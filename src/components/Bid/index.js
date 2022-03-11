import React, {useState, useContext} from "react";
import cn from "classnames";
import styles from "./Bid.module.sass";
import { AppContext } from "../../context/context";




const Bid = ({ className, nftData, currentUserAddress , closeBid, updateNftAuction, highestBid, auctionData, }) => {

  const {userBalance} = useContext(AppContext)

  const items = [
    {
      title: "Enter bid",
      value: "FTM",
    },
    {
      title: "Your balance",
      value: `${userBalance} FTM`,
    }
  ];


  const [price, setPrice] = useState("0")

  const handleBid = ()=>{

    const doesHighestBidExist = highestBid.valueOfBid !== undefined || null

    let isBidGreaterThanHighestBid  
    if(doesHighestBidExist === null || doesHighestBidExist === undefined){
      isBidGreaterThanHighestBid =  true
    }
    else{
      isBidGreaterThanHighestBid =   highestBid.valueOfBid < price
    }

    const isBidGreatedThanReservedPrice = auctionData.auctionStartingPrice < price

    console.log(doesHighestBidExist)

    if(Number(price) !== 0 && isBidGreaterThanHighestBid && isBidGreatedThanReservedPrice ){
    fetch("https://fantomsea-api.herokuapp.com/auction/addBidToNftsBid", {
      method :'POST',
      headers:{
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        userAddress  : currentUserAddress,
        auctionId : nftData.nftAuctionId,
        valueOfBid : price
      })
    })
    .then(res=>res.json())
    .then(data=>{
      const {updated} =  data
      if(updated === true){
        closeBid()
        alert("NFT Bid Placed")
        updateNftAuction(data.updatedAuction)
      }
    })
  }
  else if(isBidGreaterThanHighestBid === false) {
    alert('Seems Your Bid is Lower than the Highest Bid')
  }
  else if(isBidGreatedThanReservedPrice === false){
    alert('Seems Your Bid is Lower than the Reserved Price for this NFT')
  }
  }


  return (
    <div className={cn(className, styles.checkout)}>
      <div className={cn("h4", styles.title)}>Place a bid</div>
      <div className={styles.info}>
        You are about to bid for <strong>{nftData.nftName}</strong> from{" "}
        <strong>{nftData.nftOwner.userName}</strong>
      </div>
      <div className={styles.stage}>Your bid</div>
      <div className={styles.table}>
      {items.map((x, index) => (
          index !== 0 ? 
          <div className={styles.row} key={index}>
            <div className={styles.col}>{x.title}</div>
            <div className={styles.col}>{x.value}</div>
          </div>  : 

<div className={styles.row} key={index}>
            <input type='text' placeholder= "Your Bid amount here" onChange={(event)=>setPrice(event.target.value)} className={styles.col}/>
            <div className={styles.col}>{x.value}</div>
          </div>

        ))}
      </div>
      <div className={styles.btns}>
        <button onClick={()=>handleBid()}  className={cn("button", styles.button)}>Place a bid</button>
        <button className={cn("button-stroke", styles.button)}>Cancel</button>
      </div>
    </div>
  );
};

export default Bid;
