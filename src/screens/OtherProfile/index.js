import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import { Link, useParams} from "react-router-dom";
import styles from "./Profile.module.sass";
import Icon from "../../components/Icon";
import User from "./User";
import Items from "./Items";
import Followers from "./Followers";

// data
import { bids } from "../../mocks/bids";
import { isStepDivisible } from "react-range/lib/utils";
import { AppContext } from "../../context/context";

import {getLocalStorage} from '../../utils/localUtils'

const navLinks = [
  "On Sale",
  "Collectibles",
  "Created",
  "Owned",
  // "Likes",
  // "Following",
  // "Followers",
];

const socials = [
  {
    title: "twitter",
    url: "https://twitter.com/ui8",
  },
  {
    title: "instagram",
    url: "https://www.instagram.com/ui8net/",
  },
  {
    title: "facebook",
    url: "https://www.facebook.com/ui8.net/",
  },
];

const following = [
  {
    name: "Sally Fadel",
    counter: "161 followers",
    avatar: "/images/content/avatar-5.jpg",
    url: "https://ui8.net",
    buttonClass: "stroke",
    buttonContent: "Unfollow",
    gallery: [
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-2.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-4.jpg",
    ],
  },
  {
    name: "Aniya Harber",
    counter: "161 followers",
    avatar: "/images/content/avatar-6.jpg",
    url: "https://ui8.net",
    buttonClass: "stroke",
    buttonContent: "Unfollow",
    gallery: [
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-6.jpg",
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
    ],
  },
  {
    name: "Edwardo Bea",
    counter: "161 followers",
    avatar: "/images/content/avatar-7.jpg",
    url: "https://ui8.net",
    buttonClass: "stroke",
    buttonContent: "Unfollow",
    gallery: [
      "/images/content/follower-pic-4.jpg",
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-6.jpg",
    ],
  },
  {
    name: "Reymundo",
    counter: "161 followers",
    avatar: "/images/content/avatar-8.jpg",
    url: "https://ui8.net",
    buttonClass: "stroke",
    buttonContent: "Unfollow",
    gallery: [
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-2.jpg",
      "/images/content/follower-pic-6.jpg",
      "/images/content/follower-pic-1.jpg",
    ],
  },
  {
    name: "Jeanette",
    counter: "161 followers",
    avatar: "/images/content/avatar-9.jpg",
    url: "https://ui8.net",
    buttonClass: "stroke",
    buttonContent: "Unfollow",
    gallery: [
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-4.jpg",
    ],
  },
];

const followers = [
  {
    name: "Sally Fadel",
    counter: "161 followers",
    avatar: "/images/content/avatar-5.jpg",
    url: "https://ui8.net",
    buttonClass: "blue",
    buttonContent: "Follow",
    gallery: [
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-2.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-4.jpg",
    ],
  },
  {
    name: "Aniya Harber",
    counter: "161 followers",
    avatar: "/images/content/avatar-6.jpg",
    url: "https://ui8.net",
    buttonClass: "blue",
    buttonContent: "Follow",
    gallery: [
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-6.jpg",
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
    ],
  },
  {
    name: "Edwardo Bea",
    counter: "161 followers",
    avatar: "/images/content/avatar-7.jpg",
    url: "https://ui8.net",
    buttonClass: "blue",
    buttonContent: "Follow",
    gallery: [
      "/images/content/follower-pic-4.jpg",
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-6.jpg",
    ],
  },
  {
    name: "Reymundo",
    counter: "161 followers",
    avatar: "/images/content/avatar-8.jpg",
    url: "https://ui8.net",
    buttonClass: "blue",
    buttonContent: "Follow",
    gallery: [
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-2.jpg",
      "/images/content/follower-pic-6.jpg",
      "/images/content/follower-pic-1.jpg",
    ],
  },
  {
    name: "Jeanette",
    counter: "161 followers",
    avatar: "/images/content/avatar-9.jpg",
    url: "https://ui8.net",
    buttonClass: "blue",
    buttonContent: "Follow",
    gallery: [
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-4.jpg",
    ],
  },
];

const  UserProfile = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const [displayName, setDisplayName] = useState('')
const [websiteUrl, setWebsiteUrl] =  useState('')
const [customUrl, setCustomUrl] = useState('')
const [twitterUserName, setTwitterUserName] = useState('')
const [userBio, setUserBio] = useState('')
const [memberSince, setMemeberSince] = useState('')
const [createdNfts, setCreatedNfts] = useState([])
const [ownedNfts, setOwnedNfts] = useState([])

