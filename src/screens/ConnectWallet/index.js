import React, { useState , useContext} from "react";
import { Link , useHistory} from "react-router-dom";
import cn from "classnames";
import styles from "./ConnectWallet.module.sass";
import Icon from "../../components/Icon";
import Checkbox from "../../components/Checkbox";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from 'walletlink';
import { AppContext } from "../../context/context";
import { setLocalStorageData, clearLocalStorage, getLocalStorage } from "../../utils/localUtils";
import Loader from "../../components/Loader";
import Modal from '../../components/Modal'

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


const menu = [
  {
    title: "Sign in with Meta Mask",
    color: "#9757D7",
  },
];

const Connect = () => {

  const [age, setAge] = useState(true);
  const [conditions, setConditions] = useState(false);
  const [doesUserExist, setDoesUserExist] = useState(true)
  const [showLoader, setShowLoader] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const history = useHistory()

  const {userAccountAddress, setUserAccountAddress, setIsStateUserLoggedIn, setUserData, setIsUserToUploadNFT, isUserToUploadNFT,setUserBalance} = useContext(AppContext)



  
  const handleLogOut = ()=>{
    clearLocalStorage()
    setUserBalance(0.00)
    setIsStateUserLoggedIn(false)
    setShowModal(false)
  }

const connectMyWallet = async () => {

  setShowLoader(true)

const provider = await web3Modal.connect();

provider.on("accountsChanged", (accounts)=>{
  const userAccount =  accounts[0]

  console.log(userAccount)

  handleLogOut()

  history.push('/connect-wallet')
  window.location.reload() 

})

provider.on("chainChanged", (changedId)=>{
  if(changedId.toLowerCase() ===  "97"){
    setShowModal(false)
  }
  else{
    setShowModal(true)
  }
})
const web3 = new Web3(provider);

console.log(web3)

const accounts =  await web3.eth.getAccounts()
    
const userAccount = accounts[0]

const chainId =  await web3.eth.getChainId()

console.log( chainId, userAccount)

setUserAccountAddress(userAccount)

console.log(userAccountAddress)


const isChainRightChain = chainId === 97

if(isChainRightChain){
    fetch("https://backend.billisea.io/users/checkIfUserExist", {
      method:'POST',
      body: JSON.stringify({
        "userAddress" : userAccount
      }),
      headers:{
        "Content-Type" : "application/json"
      }
    })
    .then(res=>res.json())
    .then((data)=>{
      console.log(data)
      const {userExists, userData } = data
      console.log(userData)
      if(userExists === true){
        console.log("User Exists")
        fetch(`https://api.covalenthq.com/v1/250/address/${userData.userWalleteAddress}/balances_v2/?nft=true&no-nft-fetch=false&key=ckey_ef35007658e64a73ad8bb3066ac`)
              .then(res=>res.json())
              .then(data=>{
                const ftmDetails = data.data.items[0]
                const userBalance = (ftmDetails.balance) / (Math.pow(10,18)).toFixed(4)
                console.log(userBalance)
                setUserBalance(userBalance)
                const returnedData = setLocalStorageData(userAccount)
                console.log(returnedData)
                setUserData(userData)
                setIsStateUserLoggedIn(true)
                if(isUserToUploadNFT === true){
                  history.push('/upload-variants')
                }
                else{
                  history.push('/')
                  window.location.reload(true)
                }
              })
      
      }
      else{
        setDoesUserExist(false)
        setShowLoader(false)
      }
    })
}
else{
  setShowModal(true)
}


  }


const createAccount = ()=>{

  setShowLoader(true)

  fetch("https://backend.billisea.io/users/createUser", {
  method:'POST',
  body: JSON.stringify({
    "userAddress" : userAccountAddress
  }),
  headers:{
    "Content-Type" : "application/json"
  }
})
.then(res=>res.json())
.then(data=>{
  console.log(data)
  if(data.userProfileSaved){
            setLocalStorageData(userAccountAddress)
            setIsStateUserLoggedIn(true)
  
    history.push('/profile-edit')
    window.location.reload(true)
    
  }
  
})
}

  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.head}>
          <div className={styles.back}>
            <Icon name="arrow-prev" size="24" />
            <div className={cn("h2", styles.stage)}>Connect your wallet</div>
          </div>
          {
            showLoader === true ? <Loader/> : ""
          }
        </div>
        <div className={styles.body}>

        <Modal
            visible={showModal}
            onClose={()=>setShowModal(false)}
            >
            <Loader/>
            <br/><br/>

            <h3 style={{textAlign:"center"}}>Wrong Network</h3>
            <br/> <br/>

            <p style={{textAlign:"center"}}>
              Please Change the Network to the BSC Testnet Network  to access your account
            </p>

              <br/> <br/>

                {
                  getLocalStorage().addressFound === true ? <button style={{marginLeft:"30%"}} className={cn("button", styles.button)} 
                  onClick={()=>handleLogOut()}
                  >
                  Sign out 
                </button> : ""
                }
              

            </Modal>
         
            
          <div className={styles.menu}>
            {menu.map((x, index) => (
              <div
              onClick={()=>connectMyWallet()}
                className={cn({ [styles.active]: index === 1 }, styles.link)}
                key={index}
              >
                <div
                  className={styles.icon}
                  style={{ backgroundColor: x.color }}
                >
                  <Icon name="wallet" size="24" />
                  <Icon name="check" size="18" fill={x.color} />
                </div>
                <span>{x.title}</span>
                <div className={styles.arrow}>
                  <Icon name="arrow-next" size="14" />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bg}>
              {/* <img
                srcSet="/images/content/connect-bg@2x.jpg 2x"
                src="/images/content/connect-bg.jpg"
                alt="Connect wallet"
              /> */}
            </div>
            {/* <div className={styles.item}>
              <div className={cn("h3", styles.title)}>Scan to connect</div>
              <div className={styles.text}>Powered by UI8.Wallet</div>
              <div className={styles.box}>
                <div className={styles.code}>
                  <img src="/images/content/qr-code.png" alt="Qr-code" />
                </div>
              </div>
              <button className={cn("button-stroke", styles.button)}>
                Don’t have a wallet app?
              </button>
            </div> */}
            {
              doesUserExist ? "" : <div className={styles.item}>
              <div className={cn("h3", styles.title)}>Terms of service</div>
              <div className={styles.text}>
                Please take a few minutes to read and understand{" "}
                <span>Stacks Terms of Service</span>. To continue, you’ll need
                to accept the terms of services by checking the boxes.
              </div>
              <div className={styles.preview}>
                <img
                  srcSet="/images/content/connect-pic@2x.jpg 2x"
                  src="/images/content/connect-pic.jpg"
                  alt="Connect wallet"
                />
              </div>
              <div className={styles.variants}>
                <Checkbox
                  className={styles.checkbox}
                  value={age}
                  onChange={() => setAge(!age)}
                  content="I am at least 13 year old"
                />
                <Checkbox
                  className={styles.checkbox}
                  value={conditions}
                  onChange={() => setConditions(!conditions)}
                  content="I agree Stack terms of service"
                />
              </div>
              <div className={styles.btns}>
                <button className={cn("button-stroke", styles.button)}>
                  Cancel
                </button>
                <button className={cn("button", styles.button)}
                onClick={()=>createAccount()}
                >
                  Get started now
                </button>
              </div>
            </div>
            }
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
