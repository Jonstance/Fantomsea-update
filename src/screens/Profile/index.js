import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import { Link, useHistory } from "react-router-dom";
import styles from "./Profile.module.sass";
import Icon from "../../components/Icon";
import User from "../OtherProfile/User";
import Items from "./Items";
import Followers from "./Followers";

import {create} from 'ipfs-http-client'

// data
import { bids } from "../../mocks/bids";
import { isStepDivisible } from "react-range/lib/utils";
import { AppContext } from "../../context/context";

import {getLocalStorage} from '../../utils/localUtils'
import { v4 } from "uuid";

const navLinks = [
  "On Sale",
  "Collectibles",
  "Created",
  "Owned",
  // "Likes",
  // "Following",
  // "Followers",
];

const client = create("https://ipfs.infura.io:5001/api/v0")

const Profile = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const [displayName, setDisplayName] = useState('')
const [websiteUrl, setWebsiteUrl] =  useState('')
const [customUrl, setCustomUrl] = useState('')
const [twitterUserName, setTwitterUserName] = useState('')
const [userBio, setUserBio] = useState('')
const [memberSince, setMemeberSince] = useState('')
const [createdNfts, setCreatedNfts] = useState([])
const [ownedNfts, setOwnedNfts] = useState([])

const [hasDataFetched, setHasDataFetched] = useState(false)

const [avatar, setAvatar] =  useState("")

const [coverImage, setCoverImage] = useState("/images/content/bg-profile.jpg")

const [imageFile, setImageFile] = useState('')

const [imageUrl, setImageUrl] = useState('')

const routeHistory = useHistory()


const {userAccountAddress, userData, userProfilePageControl, setUserAccountAddress} = useContext(AppContext)

let userAddressToUse = userAccountAddress

if(userAccountAddress.trim() === ''){
  const userValue = getLocalStorage()
  if(userValue.addressFound === true){
    userAddressToUse = userValue.userAddress
  }
  else{
    routeHistory.push('/connect-wallet')
  }
}


const handleListAccounttNFts =  async ()=>{
  return new Promise(async (resolve,reject)=>{
    fetch(`https://backend.billisea.io/externalData/getNftsInUserWallet`, {
      method : 'POST',
      headers:{
        'Content-type' : 'application/json'
      },
      body:JSON.stringify({
        userWalletAddress : userAddressToUse
      })
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
      const itemsInWalllet = data.itemsInWallet
      const nftsInWallet = itemsInWalllet.filter(eachItem=>{
        return eachItem.nft_data !== null
      })
      console.log(nftsInWallet)
      const allNfts = nftsInWallet.map(eachNftItem=>{
        const allNftData = eachNftItem.nft_data.map(eachNftDataInWalletObject=>{
          eachNftDataInWalletObject.contractAddress = eachNftItem.contract_address
          eachNftDataInWalletObject.contractName = eachNftItem.contract_name
          eachNftDataInWalletObject.contractTicker =  eachNftItem.contract_ticker_symbol

          return eachNftDataInWalletObject
        })
        return allNftData
      })
      
      
      const allNftsInOneArray =  allNfts.flat()
      const allSingleNfts = allNftsInOneArray.filter(eachNft=>{
        return eachNft.supports_erc !== null && !eachNft.supports_erc.includes('erc1155') 
      })

      /* This is because we support only single nfts for now */

      resolve(allSingleNfts)
    })
  })
}


const handleFileChange  = (event)=>{

const imageFile =  event.target.files[0]

const urlForImage = URL.createObjectURL(imageFile)

setCoverImage(urlForImage)

setImageFile(imageFile)

}

