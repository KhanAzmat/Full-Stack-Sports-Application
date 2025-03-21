

const { app, BrowserWindow } = require("electron");
const path = require("path");
const cp = require("node:child_process");
//const { server } = require("websocket");

const sv = require(path.join(__dirname,"./server"));

let mainWindow;
//let serverProc=null
//
//serverProc = cp.fork("./server.js")//


function createWindow() {
    console.log("app ready");
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      //preload: path.join(process.cwd(),"preload.js")
      
    },
  });

  
  mainWindow.loadURL("http://localhost:5000");
   

  mainWindow.on("show",function(){
    
    serverProc.stderr.on('data', (data) => {
      console.log(data);
    }); 
    
  })
  
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

//app.removeAllListeners("ready")
app.on("ready", ()=>{

  sv.server()
  createWindow()    

    



});





//app.prependOnceListener("ready",createWindow)

app.on("error",()=>{console.log("error occured")})
app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  
});


app.on("will-quit",function(e){
      //e.preventDefault()
      console.log("quiting app")
      
})

