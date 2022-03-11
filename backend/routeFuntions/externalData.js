import axios from 'axios'
import dotevn from 'dotenv'
import Redis from 'ioredis'
dotevn.config()

const redis = new Redis({
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT,
    password : process.env.REDIS_KEY
})

export const getUserWalletBalance = async (req,res)=>{

    const {walletAddress}  = req.body

    const cachedData =  await redis.get(`userBalance:${walletAddress}`)

    console.log(cachedData, 'cache')
    if(cachedData){

        res.json({
            userBalance : Number(cachedData)
        })
    }
    else{
        const responseData =  await axios.get(`https://api.covalenthq.com/v1/250/address/${walletAddress}/balances_v2/?&key=${process.env.COVALENT_API_KEY}`)

        const ftmBalance = responseData.data.data.items.filter(eachItem=>{
            return eachItem.contract_name === "Fantom"
        })

        console.log(ftmBalance[0].balance, 'api')

        const userBalance = ftmBalance[0].balance / (Math.pow(10,18)).toFixed(4);

        await redis.set(`userBalance:${walletAddress}`, userBalance, 'EX', '1800')

        res.json({
            userBalance : userBalance
        })
    }

}

export const getNftsInUserWallet = async(req,res)=>{

    const {userWalletAddress} = req.body;

    const cachedData =  await redis.get(`nftInWallet:${userWalletAddress}`)

    if(cachedData){

        const parsed =  JSON.parse(cachedData)
        console.log(parsed,  'cache')
        res.json({
            itemsInWallet : JSON.parse(cachedData)
        })
    }
    else{
        const responseData = await axios.get(`https://api.covalenthq.com/v1/250/address/${userWalletAddress}/balances_v2/?nft=true&no-nft-fetch=false&key=${process.env.COVALENT_API_KEY}`)

        const itemsInWallet = responseData.data.data.items

        console.log(itemsInWallet, 'api')
        await redis.set(`nftInWallet:${userWalletAddress}`, JSON.stringify(itemsInWallet), 'EX', '1800')

        res.json({
            itemsInWallet : itemsInWallet
        })

    }
    
}

export const getSingleNftExternalData = async(req,res)=>{

    const {contractAddress, contractTokenId} =  req.body


    const nftUniqueIdentifier = contractAddress + contractTokenId

    const cachedData =  await redis.get(`nftMetaData:${nftUniqueIdentifier}`)

    if(cachedData){
        console.log(JSON.parse(cachedData), 'cache')
        res.json({
            externalData : JSON.parse(cachedData)
        })
    }
    else{
        const responseData =  await axios.get(`https://api.covalenthq.com/v1/250/tokens/${contractAddress}/nft_metadata/${contractTokenId}/?&key=${process.env.COVALENT_API_KEY}`)

        const externalData = responseData.data;

        redis.set(`nftMetaData:${nftUniqueIdentifier}`, JSON.stringify(externalData), 'EX' , '86400')

        console.log(externalData, 'api')

        res.json({
            externalData : externalData  
        })
    }

}