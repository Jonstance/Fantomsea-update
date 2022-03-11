import React,{useContext, useEffect} from "react";
import cn from "classnames";
import styles from "./Items.module.sass";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";
import { AppContext } from "../../../context/context";

const Items = ({ className, items, createdNfts, activeIndex, ownedNftsInWallet }) => {

  const {userAccountAddress} = useContext(AppContext)

  useEffect(()=>{
    console.log(createdNfts)
  },[])


  return (
    <div className={cn(styles.items, className)}>
      <div className={styles.list}>
      
        {
          createdNfts.length > 0 ? 
          createdNfts.map((x, index) => {
            if(activeIndex === 0){
             if(x.listedForSale === true && x.nftOwner.userAddress === userAccountAddress ){
               x.isExternal =  false
              return <Card className={styles.card} item={x} key={index} />
             }
            }
            else if(activeIndex === 2){
              if(x.nftCreator.userAddress ==  userAccountAddress){
                x.isExternal = false
                return <Card className={styles.card} item={x} key={index} />
              }
            }

            else if(activeIndex === 3){
              if(x.nftOwner.userAddress == userAccountAddress){
                x.isExternal =  false
                return <Card className={styles.card} item={x} key={index} 
                isExternal={false}
                />
              }
            }
            
          }
            
          )
            :<Loader className={styles.loader} />

        }

        {
          activeIndex === 3 ? 
            ownedNftsInWallet.map((eachOwnedNft, i)=>{
              return <Card key={i} className={styles.card} item={eachOwnedNft} 
              isExternal={true}
              />
            })
           : ""
        }
        
      </div>
    </div>
  );
};

export default Items;
