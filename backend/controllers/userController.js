import User from '../models/usersModel.js'
import asyncHandler from 'express-async-handler'
import NFTItem from '../models/NFTModel.js'

//getUsers function to get all users
export const getUserById = asyncHandler(async (userAddress) => {
    return new Promise(async (resolve, reject)=>{
        const users = await User.find({userWalleteAddress : userAddress})
        resolve(users)
    })
    
})

export const removeNFTIDFromUser = (currentUserAddress, idOfNFT)=>{

    return new Promise(async (resolve,reject)=>{

     const userData =  await getUserById(currentUserAddress)
     
     const {ownedNFTs} = userData[0]

     const newOwnedNfts =  ownedNFTs.filter(eachNFTID=>{
         return eachNFTID !== idOfNFT
     })

     const filter = {userWalleteAddress : currentUserAddress}
     const dataToReplace = {
         ownedNFTs : newOwnedNfts
     }

     try{
        const newUserData =  await User.findOneAndUpdate(filter, dataToReplace, {
            new:true
        })

        const response = {
            "userDataUpdated" : true,
            "userData" : newUserData
        }

        resolve(response)
     }
     catch(e){
        const response = {
            "userDataUpdated" : false,
        }   
        resolve(response)
     }
    })
}

export const addNFTIdToNewOwner = (addressOfNewOwner, nftID)=>{

    return new Promise(async (resolve,reject)=>{

        const userData = await getUserById(addressOfNewOwner)
     
     const {ownedNFTs} = userData[0]

     let myNfts = ownedNFTs

     let myNewFts = [...ownedNFTs, nftID]

     console.log(myNewFts)

     const filter = {userWalleteAddress : addressOfNewOwner}

     const dataToReplace  = {
        ownedNFTs : myNewFts
     }

     try{
        const returnedData  = await User.findOneAndUpdate(filter, dataToReplace, {
            new:true
        })

        console.log(returnedData)

        const response = {
            "userDataUpdated" : true,
            "userData" : returnedData
        }
        resolve(response)
     }
     catch(e){
         console.log(e)
        const response = {
            "userDataUpdated" : false,
        }

        resolve(response)
     }
     

    })

}

export const getUserAvatar = (address)=>{
    return new Promise((resolve,reject)=>{
        const userData =  getUserById(address)
        if(userData.length > 0){
            const {avatar} = userData[0]
            resolve(avatar)
        }
    })
    
}

// //getUserById function to retrieve user by id
// export const getUserById  = asyncHandler(async(req, res) => {
//     const user = await User.findById(req.params.id)

//     //if user id match param id send user else throw error
//     if(user){
//         res.json(user)
//     }else{
//         res.status(404).json({message: "User not found"})
//         res.status(404)
//         throw new Error('User not found')
//     }
// })