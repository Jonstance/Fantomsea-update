import { v4 } from "uuid";
import Collection from "../models/Collection.js";
import NFTItem from "../models/NFTModel.js";

export const uploadCollection = async (req,res)=>{

    const {collectionName, collectionAddress, collectionTicker} =  req.body

    console.log(collectionName, collectionAddress, collectionTicker)

    const collectionCheck =  await Collection.find({contractAddress : collectionAddress.toLowerCase()})



    if(collectionCheck.length === 0){

        const collection = new Collection({
            collectionId : v4(),
            collectionAvatar : "",
            collectionTicker : collectionTicker,
            collectionName : collectionName,
            contractAddress : collectionAddress.toLowerCase(),
            nftsInCollection : [],
            isFeatured:false,
            collectionCover : '',
            isVerified : false,
            royaltyReciver : '',
            royaltyPercentage : ''
        })

        const collectionData =  await collection.save()

        const {collectionId}  =  collectionData

        res.json({
            collectionId : collectionId
        })
    }
    else{
        const {collectionId} = collectionCheck[0]
        console.log(collectionCheck)
        console.log(collectionId)
        res.json({
            collectionId: collectionId
        })
    }
}


export const getOneCollection = async (req,res)=>{
    
const {collectionId} = req.body

console.log(collectionId)

const nftsInCollection =  await NFTItem.find({collectionId:collectionId})

const collectionDetails =  await Collection.findOne({collectionId:collectionId})




res.json({
    nfts:nftsInCollection,
    collectionDetails : collectionDetails
})


}

export const getCollectionByAddress = async (req,res)=>{

    const {contractAddress} = req.body

    const collectionCheck = await Collection.find({contractAddress : contractAddress})

    if(collectionCheck.length === 0){
        res.json({
            collectionFound: false,
            collection : {}
        })
    } 
    else{
        res.json({
            collectionFound : true,
            collection : collectionCheck[0]
        })
    }
}

export const getAllCollections = async(req,res)=>{

    const allCollection = await Collection.find().limit(20)

    console.log(allCollection)
    res.json(allCollection)

}

export const getMoreCollections = async(req,res)=>{
    const {lastId} =  req.body
    const moreCollections = await Collection.find({_id:{$gt:lastId}}).limit(20)
    res.json(moreCollections)
}