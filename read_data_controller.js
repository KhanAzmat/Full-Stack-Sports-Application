const wbs = require("./webSocketProcess")
const cp  = require("child_process")
const path = require("path")
const process_path = path.join(__dirname,"rtls","manage_geofence")

const sleep = ms => new Promise(r => setTimeout(r, ms));
var readProc = null

const startReadProc = ()=>{
    if(readProc!==null)
    {
          console.log("Read process id still UP . Please kill it before launching it")
          return
    }
    else{
      readProc=cp.exec(process_path,{cwd:path.join(__dirname,"rtls")})
      
      readProc.stdout.on("data",(data)=>{
     
        console.log(data)
      })

      readProc.stderr.on("data",(data)=>{
     
        console.log(data)
      })
      
    }

}


const stopReadProc = async()=>{
    if(readProc===null){
        console.log("Cant stop read process!Readproces never launched. Plese start it.")
        return
    }
    wbs.stopServer()
    await sleep(10)
    //readProc.stdout.removeAllListeners()\
    
    readProc.kill("SIGINT")
    console.log("Killing read proc",readProc.killed)
    //await sleep(10)
    readProc=null
}



const restartReadProc = async()=>{
      stopReadProc()  
      startReadProc()
    

}

const startIfNotStarted= async()=>{
   if (readProc === null)
   {
    await startReadProc()
   }

}


const stopIfNotStopped = async()=>{
  if(readProc){
    await stopReadProc()
  }
}

module.exports ={
    startReadProc, stopReadProc, restartReadProc, startIfNotStarted, stopIfNotStopped
}




