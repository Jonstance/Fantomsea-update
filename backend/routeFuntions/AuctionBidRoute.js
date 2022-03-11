import { v4 } from "uuid";
import { addBidToAuction } from "../controllers/auctionController.js";
import { getUserById } from "../controllers/userController.js";
import AuctionModel from "../models/AuctionModel.js";
import NFTItem from "../models/NFTModel.js";


export const addBidToNftsBid = async (req,res)=>{

    const { userAddress, valueOfBid, auctionId  } = req.body

    console.log(userAddress)

    const userDataArray = await getUserById(userAddress)

    console.log(userDataArray)

    const userData =  userDataArray[0]

    const { avatar, username} = userData

    const returnedData = await addBidToAuction(auctionId, userAddress, valueOfBid, username, avatar)
    res.json(returnedData)

}


export const createAuctionFromExistingNFT = async (req,res)=>{

    const {startingPrice, auctionTimeDeadline, auctionOwner, nftId} =  req.body

    const auction = new AuctionModel({
            auctionId : v4(),
            auctionStartingPrice : startingPrice,
            auctionTimeDeadline : auctionTimeDeadline,
            nftAuctionBides : [],
            nftAuctionOwner : auctionOwner,
            auctionBought:false
    })

    const returnedAuctionData =  await auction.save();

    const {auctionId} = returnedAuctionData

    const filter = {nftID:nftId}

    const dataToReplace = {nftAuctionId : auctionId, isAuctionNft : true, nftPrice : startingPrice, listedForSale : true }

    const returnedNftAuction = await NFTItem.findOneAndUpdate(filter, dataToReplace, {
        new : true
    })

    res.json({
        updated: true,
        nftItem : returnedAuctionData
    })


}

export const setAuctionWinner = async(req,res)=>{

    const {auctionId, nftId, userAddress, avatar, userName, valueOfBid} = req.body
    
    const winnerData = {
        userAddress: userAddress,
        avatar : avatar,
        userName : userName,
        valueOfBid:valueOfBid
    }

    const filter = {auctionId:auctionId}
    const dataToUpdate = {
        nftAuctionWinner : winnerData
    }
    const nftFilter = {nftID:nftId}

    const nftDataToReplace = {nftPrice:valueOfBid}

    try{
        const returnedData = await  AuctionModel.findOneAndUpdate(filter, dataToUpdate, {
            new:true
        })

        const returnedNftData =  await NFTItem.findOneAndUpdate(nftFilter, nftDataToReplace, {
            new : true
        })

        res.json({
            updated :true,
            nftData: returnedData
        })
    }
    catch(e){
        console.log(e)
    }


}