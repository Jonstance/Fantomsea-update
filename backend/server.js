import express from 'express'
import dotenv  from 'dotenv'
import connectDB from './config/db.js';
import cors from 'cors';
import { createUserOnSignIn , checkIfUserExists, updateUserProfile, getOneUserById, getOneUserAvatar, setUserCoverPhoto} from './routeFuntions/userRoute.js';
import {getSingleNftData, uploadNftToDb, putNftForSale, putNftOutOfSale, updateNFTDataOnSold, getAllNfts, getMoreNFts, UploadnftAuctionData } from './routeFuntions/NftListingRoute.js';
import { addBidToNftsBid, setAuctionWinner, createAuctionFromExistingNFT } from './routeFuntions/AuctionBidRoute.js';
import { uploadCollection, getOneCollection, getAllCollections, getMoreCollections, getCollectionByAddress } from './routeFuntions/collectionRoutes.js';
import { getHomePageData } from './routeFuntions/dataRoute.js';

import {getNftsInUserWallet, getSingleNftExternalData, getUserWalletBalance} from './routeFuntions/externalData.js'

//connect database
connectDB()

//dotenv config
dotenv.config()

const app = express()

//Creating API for user
app.use(cors({origin:true}))
app.use(express.json({extended:true}))


app.post("/users/checkIfUserExist", (req,res)=>{
checkIfUserExists(req,res)
})
app.post("/users/createUser", (req,res)=>{
    createUserOnSignIn(req,res)
})

app.post("/users/updateUserProfile", (req,res)=>{
updateUserProfile(req,res)
})

app.post("/users/getUserAccount", (req,res)=>{
    getOneUserById(req,res)
})

// app.post("/users/getAvatar", (req,res)=>{
//     getOneUserAvatar(req,res)
// })

app.post('/users/setProfileCoverUrl', (req,res)=>{
    setUserCoverPhoto(req,res)
})

app.post("/nft/uploadSingleNft", (req,res)=>{
    uploadNftToDb(req,res)
})

app.post("/nft/UploadnftAuctionData", (req,res)=>{
    UploadnftAuctionData(req,res)
})

app.post("/nft/getSingleNFTData", (req,res)=>{
    getSingleNftData(req,res)
})

app.post("/nft/putNftForSale", (req,res)=>{
    putNftForSale(req,res)
})

app.post("/nft/putNftOutOfSale", (req,res)=>{
    putNftOutOfSale(req,res)
})

app.post('/nft/updateNftAfterSale', (req,res)=>{
    updateNFTDataOnSold(req,res)
})

app.get('/nft/getAllNfts', (req,res)=>{
    getAllNfts(req,res)
})

app.post('/nft/getMoreNtfs', (req,res)=>{
    getMoreNFts(req,res)
})

app.post("/auction/addBidToNftsBid", (req,res)=>{
    addBidToNftsBid(req,res)
})

app.post("/auction/setAuctionWinner", (req,res)=>{
    setAuctionWinner(req,res)
})


app.post("/auction/createAuctionFromExistingNFT", (req,res)=>{
    createAuctionFromExistingNFT(req,res)
})

app.post("/collection/uploadCollection", (req,res)=>{
    uploadCollection(req,res)
})

app.post("/collection/getCollection", (req,res)=>{
    getOneCollection(req,res)
})

app.post("/collection/getCollectionByAddress", (req,res)=>{
    getCollectionByAddress(req,res)
})

app.get('/collection/getAll', (req,res)=>{
    getAllCollections(req,res)
})

app.post('/collection/getMore', (req,res)=>{
    getMoreCollections(req,res)
})

app.get("/data/getHomePageData", (req,res)=>{
    getHomePageData(req,res)
})


app.post('/externalData/getUserBalance', (req,res)=>{
    getUserWalletBalance(req,res)
})

app.post('/externalData/getNftsInUserWallet', (req,res)=>{
    getNftsInUserWallet(req,res)
})

app.post('/externalData/getNftMetaData', (req,res)=>{
    getSingleNftExternalData(req,res)
})

const PORT = process.env.PORT || 5001

//Express js listen method to run project on http://localhost:5000
app.listen(PORT, console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`))