const [hasDataFetched, setHasDataFetched] = useState(false)

const [avatar, setAvatar] =  useState("")

const [userAddress, setUserAddress] = useState("")



const { userProfilePageControl} = useContext(AppContext)

const {address} =  useParams()



useEffect(()=>{

  let addressToUse = address

  console.log(addressToUse)

  console.log(address, "HEY")

  setUserAddress(address)

    fetch("http://localhost:5001/users/getUserAccount", {
      method : 'POST',
      headers:{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        "userAddress" : addressToUse
      })
    })
    .then(res=>res.json())
    .then(data=>{
      const {userData, nftData} = data
      console.log(nftData)
      console.log(data)
      console.log(userData) 
      setUserBio(userData.bio)
      setTwitterUserName(userData.twitter)
      setDisplayName(userData.username)
      setWebsiteUrl(userData.website)
      setCustomUrl(userData.customUrl)
      setAvatar(userData.avatar)
      console.log(userProfilePageControl)

      if(userProfilePageControl === 'created'){
        setActiveIndex(2)
      }
      else if(userProfilePageControl === 'owned'){
        setActiveIndex(3)
      }

      const dateInstance = new Date(userData.createdAt)

      const date = dateInstance.getDate()

      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      const month =  months[dateInstance.getMonth()]
      const year = dateInstance.getFullYear()
      
      const fullDate =  `${month} ${date}, ${year}  `

      setMemeberSince(fullDate)
      setCreatedNfts(nftData)

      setHasDataFetched(true)
      console.log(nftData)
    })
  }
  ,[])

  return (
    <div>

      {
        hasDataFetched ? <div className={styles.profile}>
        <div
          className={cn(styles.head, { [styles.active]: visible })}
          style={{
            backgroundImage: "url(/images/content/bg-profile.jpg)",
          }}
        >
          <div className={cn("container", styles.container)}>
            {/* <div className={styles.btns}>
              <button
                className={cn("button-stroke button-small", styles.button)}
                onClick={() => setVisible(true)}
              >
                <span>Edit cover photo</span>
                <Icon name="edit" size="16" />
              </button>
              <Link
                className={cn("button-stroke button-small", styles.button)}
                to="profile-edit"
              >
                <span>Edit profile</span>
                <Icon name="image" size="16" />
              </Link>
            </div> */}
            <div className={styles.file}>
              <input type="file" />
              <div className={styles.wrap}>
                <Icon name="upload-file" size="48" />
                <div className={styles.info}>Drag and drop your photo here</div>
                <div className={styles.text}>or click to browse</div>
              </div>
              <button
                className={cn("button-small", styles.button)}
                onClick={() => setVisible(false)}
              >
                Save photo
              </button>
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={cn("container", styles.container)}>
            <User className={styles.user} item={socials}
            customUrl={customUrl}
            displayName={displayName}
            userAddress={userAddress}
            userBio={userBio}
            memeberShipDate = {memberSince}
            avatar={avatar}
            
            />
            <div className={styles.wrapper}>
              <div className={styles.nav}>
                {navLinks.map((x, index) => (
                  <button
                    className={cn(styles.link, {
                      [styles.active]: index === activeIndex,
                    })}
                    key={index}
                    onClick={() => setActiveIndex(index)}
                  >
                    {x}
                  </button>
                ))}
              </div>
              <div className={styles.group}>
                <div className={styles.item}>
                  {activeIndex === 0 && (
                    <Items class={styles.items} createdNfts = {createdNfts} 
                    activeIndex = {activeIndex} 
                    address={userAddress} 
                    items={bids.slice(0, 3)} />
                  )}
                  {activeIndex === 1 && (
                    <Items class={styles.items} createdNfts = {createdNfts}
                    activeIndex = {activeIndex} 
                    address={userAddress} 
                    items={bids.slice(0, 6)} />
                  )}
                  {activeIndex === 2 && (
                    <Items class={styles.items} createdNfts = {createdNfts} 
                    activeIndex = {activeIndex} 
                    address={userAddress} 
                    items={bids.slice(0, 2)} />
                  )}
                  {activeIndex === 3 && (
                    <Items class={styles.items} createdNfts = {createdNfts}  
                    activeIndex = {activeIndex} 
                    address={userAddress} 
                    items={bids.slice(0, 3)} />
                  )}
                  {/* {activeIndex === 4 && (
                    <Followers className={styles.followers} items={following} />
                  )}
                  {activeIndex === 5 && (
                    <Followers className={styles.followers} items={followers} />
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> : ""
      }
    
    </div>
  );
};

export default UserProfile;
