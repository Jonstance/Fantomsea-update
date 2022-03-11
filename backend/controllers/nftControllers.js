import NFTItem from "../models/NFTModel.js"
import User from "../models/usersModel.js"
import { getUserById } from "./userController.js"


export const replaceNFTOwner = async (nftID , addressOfNewUser) =>{

    return new Promise(async (resolve,reject)=>{
        const userData = await getUserById(addressOfNewUser)
        const {username, userWalleteAddress, avatar} = userData[0]
        const filter = {nftID: nftID}
        const newNFTOwner = {
            userName : username,
            userAddress: userWalleteAddress,
            avatar : avatar
        }
        const dataToUpdate  = {
            nftOwner : newNFTOwner,
            listedForSale : false
        }
    
        try{
            const returnedNewNFTData = await NFTItem.findOneAndUpdate(filter, dataToUpdate,{
                new: true
            })
            const response = {
                "nftUpdated" : true,
                nftData: returnedNewNFTData
            }
            resolve(response)
        }
        catch(e){
            const response =  {
                "nftUpdated" : false
            }
            resolve(response)
        }
    })
}

export const updateNFTHistory = (nftID, userNameOfBuyer,addressOfBuyer)=>{

    return new Promise(async (resolve,reject)=>{

        const nftData = await NFTItem.find({nftID:nftID})

        const {tradingHistory} = nftData[0]

        const userData =  await getUserById(addressOfBuyer)

        const {avatar} = userData[0]

        const newSellHistory = {
            "description" : `Sold to ${userNameOfBuyer}`,
            "time" : Date.now(),
            "avatar" : avatar
        }  

        const newBuyHistory = {
            "description" : `Purchased by ${userNameOfBuyer}`,
            "time" : Date.now(),
            avatar :avatar
        }

        tradingHistory.unshift(newSellHistory, newBuyHistory)

        const filter = {
            nftID:nftID  
        }

        const dataToReplace = {
            tradingHistory : tradingHistory
        }

        try{
            const returnedNftData =  await NFTItem.findOneAndUpdate(filter, dataToReplace, {
                new:true
            })

            const response = {
                "dataUpdated" : true,
                "nftData" : returnedNftData
            }
            resolve(response)
        }
        catch(e){
            const response = {
                "dataUpdated" : false,
            }

            resolve(response)
        }

    })

}