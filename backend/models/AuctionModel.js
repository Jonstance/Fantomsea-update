import mongoose from 'mongoose'

const AuctionModelSchema   = new mongoose.Schema({
    auctionId : {
        type: String,
        required : true
    },

    auctionStartingPrice:{
        type :String,
        required : true,
    },

    auctionTimeDeadline : {
        type : Number,
        required : true
    },

    nftAuctionBids:{
        type : Array,
        required: true
    },
    nftAuctionWinner:{
        type : Object,
        required : false
    },

    nftAuctionOwner:{
        type:String,
        required:true
    },

    auctionBought:{
        type : Boolean,
        required : true
    }

})

const AuctionModel  = mongoose.model('AuctionModel', AuctionModelSchema)

export default AuctionModel