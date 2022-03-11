import React from 'react';
import './history.css'
import styles from "../Users/Users.module.sass";


const  History =  ({nftHistory})=> {

    console.log(nftHistory)

    return (
        <div>
            {
                nftHistory.map((eachHistory,i)=>{

    console.log(eachHistory.time)
    const dateHelper = new Date(eachHistory.time)

    const date =  dateHelper.getDate()

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const month =  months[dateHelper.getMonth()]

    const year  = dateHelper.getFullYear()

     console.log(date, month, year)

     console.log(eachHistory)
     const fullDate   =  `${date} ${month}, ${year} `
                    return <div key={i} className= "divOfHistory" >
                    <img className="avatarOfUser" src=
                    {
                        eachHistory.hasOwnProperty("avatar") ? eachHistory.avatar : "/images/content/avatar-2.jpg"
                    }
                    >
                    </img>
                    <div>
                      <div style={{marginLeft:"10px", textAlign:'center'}} className={styles.position}>
                          <p></p>{eachHistory.description}</div>
                      <div style={{marginLeft:"10px", textAlign:'center'}} className={styles.name}>at {fullDate}</div>
                    </div>
                    </div>
                })
            }
            

        </div>
    )
}

export default History
