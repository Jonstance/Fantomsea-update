import React,{useContext, useEffect} from "react";
import cn from "classnames";
import styles from "./Items.module.sass";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";
import { AppContext } from "../../../context/context";

const Items = ({ className, items, createdNfts, activeIndex, address }) => {
  console.log(createdNfts)
  console.log(activeIndex)


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
             if(x.listedForSale === true){
              return <Card className={styles.card} item={x} key={index} />
             }
            }
            else if(activeIndex === 2){
              if(x.nftCreator.userAddress ===  address){
                return <Card className={styles.card} item={x} key={index} />
              }
            }

            else if(activeIndex === 3){
              console.log(x.nftOwner.userAddress,address)
              if(x.nftOwner.userAddress === address){

                return <Card className={styles.card} item={x} key={index} />
              }
            }
            
          }
            
          )
            :<Loader className={styles.loader} />

        }
        
      </div>
    </div>
  );
};

export default Items;
