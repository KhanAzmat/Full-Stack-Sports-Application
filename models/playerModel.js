
const mongoose = require("mongoose");
const { primaryKey } = require("./tagModel");

const playerSchema = {
  name:"player",
  properties:
  {
    _id : { type : "objectId" },
    name: { type: "string", required : true},
    initials : { type : 'string' },
    // team : { type : 'string?' },
    color : { type : 'string?' },
    image: { type : "string?" },
    // description: "string?",
    active: {
      type: "bool",
      default: true,
    },
    // linkTag : {
    //   type : 'linkingObjects',
    //   objectType : 'linkedTagToPlayer',
    //   property : 'player'
    // },

    team : {
      type : 'linkingObjects',
      objectType : 'linkedTeamToPlayer',
      property : 'players'
    }
  },
  primaryKey:"_id",
}

module.exports = playerSchema

