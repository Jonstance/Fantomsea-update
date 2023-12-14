import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./User.module.sass";
import Icon from "../../Icon";
import Theme from "../../Theme";
import { AppContext } from "../../../context/context";
import Fantom from '../../../assets/Fantom.png'
import { clearLocalStorage } from "../../../utils/localUtils";
const items = [
  {
    title: "My profile",
    icon: "user",
    url: "/profile",
  },
  {
    title: "My items",
    icon: "image",
    url: "/profile",
  },
  {
    title: "Dark theme",
    icon: "bulb",
  },
  {
    title: "Disconnect",
    icon: "exit",
    url: "",
  },
];


const User = ({ className }) => {
  const [visible, setVisible] = useState(false);

  const {userAccountAddress, userData, userBalance,
    setUserBalance, 
    setUserProfilePageControl, 
    setIsStateUserLoggedIn,} = useContext(AppContext)

    const history = useHistory()

    const handleLogOut = ()=>{
      clearLocalStorage()
      setUserBalance(0.00)
      setIsStateUserLoggedIn(false)

    }

    const handleNavButtonClicked = (icon)=>{
      if(icon === 'exit'){
        handleLogOut()
        console.log(icon)
        history.push('/')
        window.location.reload(false)
      }
        
    }

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(styles.user, className)}>
        <div className={styles.head} onClick={() => setVisible(!visible)}>
          <div className={styles.avatar}>
            <img src={userData.avatar} />
          </div>
          <div className={styles.wallet}>
            {userBalance.toFixed(2)}  <span className={styles.currency}>BCAT</span>
          </div>
        </div>
        {visible && (
          <div className={styles.body}>
            <div className={styles.name}>{userData.username}</div>
            <div className={styles.code}>
              <div className={styles.number}>{userAccountAddress}</div>
              <button className={styles.copy}>
                <Icon name="copy" size="16" />
              </button>
            </div>
            <div className={styles.wrap}>
              <div className={styles.line}>
                <div className={styles.preview}>
                  <img
                    src={Fantom}
                  />
                </div>
                <div className={styles.details}>
                  <div className={styles.info}>Balance</div>
                  <div className={styles.price}>{userBalance.toFixed(2)} BCAT</div>
                </div>
              </div>
              {/* <button
                className={cn("button-stroke button-small", styles.button)}
              >
                Manage fun on Coinbase
              </button> */}
            </div>
            <div className={styles.menu}>
              {items.map((x, index) =>
                x.url ? (
                  x.url.startsWith("http") ? (
                    <a
                      className={styles.item}
                      href={x.url}
                      rel="noopener noreferrer"
                      key={index}
                    >
                      <div className={styles.icon}>
                        <Icon name={x.icon} size="20" />
                      </div>
                      <div className={styles.text}>{x.title}</div>
                    </a>
                  ) : (
                    <Link
                      className={styles.item}
                      to={x.url}
                      onClick={() =>{
                        setUserProfilePageControl('owned')
                        setVisible(!visible)
                      }
                      }
                      key={index}
                    >
                      <div className={styles.icon}>
                        <Icon name={x.icon} size="20" />
                      </div>
                      <div className={styles.text}>{x.title}</div>
                    </Link>
                  )
                ) : (
                  <div className={styles.item} key={index}
                  style={{cursor:'pointer'}}
                  onClick={()=>{
                   handleNavButtonClicked(x.icon)
                  }}
                  >
                    <div className={styles.icon}>
                      <Icon name={x.icon} size="20" />
                    </div>
                    <div className={styles.text}>{x.title}</div>
                    {
                      x.icon !== 'exit' ? <Theme className={styles.theme} /> : ""
                    }
                    
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default User;
