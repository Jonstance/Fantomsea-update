import React, { useState, useEffect } from "react";
import cn from "classnames";
import styles from "./Search01.module.sass";
import { Range, getTrackBackground } from "react-range";
import Icon from "../../components/Icon";
import Card from "../../components/Card";
import Dropdown from "../../components/Dropdown";

import { bids } from "../../mocks/bids";
import TextInput from "../../components/TextInput";
import Switch from "../../components/Switch";

const navLinks = ["All items", "Music", , "Art", "Collectible", "Sport", "Utility", "Other"];

const dateOptions = ["Recently Added", "Oldest"];
const likesOptions = ["Highest", "Lowest"];


const Search = () => {

  const [activeIndex, setActiveIndex] = useState(0);
  const [date, setDate] = useState(dateOptions[0]);
  const [likes, setLikes] = useState(likesOptions[0]);
  const [collection, setCollection] = useState
  ('All');
  const [allNftData, setAllNFTData] = useState([])
  const [currentView, setCurrentView] = useState([])
  const [filteredNFTData, setFilteredNFTData] = useState([])
  const [highestPrice, setHighestPrice] = useState([]) 
  const [viewListedForSale, setViewListedForSale]  = useState(false)

  const [collectionsInFSEA, setCollectionsInFsea] = useState([])

  const [namesOfCollections, setNamesOfCollections] = useState(['All'])

  const [search, setSearch] = useState("");

  const [values, setValues] = useState(["All Prices"]);


  const STEP = 0.001;
  let MIN = 0.0001;
  let MAX = 10000;

  useEffect(()=>{

    fetch('https://backend.billisea.io/nft/getAllNfts')
    .then(res=>res.json())
    .then(data=>{
      setAllNFTData(data)
      setFilteredNFTData(data)
      setCurrentView(data)
    })

    fetch('https://backend.billisea.io/collection/getAll').then(res=>res.json())
    .then(data=>{
      console.log(data)
      setCollectionsInFsea(data)

      const nameOfAllColllections = data.map(eachCollection=>{
        return `${eachCollection.collectionName}`
      })
      
      setNamesOfCollections(['All', ...nameOfAllColllections])

    })



  },[])


  // const getHighestPrice = (arrayOfNFTS)=>{

  //   let  currentHighest = 0
  //   for(let i = 0; i < arrayOfNFTS.length ; i++){
  //     if(arrayOfNFTS[i].nftPrice > currentHighest){
  //       currentHighest = arrayOfNFTS[i].nftPrice
  //     }else{
  //       continue
  //     }
  //   }
  //   MAX = currentHighest
  //   return currentHighest
  // }

  // const getLowestPrice = (arrayOfNFTS)=>{
  //   let  currentLowest = getHighestPrice(arrayOfNFTS)
  //   for(let i = 0; i < arrayOfNFTS.length ; i++){
  //     if(arrayOfNFTS[i].nftPrice < currentLowest){
  //       currentLowest = arrayOfNFTS[i].nftPrice
  //     }else{
  //       continue
  //     }
  //   }
  //   MIN = currentLowest
  //   return currentLowest
  // }

  const getMoreNFTs = ()=>{
    const lastId  = allNftData[allNftData.length-1]._id
    fetch("https://backend.billisea.io/nft/getMoreNtfs", {
      method:'POST',
      headers:{
        'Content-type' : 'application/json'
      },
      body:JSON.stringify({
        lastId : lastId
      })
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
      if(data.length === 0){
        alert('No More Results Avaialable')
      }else{
      setCurrentView([...filteredNFTData, ...data])
      }
      setFilteredNFTData([...filteredNFTData, ...data])
      setAllNFTData([...allNftData, ...data])

    })
  }

  const handleFilterByCategory = (index)=>{
    if(index === 0){
      setFilteredNFTData(allNftData)
      setCurrentView(allNftData)
    }
    else{
      const allNFTThatSatisfyFilter = allNftData.filter(eachNft=>{
        return eachNft.nftCategory.trim() === navLinks[index].trim()
      })
      setFilteredNFTData(allNFTThatSatisfyFilter)
      setCurrentView(allNFTThatSatisfyFilter)
    }
  }

  const filterPrice = (value)=>{
  setLikes(value)
  if(value === "Highest"){
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
    if(value === ''){
      setValues("All Prices")
    }else{
      setValues(value)
    }
    
   

    if(value === ''){
      setFilteredNFTData(allNftData)
    } else{
      const filteredNFTByPrice = currentView.filter(eachNft=>{
        return (eachNft.nftPrice *1 ) <= (value * 1 )
      })
      setFilteredNFTData(filteredNFTByPrice)
    }
  }

  // const filterDate = (value)=>{
  //   if(value === "Recently Added"){
  //     const nftsRecentlyAdded = filteredNFTData.sort((a,b)=>)
  //   }
  // }

  const searchKeyword = ()=>{
    const newItems =  currentView.filter(eachNft=>{
      return eachNft.nftName.toLowerCase().trim().includes(search.toLowerCase().trim())
    })
    console.log(newItems)
    setFilteredNFTData(newItems)
  }

  const handeleFilterByCollection = (collectionName)=>{

    if(collectionName.trim() === 'All'){
      setFilteredNFTData(allNftData)
    }
    else{
      const collectionSelected = collectionsInFSEA.filter(eachCollection=>{
        return eachCollection.collectionName.trim().toLowerCase() === collectionName.trim().toLowerCase()
      })

      console.log(collectionSelected)

      const nftsInCollection = allNftData.filter(eachNft=>{
        return eachNft.collectionId === collectionSelected[0].collectionId
      })

      console.log(nftsInCollection)

      setFilteredNFTData(nftsInCollection)
    }

    setCollection(collectionName)

  } 

  const handleFilterBySaleStatus = (saleStatus)=>{

    const nftsSatisfyingSaleStatus = allNftData.filter(eachNft=>{
      return eachNft.listedForSale === saleStatus
    })

    console.log(nftsSatisfyingSaleStatus)
    setViewListedForSale(saleStatus)
    setFilteredNFTData([])
      setTimeout(()=>{
        setFilteredNFTData(nftsSatisfyingSaleStatus)
      },1000)
  }

  const handleFilterByTimeAdded = (value)=>{

    if(value.toLowerCase().trim() === 'Oldest'.toLowerCase().trim()){
      console.log(allNftData)
    }
    console.log(value)
  }

  const handleResetFilter = ()=>{
    setFilteredNFTData([])
    setValues("All Prices")
    setViewListedForSale(false)
    setTimeout(()=>{
      setFilteredNFTData(allNftData)

    },200)
  }

  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.top}>
          <div className={styles.title}>Type your keywords</div>
          <form
            className={styles.search}
            onSubmit={(e)=>e.preventDefault()}
          >
            <input
              className={styles.input}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="Search ..."
              required
            />
            <button className={styles.result} onClick={searchKeyword}>
              <Icon name="search" size="16" />
            </button>
          </form>
        </div>
        <div className={styles.sorting}>
          {/* <div className={styles.dropdown}>
            <Dropdown
              className={styles.dropdown}
              value={date}
              setValue={handleFilterByTimeAdded}
              options={dateOptions}
            />
          </div> */}
          <div className={styles.nav}>
            {navLinks.map((x, index) => (
              <button
                className={cn(styles.link, {
                  [styles.active]: index === activeIndex,
                })}
                onClick={() => handleFilterByCategory(index)}
                key={index}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.filters}>
            <div className={styles.range}>
              <div className={styles.label}>{`Price range(0 -  ${values} ) BCAT `} </div>
              {/* <Range
                values={values}
                step={STEP}
                min={MIN}
                max={MAX}
                onChange={filterPriceSlide}
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                      ...props.style,
                      height: "36px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <div
                      ref={props.ref}
                      style={{
                        height: "8px",
                        width: "100%",
                        borderRadius: "4px",
                        background: getTrackBackground({
                          values,
                          colors: ["#3772ff", "#E6E8EC"],
                          min: MIN,
                          max: MAX,
                        }),
                        alignSelf: "center",
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props, isDragged }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "24px",
                      width: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#3772ff",
                      border: "4px solid #FCFCFD",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-33px",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "14px",
                        lineHeight: "18px",
                        fontFamily: "Poppins",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        backgroundColor: "#141416",
                      }}
                    >
                      {values[0].toFixed(1)}
                    </div>
                  </div>
                )}
              /> */}

              <TextInput type="number" setinputchange={(value)=>filterPriceSlide(value)} 
              
              />

              {/* <div className={styles.scale}>
                <div className={styles.number}>0.01 BCAT</div>
                <div className={styles.number}>{MAX} BCAT</div>
              </div> */}
            </div>
            <div className={styles.group}>
              <div className={styles.item}>
                <div className={styles.label}>Price</div>
                <Dropdown
                  className={styles.dropdown}
                  value={likes}
                  setValue={filterPrice}
                  options={likesOptions}
                />
              </div>
              
              <div className={styles.item}>
                <div className={styles.label}>Collections</div>
                <Dropdown
                  className={styles.dropdown}
                  value={collection}
                  setValue={handeleFilterByCollection}
                  options={namesOfCollections}
                />
              </div>
              <div className={styles.item}>
                <div className={styles.label}>For Sale</div>
                <Switch
                  className={styles.dropdown}
                  value={viewListedForSale}
                  setValue={(value)=>handleFilterBySaleStatus(value)}
                />
              </div>
            </div>
            <div className={styles.reset} onClick={()=>handleResetFilter()} >
              <Icon name="close-circle-fill" size="24" />
              <span>Reset filter</span>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.list}>
              {filteredNFTData.map((x, index) => (
                <Card className={styles.card} item={x} key={index} />
              ))}
            </div>
            <div className={styles.btns}>
              <button onClick={()=>getMoreNFTs()}  className={cn("button-stroke", styles.button)}>
                <span>Load more</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
