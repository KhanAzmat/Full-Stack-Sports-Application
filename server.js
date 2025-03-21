const dotenv = require("dotenv");
const express = require("express");
const socketIO= require("socket.io")
const http = require("http")
const soc = require("./socketProcess")
const websoc = require("./webSocketProcess")
const dbconnect = require("./models/dbconnect")
const cp = require("child_process")
const path =require("path")
const erp= require('electron-root-path');
const eip=require('electron-is-packaged');
const readProc = require("./read_data_controller")

   var binaryPath = path.join("./rtls")

function server(){
          //import { getPlatform } from './getPlatform';
          // ---------------------Unhandled Exception Response-----------------------
          process.on("uncaughtException", (err) => {
            console.log("UNCAUGHT EXCEPTION! 🔥  Shutting down...");
            // on_error()
            console.log(err);
            process.exit(1);
          });
          // -----------------------------------------------------------------------

          //dotenv.config({ path: __dirname + "/config.env" });
          dotenv.config({ path: path.join(__dirname,"./config.env" )});

          // ---------------------------Server Setup---------------------------------
          const app = require("./app");

          const port = process.env.PORT || 5000;

          const server = http.createServer(app)

          const io = socketIO(server,{cors:{origin :"*"}})

          io.on("connection",soc.connect)
          //io.on("disconnect",soc.processDisconnect)
          io.on("gatewayconnect",soc.gatewayConnect)
          io.of("/data").on("connect",websoc.connectDataGateway)

          //------------------------------launch server------------------------
          server.listen(port, () => {
            console.log(`Server running on port ${port}`);
          });
          // -----------------------------------------------------------------------


          //--------lauch cle------------------------------------------
          // const cleProcess = cp.spawn(path.join(__dirname,binaryPath,"./cle","./auto_sockserver"),{cwd:path.join(binaryPath,"./cle")})
          // ////-----------------------------------------------------------

          // cleProcess.stdout.on('data', (data) => {
          //   console.log(data);
          // }); 

          // cleProcess.stderr.on('data', (data) => {
          //   console.log(data);
          // }); 

          ////-----------------------------launch pysocket-----------------------
          // const socketProcess = cp.spawn(path.join(__dirname,binaryPath,"./pysocket"),[binaryPath],{cwd:binaryPath})
          // socketProcess.stdout.on('data', (data) => {
          //   console.log(data);
          // }); 
          // socketProcess.stderr.on('data', (data) => {
          //   console.log(data);
          // }); 

          // --------------------------------------------------------------------

          /*const geofenceProcess = cp.spawn(path.join(binaryPath,"./manage_geofence"),[binaryPath],{cwd:binaryPath,shell:true})
          geofenceProcess.stdout.on('data', (data) => {
            console.log(data);
          }); 
          geofenceProcess.stderr.on('data', (data) => {
            console.log(data);
          }); 
          */

          //-------------------------------------------launch read data-------------------------------

          //readProc.startReadProc()
          // ---------------------Unhandled Rejection Response----------------------
          process.on("unhandledRejection", (err) => {
            console.log("UNHANDLED REJECTION! 🔥  Shutting down...");
            console.log(err);
            // on_error()
            server.close(() => {
              process.exit(1);
            });
          });
          // ------------------------------------------------------------------------

          const on_error=()=>{
            //geofenceProcess.kill("SIGINT")
            cleProcess.kill("SIGINT")
          socketProcess.kill("SIGINT")
          //readProc.stopIfNotStopped()
          }

          const on_exit=()=>{
            dbconnect.disconnect();
            //geofenceProcess.kill("SIGINT")
            
            // cleProcess.kill("SIGINT")
            // socketProcess.kill("SIGINT")
            //readProc.stopIfNotStopped()
            process.exit(0)


          }



          //-------------------------Close database on exit--------------------------
          process.on("exit",on_exit)
          process.on("SIGINT", on_exit)
          process.on("SIGTERM",on_exit)


}


module.exports = {server}




