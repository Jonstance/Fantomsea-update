import AuctionModel from "../models/AuctionModel.js";


export const addBidToAuction = async (auctionId, userAddress, valueOfBid, nameOfUser, avatarOfUser)=>{

    return new Promise(async (resolve,reject)=>{
        const auctionDataForBid = {
            userAddress,
            timeBidWasPlaced : Date.now(),
            valueOfBid,
            nameOfUser,
            avatarOfUser
        }
        
        const currentAuctionDataArray = await AuctionModel.find({auctionId : auctionId})
        
        const currentAuctionData = currentAuctionDataArray[0]
        
        const arrayOfBids =  currentAuctionData.nftAuctionBids
        console.log(arrayOfBids)
        
        arrayOfBids.unshift(auctionDataForBid)
        
        console.log(arrayOfBids)
        
        const filter = {auctionId : auctionId}
        const dataToReplace = {nftAuctionBids : arrayOfBids}
        const returnedAuction = await  AuctionModel.findOneAndUpdate(filter, dataToReplace, {
            new : true
        })
        resolve({
            updated : true,
            updatedAuction : returnedAuction
        })
    })
}