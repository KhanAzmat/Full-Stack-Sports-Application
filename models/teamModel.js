const teamSchema = {
    name : 'team',
    properties : {
        _id : 'objectId',
        name : {type : 'string'},
        image : {type : 'string?'},
        location : {type:'string?'},
        color : {type : 'string?'},
        sports : {type : 'string?'},
        players: { 
            type: 'set',
            objectType : "string"}, 
        // linkPlayer : {
        //     type : 'linkingObjects',
        //     objectType : 'linkedTeamToPlayer',
        //     property : 'team'
        // }
    },
    primaryKey : '_id'
}

module.exports = teamSchema