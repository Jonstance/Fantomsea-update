import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Link , useHistory} from "react-router-dom";
import Slider from "react-slick";
import styles from "./Hero.module.sass";
import Icon from "../../../components/Icon";
import Player from "../../../components/Player";
import Modal from "../../../components/Modal";
import Connect from "../../../components/Connect";
import moment from "moment";
// import Bid from "../../../components/Bid";
import coingecko from  'coingecko-api'


const items = [
  {
    title: "the creator network®",
    creator: "Enrico Cole",
    currency: "1.00 BCAT",
    price: "$3,618.36",
    avatar: "/images/content/avatar-creator.jpg",
    image: "/images/content/video-preview.jpg",
    image2x: "/images/content/video-preview@2x.jpg",
  },
  {
    title: "Marco carrillo®",
    creator: "Enrico Cole",
    currency: "2.00 BCAT",
    price: "$2,477.92",
    avatar: "/images/content/avatar-creator.jpg",
    image: "/images/content/video-preview.jpg",
    image2x: "/images/content/video-preview@2x.jpg",
  },
  {
    title: "the creator network®",
    creator: "Enrico Cole",
    currency: "1.00 BCAT",
    price: "$3,618.36",
    avatar: "/images/content/avatar-creator.jpg",
    image: "/images/content/video-preview.jpg",
    image2x: "/images/content/video-preview@2x.jpg",
  },
  {
    title: "Marco carrillo®",
    creator: "Enrico Cole",
    currency: "2.00 BCAT",
    price: "$2,477.92",
    avatar: "/images/content/avatar-creator.jpg",
    image: "/images/content/video-preview.jpg",
    image2x: "/images/content/video-preview@2x.jpg",
  },
];

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);

const Hero = ({featuredAuctions}) => {

  const history = useHistory()

  const coinGeckoClient =  new coingecko()

  useEffect(()=>{

  },[])

  function constructAuctionObject(featuredAuctions){

    const arrayOfDesiredData = featuredAuctions.map(eachAuction=>{
      console.log(eachAuction)

      let highestBid = 0

      if(eachAuction.nftAuctionBids.length > 1 ){

        let  highestBidPrice = 0
        let  highestBidIndex = 0
        const nftBids =  eachAuction.nftAuctionBids
        for(let i  = 0 ; i < nftBids.length; i++){
          if(nftBids[i].valueOfBid > highestBidPrice){
            highestBidPrice = nftBids[i].valueOfBid
            highestBidIndex =  i
          }
        }
    
        console.log(highestBidIndex)
        highestBid =  nftBids[highestBidIndex].valueOfBid
      }
    
      else if ( eachAuction.nftAuctionBids.length === 1 ){
         highestBid =  eachAuction.nftAuctionBids[0].valueOfBid
      }

      return {
        title : eachAuction.nftName,
        creator : eachAuction.nftOwner.userName,
        currency : `${eachAuction.auctionStartingPrice} BCAT` ,
        price : `${eachAuction.auctionStartingPrice}`,
        avatar: eachAuction.nftOwner.avatar,
        image : eachAuction.nftDigitalUrl,
        image2x: eachAuction.nftDigitalUrl,
        nftID : eachAuction.nftID,
        highestBid : highestBid,
        deadline : moment(eachAuction.auctionTimeDeadline).format('MMMM Do YYYY, h:mm a'),
        isDeadeLineMet : eachAuction.auctionTimeDeadline < Date.now()
      }
    })
    return arrayOfDesiredData
  }


  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: (
      <SlickArrow>
        <Icon name="arrow-next" size="14" />
      </SlickArrow>
    ),
    prevArrow: (
      <SlickArrow>
        <Icon name="arrow-prev" size="14" />
      </SlickArrow>
    ),
  };

  const [visibleModalBid, setVisibleModalBid] = useState(false);

  const [auctionData, setAuctionData] = useState([])

  const [fantomPriceInDollars, setFantomPriceInDollars] = useState([0])

  useEffect(async ()=>{

    const dollarRateOfFTM =  await coinGeckoClient.simple.price({ids:"fantom", vs_currencies:'USD'})
      console.log(dollarRateOfFTM)

      const dollarAmount =  dollarRateOfFTM.data.fantom.usd

      setFantomPriceInDollars(dollarAmount)

    setAuctionData(constructAuctionObject(featuredAuctions))
  },[])

  return (
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.head}>
            <div className={styles.stage}>
              Create, explore, & collect digital art NFTs.
            </div>
            <h2 className={cn("h4", styles.title)}>
            All in one NFT platform. Powered by 
            </h2>
            <span className={cn("h4", styles.blue)}>BSC Chain</span>
           <br/>
           <br/>
            <Link className={cn("button-stroke", styles.button)} to="/discover">
              Start your search
            </Link>
          </div>
          <div className={styles.wrapper}>
            <Slider className="creative-slider" {...settings}>
              {auctionData.map((x, index) => (
                <div className={styles.slide} key={index}>
                  <div className={styles.row}>
                    <Player className={styles.player} item={x} />
                    <div className={styles.details}>
                      <div className={cn("h1", styles.subtitle)}>{x.title}</div>
                      <div className={styles.line}>
                        <div className={styles.item}>
                          <div className={styles.avatar}>
                            <img src={x.avatar} alt="Avatar" />
                          </div>
                          <div className={styles.description}>
                            <div className={styles.category}>Owner</div>
                            <div className={styles.text}>{x.creator}</div>
                          </div>
                        </div>
                        <div className={styles.item}>
                          <div className={styles.icon}>
                            <Icon name="stop" size="24" />
                          </div>
                          <div className={styles.description}>
                            <div className={styles.category}>Reserved Price</div>
                            <div className={styles.text}>{x.price}BCAT</div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.wrap}>
                        <div className={styles.info}>Current Bid</div>
                        <div className={styles.currency}>{x.highestBid} BCAT </div>
                        <div className={styles.price}>{x.highestBid} BCAT - ${(x.highestBid * fantomPriceInDollars).toFixed(4)} </div>
                        <div className={styles.info}>
                          {
                            x.isDeadeLineMet ? `Auction has Ended on ${x.deadline}` : `Auction ending at ${x.deadline}`
                          }
                          </div>
                        
                      </div>
                      <div className={styles.btns}>
                        {
                          x.isDeadeLineMet ? "" : <button
                          className={cn("button", styles.button)}
                          onClick={() =>
                          history.push(`/nft/${x.nftID}`)
                          }
                        >
                          Place a bid
                        </button>
                        }
                        
                        <Link
                          className={cn("button-stroke", styles.button)}
                          to={`/nft/${x.nftID}`}
                        >
                          View item
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      <Modal
        visible={visibleModalBid}
        onClose={() => setVisibleModalBid(false)}
      >
        <Connect />
      </Modal>
    </>
  );
};

export default Hero;
