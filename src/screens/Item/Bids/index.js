import React from 'react';
import './history.css'
import styles from "../Users/Users.module.sass";

import momemnt from 'moment'

const Bids =  ({nftBids})=> {


    

    return (
        <div>
            {
                nftBids.map((eachBid,i)=>{

                    const { nameOfUser, valueOfBid, avatarOfUser,timeBidWasPlaced} = eachBid

                 
                    const timeInText =  momemnt(timeBidWasPlaced).startOf('milliseconds').fromNow()

                    return <div className= "divOfHistory" key={i} >
                    <img src= {avatarOfUser} className="avatarOfUser"  >
                    </img>
                    <div>
                      <div style={{marginLeft : "30px"}} className={styles.position}>
                          <p></p>{`${nameOfUser}  placed a bid of ${valueOfBid} BCAT`}</div>
                      <div 
                      style={{marginLeft : "30px"}}
                      className={styles.name}>at {timeInText}</div>
                    </div>
                    </div>
                })
            }
            

        </div>
    )
}

export default Bids
