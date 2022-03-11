import React, { useState , useContext, useEffect } from "react";
import cn from "classnames";
import { Link, NavLink, useHistory } from "react-router-dom";
import styles from "./UploadDetails.module.sass";
import Dropdown from "../../components/Dropdown";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import Switch from "../../components/Switch";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import Preview from "./Preview";
import Cards from "./Cards";
import FolowSteps from "./FolowSteps";
import {create} from 'ipfs-http-client'
import Web3Modal from 'web3modal';
import { ethers } from "ethers";
import {AppContext} from '../../context/context'
import CreateCollection from "./CreateCollection/index"
import moment from 'moment'
import * as musicMetaData from 'music-metadata-browser'

import NFTMarketABI from '../../ABIs/contracts/Market.sol/marketABI.json'


import NFTABI from '../../ABIs/contracts/SingleNFT.sol/SingleNFTAbi.json'
import { v4 } from "uuid";
const royaltiesOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ,"10"];
const categoryOptions = ["Art", "Music", "Collectibles", "Sports", "Utility", "Other"];

const items = [
  {
    title: "Create collection",
    color: "#4BC9F0",
  },
  
];
const Upload = () => {

  const [royalties, setRoyalties] = useState(0)
  const [category, setCategory] = useState(categoryOptions[0]);
  const [sale, setSale] = useState(true);
  const [price, setPrice] = useState(false);
  const [locking, setLocking] = useState(false);
  const [imageUrl, setImageUrl] = useState('')
  const [itemName, setItemName]=  useState('Item Name Preview')
  const [externalLink, setExternalLink] = useState('')
  const [description, setDescripition] = useState('')
  const [itemPrice, setItemPrice] = useState(0)
  const [isAuction, setIsAuction] = useState(false)
  const [isInstantBuy , setIsInstantBuy] = useState(true) 
  const [reservedPrice, setReserevedPrice] = useState("0.05")

  const [showAlert, setShowAlert] =  useState(false)
  const [alertMessage, setAlertMessaege] = useState('')
  const [timeDeadline, setTimeDeadline] = useState(0)

  const [NftTokenId, setNtfTokenId] = useState('')

  const [nfswContent, setNFTSwContent] = useState(false)

  const [hasNFTbeenUploadedAndMinted, setHasNFTBeenUploadedAndMinted] = useState(false)

  const [hasNFTBeenListedOnContract, setHasNFTBeenListedOnContract] = useState(false)

  const [hasUserStartedSignSell, setHasUserStartedSignSell] =  useState(false)

  const [fileUrl, setFileUrl] = useState('')

  const [file, setFile] = useState('')

  const [nftMediaUrl, setnftMediaUrl] = useState('')

  const [nftAttributes, setNftAttributes] = useState([])

  const [visibleModal, setVisibleModal] = useState(false);

  const [visiblePreview, setVisiblePreview] = useState(false);

  const [nftCreatorAddress, setNftCreatorAddress] = useState("0xF57Fd1CFf610278AA63CbBa0C454c5f9e5664207".toLowerCase())

  const [showNoCoverAlert, setShowNoCoverAlert] = useState(false)


  const [nftType, setNftType]  = useState('')

  const [collectionName, setCollectionName] = useState("FantomSea")
  
  const [collectionTicker, setCollectionTicker] = useState("FSEA")

  const [isNotImage, setIsNotImage] = useState(false)

  const [fileType, setFileType] = useState("image")



  const [collectionId, setCollectionId] =  useState('')

  const {userAccountAddress, setUserAccountAddress, setUserData,setUserProfilePageControl, importNFTMode, setImportNFTMode, nftImportData } = useContext(AppContext)

  const history =  useHistory()

  const client = create("https://ipfs.infura.io:5001/api/v0")

  const nftMarketaddress = "0x60601D627020Cc125D68E3EC71A862ad389c3f3e"

  useEffect(()=>{
    if(importNFTMode){
      console.log(nftImportData)
      setNftCreatorAddress(nftImportData.contractAddress)
      setFileUrl(nftImportData.nftDigitalUrl)
      setImageUrl(nftImportData.nftDigitalUrl)
      setDescripition(nftImportData.nftDescription)
      setNtfTokenId(nftImportData.tokenID)
      setCollectionName(nftImportData.collectionName)
      setCollectionTicker(nftImportData.collectionTicker)
      setItemName(nftImportData.nftName)
      setNftAttributes(nftImportData.nftAttributes)


      // fetch(nftImportData.token_url)
      // .then(res=>res.json())
      // .then(data=>{
      //   console.log(data)
      //   const allKeys = Object.keys(data)
      //   const allValue = Object.values(data)
      //   console.log(allKeys)
      //   let nameProperty;
      //   allKeys.map(eachKey=>{
      //     if(eachKey.toLowerCase().includes('name')){
      //       nameProperty = eachKey 
      //     }
      //   })
        
      //   const indexOfProperty = allKeys.indexOf(nameProperty)  
        
      //   console.log(allValue[indexOfProperty])
      //     setItemName(allValue[indexOfProperty])


      // })

    }

    return ()=>{
      setImportNFTMode(false)
    }

  },[])


  const handleAudioImageUpload = (event)=>{

    const imageFile = event.target.files[0]

    const coverImageUrl = URL.createObjectURL(imageFile)

    setImageUrl(coverImageUrl)

    UploadImageToIPFS(imageFile)

    setShowNoCoverAlert(false)

  }

  const handleFileSelected = async (event)=>{

    const imageFile =  event.target.files[0]

    console.log(imageFile)

    if(imageFile.size <= (25 * 1024 * 1024 )){

    

    if(imageFile.type.includes('audio')){

      setFileType('audio')
      setIsNotImage(true)

      const fileUrl = URL.createObjectURL(imageFile)

      const mediaMetaData = await musicMetaData.fetchFromUrl(fileUrl)

      console.log(mediaMetaData)

      const pictureArray =  mediaMetaData.common.picture

      console.log(pictureArray)

      if(pictureArray !== undefined){
        const imageData  =  mediaMetaData.common.picture[0]
        const imageContent = new Uint8Array(imageData.data)
        const imageUrl = URL.createObjectURL(new Blob([imageContent.buffer], {type:imageData.format}))
        console.log(imageUrl)
        setImageUrl(imageUrl)
        const imageInBlob = new Blob([imageContent.buffer], {type:imageData.format})
        const imageInFileFormat = new File([imageInBlob], `${v4()}`, {type:imageData.format})
      setFile(fileUrl)
      UploadImageToIPFS(imageInFileFormat) 
      console.log(imageInFileFormat)
      }
      else{
        setShowNoCoverAlert(true)
        setFile(fileUrl)
      }
        console.log(fileUrl)
        uploadMediaFileToIPFS(imageFile)
    }

    else if(imageFile.type.includes('video')){
      setFileType('video')
      const fileUrl = URL.createObjectURL(imageFile)
      setFile(fileUrl)
      uploadMediaFileToIPFS(imageFile)
    }
    
    else{
      const fileUrl = URL.createObjectURL(imageFile)

        console.log(fileUrl)
    
       setImageUrl(fileUrl)
    
       setFile(imageFile) 
       setFileType('image')
       UploadImageToIPFS(imageFile)
    }
  }
  else{
    alert("File is Too Large")
  }
  }
 
  const clearALLStateFields  = ()=>{

    setImageUrl('')
    setItemName('Item Name Preview')
    setItemPrice('0')

  }

  const UploadImageToIPFS = async (file)=>{
   try{

      const added =  await client.add(file, {
      })

      const v1Cid = added.cid.toV1()
      const urlPath = v1Cid.toString()
      const url = `https://${urlPath}.ipfs.infura-ipfs.io`

      console.log(url)

      setFileUrl(url)
    }
    catch(e){
      console.log(e)

  }
  }

  const uploadMediaFileToIPFS =  async(file)=>{
    
    try{
      const added = await client.add(file, {
      })
      const v1Cid = added.cid.toV1()
      const urlPath = v1Cid.toString()
      const url = `https://${urlPath}.ipfs.infura-ipfs.io`

      console.log(url)
      setnftMediaUrl(url)
    }
    catch(e){
      console.log(e)
    }

  }
 

  const createNFTItem = async()=>{

    const doesFileExist = fileUrl ===  null ? false : fileUrl.trim() === '' ? false : true

    const isPriceLessThanZero = price <= 0

    const doesItemNameExist = itemName === null ? false : itemName.trim() === '' ? false : true

    const doesDescriptionExist = description ===  null ? false : description.trim() === '' ? false : true

    console.log(doesFileExist, isPriceLessThanZero, doesItemNameExist, doesDescriptionExist)

    if(doesFileExist === false || isPriceLessThanZero === false, doesItemNameExist ===false || (doesDescriptionExist === false && importNFTMode === false ) ){
      if (doesFileExist ===  false){
        setAlertMessaege("NFT Media File not Uploaded Yet, please check that ")
        setShowAlert(true)
      }
      else if(isPriceLessThanZero === false){
        setAlertMessaege("Price cannot be 0 or less ")
        setShowAlert(true)
      }
      else if (doesItemNameExist === false){
        setAlertMessaege("NFT Must have a name, please recheck the form")
        setShowAlert(true)
      }
      else if(doesDescriptionExist === false){
        setAlertMessaege("NFT must have a description ")
        setShowAlert(true)
      }
    }
    else{
      setVisibleModal(true)
      const nftData = JSON.stringify({
        name:itemName, description, image:fileUrl,price:itemPrice,
        attributes:nftAttributes,
        external_url : externalLink,
        animation_url : nftMediaUrl
      })
  
      console.log(nftData)
  
      try{
  
        const added = await client.add(nftData)
        const tokenUrI =  `https://ipfs.infura.io/ipfs/${added.path}`
        console.log(tokenUrI)
        createNFTSaleItem(tokenUrI)
      }
      catch(e){
  
        console.log("An Error occured", e)
  
      }
  
    }

    
  }
  
  const createNFTSaleItem = async (url)=>{

    const web3Modal = new Web3Modal()

    const connection = await web3Modal.connect()

    const webProvider = new ethers.providers.Web3Provider(connection)

    const signer = webProvider.getSigner()

    const gasPrice = await webProvider.getGasPrice()

    const lastBlock =  await webProvider.getBlock("latest")

    const gasLimit  = lastBlock.gasLimit.toNumber()


    console.log(signer)

    if(!importNFTMode){

      const nftContract  = new ethers.Contract(nftCreatorAddress, NFTABI, signer )

      const transaction = await nftContract.createToken(url, {gasPrice:gasPrice, gasLimit:1000000})
    
      let txDetails = await transaction.wait()
      let event = txDetails.events[0]
      console.log(event)
      let value = event.args[2]
      let nftTokenId = value.toNumber()
  
      setHasNFTBeenUploadedAndMinted(true)
  
      setNtfTokenId(nftTokenId)
  
      if(isAuction){

        fetch("https://fantomsea-api.herokuapp.com/collection/uploadCollection", {
      method : 'POST',
      headers:{
        'Content-Type' : "application/json"
      },
      body : JSON.stringify({
        collectionName : collectionName,
        collectionAddress : nftCreatorAddress,
        collectionTicker : collectionTicker
      })
    })
    .then(res=>res.json())
    .then(data=>{
      const {collectionId} =  data

      const nftItemData = {
        nftName: itemName,
        nftDescription : description,
        nftDigitalUrl : fileUrl,
        nftCategory : category,
        royalty : royalties,
        isAuctionNFT: isAuction,
        isInstantBuy : isInstantBuy,
        userAddress : userAccountAddress,
        contractId : nftTokenId,
        contractAddress : nftCreatorAddress,
        isSingle : true,
        isMultiple:false,
        numberInStock:1,
        nftStaringPrice : reservedPrice,
        nftTimeDeadline : timeDeadline,
        collectionId : collectionId,
        externalLink : externalLink,
        nftAttributes :nftAttributes,
        nftMediaUrl : nftMediaUrl,
        nftType : fileType,
        nfswContent : nfswContent,
        listedForSale : true
        
      }

      console.log(nftItemData)

      fetch("https://fantomsea-api.herokuapp.com/nft/UploadnftAuctionData", {
        method : 'POST',
        headers:{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(nftItemData)
      })
      .then(res=>res.json())
      .then(data=>{
        console.log(data)
        setHasNFTBeenListedOnContract(true)
        history.push('/profile')
        setUserProfilePageControl("created")
  
      })
    })  
      }
  
    }
    else{
      setHasNFTBeenUploadedAndMinted(true)
      console.log("Hey")

    }
  }

  const listNftOnMarketContract = async (nftTokenId)=>{

    if(hasNFTbeenUploadedAndMinted === true){ 

    const web3Modal = new Web3Modal()

    const connection = await web3Modal.connect()

    const webProvider = new ethers.providers.Web3Provider(connection)

    const signer = webProvider.getSigner()

    const priceOfNft = ethers.utils.parseUnits(itemPrice, 'ether')

    console.log(priceOfNft)

    console.log(itemPrice)

    setHasUserStartedSignSell(true)

    if(importNFTMode){
      const web3Modal = new Web3Modal()

      const connection = await web3Modal.connect()
  
      const webProvider = new ethers.providers.Web3Provider(connection)
  
      const signer = webProvider.getSigner()

      let setApprovalGasPrice =  await webProvider.getGasPrice()

      const nftContract = new ethers.Contract(nftCreatorAddress, NFTABI, signer)
      try{

        const isApproved =  await nftContract.isApprovedForAll(userAccountAddress,nftMarketaddress)
        console.log(isApproved)
        if(isApproved === false){
          const setApprovalForAll =  await nftContract.setApprovalForAll(nftMarketaddress, true, {gasPrice:setApprovalGasPrice, gasLimit:1000000})
          console.log(setApprovalForAll)
        }
        const nftLister =  new ethers.Contract(nftMarketaddress, NFTMarketABI, signer)

      let listingPrice = await nftLister.getListingPrice()
  
      listingPrice = listingPrice.toString()
  
      console.log(nftCreatorAddress)

      const fetchCollectionPromise = await  fetch("https://fantomsea-api.herokuapp.com/collection/getCollectionByAddress", {
        method : 'POST',
      headers:{
        'Content-Type' : "application/json"
      },
      body:JSON.stringify({
        contractAddress : nftCreatorAddress
      })
      })
  
      const collectionData = await fetchCollectionPromise.json()
      
      const {collectionFound, collection }  = collectionData



      console.log(collectionData)
  
      const listNftInMarketGasPrice =  webProvider.getGasPrice()

      const listNFTTransaction = await nftLister.createMarketItem(nftCreatorAddress, nftTokenId, priceOfNft, collectionFound === true ? (collection.royaltyPercentage === undefined || collection.royaltyPercentage === '' ? royalties : collection.royaltyPercentage) : royalties , collectionFound === true ?  (collection.royaltyReciver === '' || collection.royaltyReciver === undefined  ? userAccountAddress:  collection.royaltyReciver ) : userAccountAddress ,  {value:listingPrice,gasPrice:listNftInMarketGasPrice, gasLimit:1000000})
  
      const transactionDetails = await  listNFTTransaction.wait()

        fetch("https://fantomsea-api.herokuapp.com/collection/uploadCollection", {
      method : 'POST',
      headers:{
        'Content-Type' : "application/json"
      },
      body : JSON.stringify({
        collectionName : collectionName,
        collectionAddress : nftCreatorAddress,
        collectionTicker : collectionTicker
      })
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
      const {collectionId} = data
      setCollectionId(collectionId)
      
      const nftItemData = {

        nftName: itemName,
        nftPrice : itemPrice,
        nftDescription : description,
        nftDigitalUrl : fileUrl,
        nftCategory : category,
        royalty : royalties,
        isAuctionNFT: isAuction,
        isInstantBuy : isInstantBuy,
        userAddress : userAccountAddress,
        nfswContent: nfswContent,
        contractId : nftTokenId,
        contractAddress : nftCreatorAddress,
        isSingle : true,
        isMultiple:false,
        numberInStock:1,
        collectionId : collectionId,
        externalLink : externalLink,
          nftAttributes :nftAttributes,
          nftMediaUrl : nftMediaUrl,
          nftType : fileType,
          listedForSale : true
      }
  
      
  
      fetch("https://fantomsea-api.herokuapp.com/nft/uploadSingleNft", {
        method : 'POST',
        headers:{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(nftItemData)
      })
      .then(res=>res.json())
      .then(data=>{
        console.log(data)
        setHasNFTBeenListedOnContract(true)
  
        history.push('/profile')
        setUserProfilePageControl("created")
  
  
      })
      .catch(e=>{
        console.log(e)
      })
    })

      }
      catch(e){
        console.log(e)
        alert("Seems the Gas price is too low to complete this transaction - please increase the gas price in your wallet ")
        
      }


    }

    else{
      const nftLister =  new ethers.Contract(nftMarketaddress, NFTMarketABI, signer)

      let listingPrice = await nftLister.getListingPrice()
  
      listingPrice = listingPrice.toString()
  
      console.log(nftCreatorAddress)
  
      let gasPrice =  await webProvider.getGasPrice()
  
  
      const listNFTTransaction = await nftLister.createMarketItem(nftCreatorAddress, nftTokenId, priceOfNft, royalties,userAccountAddress, {value:listingPrice,gasPrice:gasPrice,gasLimit:1000000})
  
      const transactionDetails = await  listNFTTransaction.wait()
  
      console.log(transactionDetails)
      fetch("https://fantomsea-api.herokuapp.com/collection/uploadCollection", {
        method : 'POST',
        headers:{
          'Content-Type' : "application/json"
        },
        body : JSON.stringify({
          collectionName : collectionName,
          collectionAddress : nftCreatorAddress,
          collectionTicker : collectionTicker
        })
      })
      .then(res=>res.json())
      .then(data=>{
        console.log(data)
        const {collectionId} = data
        setCollectionId(collectionId)
        const nftItemData = {
  
          nftName: itemName,
          nftPrice : itemPrice,
          nftDescription : description,
          nftDigitalUrl : fileUrl,
          nftCategory : category,
          royalty : royalties,
          isAuctionNFT: isAuction,
          isInstantBuy : isInstantBuy,
          userAddress : userAccountAddress,
          contractId : nftTokenId,
          contractAddress : nftCreatorAddress,
          isSingle : true,
          isMultiple:false,
          numberInStock:1,
          collectionId : collectionId,
          nfswContent :nfswContent,
          externalLink : externalLink,
          nftAttributes :nftAttributes,
          nftMediaUrl : nftMediaUrl,
          nftType : fileType,
          listedForSale : true
        }
    
        
    
        fetch("https://fantomsea-api.herokuapp.com/nft/uploadSingleNft", {
          method : 'POST',
          headers:{
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(nftItemData)
        })
        .then(res=>res.json())
        .then(data=>{
          console.log(data)
          setHasNFTBeenListedOnContract(true)
    
          history.push('/profile')
          setUserProfilePageControl("created")
    
    
        })
        .catch(e=>{
          console.log(e)
        })
      })
    } 
  }
  else{
    alert("Waiting for the NFT to be Minted..... ")
  }

  }



  const uploadNftToDb = ()=>{
    if(isAuction){
      fetch("https://fantomsea-api.herokuapp.com/collection/uploadCollection", {
    method : 'POST',
    headers:{
      'Content-Type' : "application/json"
    },
    body : JSON.stringify({
      collectionName : collectionName,
      collectionAddress : nftCreatorAddress,
      collectionTicker : collectionTicker
    })
  })
  .then(res=>res.json())
  .then(data=>{
    const {collectionId} =  data

    const nftItemData = {
      nftName: itemName,
      nftDescription : description,
      nftDigitalUrl : fileUrl,
      nftCategory : category,
      royalty : royalties,
      isAuctionNFT: isAuction,
      isInstantBuy : isInstantBuy,
      userAddress : userAccountAddress,
      contractId : NftTokenId,
      contractAddress : nftCreatorAddress,
      isSingle : true,
      isMultiple:false,
      numberInStock:1,
      nftStaringPrice : reservedPrice,
      nftTimeDeadline : timeDeadline,
      collectionId : collectionId,
      externalLink : externalLink,
      nftAttributes :nftAttributes,
      nftMediaUrl : nftMediaUrl,
      nftType : fileType,
      nfswContent : nfswContent,
      listedForSale : false
    }

    console.log(nftItemData)

    fetch("https://fantomsea-api.herokuapp.com/nft/UploadnftAuctionData", {
      method : 'POST',
      headers:{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(nftItemData)
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
      setHasNFTBeenListedOnContract(true)
      history.push('/profile')
      setUserProfilePageControl("created")

    })
  })  
    }
else{

  fetch("https://fantomsea-api.herokuapp.com/collection/uploadCollection", {
        method : 'POST',
        headers:{
          'Content-Type' : "application/json"
        },
        body : JSON.stringify({
          collectionName : collectionName,
          collectionAddress : nftCreatorAddress,
          collectionTicker : collectionTicker
        })
      })
      .then(res=>res.json())
      .then(data=>{
        console.log(data)
        const {collectionId} = data
        setCollectionId(collectionId)
        const nftItemData = {
  
          nftName: itemName,
          nftPrice : itemPrice,
          nftDescription : description,
          nftDigitalUrl : fileUrl,
          nftCategory : category,
          royalty : royalties,
          isAuctionNFT: isAuction,
          isInstantBuy : isInstantBuy,
          userAddress : userAccountAddress,
          contractId : NftTokenId,
          contractAddress : nftCreatorAddress,
          isSingle : true,
          isMultiple:false,
          numberInStock:1,
          collectionId : collectionId,
          nfswContent :nfswContent,
          externalLink : externalLink,
          nftAttributes :nftAttributes,
          nftMediaUrl : nftMediaUrl,
          nftType : fileType,
          listedForSale : false
        }
    
        
        fetch("https://fantomsea-api.herokuapp.com/nft/uploadSingleNft", {
          method : 'POST',
          headers:{
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(nftItemData)
        })
        .then(res=>res.json())
        .then(data=>{
          console.log(data)
          setHasNFTBeenListedOnContract(true)
    
          history.push('/profile')
          setUserProfilePageControl("created")
    
    
        })
      })
}
  }

  const handleSetRoyalty = (value)=>{
    console.log(value, isNaN(value), itemPrice)
    if(value <=10 && isNaN(value) === false ){
      setRoyalties(value)
    }
    else{
      alert("Royalty must be from from 0-10")
    }
  }


  const handleSetItemPrice = (value)=>{
    if(isNaN(value) === false){
      setItemPrice(value)
    }
    else{
      alert("Not Valid")
    }
  }

  return (
    
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <Modal visible={showNoCoverAlert} onClose={()=>alert("Modal cannot be closed without Audio Cover Image")} >
            <h3 style={{textAlign:'center'}}>Seems Your Audio File has no cover Image</h3>
            <br/>
            <br/>

            <p>An Image is required for all NFTs , including Audio NTFs, please use the upload button below 👇 </p>
<br/>

<div className={styles.item}>
                  <div className={styles.category}>Upload file</div>
                  <div className={styles.note}>
                    Drag or choose your file to upload
                  </div>
                  <div className={styles.file}>
                    <input className={styles.load} disabled={importNFTMode} type="file" accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm,audio/mp3,audio/webm,audio/mpeg"
                    
                    onChange={(event)=>handleAudioImageUpload(event)}
                    />
                    <div className={styles.icon}>
                      <Icon name="upload-file" size="24" />
                    </div>
                    <div className={styles.format}>
                      PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
                    </div>
                  </div>
                </div>

                
            
          </Modal>


          <Modal visible={showAlert} onClose={()=>setShowAlert(false)} >
            <h3 style={{textAlign:'center'}}>Oops... an Error</h3>
            <br/>
            <br/>

            <p>{alertMessage}</p>
<br/>
            
          </Modal>

          <div className={styles.wrapper}>
            <div className={styles.head}>
              <div className={cn("h2", styles.title)}>
                Create Single collectible
              </div>
              {/* <Link
          className={cn("button-stroke", styles.button)}
          to="/upload-multiple-details"
        >
          Switch to Multiple
        </Link> */}
            </div>
            <form className={styles.form} action="">
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Upload file</div>
                  <div className={styles.note}>
                    Drag or choose your file to upload
                  </div>
                  <div className={styles.file}>
                    <input className={styles.load} disabled={importNFTMode} type="file" accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm,audio/mp3,audio/webm,audio/mpeg"
                    
                    onChange={(event)=>handleFileSelected(event)}
                    />
                    <div className={styles.icon}>
                      <Icon name="upload-file" size="24" />
                    </div>
                    <div className={styles.format}>
                      PNG, GIF, WEBP, MP4 or MP3. Max 25mb.
                    </div>
                  </div>
                </div>

                <br/> <br/>
              <div className={styles.foot}>
                <button
                  className={cn("button-stroke tablet-show", styles.button)}
                  onClick={() => setVisiblePreview(true)}
                  type="button"
                >
                  Preview
                </button>

                {/* <div className={styles.saving}>
                  <span>Auto saving</span>
                  <Loader className={styles.loader} />
                </div> */}
                <br/><br/>
              </div>
                <div className={styles.item}>
                  <div className={styles.category}>Item Details</div>
                  <div className={styles.fieldset}>
                    {/* <Modal visible={true} >
                      <CreateCollection/>
                    </Modal> */}
                    {
                      importNFTMode ? "" : <TextInput
                      className={styles.field}
                      label="Item name"
                      name="Item"
                      type="text"
                      value={itemName}
                      disabled={importNFTMode}
                      setinputchange={(value)=>setItemName(value)}
                      placeholder='e. g. Redeemable Bitcoin Card with logo"'
                      required
                    />
                    }
                    
                    {
                      importNFTMode ? "" :  <TextInput
                      className={styles.field}
                      label="External Link"
                      name="Item"
                      type="text"
                      setinputchange={(value)=>setExternalLink(value)}
                      placeholder='https://fantomsea.com/item/123'
                      required
                    />
                    }
                   
                   {
                     importNFTMode ? "" : <TextInput
                     className={styles.field}
                     label="Description"
                     name="Description"
                     disabled={importNFTMode && description ===''}
                     setinputchange={(value)=>setDescripition(value)}
                     type="text"
                     value={description}
                     placeholder="e. g. “NFT Description ”"
                     required
                   />
                   }

                    
                    <div className={styles.row}>
                      {
                        importNFTMode ? "" : <div className={styles.col}>
                        <div className={styles.field}>
                          <TextInput
                      className={styles.field}
                      label="Royalties"
                      name="Royalty"
                      type="number"
                      value={royalties}
                      disabled={importNFTMode}
                      min={0}
                      max={10}
                      setinputchange={(value)=>handleSetRoyalty(value)}
                      placeholder='1-10 %'
                      required
                    />
                    </div>
                      </div>
                      }
                      
                      <div className={styles.col}>
                        <div className={styles.field}>
                          <div className={styles.label}>Category</div>
                          <Dropdown
                            className={styles.dropdown}
                            value={category}
                            setValue={(value)=>{
                              setCategory(value)
                              console.log(value)
                            }}
                            options={categoryOptions}
                          />
                        </div>
                      </div>
                      <div className={styles.col}>
                        <div className={styles.field}>
                          <div className={styles.label}>NSFW</div>
                          <br/>
                          <Switch value={nfswContent} setValue={(value)=>{
                            setNFTSwContent(value)
                    console.log(value)
                  }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.options}>
                <div className={styles.option}>
                  <div className={styles.box}>
                    <div className={styles.category}>Put on Auction</div>
                    <div className={styles.text}>
                      You’ll receive bids on this item
                    </div>
                  </div>
                  <Switch value={isAuction} setValue={(value)=>{
                    if(isInstantBuy === true  && value === true ){
                      setIsInstantBuy(false)
                    }
                    setIsAuction(value)
                    console.log(value)
                  }} />
                </div>
                <div className={styles.option}>
                  <div className={styles.box}>
                    <div className={styles.category}>Buy it Now Price</div>
                    <div className={styles.text}>
                      Enter the price for which the item will be instantly sold
                    </div>
                  </div>
                  <Switch value={isInstantBuy} setValue={(value)=>{
                    if(isAuction === true  && value === true ){
                    setIsAuction(false)
                    setIsInstantBuy(value)
                    }
                    setIsInstantBuy(value)
                    console.log(value)
                  }} />
                </div>

{
  isInstantBuy ? <TextInput
  className={styles.field}
  label="Price"
  name="Price"
  type="number"
  min={0}
  value={itemPrice}
  setinputchange={(value)=>handleSetItemPrice(value)}
  placeholder='0 FTM'
  required
/>  : ""
}

{
  isAuction ? <TextInput
  className={styles.field}
  label="Reserved Price"
  name="Reserved Price"
  type="number"
  min={0}
  setinputchange={(value)=>setReserevedPrice(value)}
  placeholder='0 FTM'
  required
/> : ""
}
<br/> <br/>
{
  isAuction ? <TextInput
  className={styles.field}
  label="Number of Days Auction Should Last"
  name="Auction Time-"
  type="number"
  setinputchange={(value)=>{

    const duration = moment.duration(value, 'days')

    const daysInMilliSeconds =  duration.asMilliseconds()

    const nftAuctionTime =  Date.now() + daysInMilliSeconds

    console.log(nftAuctionTime)

    setTimeDeadline(nftAuctionTime)

  }}
  placeholder='2 Days'
  required
/> : ""
}
                                
                    <br/>
                {/* <div className={styles.category}>Choose collection</div>
                <div className={styles.text}>
                  Choose an exiting collection or create a new one
                </div>
                <Cards className={styles.cards} items={items} /> */}
              </div>
             
            <p>Listing Fee : 1 FTM </p>
                <p> 2.5% Service Fee will be deducted when sold</p>
                <br/> <br/>
              <div className={styles.foot}>
                {/* <button
                  className={cn("button-stroke tablet-show", styles.button)}
                  onClick={() => setVisiblePreview(true)}
                  type="button"
                >
                  Preview
                </button> */}
                <button
                  className={cn("button", styles.button)}
                  onClick={() =>{
                    
                    createNFTItem()
                  } }
                  // type="button" hide after form customization
                  type="button"
                >
                  <span>Create item</span>
                  <Icon name="arrow-next" size="10" />
                </button>

                {/* <div className={styles.saving}>
                  <span>Auto saving</span>
                  <Loader className={styles.loader} />
                </div> */}
                
              </div>
            </form>
        
          </div>
          <Preview
            className={cn(styles.preview, { [styles.active]: visiblePreview })}
            onClose={() => setVisiblePreview(false)
            }
            imageUrl = {imageUrl}
            itemName={itemName}
            mediaUrl={file}
            isNotImage={isNotImage}
            itemPrice={itemPrice}
            fileType={fileType}
            startingPrice = {reservedPrice}
            clearAllField={clearALLStateFields}
          />
        </div>
      </div>
      <Modal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <FolowSteps
        isImportNft ={importNFTMode}
         className={styles.steps} 
        nftMinted =  {hasNFTbeenUploadedAndMinted} nftListedOnContract={hasNFTBeenListedOnContract} 
        callListNftFunction={()=>listNftOnMarketContract(NftTokenId)}
         signSaleActive={hasUserStartedSignSell} 
         isAuction={isAuction}
         handleUploadToDb={()=>uploadNftToDb()}
        />
      </Modal>
    </>
  );
};

export default Upload;
