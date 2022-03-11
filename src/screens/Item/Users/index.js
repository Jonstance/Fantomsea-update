import React from "react";
import cn from "classnames";
import styles from "./Users.module.sass";
import { useHistory } from "react-router";



const Users = ({ className, items }) => {

  const history = useHistory()


  return (
    <div className={cn(styles.users, className)}>
      <div className={styles.list}>
        {items.map((x, index) => (
          <div className={styles.item} key={index} onClick={()=>{

            history.push(`/profile/${x.address}`)
            
          }} >
            <div className={styles.avatar}>
              <img src={x.avatar} alt="Avatar" />
              {x.reward && (
                <div className={styles.reward}>
                  <img src={x.reward} alt="Reward" />
                </div>
              )}
            </div>
            <div className={styles.details}>
              <div className={styles.position}>{x.position}</div>
              <div className={styles.name}>{x.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
