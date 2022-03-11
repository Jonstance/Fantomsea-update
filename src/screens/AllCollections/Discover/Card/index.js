import React, { useContext, useEffect, useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Card.module.sass";
import * as musicMetaData from 'music-metadata-browser'
import CollectionCover from '../../../../assets/collection-cv.png'
import Unknown from '../../../../assets/unknown.png'


const Card = ({ className, item , isExternal, collectionData, collectionCover }) => {
  const [visible, setVisible] = useState(false);
  const [isImage, setIsImage] = useState(true)
  const [isAudio, setIsAudio] =  useState(false)
  const [coverImage, setCoverImage] =useState('')
  const [mediaFile, setMediaFile] = useState('')
  const [itemName, setItemName] = useState('')

  useEffect(()=>{

  
  },[])


  const handleClickedLink = ()=>{
    console.log('CLICKED')
    if(isExternal === true){
      
    }

  }
  

  return (
    <div className={cn(styles.card, className)}>
      <Link to={`/collection/${collectionData.collectionId}`} onClick={()=>handleClickedLink()} >
      <div className={styles.preview}>
        
         <img src={collectionData.collectionCover === undefined  ?  CollectionCover : collectionData.collectionCover === '' ? CollectionCover :   collectionData.collectionCover} alt="Card" style={{width:'100%'}} /> 
         <img  src={collectionData.collectionAvatar !== ( undefined|| '' ) ? collectionData.collectionAvatar : Unknown } className="collection-avatar" style={{width:'50px', height:'50px'}} />
        
        
        <div className={styles.control}>
          
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
      <Link className={styles.link} to={`/collection/${collectionData.collectionId}`} onClick={()=>handleClickedLink()}  >
      
        
        <div className={styles.body}>
          <div className={styles.line}>
            <div className={styles.title}>{collectionData.collectionName}</div>
            
            
          </div>
          <div className={styles.line}>
            <div className={styles.users}>
              {/* {item.users.map((x, index) => (
                <div className={styles.avatar} key={index}>
                  <img src={x.avatar} alt="Avatar" />
                </div>
              ))} */}
            </div>
          </div>
        </div>

        {/* {
            item.isAuctionNft  && item.nftBids.length !==0 ? 
            <div className={styles.foot}>
            <div className={styles.status}>
            Highest bid <span>{item.highestBid}</span>
          </div>
          <div
            className={styles.bid}
            dangerouslySetInnerHTML={{ __html: item.bid }}
          /> </div>
           : "" } */}
          
          
          
          
       
      </Link>
    </div>
  );
};

export default Card;
