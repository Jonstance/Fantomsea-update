import React, { useEffect, useState, useContext } from "react";
import cn from "classnames";
import styles from "./Item.module.sass";
import Users from "./Users";
import Control from "./Control";
import Options from "./Options";
import {useParams, useHistory} from 'react-router'
import History from  './History/index.js'
import { AppContext } from "../../context/context";
import Bids from "./Bids";
import coingeckoApi from 'coingecko-api'
import Player from '../../components/Player'
import * as musicMetaData from 'music-metadata-browser'

let  navLinks = ["Owners", "History", "Bids"];






const users = [
  {
    name: "Raquel Will",
    position: "Owner",
    avatar: "/images/content/avatar-2.jpg",
    reward: "/images/content/reward-1.svg",
  },
  {
    name: "Selina Mayert",
    position: "Creator",
    avatar: "/images/content/avatar-1.jpg",
  },
];

const Item = () => {

  const historyRoute = useHistory()

  const [nftData, setNftData] = useState({})

  const [activeIndex, setActiveIndex] = useState(0);

  const [arrayOfUsers, setArrayOfUsers] =useState([])

  const [hasItemBeenFetched, setHasItemBeenFetched] = useState(false)

  const [navLinks, setNavLinks] = useState(["Owners", "History", "Bids"])

const [nftAuctionData, setNftAuctionData] = useState([])

const [isImage, setIsImage] =  useState(true)

const [isAudio, setIsAudio] = useState(false)

const [priceInDollars, setPriceInDollars] = useState('')

const [imageCover, setImageCover] = useState('')

const [attributesData, setAttributesData] = useState([])

const coinGeckoClient =  new coingeckoApi()

const jsmediatags = window.jsmediatags 


  const {id} = useParams()

  const {userAccountAddress, isExternalNFTViewed,
    setIsExternalDataViewed,
    userData,
    nftDataInWallet,
    setNftDataInWallet,
    importNFTMode,
    setImportNFTMode,
    nftImportData,
    setNftImportData,
  
  } = useContext(AppContext)


  const categories = [
    {
      category: "black",
      content: nftData.nftCategory,
    },
  ];


  useEffect( ()=>{

    console.log(isExternalNFTViewed)


    let nftCollectionId
    let nftDetails
(async ()=>{
    if(isExternalNFTViewed === false){
      fetch("https://fantomsea-api.herokuapp.com/nft/getSingleNFTData", {
        method :'POST',
        headers:{
          'Content-type' : 'application/json'
        },
        body:JSON.stringify({
          nftid: id
        })
      })
      .then(res=>res.json())
      .then(async (data)=>{
        console.log(data)
        setNftData(data.nftData)
        nftDetails=  data.nftData
        nftCollectionId = data.nftData.collectionId
        const contractAddress = data.nftData.contractAddress
        const contractTokenId = data.nftData.contractId
  
        fetch(`https://fantomsea-api.herokuapp.com/externalData/getNftMetaData`, {
          method : 'POST',
          headers:{
            'Content-type' : 'application/json'
          },
          body:JSON.stringify({
            contractAddress : contractAddress,
            contractTokenId : contractTokenId
          })
        })
   .then(res=>res.json())
   .then(dataRes=>{
    const data =  dataRes.externalData
     if(data.data.items[0].nft_data !== null){
      const nftDetails = data.data.items[0].nft_data[0].external_data
      const nftAttributeData = nftDetails.attributes
      console.log(nftAttributeData)
      if(nftAttributeData !== null ){
       setAttributesData(nftAttributeData)
      }
     }
   })

        
          if(data.nftData.nftType === 'video'){
            setIsImage(false)
          }
          else if(data.nftData.nftType === 'audio'){
            setImageCover(data.nftData.nftDigitalUrl)
            setIsImage(false)
            setIsAudio(true)
  
        }
        const dollarRateOfFTM =  await coinGeckoClient.simple.price({ids:"fantom", vs_currencies:'USD'})
        console.log(dollarRateOfFTM)
  
        const dollarAmount =  dollarRateOfFTM.data.fantom.usd
  
        const dollarEquivalent =  dollarAmount * data.nftData.nftPrice
  
        setPriceInDollars(dollarEquivalent)
  
        if(!data.nftData.hasOwnProperty('nftAuctionId'))
        {
          const filteredNavLinks = navLinks.filter((eachNav, i)=>{
            return i !=2
          })
  
          setNavLinks(filteredNavLinks)
        }
        else{
          setNavLinks(["Owners", "History", "Bids"])
          setNftAuctionData(data.auctionData)
        }
  
        const nftOwner = data.nftData.nftOwner
        const nftCreator =  data.nftData.nftCreator
  
        const arrayOfUsers = []
  
        const ownerObject = {
          name : nftOwner.userName,
          position: "Owner",
          avatar : nftOwner.avatar,
          address : nftOwner.userAddress
        }
  
        const creatorObject = {
          name : nftCreator.userName,
          position : "Creator",
          avatar : nftCreator.avatar,
          address : nftCreator.userAddress
  
        }
  
        arrayOfUsers.push(ownerObject)
        arrayOfUsers.push(creatorObject)
  
        setHasItemBeenFetched(true)
        setArrayOfUsers(arrayOfUsers)


        const apiCallForCollection =  await fetch('https://fantomsea-api.herokuapp.com/collection/getCollection', {
        method : 'POST',
        headers:{
            'Content-type' :'application/json'
        },
        body:JSON.stringify({
            collectionId : nftCollectionId
        })
    })

    const parsedAPIResponse = await apiCallForCollection.json()

    console.log(parsedAPIResponse)
   

    const newNFTData =  {
      ...nftDetails,
      collectionName : parsedAPIResponse.collectionDetails.collectionName,
      collectionTicker : parsedAPIResponse.collectionDetails.collectionTicker
    }
    console.log(newNFTData)
    setNftData(newNFTData)

      })
    }
    else {

      console.log("Hey")

      setNftData(nftDataInWallet)
      
      const contractAddress =  nftDataInWallet.contractAddress
      const contractTokenId = nftDataInWallet.tokenID

      console.log(contractAddress, contractTokenId)

      fetch(`https://fantomsea-api.herokuapp.com/externalData/getNftMetaData`, {
          method : 'POST',
          headers:{
            'Content-type' : 'application/json'
          },
          body:JSON.stringify({
            contractAddress : contractAddress,
            contractTokenId : contractTokenId
          })
        })
   .then(res=>res.json())
   .then(data=>{
     console.log(data)

     const nftDetails = data.externalData.data.items[0].nft_data[0].external_data
     const nftAttributeData = nftDetails.attributes
     console.log(nftAttributeData)
     if(nftAttributeData !== null){
      setAttributesData(nftAttributeData)
     }

   })


      if(nftDataInWallet.nftType === 'determine'){
        const newNftData = nftDataInWallet
        fetch(nftDataInWallet.nftMediaUrl)
        .then(res=>res.blob())
        .then(data=>{
          if(data.type.includes('audio')){
            newNftData.nftType = 'audio'
          }else{
            newNftData.nftType = 'video'
          }
          setNftData(newNftData)
        })
      }

      const arrayOfUsers = []


      const ownerObject = {
        name : userData.userName,
        position: "Owner",
        avatar : userData.avatar,
        address : userData.userWalleteAddress
      }

      arrayOfUsers.push(ownerObject)

      setArrayOfUsers(arrayOfUsers)
      setHasItemBeenFetched(true)

      

    }

  })()
        
    return ()=>{
      setIsExternalDataViewed(false)
      setNftDataInWallet({})
    }

  },[])
  

  const handleImportNft = ()=>{

    setImportNFTMode(true)
    setNftImportData(nftData)
    historyRoute.push('/upload-details')

  }

  return (
    <>

    {
      hasItemBeenFetched ? <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.bg}>
          <div className={styles.preview}>
            <div className={styles.categories}>
              {categories.map((x, index) => (
                <div
                  className={cn(
                    { "status-black": x.category === "black" },
                    { "status-purple": x.category === "purple" },
                    styles.category
                  )}
                  key={index}
                >
                  {x.content}
                </div>
              ))}
            </div>
            {
              isImage && isAudio === false ? 
              <img
              srcSet={nftData.nftDigitalUrl}
              alt="Item"
            /> : isImage === false && isAudio === false ? <video src={nftData.nftMediaUrl}
                        autoPlay={true}
                        controls={true}
                        
            /> : isImage === false && isAudio === true ? 
            <div>
              <img src={imageCover} />
              <audio style={{marginTop:"30px"}} src={nftData.nftMediaUrl} autoPlay={true} controls={true} controlsList="nodownload" />
            </div> : ""
            }
            
          </div>
          {/* <Options className={styles.options} /> */}
        </div>
        <div className={styles.details}>
          <h1 className={cn("h3", styles.title)}>{nftData.nftName}</h1>
          {
              isExternalNFTViewed === false ?
          <div className={styles.cost}>
            <div className={cn("status-stroke-green", styles.price)}>
              {nftData.nftPrice}FTM
            </div>
             <div className={cn("status-stroke-black", styles.price)}>
              ${priceInDollars.toFixed(2)}
            </div> 
            
          </div> : ""
}
          <div className={styles.info}>
           Description : {nftData.nftDescription}
          </div>
          <div className={styles.info}>
           Collection Name : {nftData.collectionName} ({nftData.collectionTicker})
          </div>
          <div className={styles.info}>
           Contract Address : {nftData.contractAddress}
          </div>

          <div className={styles.nav}>
            {navLinks.map((x, index) => (
              <button
                className={cn(
                  { [styles.active]: index === activeIndex },
                  styles.link
                )}
                onClick={() => setActiveIndex(index)}
                key={index}
              >
                {x}
              </button>
            ))}
          </div>
          {
            activeIndex === 0 ? <Users className={styles.users} items={arrayOfUsers} /> : activeIndex === 1 ? <History nftHistory={nftData.tradingHistory} /> : activeIndex === 2 ?  <Bids nftBids={nftAuctionData.nftAuctionBids}  /> : ""
          }
          
          <div className={styles.attributeSection} >
              <h3>Attributes</h3>
              <br/>
              <div className={styles.attributeDiv} >
                <p className={styles.attributeType} >Type</p>
                <p className={styles.attributeValue} >Value</p>
              </div>
              <hr className={styles.horizontalLine} ></hr>
              <br/>
              
              {
                attributesData.length > 0 ? attributesData.map((eachAttribute,i)=>{
                    return <div key={i} className={styles.attributeDiv} >
                    <p className={styles.attributeType} >{eachAttribute.trait_type}</p>
                    <p className={styles.attributeValue} >{eachAttribute.value}</p>
                  </div>
                })
                : <p>Not Attributes Available for this NFT</p>

              }
            </div>

          {
            isExternalNFTViewed ? <button style={{background:"dodgerblue", color:"white", height:'50px', width:"auto", padding:"15px", borderRadius:"13px", fontFamily: "Poppins, sans-serif" , marginTop:"30px" }} 
            onClick={()=>handleImportNft()}
            >
              Import to MarketPlace
            </button> : ""
          }


          {
            isExternalNFTViewed === false ? <Control className={styles.control}  nftData = {nftData} currentUserAddress = {userAccountAddress}
            setItemData = {(data)=>setNftData(data)
              
            }
            setNftAuctionData={(value)=>{setNftAuctionData(value)
            console.log(value)
            }}
            nftAuctionData={nftAuctionData}
            priceInDollars={priceInDollars}
            /> : ""
          }
          
        </div>
      </div>

            

    </div> : ""
    }
      
    </>
  );
};

export default Item;
