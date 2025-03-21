
const linkedTagPlayerSchema = {
    name:"linkedTagToPlayer",
    properties:
    {
      _id:"objectId",
  
      tag: { type: "tag" },     
      player: { type: "player"},      
      active: {
        type: "bool",
        default: true,
        select: false,
      },
    },
    primaryKey:"_id",  
  
  }
  
  module.exports = linkedTagPlayerSchema 
  