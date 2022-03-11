import React, { useState } from "react";
import cn from "classnames";
import styles from "./FolowSteps.module.sass";
import Icon from "../../../components/Icon";
import Loader from "../../../components/Loader";
import LoaderCircle from "../../../components/LoaderCircle";

const FolowSteps = ({ className , nftMinted, nftListedOnContract, callListNftFunction, signSaleActive, isAuction,isImportNft}) => {

  const [isListingInProgress, setIsListingInProgress] =  useState(false)


  return (
    <div className={cn(className, styles.steps)}>
      <div className={cn("h4", styles.title)}>Follow steps</div>
      <div className={styles.list}>
        <br/>
      <b style={{textAlign:'center'}}  > ** When Listing an NFT - Two Transactions will be sent - do well to confirm them ** </b>
      <br/> <br/><br/>
        {
          isImportNft ? "" : <div className={cn(styles.item, styles.done)}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <Icon name="upload-file" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Upload files & Mint token</div>
              <div className={styles.text}>Mint NFT</div>
            </div>
          </div>
          <button className={cn("button done", styles.button)}>{
            nftMinted ? "Done" : <p>"In Progress... "</p>            
          }</button>
        </div>
        }
        
{/* 
        {
          signSaleActive ? "" : <div className={styles.item}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <Icon name="pencil" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>List NFT on Contract </div>
              <div className={styles.text}>
                List NFT
              </div>
            </div>
          </div>
          <button className={cn("button", styles.button) }onClick={()=>callListNftFunction()}  >
            Start now
          </button>
        </div>
        } */}
        
        
        {
          <div className={styles.item}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <LoaderCircle className={styles.loader} />
            </div>
            {
              isAuction === false ? <div className={styles.details}>
              <div className={styles.info}>List NFT in Market</div>
              <div className={styles.text}>
                {
              isListingInProgress ? "In Progress" : ""
                }
                
              </div>
            </div> : ""
            }
            
          </div>
          {
            isAuction === false ? <button className={cn("button loading", styles.button)}  onClick={()=>
              {
                callListNftFunction()
                setIsListingInProgress(true)
              }
              }>
                {
                  nftMinted === false && nftListedOnContract === false ? "Awaiting Upload Minted NFT" : nftMinted === true && nftListedOnContract === false ? <div> <p>Start Now </p></div>: "Done"
    
                }
              </button> : ""
          }
          
        </div> 
        }
        
        {/* <div className={cn(styles.item, styles.error)}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <Icon name="pencil" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Sign sell order</div>
              <div className={styles.text}>
                Sign sell order using your wallet
              </div>
            </div>
          </div>
          <button className={cn("button error", styles.button)}>Failed</button>
        </div> */}
        {/* <div className={styles.item}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <Icon name="bag" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Sign lock order</div>
              <div className={styles.text}>
                Sign lock order using your wallet
              </div>
            </div>
          </div>
          <button className={cn("button", styles.button)}>Start now</button>
        </div> */}
      </div>
      {/* <div className={styles.note}>
        Something went wrong, please{" "}
        <a href="/#" target="_blank" rel="noopener noreferrer">
          try again
        </a>
      </div> */}
    </div>
  );
};

export default FolowSteps;
