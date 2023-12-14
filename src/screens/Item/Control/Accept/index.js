import React from "react";
import cn from "classnames";
import styles from "./Accept.module.sass";



const Accept = ({ className, listNftInMarket, nftData, nftHighestBid }) => {

  const items = [
    {
      title: "Service fee",
      value: "0.025 BCAT",
    },
    {
      title: "Total bid amount",
      value: `${nftHighestBid.valueOfBid} BCAT`,
    },
  ];

  return (
    <div className={cn(className, styles.accept)}>
      <div className={styles.line}>
        <div className={styles.icon}></div>
        <div className={styles.text}>
          You are about to accept a bid for <strong>{nftData.nftName}</strong> from{" "}
          <strong>{nftHighestBid.nameOfUser}</strong>
        </div>
      </div>
      <div className={styles.stage}>{ nftHighestBid.valueOfBid } BCAT for {nftData.numberInStock} Copy </div>
      <div className={styles.table}>
        {items.map((x, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.col}>{x.title}</div>
            <div className={styles.col}>{x.value}</div>
          </div>
        ))}
      </div>
      <div className={styles.btns}>
        <button  onClick={()=>listNftInMarket(nftHighestBid.valueOfBid)} className={cn("button", styles.button)}>Accept bid</button>
        <button className={cn("button-stroke", styles.button)}>Cancel</button>
      </div>
    </div>
  );
};

export default Accept;
