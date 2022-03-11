import React,{useState, useContext, useEffect, useRef} from "react";
import { Link , useHistory} from "react-router-dom";
import cn from "classnames";
import styles from "./ProfileEdit.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import Icon from "../../components/Icon";
import { AppContext } from "../../context/context";
import {create} from 'ipfs-http-client'
import {getLocalStorage} from '../../utils/localUtils'


const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Edit Profile",
  },
];

const ProfileEdit = () => {

const [displayName, setDisplayName] = useState('')
const [websiteUrl, setWebsiteUrl] =  useState('')
const [customUrl, setCustomUrl] = useState('')
const [twitterUserName, setTwitterUserName] = useState('')
const [userBio, setUserBio] = useState('')
const [avatarLink, setAvatarLink] = useState('')
const [fileLocalUrl, setFileLocalUrl] =  useState ('/images/content/avatar-1.jpg')
const [userAddress, setUserAddress] = useState('')

const History = useHistory()

const {userAccountAddress} = useContext(AppContext)

useEffect(()=>{

  if(userAccountAddress !== '' || userAccountAddress !== undefined ){
    setUserAddress(userAccountAddress)
  }else{
    const userLocalDetails = getLocalStorage()
    if(userLocalDetails.addressFound){
      const userLocalAddress = userLocalDetails.userAddress
      setUserAddress(userLocalAddress)
    }
    else{
          History.push("/profile")
    }
  }

},[])

const inputFile = useRef(null)

const client = create("https://ipfs.infura.io:5001/api/v0")


useEffect(()=>{
  fetch("https://fantomsea-api.herokuapp.com/users/getUserAccount", {
    method : 'POST',
    headers:{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      "userAddress" : userAccountAddress
    })
  })
  .then(res=>res.json())
  .then(data=>{
    console.log(data, userAccountAddress)
    const {userData} = data
    console.log(userData) 
    setUserBio(userData.bio)
    setTwitterUserName(userData.twitter)
    setDisplayName(userData.username)
    setWebsiteUrl(userData.website)
    setCustomUrl(userData.customUrl)
    if(userData.avatar.trim() !== ""){
      setAvatarLink(userData.avatar)
      setFileLocalUrl(userData.avatar)
    }
  })
},[])

const updateUserProfile = ()=>{

  const userData = {
    userAddress : userAccountAddress,
    userDisplayName:displayName,
     userCustomUrl : customUrl,
     userBio : userBio,
     portfolioWebsite: websiteUrl,
     twitterUserName : twitterUserName,
     avatar : avatarLink  
  }

  console.log(userData)

  fetch("https://fantomsea-api.herokuapp.com/users/updateUserProfile", {
  method:'POST',
  body: JSON.stringify(userData),
  headers:{
    "Content-Type" : "application/json"
  }
  }
  )
  .then(res=>res.json())
  .then(data=>{
    console.log(data)
    alert("Profile Saved")
  })

}

const handleAvatarChange = async (event)=>{

  const files  = event.target.files
  
 const file  = files[0]

 const localUrl =  URL.createObjectURL(file)

 setFileLocalUrl(localUrl)

const added =  await client.add(file, {
      })

      const v1Cid = added.cid.toV1()
      const urlPath = v1Cid.toString()
      const url = `https://${urlPath}.ipfs.infura-ipfs.io`

      console.log(url)

      setAvatarLink(url)

}

  return (
    <div className={styles.page}>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>Edit profile</h1>
            <div className={styles.info}>
              You can set preferred display name, create{" "}
              <strong>your profile URL</strong> and manage other personal
              settings.
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.user}>
                <div className={styles.avatar}>
                  <img src={fileLocalUrl} alt="Avatar" />
                </div>
                <div className={styles.details}>
                  <div className={styles.stage}>Profile photo</div>
                  <div className={styles.text}>
                    We recommend an image of at least 400x400. Gifs work too{" "}
                    <span role="img" aria-label="hooray">
                      🙌
                    </span>
                  </div>
                  <div className={styles.file}>
                    <input type="file" style={{display:'none'}} 
                    onChange={(event)=>handleAvatarChange(event)}
                    ref={inputFile}
                    accept="image/png, image/jpeg" 
                    />
                    <button
                      className={cn(
                        "button-stroke button-small",
                        styles.button
                      )}
                      onClick={()=>inputFile.current.click()}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Account info</div>
                  <div className={styles.fieldset}>
                    <TextInput
                    setinputchange = {(value)=>setDisplayName(value)}
                      className={styles.field}
                      label="display name"
                      name="Name"
                      type="text"
                      value={displayName}
                      placeholder="Enter your display name"
                      required
                    />
                    <TextInput
                    setinputchange = {(value)=>setCustomUrl(value)}
                      className={styles.field}
                      label="Website"
                      name="Url"
                      type="text"
                      value={customUrl}
                      placeholder="fantomsea.com/Your custom URL"
                      required
                    />
                    <TextArea
                    setinputchange = {(value)=>setUserBio(value)}
                      className={styles.field}
                      label="Bio"
                      name="Bio"
                      value={userBio}
                      placeholder="About yourselt in a few words"
                      required="required"
                    />
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>Socials</div>
                  <div className={styles.fieldset}>
                    {/* <TextInput
                    setinputchange={(value)=>setWebsiteUrl(value)}
                      className={styles.field}
                      label="portfolio or website"
                      name="Portfolio"
                      value={websiteUrl}
                      type="text"
                      placeholder="Enter URL"
                      required
                    /> */}
                    <div className={styles.box}>
                      <TextInput
                      setinputchange = {(value)=>setTwitterUserName(value)}
                        className={styles.field}
                        label="Discord | Telegram | Meduim "
                        name="Discord | Telegram | Meduim"
                        value={twitterUserName}
                        type="text"
                        placeholder="Discord | Telegram | Meduim  Link"
                        required
                      />
                      {/* <button
                        className={cn(
                          "button-stroke button-small",
                          styles.button
                        )}
                      >
                        Verify account
                      </button> */}
                    </div>
                  </div>
                  {/* <button
                    className={cn("button-stroke button-small", styles.button)}
                  >
                    <Icon name="plus-circle" size="16" />
                    <span>Add more social account</span>
                  </button> */}
                </div>
              </div>
              <div className={styles.note}>
                To update your settings you should sign message through your
                wallet. Click 'Update profile' then sign the message
              </div>
              <div className={styles.btns}>
                <button 
                onClick={()=>updateUserProfile()}
                className={cn("button", styles.button)}>
                  Update Profile
                </button>
                <button 
                
                onClick={()=>{
                  setDisplayName('')
                  setTwitterUserName('')
                  setUserBio('')
                  setCustomUrl('')
                  setWebsiteUrl('')
                }}
                className={styles.clear}>
                  <Icon name="circle-close" size="24" />
                  Clear all
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
