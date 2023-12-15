import React, { useContext, useEffect, useState,  } from "react";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import cn from "classnames";
import styles from "./Header.module.sass";
import Icon from "../Icon";
import Image from "../Image";
import Notification from "./Notification";
import User from "./User";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from 'walletlink'
import { AppContext} from "../../context/context";
import { clearLocalStorage, getLocalStorage } from "../../utils/localUtils";
import FTMABI from '../../ABIs/contracts/FTM_Abi/FTMABI.json'
import { ethers } from "ethers";
import Modal from "../Modal";
import Loader from '../../components/Loader/index'




const INFURA_ID = '60e44de681c94c89b7a6db9447bfd672'



const providerOptions = {
  walletconnect: {
    package: new WalletConnectProvider({rpc:{
      97 : "https://data-seed-prebsc-1-s1.binance.org:8545/"
    }}), // required
    
  },
  'custom-walletlink': {
    package: WalletLink,
    connector: async (_, options) => {
      const { appName, networkUrl, chainId } = options
      const walletLink = new WalletLink({
        appName,
        
      })
      const provider = walletLink.makeWeb3Provider("https://data-seed-prebsc-1-s1.binance.org:8545/", 97)
      await provider.enable()
      return provider
    },
  },
}

const web3Modal = new Web3Modal({
  network: "testnet",
  cacheProvider: true,
  providerOptions
});


const nav = [
  {
    url: "/discover",
    title: "Discover",
  },
  {
    url: "/all-collections",
    title: "Collections",
  },
  // {
  //   url: "/faq",
  //   title: "How it work",
  // },
  // {
  //   url: "/item",
  //   title: "Create item",
  // },
  // {
  //   url: "/profile",
  //   title: "Profile",
  // },
];

const Headers = () => {

  const routeHistory = useHistory()

  const currentLocation  =  useLocation()


  const [visibleNav, setVisibleNav] = useState(false);
  const [search, setSearch] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [showModal, setShowModal] = useState(false)


  const {userAccountAddress, setUserAccountAddress, setUserData,isStateUserLoggedIn, setIsStateUserLoggedIn, userData,
    userBalance,
    setUserBalance,
  } = useContext(AppContext)



  const handleSubmit = (e) => {
    alert();
  };

  const [showUser, setShowUser] = useState(false);

  const handleLogOut = ()=>{
    clearLocalStorage()
    setUserBalance(0.00)
    setIsStateUserLoggedIn(false)

  }
  
  useEffect(async ()=>{

    const userAddress =  getLocalStorage()
    console.log(userAddress)


    const currentPath = currentLocation.pathname

    const userLoggedIn =  getLocalStorage()

    
    if(currentPath !== '/connect-wallet' && userLoggedIn.addressFound === true){
      const provider =  await web3Modal.connect()

      console.log(provider)
  
      console.log(currentLocation.pathname)
  
      provider.on("accountsChanged", (accounts)=>{
        const userAccount =  accounts[0]
  
        console.log(userAccount)
  
        handleLogOut()
  
        routeHistory.push('/connect-wallet')
        window.location.reload() 

      })

      provider.on("chainChanged", (changedId)=>{
        console.log(changedId)
        if(changedId.toLowerCase() ===  "0xfa"){
          setShowModal(false)
        }
        else{
          setShowModal(true)
        }
      })
  
    }


    if(userAddress.addressFound === true){
      setUserAccountAddress(userAddress.userAddress)
      fetch("http://localhost:5001/users/getUserAccount", {
        method : 'POST',
        headers:{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          "userAddress" : userAddress.userAddress
        })
      })
      .then(res=>res.json())
      .then(async (data)=>{
        if(data.userFound === true){
          console.log(data)
          setIsUserLoggedIn(true)
          setShowUser(true)
          console.log(data)
          setUserData(data.userData)


          fetch(`http://localhost:5001/externalData/getUserBalance`, {
          method : 'POST',
          headers:{
            'Content-type' : 'application/json'
          },
          body:JSON.stringify({
            walletAddress : userAddress.userAddress
          })
        })
              .then(res=>res.json())
              .then(data=>{
                const userBalance = data.userBalance
                console.log(userBalance)
                setUserBalance(userBalance)
        
          })


        }
        
      })
    }
    else{
      setShowUser(false)
      console.log("User not found")
    }
  },[])

  useEffect(async ()=>{

    if(getLocalStorage().addressFound === true){
      const provider =  await web3Modal.connect()

        console.log(provider)

    
    const web3 = new Web3(provider)

    const chainId =  await web3.eth.getChainId()

    console.log(chainId)
    if(chainId !== 97){
      setShowModal(true)
    }

    provider.on("chainChanged", (changedId)=>{
      console.log(changedId)
      if(changedId.toLowerCase() ===  "0xfa"){
        setShowModal(false)
      }
      else{
        setShowModal(true)
      }
    })

    }
      },[])

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <Link className={styles.logo} to="/">

        <Modal
            visible={showModal}
            >
            <Loader/>
            <br/><br/>

            <h3 style={{textAlign:"center"}}>Wrong Network</h3>
            <br/> <br/>

            <p style={{textAlign:"center"}}>
              Please Change the Network to the Fantom Blockchain, to access this
            </p>

              <br/> <br/>

                {
                  getLocalStorage().addressFound === true ? <button 
                  style={{marginLeft:"30%"}} 
                  className={cn("button", styles.button)}
                  onClick={()=>handleLogOut()}
                  >
                  Sign out 
                </button> : ""
                }
              

            </Modal>
         

          <Image
            className={styles.pic}
            src="/images/logo-dark.png"
            srcDark="/images/logo-light.png"
            alt="Fitness Pro"
          />
        </Link>
        <div className={cn(styles.wrapper, { [styles.active]: visibleNav })}>
          <nav className={styles.nav}>
            {nav.map((x, index) => (
              <Link
                className={styles.link}
                // activeClassName={styles.active}
                to={x.url}
                key={index}
              >
                {x.title}
              </Link>
            ))}
          </nav>
          <form
            className={styles.search}
            action=""
            onSubmit={() => handleSubmit()}
          >
            <input
              className={styles.input}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="Search"
              required
            />
            <button className={styles.result}>
              <Icon name="search" size="20" />
            </button>
          </form>
          {
             isUserLoggedIn || isStateUserLoggedIn ? <Link
             className={cn("button-small", styles.button)}
             to="/upload-variants"
           >
            Create
           </Link> : ""
          }
          
        </div>
        {/* {
           isUserLoggedIn || isStateUserLoggedIn ?         <Notification className={styles.notification} /> : ""
        } */}
        {
           isUserLoggedIn || isStateUserLoggedIn ? <Link
           className={cn("button-small", styles.button)}
           to="/upload-variants"
         >
           Create
         </Link> : "" 
        }
        
        {
          isUserLoggedIn || isStateUserLoggedIn ? "" :  <Link  to="/connect-wallet">
          <button
          id={"connectbtn"}
            className={cn("button-stroke button-small", styles.button)}
            // onClick={() => connectMyWallet()}
          >Connect Wallet</button>
          </Link>
        }
  
        
        {showUser || isStateUserLoggedIn ? <User className='' /> : null}
        <button
          className={cn(styles.burger, { [styles.active]: visibleNav })}
          onClick={() => setVisibleNav(!visibleNav)}
        ></button>
      </div>
    </header>
  );
};

export default Headers;
