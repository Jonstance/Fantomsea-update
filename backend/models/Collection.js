import mongoose from 'mongoose'

const CollectionModel = new mongoose.Schema({

    collectionName:{
        type:String,
        required: true
    },

    collectionAvatar:{
        type : String,
        required:false
    },

    collectionTicker:{
        type :String,
        required:true
    },

    collectionId:{
        type:String,
        required:true
    },

    contractAddress:{
        type : String,
        required:true
    },

    nftsInCollection:{
        type :Array,   
    },
    isFeatured:{
        type : Boolean
    },
    collectionCover:{
        type : String
    },
    isVerified:{
        type:Boolean
    },
    royaltyReciver:{
        type : String
    },
    royaltyPercentage:{
        type : String
    }
})


const Collection =  mongoose.model('Collection', CollectionModel)

export default Collection