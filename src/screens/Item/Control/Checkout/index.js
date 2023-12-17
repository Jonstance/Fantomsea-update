import React,{useState, useContext, useEffect} from "react";
import cn from "classnames";
import styles from "./Checkout.module.sass";
import Icon from "../../../../components/Icon";
import LoaderCircle from "../../../../components/LoaderCircle";
import { ethers } from "ethers";
import FTMABI from "../../../../ABIs/contracts/FTM_Abi/FTMABI.json"
import Web3Modal from 'web3modal';
import MarketABI from '../../../../ABIs/contracts/Market.sol/marketABI.json'
import NFTABI from '../../../../ABIs/contracts/SingleNFT.sol/SingleNFTAbi.json'
import { AppContext } from "../../../../context/context";
import { useHistory } from "react-router";





const Checkout = ({ className , nftData, updateTransactionId, setPurchased, onCancel}) => {

  const history =  useHistory()

  const {userData, setUserProfilePageControl, userBalance} =  useContext(AppContext)

  const [nftCreatorAddress, setNftCreatorAddress] =  useState("")

const nftMarketaddress = "0x811673b14e8b0abf4ded21bdfa490bc9693c0d71"


const [isPurchaseInProgress, setIsPurchaseInProgress] = useState(false)  

const [displayLoadAgainText, setDisplayLoadAgainText]  = useState(false)


useEffect(()=>{
  setNftCreatorAddress(nftData.contractAddress)
},[])

const items = [
  {
    title: "Price",
    value:`${nftData.nftPrice}  BCAT`,
  },
  {
    title: "Your balance",
    value: `${userBalance.toFixed(2)} BCAT`,
  },
];



const testFunc =  async ()=>{

  const web3Modal = new Web3Modal()


  const connection = await web3Modal.connect()

  const webProvider = new ethers.providers.Web3Provider(connection)

  const signer = webProvider.getSigner()
  const NFT = await new ethers.Contract(nftCreatorAddress, NFTABI, signer)

  const nftMarketContract =  new ethers.Contract(nftMarketaddress, MarketABI, signer)
    console.log(nftMarketContract)


    window.contract = NFT
    window.contract2 = nftMarketContract
      // const approveNFTTransfer = await NFT.approve(nftMarketaddress, nftData.contractId )
      // console.log(approveNFTTransfer)

  
}


const handlePurchaseNft =  async ()=>{

  setIsPurchaseInProgress(true)

  const web3Modal = new Web3Modal()

    const connection = await web3Modal.connect()

    const webProvider = new ethers.providers.Web3Provider(connection)

    const signer = webProvider.getSigner()

    console.log(signer)

    const nftMarketContract =  new ethers.Contract(nftMarketaddress, MarketABI, signer)
    console.log(nftMarketContract)

    const nftContractId = nftData.contractId

    console.log(nftContractId)

    let price = nftData.nftPrice
    
    let valueOfPrice = ethers.utils.parseUnits(price, 'ether')

      console.log(nftCreatorAddress, nftContractId)

      const allItemsInListing = await nftMarketContract.fetchMarketItems()

      console.log(allItemsInListing)

      const specificItem = allItemsInListing.filter(eachItem=>{
        const tokenIdInNumber = eachItem.tokenId.toNumber()
        const contractAddress = eachItem.nftContract.toLowerCase().trim()

        console.log(tokenIdInNumber, nftContractId, contractAddress, nftCreatorAddress)
        return tokenIdInNumber === nftContractId && contractAddress === nftCreatorAddress.toLowerCase().trim()
      }) 

      console.log(specificItem, nftContractId)

      if(specificItem.length!== 0){
        console.log(specificItem[0].price)


      console.log(allItemsInListing, specificItem)

      console.log(specificItem)
      const itemIdOfSpecificNFT = specificItem[0].itemId.toNumber()
      console.log(itemIdOfSpecificNFT)

      let marketTransac
      console.log(nftData.nftCreator.userAddress)
      try{
        const gasPrice =  await webProvider.getGasPrice()
        
        const returnedMarketTransaction = await nftMarketContract.createMarketSale(nftCreatorAddress, itemIdOfSpecificNFT,  {value : valueOfPrice, gasPrice:gasPrice})
  
        console.log(nftCreatorAddress, nftContractId)
        marketTransac = returnedMarketTransaction
      
      const updateNFTData = {
        userNameOfNewOwner : userData.username,
        addressOfNewOwner : userData.userWalleteAddress,
        addressOfPreviousOwner : nftData.nftOwner.userAddress,
        nftID : nftData.nftID
      }
       fetch("https://backend.billisea.io/nft/updateNftAfterSale", {
          method : 'POST',
          body:JSON.stringify(updateNFTData),
          headers:{
            'Content-type':'application/json'
          }
        })
        .then(res=>res.json())
        .then(updatedNftDataJson=>{
    
          const {nftDataUpdated} = updatedNftDataJson
          console.log(updatedNftDataJson)
  
          if(nftDataUpdated === true){
            console.log(updatedNftDataJson)
            window.location.reload()
            // updateTransactionId(transactionHash)
            setPurchased()
            setUserProfilePageControl('owner')
          }
        })
    }
    catch(e){
      console.log(e)
      alert(e.data.message)
      setIsPurchaseInProgress(false)
      setDisplayLoadAgainText(true)
    }
      }

      else{
      //   fetch("https://backend.billisea.io/nft/putNftOutOfSale", {
      //   method : 'POST',
      //   headers:{
      //     'Content-Type' : 'application/json'
      //   },
      //   body:JSON.stringify({
      //     nftId : nftData.nftID,
      //     price : nftData.nftPrice
      //   })
      // })
      // .then(res=>res.json())
      // .then(data=>{
      //   const {nftData, updated} = data
      //   if(updated === true){
      //     window.location.reload(true)
      //     alert("NFT Not Available for Purchase")
      //   }
      // })
      }
      
  }

  return (
    <div className={cn(className, styles.checkout)}>
      <div className={cn("h4", styles.title)}>Checkout</div>
      <div className={styles.info}>
        You are about to purchase <strong>{nftData.nftName}</strong> from  
        <strong>  {nftData.nftOwner.userName}</strong>
      </div>
      <div className={styles.table}>
        {items.map((x, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.col}>{x.title}</div>
            <div className={styles.col}>{x.value}</div>
          </div>
        ))}
        <br/> <br/>
      </div>
      {/* <div className={styles.attention}>
        <div className={styles.preview}>
          <Icon name="info-circle" size="32" />
        </div>
        <div className={styles.details}>
          <div className={styles.subtitle}>This creator is not verified</div>
          <div className={styles.text}>Purchase this item at your own risk</div>
        </div>
      </div> */}
      {

      }
      {/* <div className={cn("h4", styles.title)}>Follow steps</div> */}

        {
          isPurchaseInProgress ? 
          <div className={styles.line}>
          <div className={styles.icon}>
          <LoaderCircle className={styles.loader} />
          {/* {
            displayLoadAgainText ? "... Taking Too Long ? Click this again" : ""
          } */}
          
        </div>
        </div>
 : ""
        }
<br/>
        {
          isPurchaseInProgress ? <div className={styles.details}>
          <div className={styles.subtitle}>Purchasing</div>
          <div className={styles.text}>
            Sending transaction with your wallet
          </div>
        </div> :""
        }


        <br/>
      {/* <div className={styles.attention}>
        <div className={styles.preview}>
          <Icon name="info-circle" size="32" />
        </div>
        <div className={styles.details}>
          <div className={styles.subtitle}>This creator is not verified</div>
          <div className={styles.text}>Purchase this item at your own risk</div>
        </div>
        <div className={styles.avatar}>
          <img src="/images/content/avatar-3.jpg" alt="Avatar" />
        </div>
      </div> */}
      <div className={styles.btns}>
        <button className={cn("button", styles.button)}
        onClick={()=>handlePurchaseNft()}
        >
          {
            isPurchaseInProgress ? <LoaderCircle className={styles.loader} /> : "Purchase"
          }
          
        </button>
        <button onClick={onCancel} className={cn("button-stroke", styles.button)}>Cancel</button>
      </div>
    </div>
  );
};

export default Checkout;
