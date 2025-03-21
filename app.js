// --------------------------Import Dependencies--------------------------
const express = require("express");
//const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const fs = require('fs/promises')
const db = require("./models/dbconnect")
// ----------------------------------------------------------------------

// -------------------------Import Routes---------------------------------
// const assetRouter = require("./routes/assetRoutes");
//const employeeRouter = require("./routes/employeeRoutes");
const geoFenceRouter = require("./routes/geoFenceRoutes");
const tagRouter = require("./routes/tagRoutes");
const userRouter = require("./routes/userRoutes");
//const buildingRouter = require("./routes/buildingRoutes");
const floorplanRouter = require("./routes/floorplanRoutes");
//const organisationRouter = require("./routes/organisationRoutes");
//const itemRouter = require("./routes/itemRoutes");
const linkedTagRouter = require("./routes/linkedTagRoutes");
const gltfRouter = require("./routes/gltfRoutes");
const mqttRouter = require("./routes/mqttAuthRoutes")
const anchorsRouter = require("./routes/anchorsRoutes")
const udpRoutes = require("./routes/udpRoutes")
const mqttRecordRoutes = require("./routes/mqttRoutes")
const serverRouter = require('./routes/serverRoutes')
const playerRouter = require('./routes/playerRoutes')
const linkedTagPlayerRouter = require('./routes/linkedTagPlayerRoutes')
const teamRouter = require('./routes/teamRoutes')
const linkedTeamPlayerRouter = require('./routes/linkedTeamPlayerRoutes')
// ----------------------------------------------------------------------

const app = express();

// cors setup for development
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:5000",
//       "http://192.168.50.99:3000",
//       "http://192.168.50.99:5000",
//     ],
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );

// --------------------------Database Connectivity---------------------------
const DB = process.env.DATABASE;
console.log(DB)
const connection =  db.getDBPointer()


// ---------------------------Global Middlewares---------------------------
//set security http headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
  })
);

// app.use(express.static(path.join(__dirname,"./client", "build"), {
//   setHeaders: function(res,path,stat){
//     res.set('x-decompressed-content-length', stat.size)
//   }
// }))

//development logging
if (process.env.NODE_ENV === "development") {
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,"./client", "build"), {
  setHeaders: function(res,path,stat){
    res.set('x-decompressed-content-length', stat.size)
  }
}))

}

//Limit request from same IP
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use(express.urlencoded());
//body parser, reading data into req.body
app.use(express.json({ limit: "5mb" }));
app.use("/mqtt", mqttRouter);

app.use("/api", limiter);

//Data sanitization against Nosql query injections
app.use(mongoSanitize());

//Data sanitization against XSS(cross site scripting attacks)
app.use(xss());

//app.use(compression());

//-----------------------------ROUTES----------------------------------
// app.use("/api/asset", assetRouter);
//app.use("/api/employee", employeeRouter);
app.use("/api/geoFence", geoFenceRouter);
app.use("/api/tag", tagRouter);
app.use("/api/user", userRouter);
//app.use("/api/building", buildingRouter);
app.use("/api/floorplan", floorplanRouter);
//app.use("/api/organisation", organisationRouter);
//app.use("/api/item", itemRouter);
app.use("/api/linkedTag", linkedTagRouter);
app.use("/api/gltf", gltfRouter);
app.use("/api/anchors",anchorsRouter)
app.use("/api/udp", udpRoutes)
app.use("/api/mqrec",mqttRecordRoutes)
app.use('/api/server', serverRouter)
app.use('/api/player', playerRouter)
app.use('/api/linkedTagPlayer', linkedTagPlayerRouter)
app.use('/api/team', teamRouter)
app.use('/api/linkedTeamPlayer', linkedTeamPlayerRouter)
//-----------------------------------------------------------------------

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"./client", "build"),{
  setHeaders:  function (res, path, stat) {
   
    
    res.set('x-decompressed-content-length', stat.size)
   
    //console.log("stat",stat)

  }
}
  
  ));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,"./client", "build", "index.html"));
  });
}

module.exports = app;
