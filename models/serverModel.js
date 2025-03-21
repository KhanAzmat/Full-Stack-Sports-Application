

const ServerSchema = {
    name : 'server',
    properties : {
        _id : { type:'objectId' },
        name : { 
            type:'string',
            required:'true',
            unique:'true' },
        image : { type:'string' },
        location : { type:'string' },
        status : {
            type:'bool',
            default:false
        }
    },
    primaryKey : '_id'
}

module.exports = ServerSchema

