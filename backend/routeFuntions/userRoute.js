import {getUserAvatar, getUserById} from "../controllers/userController.js";
import User from "../models/usersModel.js";
import NFTItem from "../models/NFTModel.js";


export const checkIfUserExists = async(req,res)=>{
    const {userAddress} = req.body
    const usersAlreadyExisting =  await getUserById(userAddress)
    console.log(usersAlreadyExisting)
    console.log(usersAlreadyExisting.length)
    if(usersAlreadyExisting.length === 1){
        console.log(usersAlreadyExisting[0])
        res.json({
            "userExists" : true,
            "userData" : usersAlreadyExisting[0]
        })
    }
    else{
        res.json({
        "userExists" : false
        })
    }
}

export const createUserOnSignIn =  async (req,res)=>{

    const {userAddress, avatarUrl} = req.body
    const usersAlreadyExisting =  await getUserById(userAddress)
    console.log(usersAlreadyExisting, "hi")
    console.log(usersAlreadyExisting.length)    
    if(usersAlreadyExisting.length === 0){
        const newUser = new User({
            userWalleteAddress : userAddress,
            avatar : "https://bafybeihpmcfbjiafbi4iudufqwpjkzvu7huilad5f3g36cwn5xft2rrbuu.ipfs.infura-ipfs.io",
            username: '',
            bio : '',
            website : '',
            twitter : "",
            customUrl : '0',    
            ownedNfts : [],
            createdNfts : []       
        })

        const returnedUser =  await newUser.save()
        res.json({
            "userProfileSaved" : true,
            "userObject" : returnedUser
        })
    }
    else{
        res.json({
            "userProfileSaved" : false,
        })
    }
}

export const updateUserProfile = async (req,res)=>{

    const {userAddress,userDisplayName, userCustomUrl, userBio, portfolioWebsite, twitterUserName, avatar} = req.body
    const usersAlreadyExisting =  await getUserById(userAddress)
    console.log(usersAlreadyExisting)

    if(usersAlreadyExisting.lenght < 0){
        res.json({
            "userNotFound" : true
        })
    }
    else{

        let filter = {userWalleteAddress : userAddress}
        let dataToReplace  = {
            username: userDisplayName,
            bio : userBio,
            website : portfolioWebsite,
            twitter : twitterUserName,
            customUrl : userCustomUrl,
            avatar : avatar
        }

        const returnedData = await User.findOneAndUpdate(filter , dataToReplace, {
            new: true
        })

        res.json({
            "userNotFound" : false,
            "userData" : returnedData
        })
    }
}

export const getOneUserById = async (req,res)=>{

    const {userAddress}=  req.body;

    console.log(userAddress)

    const userData = await getUserById(userAddress)

    console.log(userData)

    if(userData.length !== 0){

    const {createdNfts, ownedNFTs} =  userData[0]

    const allNFTS = [...createdNfts, ...ownedNFTs]

    const nftSets = [... new Set(allNFTS)]

    const promiseOfReturnedNfts = nftSets.map(async(eachNftID)=>{
        return new Promise((resolve,reject)=>{
            NFTItem.find({nftID:eachNftID}).then(data=>{
                resolve(data[0])
            })
        })
        
    })

    let allNFTData = []

    if(promiseOfReturnedNfts.length > 0 ){
        Promise.all(promiseOfReturnedNfts)
        .then(data=>{
            console.log(data)
            if(userData.length !==0){
                res.json({
                    "userFound" : true,
                    "userData" : userData[0],
                    "nftData":data
                })
            }
            else{
                res.json({
                    "userFound" : false
                })
            }
        })
    }
    else{
        if(userData.length !==0){
            res.json({
                "userFound" : true,
                "userData" : userData[0],
                "nftData":[]
            })
        }
        else{
            res.json({
                "userFound" : false
            })
        }

    }
        }

    else{
        res.json({
            "userFound" : false
        })
    }
}

export const getOneUserAvatar = async(req,res)=>{

    const {userAddress} = req.body

    const userAvatar = await getUserAvatar(userAddress)
    console.log(userAvatar)
    res.json(userAvatar)
}


export const setUserCoverPhoto = async (req,res)=>{

    const {userAddress, urlOfCoverPhoto} = req.body

    const filterData = {userWalleteAddress : userAddress}

    const dataToReplace = {profileCoverUrl : urlOfCoverPhoto}

    try{
        await User.findOneAndUpdate(filterData, dataToReplace, {
            new : true
        })
        console.log(urlOfCoverPhoto)
        res.json({
            coverImage : urlOfCoverPhoto,
            error : null
        })
    }
    catch(e){
        res.json({
            coverImage : '',
            error : 'error occured'
        })
    }

    


}