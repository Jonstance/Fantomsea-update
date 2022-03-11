import React, { useState, useEffect, useContext} from "react";
import cn from "classnames";
import styles from "./Control.module.sass";
import Checkout from "./Checkout";
import Connect from "../../../components/Connect";
import Bid from "../../../components/Bid";
import Accept from "./Accept";
import PutSale from "./PutSale";
import SuccessfullyPurchased from "./SuccessfullyPurchased";
import Modal from "../../../components/Modal";
import MarketABI from '../../../ABIs/contracts/Market.sol/marketABI.json'
import NFTABI from '../../../ABIs/contracts/SingleNFT.sol/SingleNFTAbi.json'
import {ethers} from "ethers";
import Web3Modal from 'web3modal'
import { AppContext } from "../../../context/context";
import moment from "moment";
import Bids from '../Bids/index'
import coingecko from 'coingecko-api'


const Control = ({ className, nftData, currentUserAddress, setItemData, setNftAuctionData, nftAuctionData, priceInDollars }) => {


  const nftMarketaddress = "0x60601D627020Cc125D68E3EC71A862ad389c3f3e"

  const [visibleModalPurchase, setVisibleModalPurchase] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [visibleModalSale, setVisibleModalSale] = useState(false);
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false)  
  const [highestBid, setHighestBid] = useState({}) 

  const [nftCreatorAddress, setNftCreatorAddress] = useState("")

  const [timeDeadline, setTimeDeadline] = useState('')

  const [transactionId, setTransactionId] = useState('')

  const [shouldViewAll, setShouldViewAll]  = useState(false)

  const [isNftStillPurchasble, setIsNftStillPurchasable] = useState(true)
  const {userAccountAddress} = useContext(AppContext)

  const [highestBidInDollars, setHighestBidInDollars] = useState('')

  const [shouldTryAgain, setShouldTryAgain] = useState(false)


  const coinGeckoClient = new coingecko()

  useEffect(async ()=>{
    console.log(nftData)

    console.log(nftData.royalty.replace('%', ''))
    setNftCreatorAddress(nftData.contractAddress)

    if(nftData.isAuctionNft){
      const auctionEndingIn = moment(nftAuctionData.auctionTimeDeadline).format('MMMM Do YYYY, h:mm a')

      setTimeDeadline(auctionEndingIn)
  
  if(nftAuctionData.nftAuctionBids.length > 1 ){

    let  highestBidPrice = 0
    let  highestBidIndex = 0
    const nftBids =  nftAuctionData.nftAuctionBids
    for(let i  = 0 ; i < nftBids.length; i++){
      if(nftBids[i].valueOfBid > highestBidPrice){
        highestBidPrice = nftBids[i].valueOfBid
        highestBidIndex =  i
      }
    }

    console.log(highestBidIndex)
    console.log(nftBids[highestBidIndex])
    setHighestBid(nftBids[highestBidIndex])

    const dollarRateOfFTM =  await coinGeckoClient.simple.price({ids:"fantom", vs_currencies:'USD'})
      console.log(dollarRateOfFTM)

      const dollarAmount =  dollarRateOfFTM.data.fantom.usd

      const dollarEquivalent = nftBids[highestBidIndex].valueOfBid * dollarAmount

      setHighestBidInDollars(dollarEquivalent)
  }

  else if ( nftAuctionData.nftAuctionBids.length === 1 ){
    setHighestBid(nftAuctionData.nftAuctionBids[0])
    console.log(nftAuctionData.nftAuctionBids[0]) 
  }

  if( nftAuctionData.auctionTimeDeadline <= Date.now()  || nftAuctionData.auctionBought === true){
    setIsNftStillPurchasable(false)

  }
    }


  },[])


  const listNftInMarket  = async (price)=>{

    setShouldTryAgain(false)

    const web3Modal = new Web3Modal()

    const connection = await web3Modal.connect()

    const webProvider = new ethers.providers.Web3Provider(connection)

    const signer = webProvider.getSigner()

    console.log(signer)

    const nftContractId = nftData.contractId

    console.log(nftContractId)


    const nftMarketContract = new ethers.Contract(nftMarketaddress, MarketABI, signer)

    console.log(nftCreatorAddress)

    const nftContract =  new ethers.Contract(nftCreatorAddress, NFTABI, signer)

    window.contract = nftContract

    const gasPrice =   await webProvider.getGasPrice()


    const isApproved =  await nftContract.isApprovedForAll(userAccountAddress,nftMarketaddress)
        console.log(isApproved)
        if(isApproved === false){
          const setApprovalForAll =  await nftContract.setApprovalForAll(nftMarketaddress, true, {gasPrice:gasPrice, gasLimit:1000000})
          console.log(setApprovalForAll)
        }

    const priceOfNft = ethers.utils.parseUnits(price, 'ether')


    let listingPrice = await nftMarketContract.getListingPrice()
      listingPrice  =  listingPrice.toString()

      
    const gasPriceToList =  await webProvider.getGasPrice()

    console.log(nftData.royalty.replace('%', ''))


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

      console.log(nftMarketContract)

    
    try{  

      const transaction = await nftMarketContract.createMarketItem(nftCreatorAddress, nftContractId,  priceOfNft,nftData.royalty.replace('%', ''), nftCreatorAddress !== "0xF57Fd1CFf610278AA63CbBa0C454c5f9e5664207".toLowerCase() ? (collectionFound !== true ? nftData.nftCreator.userAddress :  collection.royaltyReciver === '' || collection.royaltyReciver === undefined  ? nftData.nftCreator.userAddress :  collection.royaltyReciver ) :  nftData.nftCreator.userAddress,  {value:listingPrice, gasPrice:gasPriceToList})
      
  console.log(transaction)

    fetch("https://fantomsea-api.herokuapp.com/nft/putNftForSale", {
        method : 'POST',
        headers:{
          'Content-Type' : 'application/json'
        },
        body:JSON.stringify({
          nftId : nftData.nftID,
          price: price
        })
      })
      .then(res=>res.json())
      .then(data=>{
        const {nftData, updated} = data
        if(updated === true){
          setItemData(nftData)
          alert("NFT Put on Sale")
          setVisibleModalSale(false)
        }
      })
    }
catch(e){
  console.log(e)
  alert(e.data.message)
  setShouldTryAgain(true)
  console.log(e)
}
    


  }

  const handlePutOnSale  = async ()=>{

    setVisibleModalSale(true)

    
  }

  const handlePutNftsOutOfSale  = async ()=>{

    const web3Modal = new Web3Modal()

    const connection = await web3Modal.connect()

    const webProvider = new ethers.providers.Web3Provider(connection)

    const signer = webProvider.getSigner()

    console.log(signer)

    const nftContractId = nftData.contractId

    console.log(nftCreatorAddress)

    console.log(nftContractId)

    const nftMarketContract = new ethers.Contract(nftMarketaddress, MarketABI, signer)

    try{
      const allMarketItem = await nftMarketContract.fetchMarketItems()

      const specificItem = allMarketItem.filter(eachItem=>{
        const tokenIdInNumber = eachItem.tokenId.toNumber()
        return tokenIdInNumber === nftContractId
      }) 
  
      console.log(specificItem)
  
      if(specificItem.length === 0){
        alert("Item doesn't exist in market")
      }
      else{
        console.log(specificItem)
        const itemId = specificItem[0].itemId.toNumber()
        const tokenId  = specificItem[0].tokenId.toNumber()

        try{
        const transactionRemove = await nftMarketContract.removeMarketItem(nftCreatorAddress, tokenId, itemId )
          
          fetch("https://fantomsea-api.herokuapp.com/nft/putNftOutOfSale", {
      method : 'POST',
      headers:{
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify({
        nftId : nftData.nftID
      })
    })
    .then(res=>res.json())
      .then(data=>{
        const {nftData, updated} = data
        if(updated === true){
          setItemData(nftData)
          alert("NFT Put out of Sale")
        }
      })


        }
        catch(e){
          alert('AN Error occured');
          console.log(e)
        }
      }
    }
    catch(e){
      console.log(e)
      alert("An Error occured")
    }

    
  }


  const acceptNFTBid = async (price)=>{

    const web3Modal = new Web3Modal()

    const connection = await web3Modal.connect()

    const webProvider = new ethers.providers.Web3Provider(connection)

    const signer = webProvider.getSigner()

    console.log(signer)

    const nftContractId = nftData.contractId

    const nftMarketContract = new ethers.Contract(nftMarketaddress, MarketABI, signer)

    const nftContract =  new ethers.Contract(nftCreatorAddress, NFTABI, signer)


    const priceOfNft = ethers.utils.parseUnits(price, 'ether')

    let listingPrice = await nftMarketContract.getListingPrice()

    listingPrice = listingPrice.toString()

    const gasPrice = await webProvider.getGasPrice()


    const isApproved =  await nftContract.isApprovedForAll(userAccountAddress,nftMarketaddress)
        console.log(isApproved)
        if(isApproved === false){
          const setApprovalForAll =  await nftContract.setApprovalForAll(nftMarketaddress, true, {gasPrice:gasPrice, gasLimit:1000000})
          console.log(setApprovalForAll)
        }

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
  
        console.log(nftMarketContract)
  
        
        const transaction = await nftMarketContract.createMarketItem(nftCreatorAddress, nftContractId,  priceOfNft,nftData.royalty.replace('%', ''), nftCreatorAddress !== "0xF57Fd1CFf610278AA63CbBa0C454c5f9e5664207".toLowerCase() ? (collectionFound !== true ? nftData.nftCreator.userAddress :  collection.royaltyReciver === '' || collection.royaltyReciver === undefined  ? nftData.nftCreator.userAddress :  collection.royaltyReciver ) :  nftData.nftCreator.userAddress,  {value:listingPrice, gasPrice:gasPrice})
      

    console.log(transaction)

    fetch("https://fantomsea-api.herokuapp.com/nft/putNftForSale", {
        method : 'POST',
        headers:{
          'Content-Type' : 'application/json'
        },
        body:JSON.stringify({
          nftId : nftData.nftID
        })
      })
      .then(res=>res.json())
      .then(data=>{
        fetch("https://fantomsea-api.herokuapp.com/auction/setAuctionWinner", {
          method:'POST',
          headers:{
            'Content-Type' : 'application/json'
          },
          body:JSON.stringify({
            auctionId : nftAuctionData.auctionId,
            userAddress : highestBid.userAddress,
            userName : highestBid.nameOfUser,
            valueOfBid : highestBid.valueOfBid,
            nftId : nftData.nftID,
            avatar : highestBid.avatarOfUser
          })
        })

        .then(res=>res.json())
        .then(data=>{
          console.log(data)
          const {nftData} =  data
          alert("NFT Can now be purchased by Highest Bidder")
          setVisibleModalAccept(false)
        })

      })

  }

  const listAuction = (reservedPrice, auctionDeadline)=>{

    fetch('https://fantomsea-api.herokuapp.com/auction/createAuctionFromExistingNFT', {
      method : 'POST',
      headers:{
        'Content-type' : 'application/json'
      },
      body:JSON.stringify({
        startingPrice : reservedPrice,
        auctionTimeDeadline : auctionDeadline,
        auctionOwner : userAccountAddress,
        nftId : nftData.nftID
      })
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.updated === true){
        alert("NFT Put in Auction")
        window.location.reload()
      }
    })

  }


  return (
    <>

    {
      nftData !== undefined && currentUserAddress !== undefined ? <div className={cn(styles.control, className)}>
      <div className={styles.head}>
        
        {
          nftData.isAuctionNft === false ? <div className={styles.details}>
            <div className={styles.avatar}>
          <img src={nftData.nftOwner.avatar} alt="Avatar" />
        </div>
          <div className={styles.info}>
            Owned by  <span>{nftData.nftOwner.userName}</span>
          </div>
          {/* <div className={styles.cost}>
            <div className={styles.price}>1.46 FTM</div>
            <div className={styles.price}>$2,764.89</div>
          </div> */}
        </div>  : nftAuctionData.nftAuctionBids.length !== 0 ?  <div className={styles.details}>
        <div className={styles.avatar}>
          <img src={highestBid.avatarOfUser} alt="Avatar" />
        </div>
        <br/>
          <div className={styles.info}>
            Highest bid by <span>{highestBid.nameOfUser}</span>
          </div>
          <div className={styles.cost}>
            <div className={styles.price}>{highestBid.valueOfBid } FTM</div>
            <div className={styles.price}>{`$${Number(highestBidInDollars).toFixed(5)}`}</div>
          </div>
          <br/>

{
         nftAuctionData.hasOwnProperty("nftAuctionWinner") ? `Auction Ended with ${nftAuctionData.nftAuctionWinner.userName} as the Winner` : <p> Auction Ends at {timeDeadline} </p>
}
      

        </div>  :  <h3>"NO Bids for this NFT -  YET"</h3>
        }
        
      </div>
      
      <div className={styles.btns}>
        {
          (currentUserAddress === nftData.nftOwner.userAddress) === false && nftData.isAuctionNft === false && nftData.listedForSale === true && userAccountAddress !== ''  ? <button
          className={cn("button", styles.button)}
          onClick={() => setVisibleModalPurchase(true)}
        >
          Purchase now
        </button> : "" 
        }

        {
                 nftAuctionData.hasOwnProperty("nftAuctionWinner") ?
                 
                 <div>

                {
                  nftAuctionData.nftAuctionWinner.userAddress === currentUserAddress  && isNftStillPurchasble  ?
                  
                  <button
                  style={{width:"100%"}}
                  className={cn("button-stroke", styles.button)}
                  onClick={() => setVisibleModalPurchase(true)}
                >
                   Purchase NFT -  You won the Auction!!!
                </button> : nftData.nftOwner.userAddress !== currentUserAddress ? `You Lost the Aution to  ${nftAuctionData.nftAuctionWinner.userName} ` : ""
                }

                 </div>
                : 
                 <div>
                 {
                  currentUserAddress === nftData.nftOwner.userAddress ? "" : nftData.isAuctionNft && isNftStillPurchasble ? <button
                  className={cn("button-stroke", styles.button)
                }
                style={{width:'100%'}}
                  onClick={() => setVisibleModalBid(true)}
                >
                   Place a bid
                </button> : ""
                }
                </div>
        }
        
        
         
      </div>
      {
        currentUserAddress === nftData.nftOwner.userAddress && nftData.isAuctionNft === true  && nftAuctionData.nftAuctionBids.length !== 0? <div className={styles.btns}>
          {
            shouldViewAll === false ?<button onClick={()=>setShouldViewAll(true)}  className={cn("button-stroke", styles.button)}>
            View all
          </button> : <button onClick={()=>setShouldViewAll(false)}  className={cn("button-stroke", styles.button)}>
        Hide Other Bids
     </button>
          }
        

     
     {
       nftAuctionData.hasOwnProperty("nftAuctionWinner") ? "" :  <button
       className={cn("button", styles.button)}
       onClick={() => setVisibleModalAccept(true)}
     >
       Accept
     </button>
     }
     
   </div> : ""
      }

{
         nftAuctionData.hasOwnProperty
         ("nftAuctionWinner") ? ""  :
         <div>
         {
          currentUserAddress === nftData.nftOwner.userAddress && nftData.listedForSale === true &&nftData.isAuctionNft === false ? <button
          className={cn("button", styles.button)}
          style={{width :'100%', marginTop:'25px'}}
          onClick={() => handlePutNftsOutOfSale()}
        >
          Remove from Sale
        </button> : currentUserAddress === nftData.nftOwner.userAddress && nftData.isAuctionNft === false ?  <button
          className={cn("button", styles.button)}
          style={{width :'90%', marginTop:'25px'}}
          onClick={() => handlePutOnSale()}
        >
          Put On Sale
        </button> : ""
        }
        </div>
}


      {
        shouldViewAll ? <Bids nftBids={nftAuctionData.nftAuctionBids} /> : ""
      }

    
      <div className={styles.text}>
        Service fee <span className={styles.percent}>2.5%</span>{" "}
        <span>{nftData.nftPrice} FTM</span> <span>${(priceInDollars * (2.5/100)).toFixed(4)}</span>
      </div>
      <div className={styles.foot}>
        {/* {
          currentUserAddress === nftData.nftOwner.userAddress && nftData.listedForSale ? <button
          className={cn("button", styles.button)}
          onClick={() => setVisibleModalSale(true)}
        >
          Put on sale
        </button> : ""
        } */}
        
        
      </div>
      {
        currentUserAddress === nftData.nftOwner.userAddress ? <div className={styles.note}>
        You can sell this token on Fantomsea
      </div> : ""
      }
      
    </div> : ""
    }

      
      <Modal
        visible={visibleModalPurchase}
        onClose={() => setVisibleModalPurchase(false)}
      >
        {
          isPurchaseComplete ? "" :  <Checkout nftData = {nftData} 
          setPurchased = {()=>setIsPurchaseComplete(true)}  
          updateTransactionId = {(value)=>setTransactionId(value)}
          onCancel={()=>setVisibleModalPurchase(false)}
           />
        }
        
{
  isPurchaseComplete ? <SuccessfullyPurchased nftData = {nftData} transactionId={transactionId} /> : ""
}
        
      </Modal>
      <Modal
        visible={visibleModalBid}
        onClose={() => setVisibleModalBid(false)}
      >
        {
          userAccountAddress.trim()!== '' ? "" :      <Connect />

        }
        <Bid nftData={nftData} currentUserAddress={currentUserAddress} highestBid={highestBid} 
        auctionData={nftAuctionData}
        closeBid ={()=>setVisibleModalBid(false)   
      }
        updateNftAuction={(value)=>setNftAuctionData(value)}
        />
      </Modal>
      <Modal
        visible={visibleModalAccept}
        onClose={() => setVisibleModalAccept(false)}
      >
        <Accept listNftInMarket={()=>acceptNFTBid(highestBid.valueOfBid)}  nftData={nftData}  nftHighestBid={highestBid} />
      </Modal>
      <Modal
        visible={visibleModalSale}
        onClose={() => setVisibleModalSale(false)}
      >
        <PutSale  nftData={nftData}  listNFT={(price)=>listNftInMarket(price)} 
        listAuction={(reservedPrice, deadline)=>listAuction(reservedPrice, deadline)}
        onClose={()=>setVisibleModalSale(false)}
        tryAgain={shouldTryAgain}
        
        />
      </Modal>
    </>
  );
};

export default Control;
