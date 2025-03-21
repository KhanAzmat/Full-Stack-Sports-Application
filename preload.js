

const cp = require("child_process")



let servProc
      
window.addEventListener("DOMContentLoaded", () => {
    //exec(`npm run cors-server`);

    servProc=cp.fork("server.js")
  });


  const on_exit=()=>{
    servProc.kill("SIGINT")
    process.exit(0)
  }


process.on("exit",on_exit)
process.on("SIGINT", on_exit)
process.on("SIGTERM",on_exit)

  
  


  