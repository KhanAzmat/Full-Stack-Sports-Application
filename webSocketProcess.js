const { io } = require("socket.io-client");

/**This map keeps record of connected sockets */

const clientMap = new Map()
const dataMap=new Map()
//let dataSocket =null
///////////////Data processing sockets///////////////////////////

function connectDataGateway(soc){
    console.log("Browser socket connected Success : Client Id",soc.id )

   //soc.emit("serverresponse",{
    //   status:"success"
   //})

   
   soc.on("disconnect",disconnectSocket)
   soc.on("disconnect-data",disconnectDataSource)




   soc.on("connect-data", (message)=>{
    
     




      if (!(dataMap.has(message.floorId)))
               { 
                                            console.log("connect data source",message)

            
                                            const dataSocket = io(`http://${message["hostname"]}:48080`,{
                                            auth :{
                                            token : message["apiToken"],

                                            //floor: message["floor"]

                                            },timeout : 2000, reconnectionDelayMax : 2000
                                            }); 



                                            dataSocket.on("connect",()=>{


                                        
                                        console.log("datasource connection successfull data soc id", dataSocket.id)
                                        //dataSocket.on("data", processIncomingData) /// process incoming data from cle 
                                        dataSocket.io.on("error",dataError) /// process middleware error
                                        dataSocket.on("connect_error",dataRejectionError) ///process connection rjection error

                                        dataSocket.on("disconnect",function(reson){
                                                console.log("disconnecting data socket Reson", reson)
                                                
                                            })


                                    

                                        })
                                            
                                            dataMap.set(message.floorId,{count:0, dataSocket:dataSocket})



                                            const processIncomingData=(message)=>{
                                            //console.log("data",message)
                                            //const out_soc = dataMap.get(this.id)
                                        
                                            soc.emit("data",message)
                                        
                                            }
                                    
                                            dataSocket.on("data",processIncomingData)
                                            
                                    
                                            clientMap.set(soc.id, {floorId:message.floorId, func : processIncomingData,soc:soc})
                                            data = dataMap.get(message.floorId)
                                            data["count"] = data["count"] + 1
                                            console.log("Socket id",soc.id)
                                            dataSocket.emit("getdata",{id : soc.id})
                                           
                }
            else{
                    const data = dataMap.get(message.floorId)
                    const dataSoc = data["dataSocket"]
                    //if status is disconnected reconnct      
                    
                    const processIncomingData=(message)=>{
                        //console.log("data",message)
                        //const out_soc = dataMap.get(this.id)
                        
                        soc.emit("data",message)
                        


                    }
                    dataSoc.on("data",processIncomingData)

                    clientMap.set(soc.id,{floorId:message.floorId, func : processIncomingData,soc:soc})
                    data["count"] = data["count"] + 1
                    console.log("Socket id ",soc.id)
                    dataSoc.emit("getdata",{id : soc.id})
   } 
   
})


}  



function disconnectDataSource (){

     console.log("Disconect data source")
    /*if(!client.destroyed)
    {
        client.destroy()


    }*/
    console.log("Soc refences",clientMap.has(this.id))
    if(clientMap.has(this.id))
    {
    const handle = clientMap.get(this.id)
    const data = dataMap.get(handle["floorId"])
    console.log(handle === null ? "No data socket" : "Data socket found")
    if(data && data["dataSocket"])
    {
        
        //cleSocket.disconnect()
        /*socket.emit("cleclose",{
            message:true
        })
         */
        console.log("data source on")    
        //gatewayOn = false
        //cleSocket = null
       
            //console.log("Socket",this)         
          
                //console.log("Gateway close",socket)
                //console.log(socket)
              
            data.dataSocket.off("data",handle.func)
            data["count"]=data["count"] -1
            //dataSocket.disconnect()
            //cleSocket = null
            //gatewayOn = false
            //soc.dataSocket.out_soc =null
            //soc.dataSocket=null
            //clientMap.delete(this.id)
            //dataMap.delete(dataSocket.id)
            this.emit("data-source-close",{
                code : 200,
                status:"closed"
            })


            
                console.log("Stopping data for socket", this.id)  
                data.dataSocket.emit("closedata",{id : this.id})  
                //data.dataSocket.disconnect()
                if(data["count"]===0)
                {
                  console.log("All listeners of floor id", handle["floorId"],"removed")
                }
        
            
            }
         
            clientMap.delete(this.id)
    
        }
    
    console.log("Gateway  closed")

}



//const connectDataSource= 


function dataError (e){

    console.log("data socket error detected",this.id)
    
}




function dataRejectionError(e){

   

    console.log("connection error occured . reconnecting" )
    this.connect()
 }  



function processIncomingData(message){
   console.log("data",message)
   const out_soc = dataMap.get(this.id)
   if(out_soc)
   {
out_soc.emit("data",message)
   }
}


function disconnectSocket(data) {
    /*if(!client.destroyed)
    {
         // client.end()
          client.destroy()
         

    }*/
    console.log("Client map", clientMap.has(this.id))
   if(clientMap.has(this.id))
   {
    const handle = clientMap.get(this.id) 
    const data = dataMap.get(handle["floorId"])
    //console.log(data)
    if(data && data["dataSocket"])
    {
         //dataSocket.disconnect()
        //cleSocket = null
        //soc.dataSocket.out_soc=null
        //soc.dataSocket=null
        //dataMap.delete(dataSocket.id)
        data.dataSocket.off("data", handle.func)
        data["count"] = data["count"] - 1
        
            console.log("Stopping data for socket",this.id)
            //data.dataSocket.disconnect()
            data.dataSocket.emit("closedata",{id : this.id}) 
        
    }
    console.log("Browser Socket closed",this.id)

    
   //this.disconnect()
   //soc.off("connect-data", connectDataSource)
   //soc.off("disconnect",disconnectSocket)
   
   //soc.off("disconnect-data",disconnectDataSource)
   clientMap.delete(this.id)
}
   this.removeAllListeners();
   
   
   
}


const stopServer = ()=>{
    /// The code is for demo mode.

    for (const [floor,obj] of dataMap.entries()) {
        obj.dataSocket.emit("stop",{cmd:"stop"});   
        obj.dataSocket.removeAllListeners()     
    }

    for (const [id,obj] of clientMap.entries()) {
        obj.soc.disconnect();   
        //obj.dataSocket.removeAllListeners()     
    }



}



module.exports= {

    connectDataGateway, stopServer
  
}