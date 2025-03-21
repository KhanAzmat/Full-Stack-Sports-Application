const net  = require('net')
const convert = require("xml-js")
const { io } = require("socket.io-client");
const { isNull } = require('util');
const { isNullOrUndefined } = require('util');
const rp = require("./read_data_controller")
// no responsive command set. cle doesnt return any response
//const nonResponseSet = new Set(["log start","log stop","motion filter"])

const portBlock = new Set([3334,3335,9001,9002])


const waitTime = 500000
const port =9000
let cleSocket = null



//const client = new net.Socket()
var gatewayOn = false;

//Evaluate connection status
const processConnectionStatus = (message)=>{
    console.log("Connection Status>>",message)
   if(message["status"]=="success")
   {
        socket.emit("gatewayresponse",{
        status: "OK",
        code : 200 ,
        message: "Connected Sucessfully"
      })

      cleSocket.on("cleresponse",processCleResponse)
     
      gatewayOn = true
   }
   else if(message["status"]=="failed")
   {
    socket.emit("gatewayerror",{
        status:"error",
        code:500,
        message: "gateway connection error"
    })
    //socket.disconnect()
      if(cleSocket)
      { 
         cleSocket.off("cleresponse", processCleResponse)
         cleSocket.off("cleconfig",processCleConfig)
         cleSocket.off("clerestart",processCleRestart)
         cleSocket = null
      }
      gatewayOn =false
   }

}

// process cle restart message

const processCleRestart = (message)=>{
    console.log("Received message", message)
     if(socket)
     {
       socket.emit("gatewayrestart",message)
     }

}

///process cleconfig messages
const processCleConfig = (message)=>{
      console.log("Received message", message)
       if(socket)
       {
         socket.emit("gatewayconfig",message)
         gatewayOn=true
       }

}

const processFindAnc=async(message)=>{
    console.log("Recived Message",message)
    if(socket)
    {
        ///Stop geofence because cle restated
        //await rp.stopIfNotStopped()
        socket.emit("findanc", message)
    }
}

const processGatewayRestart=(message)=>{
    console.log("gateway restart", message)
    if(cleSocket)
    {
        cleSocket.timeout(waitTime).emit("clerestart", message, cleResponseError)
        
    }

}

const processGatewayConfig=(message)=>{

    if(cleSocket)
    {
        cleSocket.timeout(waitTime).emit("cleconfig", message, cleResponseError)
        
    }

}

const processGatewayFindAnc=(message)=>{

    if(cleSocket)
    {
        cleSocket.timeout(waitTime).emit("findanc", message, cleResponseError)
    }
}


//process cle response
const processCleResponse = (message)=>{

    console.log("Socket_rtls","received data", message)
    if(message["code"]==200)
    {
    if(socket)
    {
        let xml=""
        try{
           xml= convert.xml2js(message["response"],{compact:true})
           console.log('XML : ', xml)
        }
        catch(e)
        {
             //to be removed after cle code correction . 
            
            xml = convert.xml2js(message["response"],{compact : true,ignoreAttributes:true })
        }
        socket.emit("gatewaydata",{
            response : xml
        })
    }
   }
   else{
      if(socket)
      {
        socket.emit("gatewayerror",message)        
      }
   }

}



/*client.on("data",(data)=>{
    console.log("received data", data.toString())
    if(socket)
    {
        let xml=""
        try{
           xml= convert.xml2js(data.toString(),{compact:true})
        }
        catch(e)
        {
             //to be removed after cle code correction . 
            
            xml = convert.xml2js(data.toString(),{compact : true,ignoreAttributes:true })
        }
        socket.emit("gatewaydata",{
            response : xml
        })
    }

})*/

/*client.on("close",()=>{
    
    console.log("connection closed")
    if(gatewayOn)
    {
    if(socket){

        socket.emit("gatewayclose",{
            code : 200,
            status:"closed"
        })
    }

    gatewayOn = false
    }
})


/////process error on gate way socket

client.on("error",()=>{

    console.log("gateway Connection error")
    gatewayOn = false   
     if(socket)
    {
    socket.emit("gatewayerror",{
        status:"error",
        code:500,
        message: "gateway connection error"
    })
    }
})
*/
let socket= null

//websocket server
///This finction is executed on sucessful websocket connection.
const connect=(soc)=>{
     console.log("Web socket connected sucees")
     socket=soc
    socket.emit("serverresponse",{
        status:"success"
    })

   socket.on("gatewayconnect",gatewayConnect)
   socket.on("gatewaycommand",processCommand)
   socket.on("disconnect",processDisconnect)
   socket.on("gatewaydisconnect",processGatewayDisconnect)
   socket.on("error",processError)
   socket.on("gatewayconfig", processGatewayConfig)
   socket.on("gatewayrestart", processGatewayRestart)
   socket.on("findanc",processGatewayFindAnc)

}

//this method processes socket connection error

const processError=(e)=>{
console.log("Connection Error",e)
}

///This function closes socket connection
const  processDisconnect=(data)=>{
    /*if(!client.destroyed)
    {
         // client.end()
          client.destroy()
         

    }*/

    if(cleSocket)
    {
        cleSocket.disconnect()
        //cleSocket = null
        
    }
    console.log("Socket closed",data)
    
   socket.disconnect()
   socket.off("gatewayconnect",gatewayConnect)
   socket.off("gatewaycommand",processCommand)
   socket.off("disconnect",processDisconnect)
   socket.off("gatewaydisconnect",processGatewayDisconnect)
   socket.off("error",processError)
   socket.off("gatewayconfig", processGatewayConfig)
   socket.off("gatewayrestart", processGatewayRestart)
}



