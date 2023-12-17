import React, { useState , useContext, useEffect} from "react";
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
// import CreateCollection from "./CreateCollection/index"
import * as musicMetaData from 'music-metadata-browser'
import moment from 'moment'


import NFTMarketABI from '../../ABIs/contracts/Market.sol/marketABI.json'

import NFTABI from '../../ABIs/contracts/MultipleNFT.sol/multipleNFTABI.json'

import { v4 } from "uuid";
const royaltiesOptions = ["0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%" ,"10%"];
const categoryOptions = ["Art", "Music", "Trading Cards", "Collectibles", "Sports", "Utility", "Other"];

const items = [
  {
    title: "Create collection",
    color: "#4BC9F0",
  },
  
];
const Upload = () => {

  const [royalties, setRoyalties] = useState(royaltiesOptions[0]);
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
  const [alertMessage, setAlertMessaege] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [timeDeadline, setTimeDeadline] = useState(0)

  const [NftTokenId, setNtfTokenId] = useState('')

  const [hasNFTbeenUploadedAndMinted, setHasNFTBeenUploadedAndMinted] = useState(true)

  const [hasNFTBeenListedOnContract, setHasNFTBeenListedOnContract] = useState(false)

  const [hasUserStartedSignSell, setHasUserStartedSignSell] =  useState(false)

  const [fileUrl, setFileUrl] = useState('')

  const [file, setFile] = useState('')

  const [nftMediaUrl, setnftMediaUrl] = useState('')

  const [nftAttributes, setNftAttributes] = useState([])

  const [visibleModal, setVisibleModal] = useState(false);

  const [visiblePreview, setVisiblePreview] = useState(false);

  const [numberOfCopies, setNumberOfCopies] = useState(0)

  const [isNotImage, setIsNotImage] = useState(false)

  const [fileType, setFileType] = useState("image")

  const [showNoCoverAlert, setShowNoCoverAlert] = useState(false)


  const [nftCreatorAddress, setNftCreatorAddress] = useState("0x5c80363463A7d0472Addec5DAbD9ACFdcDE33f6a".toLowerCase())
 
  const [collectionName, setCollectionName] = useState("Billisea Multiple")
  
  const [collectionTicker, setCollectionTicker] = useState("FSEA")

  
  const {userAccountAddress, setUserAccountAddress, setUserData,setUserProfilePageControl, importNFTMode, setImportNFTMode,  nftImportData } = useContext(AppContext)

  const history =  useHistory()

  const client = create("https://ipfs.infura.io:5001/api/v0")


  const nftMarketaddress = "0x811673b14e8b0abf4ded21bdfa490bc9693c0d71"


  useEffect(()=>{
    if(importNFTMode){
      console.log(nftImportData)
      setNftCreatorAddress(nftImportData.contractAddress)
      setFileUrl(nftImportData.external_data.image)
      setImageUrl(nftImportData.external_data.image)
      setDescripition(nftImportData.external_data.description)
      setNtfTokenId(nftImportData.token_id)
      setItemName(nftImportData.external_data.name)
      fetch(nftImportData.token_url)
      .then(res=>res.json())
      .then(data=>{
        console.log(data)
        const allKeys = Object.keys(data)
        const allValue = Object.values(data)
        console.log(allKeys)
        let nameProperty;
        allKeys.map(eachKey=>{
          if(eachKey.toLowerCase().includes('name')){
            nameProperty = eachKey 
          }
        })
        
        const indexOfProperty = allKeys.indexOf(nameProperty)  
        
        console.log(allValue[indexOfProperty])
          setItemName(allValue[indexOfProperty])

          
      })


      return ()=>{
        setImportNFTMode(false)
      }

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

    if(fileUrl.trim() === '' || price <= 0 , numberOfCopies < 2 || itemName.trim() === '' || description.trim() === ''){
      if (fileUrl.trim() === ''){
        setAlertMessaege("NFT Media File not Uploaded Yet, please check that ")
        setShowAlert(true)
      }
      else if(price <= 0){
        setAlertMessaege("Price cannot be 0 or less ")
        setShowAlert(true)
      }
      else if (numberOfCopies < 2 ){
        setAlertMessaege("You can't mint multiple with one copy")
        setShowAlert(true)
      }
      else if ( itemName.trim() === ''){
        setAlertMessaege("NFT Must have a name, please recheck the form")
        setShowAlert(true)
      }
      else if(description.trim() === ''){
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
        animation_url : nftMediaUrl,
        copies:numberOfCopies
      })
  
      console.log(nftData)
  
      try{
  
        const added = await client.add(nftData)
        const tokenUrI =  `https://ipfs.infura.io/ipfs/${added.path}`
        console.log(tokenUrI)
        // createNFTSaleItem(tokenUrI)
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

    console.log(signer)

    if(!importNFTMode){

      const nftContract  = new ethers.Contract(nftCreatorAddress, NFTABI, signer )


      const transaction = await nftContract.createToken(userAccountAddress, (Math.floor(Math.random()* 1000)), numberOfCopies)
    
      let txDetails = await transaction.wait()
      let event = txDetails.events[0]
      console.log(event)
      let value = event.args[3]
      let nftTokenId = value.toNumber()
  
      setHasNFTBeenUploadedAndMinted(true)
  
      setNtfTokenId(nftTokenId)
  
      if(isAuction){

        fetch("https://backend.billisea.io/collection/uploadCollection", {
          method : 'POST',
          headers:{
            'Content-Type' : "application/json"
          },
          body : JSON.stringify({
            collectionName : collectionName,
            collectionAddress : nftCreatorAddress,
            collectionTicker : collectionTicker
          })
          .then(res=>res.json())
          .then(data=>{
            const {collectionId} = data
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
              isSingle : false,
              isMultiple:true,
              numberInStock:numberOfCopies,
              nftStaringPrice : reservedPrice,
              nftTimeDeadline : timeDeadline,
              collectionId : collectionId,
              externalLink : externalLink,
              nftAttributes :nftAttributes,
              nftMediaUrl : nftMediaUrl,
              nftType : fileType
            }
      
            console.log(nftItemData)
      
            fetch("https://backend.billisea.io/nft/UploadnftAuctionData", {
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
        })
      }
    }
    else{
      setHasNFTBeenUploadedAndMinted(true)
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

      const nftContract = new ethers.Contract(nftCreatorAddress, NFTABI, signer)

      console.log(nftContract)

      const setApproveGasPrice =  await webProvider.getGasPrice()


      const setApprovalForAll =  await nftContract.setApprovalForAll(nftMarketaddress, true, {gasPrice:setApproveGasPrice})

      console.log(setApprovalForAll)
    }

    const nftLister =  new ethers.Contract(nftMarketaddress, NFTMarketABI, signer)

    let listingPrice = await nftLister.getListingPrice()

    listingPrice = listingPrice.toString()

    const listNftGasPrice =  await webProvider.getGasPrice()

    console.log(nftTokenId)

    const listNFTTransaction = await nftLister.createMultipleMarketItem(nftCreatorAddress, "208", priceOfNft, numberOfCopies.toString(), royalties.replace("%", ''), {value:listingPrice, gasPrice:listNftGasPrice})

    const transactionDetails = await  listNFTTransaction.wait()

    console.log(transactionDetails)
    fetch("https://backend.billisea.io/collection/uploadCollection", {
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
        isSingle : false,
        isMultiple:true,
        numberInStock: numberOfCopies,
        collectionId : collectionId,
        externalLink : externalLink,
        nftAttributes :nftAttributes,
        nftMediaUrl : nftMediaUrl,
        nftType : fileType
      }
  
      
  
      fetch("https://backend.billisea.io/nft/uploadSingleNft", {
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
  else{
    alert("Waiting for the NFT to be Minted..... ")
  }

  }


  return (
    
    <>

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

      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>

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
                Create Multiple collectible
              </div>
              <Link
          className={cn("button-stroke", styles.button)}
          to="/upload-details"
        >
          Switch to Single
        </Link>
            </div>
            <form className={styles.form} action="">
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Upload file</div>
                  <div className={styles.note}>
                    Drag or choose your file to upload
                  </div>
                  <div className={styles.file}>
                    <input className={styles.load} disabled={importNFTMode}  type="file" accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm,audio/mp3,audio/webm,audio/mpeg"
                    
                    onChange={(event)=>handleFileSelected(event)}
                    />
                    <div className={styles.icon}>
                      <Icon name="upload-file" size="24" />
                    </div>
                    <div className={styles.format}>
                      PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
                    </div>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>Item Details</div>
                  <div className={styles.fieldset}>
                    {/* <Modal visible={true} >
                      <CreateCollection/>
                    </Modal> */}
                    <TextInput
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
                    <TextInput
                      className={styles.field}
                      label="External Link"
                      name="Item"
                      type="text"
                      setinputchange={(value)=>setExternalLink(value)}
                      placeholder='https://yoursite.io/item/123'
                      required
                    />
                    <TextInput
                      className={styles.field}
                      label="Description"
                      name="Description"
                      disabled={importNFTMode}
                      setinputchange={(value)=>setDescripition(value)}
                      type="text"
                      placeholder="e. g. “After purchasing you will able to recived the logo...”"
                      required
                    />

                      <TextInput
                      className={styles.field}
                      label="Number of Copies"
                      name="Number of Copies"
                      setinputchange={(value)=>setNumberOfCopies(value)}
                      type="text"
                      placeholder="How many Copies of NFT do you want to mint ?"
                      required
                    />

                    <div className={styles.row}>
                      <div className={styles.col}>
                        <div className={styles.field}>
                          <div className={styles.label}>Royalties</div>
                          <Dropdown
                            className={styles.dropdown}
                            value={royalties}
                            setValue={(value)=>{
                              setRoyalties(value)
                              console.log(value)
                            }}
                            options={royaltiesOptions}
                          />
                        </div>
                      </div>
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
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.options}>
                {/* <div className={styles.option}>
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
                </div> */}
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
  type="text"
  setinputchange={(value)=>setItemPrice(value)}
  placeholder='0 BCAT'
  required
/>  : ""
}

{
  isAuction ? <TextInput
  className={styles.field}
  label="Reserved Price"
  name="Reserved Price"
  type="text"
  setinputchange={(value)=>setReserevedPrice(value)}
  placeholder='0 BCAT'
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
              <div className={styles.foot}>
                <button
                  className={cn("button-stroke tablet-show", styles.button)}
                  onClick={() => setVisiblePreview(true)}
                  type="button"
                >
                  Preview
                </button>
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
                <div className={styles.saving}>
                  <span>Auto saving</span>
                  <Loader className={styles.loader} />
                </div>
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
            itemsInStock={numberOfCopies}
            startingPrice = {reservedPrice}
            clearAllField={clearALLStateFields}
          />
        </div>
      </div>
      <Modal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <FolowSteps
         className={styles.steps} 
        nftMinted =  {hasNFTbeenUploadedAndMinted} nftListedOnContract={hasNFTBeenListedOnContract} 
        callListNftFunction={()=>listNftOnMarketContract(NftTokenId)}
         signSaleActive={hasUserStartedSignSell} 
         isAuction={isAuction}
        />
      </Modal>
    </>
  );
};

export default Upload;
