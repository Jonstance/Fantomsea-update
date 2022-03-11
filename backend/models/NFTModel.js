import mongoose from "mongoose";

const NftModel = new mongoose.Schema({
    nftName : {
        type : String,
        required:true
    }, 

    nftID : {
        type : String,
        required : true
    },
    contractId:{
        type : Number,
        required:true
    },
    contractAddress:{
        type :String,
        required : true
    },
    nftPrice:{
        type : String,
        required : true
    },

    nftOwner :{
        type : Object,
        required:true
    },

    nftCreator :{
        type : Object,
        required : true
    },

    nftType:{
        type : String,
        required:true
    },

    nftMediaUrl :{
        type : String,
        required:false
    },
    nftAttributes:{
        type: Array
    },
    nftBids:{
        type : Array
    },

    tradingHistory:{
        type:Array
    },

    currentNumberInStock:{
        type : Number,
        required:false
    },

    nftDescription:{
        type : String,
        required : true
    },

    nfswContent:{
        type : Boolean
    },

    nftDigitalUrl : {
        type: String,
        required: true
    },

    nftCategory :{
        type : String,
        required : true
    },
    royalty:{
        type : String,
        required : true
    },

    isAuctionNft:{
        type : Boolean,
        required : true
    },

    isInstantBuy:{
        type: Boolean,
        required : true
    },
    listedForSale : {
        type : Boolean,
        required : true
    },
    isSingle:{
        type :Boolean
    },
    numberInStock:{
        type : Number
    },
    isMultiple:{
        type : Boolean
    },
    nftAuctionStartingPrice : {
        type : String
    },
    nftTimeDeadline : {
        type :Number
    },

    nftAuctionId : {
        type: String,
    },

    collectionId:{
        type:String,
        required:true
    },
    isFeatured:{
        type : Boolean
    }
}, {
    timestamps : true
})

const NFTItem = mongoose.model("NFTItem", NftModel)

export default NFTItem