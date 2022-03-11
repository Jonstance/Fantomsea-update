import AuctionModel from "../models/AuctionModel.js"
import Collection from "../models/Collection.js"
import NFTItem from "../models/NFTModel.js"


export const getHomePageData = async (req,res)=>{

 const firstRequest = NFTItem.find({isFeatured:true})
 const secondRequest = Collection.find({isFeatured:true})
const thirdRequest = NFTItem.find({isAuctionNft:true})
const fourthRequest = NFTItem.find().limit(20)

const resultOfQuery = await Promise.all([firstRequest, secondRequest, thirdRequest, fourthRequest])

console.log(resultOfQuery)

const auctionNfts = resultOfQuery[2]


const arrayOfQualifiedAuctions = []

auctionNfts.forEach(eachAuctionNft=>{
arrayOfQualifiedAuctions.push(AuctionModel.find({auctionId : eachAuctionNft.nftAuctionId}))
})

const resultOfAuctions = await Promise.all(arrayOfQualifiedAuctions)

const combineAuctionAndNftData =  auctionNfts.map(eachAuctionNFt=>{

    let currentAuctionId = eachAuctionNFt.nftAuctionId
    let indexOfAuction = resultOfAuctions.findIndex((auction)=>{
        return auction[0].auctionId === currentAuctionId
    })

    let newAuctionData = {...eachAuctionNFt._doc, ...resultOfAuctions[indexOfAuction][0]._doc}

    return newAuctionData
})


const collections = resultOfQuery[1]


const collectionData = collections.map(async (eachCollection)=>{

    return new Promise(async (resolve,reject)=>{

        const nftsInCollection = eachCollection.nftsInCollection

        const promiseArray =  nftsInCollection.map(async(eachNftId)=>{
    
            return await NFTItem.findOne({nftID : eachNftId})
    
        })
        
        const nftsData =  await Promise.all(promiseArray)
        
        const imagesInCollection = nftsData.map(eachNft=>{
            return eachNft.nftDigitalUrl
        })
    
        resolve({
            images : imagesInCollection,
            collectionId : eachCollection.collectionId
        })

    })
    
})


const nftImagesInCollection = await Promise.all(collectionData)


const collectionDataToUpload = nftImagesInCollection.map(eachImageObject=>{

    const indexOfCollection = collections.map((eachCollection, i)=>{

        if(eachCollection.collectionId === eachImageObject.collectionId){
            return i
        }
        else{
            return null
        }        
    })

    console.log(indexOfCollection)

    const cleanIndex  =  indexOfCollection.filter(eachIndex=>{
        return eachIndex !== null
    })

    return {...collections[cleanIndex[0]]._doc, ...nftImagesInCollection[cleanIndex[0]]}
    

})


const dataToSendToFrontEnd = {
    featuredNFTs : resultOfQuery[0],
    featuredCollections : collectionDataToUpload,
    featuredAuctions:combineAuctionAndNftData,
    someNfts:resultOfQuery[3]
}

res.json(dataToSendToFrontEnd)



}