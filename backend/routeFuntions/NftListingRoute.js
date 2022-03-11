import { addNFTIdToNewOwner, getUserAvatar, getUserById, removeNFTIDFromUser} from "../controllers/userController.js";
import NFTItem from "../models/NFTModel.js";
import User from "../models/usersModel.js";
import {v4} from 'uuid' 
import { replaceNFTOwner, updateNFTHistory } from "../controllers/nftControllers.js";
import AuctionModel from '../models/AuctionModel.js'
import Collection from "../models/Collection.js";

export const uploadNftToDb = async(req,res)=> {

    const { nftName, nftPrice, nftDescription, nftDigitalUrl, nftCategory, royalty, isAuctionNFT, isInstantBuy , userAddress, contractId, contractAddress,isSingle, isMultiple , numberInStock, collectionId, externalLink, nftAttributes, nftMediaUrl, nftType, nfswContent, listedForSale} = req.body

    console.log(nftName)
    const userData = await getUserById(userAddress)

    if(userData.length > 0 ){

        const userProfile = userData[0]

        const {username, avatar, ownedNFTs, createdNfts} = userProfile

        const nftCreator = {
            userName : username,
            avatar : avatar,
            userAddress: userAddress
        }
        console.log(nftCreator)
        const nftItem   = new NFTItem({
           nftName : nftName,
           nftID :v4(),
           nftPrice : nftPrice,
           nftDescription : nftDescription,
           nftDigitalUrl : nftDigitalUrl,
           nftCategory : nftCategory,
           nftCreator : nftCreator,
           nftOwner: nftCreator,
           nftBids : [],
           royalty : royalty,
           contractId : contractId,
           contractAddress:contractAddress,
           isAuctionNft :isAuctionNFT,
           isInstantBuy : isInstantBuy,
           isSingle:isSingle,
           nfswContent : nfswContent,
           isMultiple : isMultiple,
           numberInStock : numberInStock,
           currentNumberInStock : numberInStock,
           tradingHistory : [{
               description : `Minted by ${username}`,
               time: Date.now(),
               avatar : avatar
           }],
           listedForSale : listedForSale,
           collectionId : collectionId,
           externalLink : externalLink,
           isFeatured: false,
           nftType : nftType,
           nftMediaUrl : nftMediaUrl,
           nftAttributes : nftAttributes
        })

        const nftDataObject =  await nftItem.save()

        console.log(nftDataObject)

        let filter = {userWalleteAddress : userAddress}

         createdNfts.push(nftDataObject.nftID)
        ownedNFTs.push(nftDataObject.nftID)

        const dataToReplace = {
            ownedNFTs : createdNfts,
            createdNfts : ownedNFTs
        }
        

        const returnedData =  await User.findOneAndUpdate(filter,dataToReplace, {
            new : true
        })

        console.log(returnedData)

        const {nftID} = nftDataObject

        const collectionDetails = await Collection.find({collectionId:collectionId})

        const { nftsInCollection } = collectionDetails[0]

    


        console.log(collectionDetails)
        console.log(nftsInCollection, "nfts")

        nftsInCollection.push(nftID)
        

        console.log(nftsInCollection)
        const collectionFilter = {collectionId:collectionId}


        const collectionDataToUpdate = {
            nftsInCollection : nftsInCollection  
        }


        const newCollectionData = await Collection.findOneAndUpdate(collectionFilter, collectionDataToUpdate, {
            new : true
        })

        res.json({
            nftSaved : true,
            nftDataObjectData: returnedData ,
            
        })
    }

}

export const  UploadnftAuctionData  = async (req,res)=>{

    const { nftName, nftStaringPrice, nftDescription, nftDigitalUrl, nftCategory, royalty, isAuctionNFT, isInstantBuy , userAddress, contractId, contractAddress,isSingle, isMultiple , numberInStock, nftTimeDeadline, nfswContent, collectionId, externalLink, nftAttributes, nftMediaUrl, nftType, listedForSale} = req.body

    console.log(nftName)
    const userData = await getUserById(userAddress)



    if(userData.length > 0 ){

        const userProfile = userData[0]

        const {username, avatar, ownedNFTs, createdNfts} = userProfile

        const nftCreator = {
            userName : username,
            avatar : avatar,
            userAddress: userAddress
        }

        const AuctionData = new AuctionModel({
            auctionId : v4(),
            auctionStartingPrice : nftStaringPrice,
            auctionTimeDeadline : nftTimeDeadline,
            nftAuctionBides : [],
            nftAuctionOwner : userAddress,
            auctionBought:false
        })


        const returnedAuctionData = await AuctionData.save()

        const {auctionId} =  returnedAuctionData

        console.log(nftCreator)
        const nftItem   = new NFTItem({
           nftName : nftName,
           nftID :v4(),
           nftPrice : nftStaringPrice,
           nftDescription : nftDescription,
           nftDigitalUrl : nftDigitalUrl,
           nftCategory : nftCategory,
           nftCreator : nftCreator,
           nftOwner: nftCreator,
           nftBids : [],
           nfswContent : nfswContent,
           royalty : royalty,
           contractId : contractId,
           contractAddress:contractAddress,
           collectionId : collectionId,
           isAuctionNft :isAuctionNFT,
           isInstantBuy : isInstantBuy,
           isSingle:isSingle,
           isMultiple : isMultiple,
           numberInStock : numberInStock,
           nftAuctionId : auctionId,
           tradingHistory : [{
               description : `Minted by ${username}`,
               time: Date.now()
           ,
        }],
           listedForSale : listedForSale,
           isFeatured : false,
           externalLink : externalLink,
           isFeatured: false,
           nftType : nftType,
           nftMediaUrl : nftMediaUrl,
           nftAttributes : nftAttributes,
        })

        const nftDataObject =  await nftItem.save()

        console.log(nftDataObject)

        let filter = {userWalleteAddress : userAddress}

        createdNfts.push(nftDataObject.nftID)
        ownedNFTs.push(nftDataObject.nftID)

        const dataToReplace = {
            ownedNFTs : createdNfts,
            createdNfts : ownedNFTs
        }
        

        const returnedData =  await User.findOneAndUpdate(filter,dataToReplace, {
            new : true
        })

        console.log(returnedData)
          
        res.json({
            nftSaved : true,
            nftDataObjectData: returnedData ,
            
        })
    }
}