/// this function closes gateway connection
const processGatewayDisconnect=(data)=>{

    /*if(!client.destroyed)
    {
        client.destroy()
    }*/
    if(cleSocket)
    {
        
        //cleSocket.disconnect()
        /*socket.emit("cleclose",{
            message:true
        })
         */
        console.log("Gateway on", gatewayOn, socket)    
        //gatewayOn = false
        //cleSocket = null
        if(gatewayOn)
            {
            console.log("Socket",socket)         
            if(socket){
                console.log("Gateway close",socket)
                console.log(socket)
                socket.emit("gatewayclose",{
                    code : 200,
                    status:"closed"
                })
            }
            cleSocket.disconnect()
            //cleSocket = null
            //gatewayOn = false
            }
        
    

    }
    console.log("Gateway  closed")
}



///This function processess  gateway command
const processCommand=(data)=>{
    if(cleSocket)
    {
        if("command" in data && "req" in data["command"] && "_attributes" in data["command"]["req"] && "type" in data["command"]["req"]["_attributes"])
        {
        const commandType = data["command"]["req"]["_attributes"]["type"]
        //const type = nonResponseSet.has(commandType) ? 2 : (commandType==="anchor cfg"? 3 : (commandType==="range test" ? 4:1))
        type =null

        switch(commandType)
        {
            case "log start":
            case "log stop":
            case "motion filter":
                type = 2
                break
            
            case "anchor cfg" :
                type =3
                break
                
            case "range test":
                type  = 4
                break

            case "rtls start":
                type = 5
                //rp.startIfNotStarted()
                break
                
                
             case "rtls stop":
                type = 6
                //rp.stopReadProc()
                break
              default:
                type= 1
                break       
                

        }

        let str = convert.json2xml(data["command"],{compact :true,fullTagEmptyElement:true})
        str=str +"\n"
        console.log(str)
        //client.write(str)
        
            cleSocket.timeout(waitTime).emit("clecommand",{"command":str, "type":type}, cleResponseError)
        }
        else{
            socket.emit("gatewayerror",{
                status:"error",
        code:400,
        message: "Wrong command"
            })        
        }
    }
}


///This  function is executed when frontend requests getway connection 

const gatewayConnect=(message)=>{

    console.log("gateway connection request",message)
    if(portBlock.has(message["port"]))
    {
        if(socket)
        {
            socket.emit("gatewayerror",{
                status:"error",
                code:500,
                message: "Forbidden port! Cant connect"
            })
        }

        return false
    }

    if(!gatewayOn)
    {     
        //client.connect({port:message["port"],host:message["host"]},()=>{
         console.log("RTLS: Gateway off: connecting.....................")
         //gatewayOn = true;
        if(!cleSocket)
        {
          console.log("RTLS:Connecting cle.........")
        cleSocket = io(`http://${message["host"]}:${message["port"]}`,{
             auth :{
             token : message["apiToken"],
             floor: message["floor"]

     },timeout:waitTime
    }) 
     
     cleSocket.on("connect",()=>{
        console.log("connection sucessfull")
        
       // gatewayOn = true
      if(cleSocket) {
       cleSocket.timeout(waitTime).emit("cleconnect",{"message":"connect", "demo":message["demo"]},cleResponseError) 
       
           }
        })
        cleSocket.io.on("error",cleError)
        cleSocket.on("connect_error",rejectionError)
        cleSocket.on("connection_status",processConnectionStatus)
        cleSocket.on("cleconfig",processCleConfig)
        cleSocket.on("clerestart",processCleRestart)
        cleSocket.on("findanc",processFindAnc)
        
        
       


        cleSocket.on("disconnect",(reson)=>{
         
         if(reson==="io server disconnect" || reson === "io client disconnect" || reson==="transport close")
         {
            if(reson==="transport close")
            {
              if(socket)

              {
                socket.emit("gatewayerror",{
                    status:"error",
                    code:500,
                    message: "gateway connection error"
                })
              }

            }
           if(cleSocket)
              {
            console.log("cle socket events removed")
            cleSocket.off("connect_error",rejectionError)    
            cleSocket.off("cleresponse",processCleResponse)
            cleSocket.off("cleconfig",processCleConfig)
            cleSocket.off("connection_status",processConnectionStatus)
            cleSocket.off("clerestart",processCleRestart)
            cleSocket.off("findanc",processFindAnc)
            cleSocket.io.off("error",cleError)
            cleSocket = null
            gatewayOn = false
              }

            }    
            console.log("Cle disconnected!! disconnect Detected",reson)
            
        })
        
        
          
        
       
        }
        

    }
   } 


   //cle rejection error

 const rejectionError=(e)=>{

    if("message" in e && e.message==="unauthorized!")
    {
        socket.emit("gatewayerror",{
            status:"error",
            code:500,
            message: "Authentication error"
        })
        
    }
    else if("message" in e && e.message==="System Error")
    {
        socket.emit("gatewayerror",{
            status:"error",
            code:500,
            message: "System Error"
        })

    }

    if(cleSocket)
          cleSocket.disconnect()
    cleSocket = null    

 }  
   
const cleResponseError=(e,value)=>{
       if(e)
      {
          console.log("CLE did not responsd....Disconnecting......",e)

      if(cleSocket){
        cleSocket.disconnect()
      }
    }
       else if(value)
       {

    console.log("SOCKET PROC: returnes value",value)
      }
}
//cle socket connection error
const cleError = (e)=>{

    console.log("Cle error detected",e)
    socket.emit("gatewayerror",{
        status:"error",
        code:500,
        message: "gateway connection error"
    })
    if(cleSocket)
        cleSocket.disconnect()
    //cleSocket = null
}



const getAnchors = (socket)=>{

}





module.exports= {connect,
    getAnchors,
   gatewayConnect,
   processDisconnect

}


