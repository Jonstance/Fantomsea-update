import {useEffect, useContext, useState} from "react";
import { Link , useHistory} from "react-router-dom";
import cn from "classnames";
import styles from "./UploadVariants.module.sass";
import Control from "../../components/Control";
import { getLocalStorage } from "../../utils/localUtils";
import { AppContext } from "../../context/context";
import Moralis from 'moralis'
import { detailsObject as MolarisDetails } from "../../molaris.config"
import Modal from './Modal/index'
import NFTsInWallet from "./NftsInWallet";



const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Upload Item",
  },
];

const items = [
  {
    url: "/upload-details",
    buttonText: "Create Single",
    image: "/images/content/upload-pic-1.jpg",
    image2x: "/images/content/upload-pic-1@2x.jpg",
  },
  // {
  //   url: "/upload-multiple-details",
  //   buttonText: "Create Multiple",
  //   image: "/images/content/upload-pic-2.jpg",
  //   image2x: "/images/content/upload-pic-2@2x.jpg",
  // },
  
];

const Upload = () => {

  const [nftsInWallet, setNftsInWallet] = useState([])

  const [showImportModal,setShowImportModal] = useState(false)

  const [showLoader, setShowLoader] = useState(false) 

  Moralis.initialize(MolarisDetails.applicationId)
Moralis.serverURL = MolarisDetails.serverURL


  const {isUserToUploadNFT, setIsUserToUploadNFT, userAccountAddress,
    setImportNFTMode,
    setNftImportData, } = useContext(AppContext)

  const routeHistory  = useHistory()

  useEffect(async ()=>{

    const loggedInData =  getLocalStorage()

    if(loggedInData.addressFound !== true){
      routeHistory.push('/connect-wallet')
      setIsUserToUploadNFT(true)
    }
  },[])


  const handleListAccounttNFts =  async () => {

    setShowLoader(true)
  
    fetch(`https://api.covalenthq.com/v1/250/address/${userAccountAddress}/balances_v2/?nft=true&no-nft-fetch=false&key=ckey_ef35007658e64a73ad8bb3066ac`)
    .then(res=>res.json())
    .then(data=>{
      setShowLoader(false)
      console.log(data)
      const itemsInWalllet = data.data.items
      const nftsInWallet = itemsInWalllet.filter(eachItem=>{
        return eachItem.nft_data !== null
      })
      console.log(nftsInWallet)
      setNftsInWallet(nftsInWallet)
      setShowImportModal(true)
    })

  }

  const handleImportNfts = (itemData)=>{

    console.log(itemData)
    setImportNFTMode(true)
    setNftImportData(itemData)
    if(itemData.token_balance == 1){
      routeHistory.push("/upload-details")
    }
    else{
      routeHistory.push("/upload-multiple-details")
    }

  }


  return (
    <div className={styles.page}>

      <Modal 
      visible={showImportModal}
       onClose={()=>setShowImportModal(false)} 
      >
        <div>
        <h2 style={{textAlign:'center'}} > List of NFTs in your Wallet </h2>
        <NFTsInWallet nftItem={nftsInWallet} importNft={(value)=>handleImportNfts(value)} />
        </div>
      </Modal>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>Upload item</h1>
            <div className={styles.info}>
              Choose <span>“Single”</span> if you want your collectible to be
              one of a kind! <span>“Multiple”</span> is coming soon!!
              {/* Choose <span>“Single”</span> if you want your collectible to be
              one of a kind or <span>“Multiple”</span> if you want to sell one
              collectible multiple times or <span>“Import”</span> if you would like to import an item. */}
            </div>
          </div>
          <div className={styles.list}>
            {items.map((x, index) => (
              <div className={styles.item} key={index}>
                <div className={styles.preview}>
                  <img srcSet={`${x.image2x} 2x`} src={x.image} alt="Upload" />
                </div>
                <Link className={cn("button-stroke", styles.button)} to={x.url}>
                  {x.buttonText}
                </Link>
              </div>
            ))}
          </div>
          {/* <button
          onClick={handleListAccounttNFts}
                className={cn("button-stroke", styles.button)}
              >
                Import
              </button>
              {
                showLoader ? <Loader/> : ""
              } */}
        </div>
      </div>
    </div>
  );
};

export default Upload;

