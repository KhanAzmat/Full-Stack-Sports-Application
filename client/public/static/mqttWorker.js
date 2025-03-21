    const options = {
      keepalive: 30,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: "WillMsg",
        payload: "Connection Closed abnormally..!",
        qos: 0,
        retain: false,
      },
      rejectUnauthorized: false,
    };
    options.clientId = `mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`;
    
    let client = null
    let socket = null 

    let floor = -90
    let tagMap= {};

      const processMessage = async (message) => {
        //const payload = { topic, message: message.toString() };
        let data = JSON.parse(message);
        if('step_count' in data){
        //   console.log('Process Message')
        // console.log(data)
        }
        
     
      if(floor.toString()=== data["floor"])
      {
       data["type"]="loc"
       //console.log(data)
     
          
        postMessage(data);
           
    
        
      }
    }


    const simpleForword = async(message)=>{
      let data = JSON.parse(message);
      console.log(data)
      postMessage(data)
    }




    onmessage=(e) =>{ /* eslint-disable-line no-restricted-globals */

                if(!e){
                  return
                }
                console.log(e.data)
                let msg = JSON.parse(e.data)
                console.log(msg)
                if(msg.type==="load-lib")
                {
                  importScripts(msg.mqtt)
                  //importScripts(msg.axios)
                  importScripts(msg.sio)
                  console.log("File imported sucessfully")
                  const url = `ws://${msg.host}:${msg.port}/data`
                 
                 socket=io(url,{
                  reconnectionDelayMax: 10000,
                  auth: {
                    token: "123"
                  },
                  query: {
                    "my-key": "my-value"
                  }
                });
                

                socket.on("connect",(message)=>{
                  console.log("socket connected", socket.id)
                 
                  socket.on("gatewayerror",(message)=>{
                    console.log("data source error",message)
                    //postMessage(message)
                    const msg = {type:"error", msg:"RTLS not available"}
                    postMessage(msg)
                  })
                     //socket.emit("connect-data",{hostname:msg.hostname,port:msg.port, apiToken:msg.password})
                   
                })


                }
                else if(msg.type === "subscribe")
                {
                  //const url = `mqtt://${msg.host}:${msg.port}`;
                  socket.emit("connect-data",{hostname:msg.hostname,port:msg.port, apiToken:msg.password, floorId:msg.floorId})
                  
                
                /*
                socket.on("data", (message)=>{
                  console.log(message)
                })
                 */
                //socket.on()
                if("floor" in msg)
                {
                    floor = msg.floor
                    socket.on("data",processMessage)
                }
                else{
                  socket.on("data",simpleForword)

                }
                }
                
               /* else if(msg.type ==="subscribe")
                {
                      floor = msg.floor
                      client.on("message",processMessage)
                      console.log("Web worker :",floor)
              }*/

                else if(msg.type === "unsubscribe")
                {

                  socket.emit("disconnect-data")
                  socket.off("data",processMessage)
                  socket.off("data",simpleForword)
                  socket.on("data-source-close",(message)=>{
                    console.log("Data source closed",socket.id);
                    socket.removeAllListeners("data-source-close")
                  })
                  /*client.removeListener('message',processMessage);
                  tagMap ={}*/
                  //socket.emit("disconnect-data", {type:"disconnect"})
                 
                }
                else if (msg.type ==="close")
                {
                  //client.end()
                  if(socket && socket.connected){ 
                  socket.disconnect()
                  }
                  /* eslint-disable-next-line no-restricted-globals */
                  
                }
    }

   


 