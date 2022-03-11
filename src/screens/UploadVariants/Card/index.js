import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Card.module.sass";
import Icon from "../../../components/Icon";

const Card = ({ className, item, index, indexb}) => {
  const [visible, setVisible] = useState(false);
  const [imageState, setImageState] = useState('')

  const {external_data} = item

  useEffect(()=>{
    setImageState(external_data.image)
  },[])

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.preview}>
        <img loading="lazy" src={imageState} alt="Card" id={`nfImage${indexb}${index}`} />
        <div className={styles.control}>
          <div
            className={cn(
              { "status-green": item.category === "green" },
              styles.category
            )}
          >
            {item.description}
          </div>
          {/* <button
            className={cn(styles.favorite, { [styles.active]: visible })}
            onClick={() => setVisible(!visible)}
          >
            <Icon name="heart" size="20" />
          </button> */}
          {/* <button className={cn("button-small", styles.button)}>
            <span>Place a bid</span>
            <Icon name="scatter-up" size="16" />
          </button> */}
        </div>
      </div>
        <div className={styles.body}>
          <div className={styles.line}>
            {/* <div className={styles.title}>{nftName}</div> */}
            {/* <div className={styles.price}>{nftPrice}</div> */}
          </div>
          <div className={styles.line}>
            <div className={styles.users}>
              {/* {item.users.map((x, index) => (
                <div className={styles.avatar} key={index}>
                  <img src={x.avatar} alt="Avatar" />
                </div>
              ))} */}
            </div>
            {/* <div className={styles.counter}>{item.numberInStock} {item.numberInStock > 1 ? "Items" : "Item"} in Stock </div> */}
          </div>
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
          
          
          
          
       
    </div>
  );
};

export default Card;
