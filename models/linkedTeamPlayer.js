
const linkedTeamPlayerSchema = {
    name:"linkedTeamToPlayer",
    properties:
    {
      _id:"objectId",
  
      team: { type: "team" },     
      players: { 
        type: 'set',
        objectType : "player"},      
      active: {
        type: "bool",
        default: true,
        select: false,
      },
    },
    primaryKey:"_id",  
  
  }
  
  module.exports = linkedTeamPlayerSchema 
  