import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./PutSale.module.sass";
import Icon from "../../../../components/Icon";
import Switch from "../../../../components/Switch";
import moment from "moment";
import TextInput from "../../../../components/TextInput";

const items = [
  {
    title: "Enter your price",
    value: "BCAT",
  },
  {
    title: "Service fee",
    value: "2.5%",
  }
];

const PutSale = ({ className, nftData , listNFT, onClose, tryAgain, listAuction}) => {
  const [price, setPrice] = useState(0);
  const [instantBuy, setIsInstantBuy] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [timeDeadline, setTimeDeadline] = useState('0')

  useEffect(()=>{
  
    const isInstantBuy = nftData.isInstantBuy 
    const isAuctionNft = nftData.isAuctionNft

    setPrice(nftData.nftPrice)

    if(isInstantBuy){
      setIsInstantBuy(true)

    }else{
      setIsInstantBuy(false)
    }
  },[])

  return (
    <div className={cn(className, styles.sale)}>
      <div className={cn("h4", styles.title)}>Put on sale</div>
      <div className={styles.line}>
        <div className={styles.icon}>
          <Icon name="coin" size="24" />
        </div>
        <div className={styles.details}>
          <div className={styles.info}>Instant sale price</div>
          <div className={styles.text}>
            Enter the price for which the item will be instanly sold
          </div>
        </div>
        
        <Switch className={styles.switch} value={instantBuy} setValue={setIsInstantBuy} />

      </div>

      {
          instantBuy === false ? <div className={styles.line}>
          <div className={styles.icon}>
            <Icon name="notification" size="24" />
          </div>
          <div className={styles.details}>
            <div className={styles.info}>List NFT as Auction </div>
            <div className={styles.text}>
              Enter Your Reserved Price
            </div>
          </div>
          
        </div> : ""
        }
      <div className={styles.table}>
        {items.map((x, index) => (
          index !== 0 ? 
          <div className={styles.row} key={index}>
            <div className={styles.col}>{x.title}</div>
            <div className={styles.col}>{x.value}</div>
          </div>  : 

<div className={styles.row} key={index}>
            <input type='text' placeholder= "New Price Of NFT here" defaultValue={nftData.nftPrice} onChange={(event)=>setPrice(event.target.value)} className={styles.col}/>
            <div className={styles.col}>{x.value}</div>

            
          </div>

        ))}
      </div>

<br/> <br/>
{
  instantBuy === false ? <TextInput 
  type='number'
   setinputchange={(value)=>{

    const duration = moment.duration(value, 'days')
    
    const daysInMilliSeconds =  duration.asMilliseconds()
    
    const nftAuctionTime =  Date.now() + daysInMilliSeconds
    
    console.log(nftAuctionTime)
    
    setTimeDeadline(nftAuctionTime)
    }} 
    label="Set NFT Auction Deadline (Days) "
    />
 : ""    
}
      

      <div className={styles.btns}>
        {
          inProgress === false ? <button  onClick={()=>{
          
              instantBuy === true ?
                listNFT(price) 
                 : listAuction(price, timeDeadline)

          setInProgress(true)
          }} className={cn("button", styles.button)}>Continue</button> : <button
          onClick={()=>{
            instantBuy === true ?
              listNFT(price) 
               : listAuction(price, timeDeadline)
               setInProgress(true)
          }}
          className={cn("button", styles.button)}>{tryAgain ? 
          'Try Again' : "In Progress"}</button>
        }
        
        {
          inProgress ? "" : <button className={cn("button-stroke", styles.button)} onClick={onClose} >Cancel</button>
        }
        
      </div>
    </div>
  );
};

export default PutSale;
