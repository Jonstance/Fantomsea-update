import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    username: {
        type: String,
    },
    bio:{
        type: String,
    },
    website: {
        type: String,
    },
    twitter: {
        type: String,
    },
    avatar: {
        type: String,
        
    },
    customUrl : {
        type : String,
    },
    userWalleteAddress : {
        type : String,
        required:true,
        unique:true
    },
    profileCoverUrl : {
        type : String,
        required:false
    },
    ownedNFTs : {
        type : Array,
        required: false
    },
    createdNfts:{
        type : Array,
        required : false
    }
   
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User