const handleProfileCoverChange = async ()=>{
  try{

    const added =  await client.add(imageFile, {
    })

    const v1Cid = added.cid.toV1()
    const urlPath = v1Cid.toString()
    const url = `https://${urlPath}.ipfs.infura-ipfs.io`

    console.log(url)
    setCoverImage(url)
    const apiResponse = await fetch("https://backend.billisea.io/users/setProfileCoverUrl", {
      method : 'POST',
      headers:{
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify({
        urlOfCoverPhoto : url,
        userAddress : userAccountAddress
      })
    })

    const parsedAPIResponse = await apiResponse.json()

    const {coverImage, error }  = parsedAPIResponse

    setCoverImage(coverImage)

    setVisible(false)
  }
  catch(e){
    console.log(e)
}

}


useEffect(async ()=>{

  
  const userAddress = getLocalStorage()

  let addressToUse = userAccountAddress

  if(userAccountAddress.trim() === '' && userAddress.addressFound === true){
    setUserAccountAddress(userAddress.userAddress)
     addressToUse = userAddress.userAddress
  }

  console.log(addressToUse)


    fetch("https://backend.billisea.io/users/getUserAccount", {
      method : 'POST',
      headers:{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        "userAddress" : addressToUse
      })
    })
    .then(res=>res.json())
    .then(async (data)=>{
      console.log(userAccountAddress)
      const {userData, nftData} = data
      console.log(nftData)
      console.log(data)
      console.log(userData) 
      if(userData.profileCoverUrl !==  undefined){
        setCoverImage(userData.profileCoverUrl)
      }
      setUserBio(userData.bio)

      const nftsInWallet = await handleListAccounttNFts()

      const ownedNfts = nftData.filter(eachNft=>{
        return eachNft!== null && eachNft.nftOwner.userAddress === userAccountAddress
      })  

      console.log(ownedNfts)

      const nftsNotListedOnMarketPlace = nftsInWallet.filter(eachNftItem=>!ownedNfts.some(eachOwnedNfts=>eachNftItem.contractAddress == eachOwnedNfts.contractAddress && eachNftItem.token_id == eachOwnedNfts.contractId))

      console.log(nftsNotListedOnMarketPlace)

      const arrayOfOwnedNftsNotInMarketPlace = nftsNotListedOnMarketPlace.map(eachNft=>{

        const desiredNftObject = {
          isExternal : true,
          nftName : eachNft.external_data.name,
          nftType : eachNft.external_data.animation_url === null ? 'image' : 'determine',
          nftMediaUrl : eachNft.external_data.animation_url,
          nftDigitalUrl : eachNft.external_data.image,
          numberInStock :  eachNft.token_balance,
          tokenUrl :  eachNft.token_url, 
          contractAddress : eachNft.contractAddress,
          tokenID : eachNft.token_id,
          nftDescription : eachNft.external_data.description,
          collectionName : eachNft.contractName,
          collectionTicker : eachNft.contractTicker,
          nftID : v4(),
          nftAttributes : eachNft.external_data.attributes
        }

        return desiredNftObject
      })

      console.log(arrayOfOwnedNftsNotInMarketPlace)

      setOwnedNfts(arrayOfOwnedNftsNotInMarketPlace)

      setTwitterUserName(userData.twitter)
      setDisplayName(userData.username)
      setWebsiteUrl(userData.website)
      setCustomUrl(userData.customUrl)
      setAvatar(userData.avatar)


      console.log(userProfilePageControl)

      if(userProfilePageControl === 'created'){
        setActiveIndex(2)
      }
      else if(userProfilePageControl === 'owned'){
        setActiveIndex(3)
      }

      const dateInstance = new Date(userData.createdAt)

      const date = dateInstance.getDate()

      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      const month =  months[dateInstance.getMonth()]
      const year = dateInstance.getFullYear()
      
      const fullDate =  `${month} ${date}, ${year}  `

      setMemeberSince(fullDate)
      const safeNftData = nftData.filter(nft=>{
        return nft !== null
      })
      setCreatedNfts(safeNftData)      

      setHasDataFetched(true)
      console.log(nftData)
    })
  }
  ,[])

  return (
    <div>

      {
        hasDataFetched ? <div className={styles.profile}>
        <div
          className={cn(styles.head, { [styles.active]: visible })}
          style={{
            backgroundImage: `url(${coverImage})`,
          }}
        >
          <div className={cn("container", styles.container)}>
            <div className={styles.btns}>
              <button
                className={cn("button-stroke button-small", styles.button)}
                onClick={() => setVisible(true)}
              >
                <span>Edit cover photo</span>
                <Icon name="image" size="16" />

              </button>
              <Link
                className={cn("button-stroke button-small", styles.button)}
                to="profile-edit"
              >
                <span>Edit profile</span>
                <Icon name="edit" size="16" />

              </Link>
            </div>
            <div className={styles.file}>
              <input type="file"  onChange={(event)=>handleFileChange(event)} />
              <div className={styles.wrap}>
                <Icon name="upload-file" size="48" />
                <div className={styles.info}>Drag and drop your photo here</div>
                <div className={styles.text}>or click to browse</div>
              </div>
              <button
                className={cn("button-small", styles.button)}
                onClick={() => handleProfileCoverChange()}
              >
                Save photo
              </button>
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={cn("container", styles.container)}>
            <User className={styles.user}
            customUrl={customUrl}
            displayName={displayName}
            userAddress={userAccountAddress}
            userBio={userBio}
            memeberShipDate = {memberSince}
            avatar={avatar}
            
            />
            <div className={styles.wrapper}>
              <div className={styles.nav}>
                {navLinks.map((x, index) => (
                  <button
                    className={cn(styles.link, {
                      [styles.active]: index === activeIndex,
                    })}
                    key={index}
                    onClick={() => setActiveIndex(index)}
                  >
                    {x}
                  </button>
                ))}
              </div>
              <div className={styles.group}>
                <div className={styles.item}>
                  {activeIndex === 0 && (
                    <Items class={styles.items} createdNfts = {createdNfts} 
                    activeIndex = {activeIndex}  
                    items={bids.slice(0, 3)} />
                  )}
                  {activeIndex === 1 && (
                    <Items class={styles.items} createdNfts = {createdNfts}
                    activeIndex = {activeIndex} 
                    items={bids.slice(0, 6)} />
                  )}
                  {activeIndex === 2 && (
                    <Items class={styles.items} createdNfts = {createdNfts} 
                    activeIndex = {activeIndex} 
                    items={bids.slice(0, 2)} />
                  )}
                  {activeIndex === 3 && (
                    <Items class={styles.items} createdNfts = {createdNfts}  
                    activeIndex = {activeIndex} 
                    ownedNftsInWallet= {ownedNfts}
                    items={bids.slice(0, 3)} />
                  )}
                  {/* {activeIndex === 4 && (
                    <Followers className={styles.followers} items={following} />
                  )}
                  {activeIndex === 5 && (
                    <Followers className={styles.followers} items={followers} />
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> : ""
      }
    
    </div>
  );
};

export default Profile;
