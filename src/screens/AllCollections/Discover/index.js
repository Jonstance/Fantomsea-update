import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Discover.module.sass";
import { Range, getTrackBackground } from "react-range";
import Slider from "react-slick";
import Icon from "../../../components/Icon";
import Card from "./Card/index"
import Dropdown from "../../../components/Dropdown";

// data
import { bids } from "../../../mocks/bids";
import { useHistory } from "react-router";


const dateOptions = ["Recently Added", "Oldest"];
const priceOptions = ["Highest price", "The lowest price"];
const likesOptions = ["Most liked", "Least liked"];
const creatorOptions = ["Verified only", "All", "Most liked"];
const sortingOptions = [];
// navLinks.map((x) => sortingOptions.push(x));

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);


const Discover = ({collectionData, collectionCover}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [date, setDate] = useState(dateOptions[0]);
  const [price, setPrice] = useState(priceOptions[0]);
  const [likes, setLikes] = useState(likesOptions[0]);
  const [creator, setCreator] = useState(creatorOptions[0]);
  const [sorting, setSorting] = useState(sortingOptions[0]);

  const [values, setValues] = useState([0.0001]);

  const [visible, setVisible] = useState(false);

  const [search, setSearch] = useState("");


  const [allNftData, setAllNFTData] = useState([])
  const [currentView, setCurrentView] = useState([])
  const [filteredNFTData, setFilteredNFTData] = useState([])


  const history = useHistory()

  const STEP = 0.001;
  const MIN = 0.0001;
  const MAX = 1000;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
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
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 100000,
        settings: "unslick",
      },
    ],
  };




  // const handleFilterByCategory = (index)=>{
  //   if(index === 0){
  //     setFilteredNFTData(allNftData)
  //     setCurrentView(allNftData)
  //   }
  //   else{
  //     const allNFTThatSatisfyFilter = allNftData.filter(eachNft=>{
  //       return eachNft.nftCategory.trim() === navLinks[index].trim()
  //     })
  //     setFilteredNFTData(allNFTThatSatisfyFilter)
  //     setCurrentView(allNFTThatSatisfyFilter)
  //   }
  // }

  const filterPrice = (value)=>{
  setPrice(value)
  if(value === "Highest price"){
    const nftsByHighestPrice = filteredNFTData.sort((a,b)=>b.nftPrice-a.nftPrice)
    console.log(nftsByHighestPrice)
    setFilteredNFTData(nftsByHighestPrice)
    }
    else{
      const nftsByLowestPrice = filteredNFTData.sort((a,b)=>a.nftPrice-b.nftPrice)
      console.log(nftsByLowestPrice)
      setFilteredNFTData(nftsByLowestPrice)
    }
  }

  const filterPriceSlide = (value)=>{
    setValues(value)
    const filteredNFTByPrice = currentView.filter(eachNft=>{
      return eachNft.nftPrice < value
    })

    console.log(filteredNFTByPrice)
    setFilteredNFTData(filteredNFTByPrice)

  }

  // const filterDate = (value)=>{
  //   if(value === "Recently Added"){
  //     const nftsRecentlyAdded = filteredNFTData.sort((a,b)=>)
  //   }
  // }

  const searchKeyword = ()=>{
    const newItems =  currentView.filter(eachNft=>{
      return eachNft.nftName.includes(search)
    })
    console.log(newItems)
    setFilteredNFTData(newItems)
  }

  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
          
        <div className={styles.list}>
          <Slider
            className={cn("discover-slider", styles.slider)}
            {...settings}
          >
            {collectionData.map((x, index) => (
              <Card className={styles.card} collectionData={x} collectionCover={collectionCover} />
            ))}
          </Slider>
        </div>
        <div className={styles.btns}>
          {/* <button 
         onClick={()=>history.push("/discover")} 
          className={cn("button-stroke button-small", styles.button)}>
            <span>Load more</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Discover;
