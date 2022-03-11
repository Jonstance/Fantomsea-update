import React, { useContext, useEffect, useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Card.module.sass";
import Icon from "../Icon";
import * as musicMetaData from 'music-metadata-browser'
import { AppContext } from "../../context/context";

const Card = ({ className, item , isExternal }) => {
  const [visible, setVisible] = useState(false);
  const [isImage, setIsImage] = useState(true)
  const [isAudio, setIsAudio] =  useState(false)
  const [coverImage, setCoverImage] =useState('')
  const [mediaFile, setMediaFile] = useState('')
  const [itemName, setItemName] = useState('')
  let  {nftName, nftPrice , nftDigitalUrl} = item

  const {isExternalNFTViewed,
    setIsExternalDataViewed,
    nftDataInWallet,
    setNftDataInWallet} = useContext(AppContext)


  useEffect(()=>{
    console.log(item)
    if(nftName === null){
      console.log(item.tokenUrl)
      fetch(item.tokenUrl)
      .then(res=>res.json())
      .then(data=>{
        const valuesOfObject =  Object.values(data)
        const keysOfObject = Object.keys(data)

        console.log(keysOfObject)

        const indexOfPropertyWithName = keysOfObject.filter((eachKey, i)=>{
          return eachKey.toLowerCase().includes('name')
        })
      
        
        const indexOfName = keysOfObject.indexOf(indexOfPropertyWithName[0])

        const valueOfItemName = valuesOfObject[indexOfName]
        console.log(valueOfItemName)
        setItemName(valueOfItemName)
      })
      .catch(e=>{
        console.log(e)
      })
    }
    else{
      setItemName(nftName)
    }

    console.log(item, isExternal)   
      if(item.nftType === 'video'){
        setMediaFile(item.nftMediaUrl)
        setIsImage(false)
      }
      else if(item.nftType === 'audio'){
            setCoverImage(nftDigitalUrl)
            setIsImage(false)
            setMediaFile(item.nftMediaUrl)
            setIsAudio(true)
    }
    else{
      return 
    }

    console.log(nftName)

  },[])


  const handleClickedLink = ()=>{
    console.log('CLICKED')
    if(isExternal === true){
      setIsExternalDataViewed(true)
      setNftDataInWallet(item)
    }

  }
  
  

  return (
    <div className={cn(styles.card, className)}>
      <Link to={`/nft/${item.nftID}`} onClick={()=>handleClickedLink()} >
      <div className={styles.preview}>
        {
          isImage ? <img src={`${nftDigitalUrl}`} alt="Card" /> : isImage === false && isAudio === false ? <video style={{width:'100%', height:'100%'}} src={mediaFile} 
          autoPlay={true}
          muted={true}
          /> : ""
        }

        {
          isAudio === true ?
          <img src={coverImage} alt="Card" />
:""          
        }
        
        <div className={styles.control}>
          <div
            className={cn(
              { "status-green": item.category === "green" },
              styles.category
            )}
          >
            {item.categoryText}
          </div>
          <button
            className={cn(styles.favorite, { [styles.active]: visible })}
            onClick={() => setVisible(!visible)}
          >
            {/* <Icon name="heart" size="20" /> */}
          </button>
          {/* <button className={cn("button-small", styles.button)}>
            <span>Place a bid</span>
            <Icon name="scatter-up" size="16" />
          </button> */}
        </div>
      </div>
      </Link>
      <Link className={styles.link} to={`/nft/${item.nftID}`} onClick={()=>handleClickedLink()}  >
      {
          isAudio ? <audio style={{width:'inherit', marginBottom:'20px'}} src={mediaFile} autoPlay={false} controls={true} controlsList="nodownload" /> : ""

        }  
        
        <div className={styles.body}>
          <div className={styles.line}>
            <div className={styles.title}>{itemName}</div>
            {
              isExternal === false || isExternal ===  undefined ? <div className={styles.price}>{nftPrice} FTM</div> : ""
            }
            
          </div>
          <div className={styles.line}>
            <div className={styles.users}>
              {/* {item.users.map((x, index) => (
                <div className={styles.avatar} key={index}>
                  <img src={x.avatar} alt="Avatar" />
                </div>
              ))} */}
            </div>
            <div className={styles.counter}>{item.numberInStock > 1 ? item.numberInStock : "" } {item.numberInStock > 1 ? "Items In Stock" : ""}</div>
            <br/>
          </div>
          <div className={styles.counter}>{item.listedForSale ===  false ? "Not for Sale": ""}</div>

        </div>

        {
            item.isAuctionNft  && item.nftBids.length !==0 ? 
            <div className={styles.foot}>
            <div className={styles.status}>
            <Icon name="candlesticks-up" size="20" />
            Highest bid <span>{item.highestBid}</span>
          </div>
          <div
            className={styles.bid}
            dangerouslySetInnerHTML={{ __html: item.bid }}
          /> </div>
           : "" }
          
          
          
          
       
      </Link>
    </div>
  );
};

export default Card;