export const getSingleNftData  =   async  (req,res)=>{

    const {nftid}  = req.body

    const nftData = await  NFTItem.find({nftID: nftid})
    const nftDataObject = nftData[0]
    console.log(nftDataObject)
    if(nftDataObject.nftAuctionId !== undefined){
        console.log('found')
        const {nftAuctionId} =  nftDataObject
        const auctionData = await AuctionModel.find({auctionId : nftAuctionId})

        const returnedAuctionData = auctionData[0]
        res.json({
            nftData : nftDataObject,
            auctionData : returnedAuctionData,
            updated : true
        })
    }
    else{
        console.log("not found")
        res.json({
            nftData : nftDataObject,
            updated : true
        })
    }
}

export const putNftForSale = async (req,res)=>{

    const {nftId, price} = req.body
    console.log(nftId, price)
    const filter = {nftID :nftId}
    const dataToUpdate = {
        listedForSale : true,
        nftPrice : price
    }
    const nftDataObject = await NFTItem.findOneAndUpdate(filter, dataToUpdate, {
        new : true
    })
    res.json({
        nftData : nftDataObject,
        updated : true
    })

}
export const putNftOutOfSale = async (req,res)=>{

    const {nftId} = req.body
    const filter = {nftID :nftId}
    const dataToUpdate = {listedForSale : false}
    const nftDataObject = await NFTItem.findOneAndUpdate(filter, dataToUpdate, {
        new : true
    })

    console.log(nftDataObject)

    res.json({
        nftData : nftDataObject,
        updated : true
    })

}

export const updateNFTDataOnSold = async (req,res)=>{

    const { userNameOfNewOwner, addressOfNewOwner, addressOfPreviousOwner, nftID } = req.body

    console.log(req.body)
    const nftReplacementResponse = await replaceNFTOwner(nftID, addressOfNewOwner)

    if(nftReplacementResponse.nftUpdated === true){

        const nftRemoved = await removeNFTIDFromUser(addressOfPreviousOwner, nftID)

        const nftAdded = await addNFTIdToNewOwner(addressOfNewOwner, nftID)

        const nftHistoryUpdated  =  await updateNFTHistory(nftID, userNameOfNewOwner, addressOfNewOwner)

        const {isAuctionNft} = nftHistoryUpdated.nftData

        if(isAuctionNft === true){

            const latestNftObject = {...nftHistoryUpdated.nftData._doc}
    
            const auctionId = latestNftObject.nftAuctionId
    
            const filter = {auctionId:auctionId}
    
    
            const dataToReplace = {
                auctionBought : true
            }
     
            try{
                const returnedAuctionData =  await AuctionModel.findOneAndUpdate(filter,dataToReplace, {
                    new :true
                })
        
                console.log(returnedAuctionData)
            }
            
            catch(e){
                console.log(e)
            }
            
             delete latestNftObject['nftAuctionId']
    
            latestNftObject.isAuctionNft = false;
            latestNftObject.isInstantBuy = true;
    
            console.log(latestNftObject.nftAuctionId, 'testa')
    
            const nftFilter =  {nftID : latestNftObject.nftID}
    
            const updatedData  =  await NFTItem.findOneAndReplace(nftFilter, latestNftObject, {
                new : true
            })
    
            console.log(updatedData, 'test')
            }

        res.json({
            nftDataUpdated: true
        })
    }

    else{
        res.json({
            nftDataUpdated: false
        })
    }
} 

export const getAllNfts = async (req,res)=>{
    const allNFTS =  await NFTItem.find().limit(20)
    console.log({data:allNFTS})
    res.json(allNFTS)
}

export const getMoreNFts = async(req,res)=>{
    const {lastId} =  req.body
    const allNfts =  await NFTItem.find({_id:{$gt:lastId}}).limit(20)
    res.json(allNfts)
}