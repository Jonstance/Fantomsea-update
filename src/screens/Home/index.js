import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import Selection from "./Selection";
import Popular from "./Popular";
import HotBid from "../../components/HotBid";
import Collections from "./Collections";
import Discover from "./Discover";
import Description from "./Description";


const Home = () => {

  const [featuredAuctions, setFeaturedAuctions] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)

  const [featuredNfts, setFeaturedNfts] =  useState([])

  const [generalNfts, setGeneralNfts] =  useState([])


  const [featuredCollections, setFeaturedCollection] = useState([])



  useEffect(()=>{

    fetch("https://fantomsea-api.herokuapp.com/data/getHomePageData")
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
      const {featuredAuctions, featuredNFTs, featuredCollections, someNfts } = data
      setFeaturedAuctions(featuredAuctions)
      setFeaturedNfts(featuredNFTs)
      setFeaturedCollection(featuredCollections)
      setGeneralNfts(someNfts)
      setDataLoaded(true)
    })

  },[])

  return (
    <>
    {
      dataLoaded ?
      <div>
     <Hero  featuredAuctions={featuredAuctions} />

     <Selection featuredNFTs={
        featuredNfts
      } />

 <Collections  featuredCollections={featuredCollections} />


 <Discover nfts={generalNfts} />

 <Description />


      </div>
      : ""
    }
      
      
      {/* <Popular   /> */}
      {/* <HotBid classSection="section" /> */}
    </>
  );
};

export default Home;
