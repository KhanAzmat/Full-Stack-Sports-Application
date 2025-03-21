const realm = require("realm")
const User = require("./userModel")
const Floorplan = require("./floorplanModel")
const Gltf = require("./gltfModel")
const Geofence = require("./geoFenceModel")
const Anchor = require("./anchorsModel")
const Tag = require("./tagModel")
const LinkedTag = require("./linkedTagModel")
const Asset = require("./assetModel")
const FloorplanSchema = require("./floorplanModel")
const UDP = require("./udpModel")
const MQTT = require("./mqttModel")
const eip=require('electron-is-packaged');
const Server = require('./serverModel')
const Player = require('./playerModel')
const LinkedTagToPlayer = require('./linkedTagPlayer')
const LinkedTeamToPlayer = require('./linkedTeamPlayer')
const Team = require('./teamModel')

var connection = null


exports.getDBPointer= async()=>{
     
    if(!connection)
    {
        try{
            //console.log(User, Floorplan,)
            if (process.env.NODE_ENV === "development")
                connection = await realm.open({
                    path:"./data/db",
                    schema:[User,Floorplan,Geofence,Gltf,Anchor,Tag,UDP,MQTT,Server,Player,LinkedTagToPlayer,Team,LinkedTeamToPlayer,LinkedTag,Asset],
                    schemaVersion: 4,
                    deleteRealmIfMigrationNeeded: true
                    })
            else
            connection = await realm.open({
                path:"./data/db",
                schema:[User,Floorplan,Geofence,Gltf,Anchor,Tag,UDP,MQTT,Server,Player,LinkedTagToPlayer,Team,LinkedTeamToPlayer,LinkedTag,Asset],
                schemaVersion: 4,
                })
              console.log("Database sucessfully connected")

         return connection
        }
        catch(err)
        {
            console.log("Database cant be connected",err)
            return null
        }

    }
    else{
        console.log("Databese already connected")
        return connection
    }



}

exports.disconnect=()=>{
   if(connection)
   {
    connection.close()
    connection=null
    console.log("database sucessfully closed")
   }    
    
} 




