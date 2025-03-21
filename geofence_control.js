const net = require("net")




//const net  = require('net')
const convert = require("xml-js")

const port = 9002

const client = new net.Socket()
var gatewayOn = false

client.on("data",(data)=>{
    console.log("received data", data.toString())
    console.log("Geofence module restarted")
    if(!client.destroyed)
    {
        client.destroy()
    }

})

client.on("close",()=>{
    
    console.log("connection closed")

    
})


/////process error on gate way socket

client.on("error",()=>{

    console.log("manage geofence Connection error")
    //gatewayOn = false   
    //console.log("Connection error. Some connection error ")
    if(!client.destroyed)
    {
        client.destroy()
    }
})





const processRestart=()=>{

    client.connect({port:port,host:"localhost"},()=>{
   
        //gatewayOn = true;
        const command = JSON.stringify({type:"restart"})
        client.write(command+"\n")

      
   })

}












module.exports= {
processRestart
}
