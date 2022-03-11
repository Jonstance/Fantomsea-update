import React, { useEffect, useState } from 'react'
import './collections.css'
import CollectionCover from '../../assets/collection-cv.png'
import CollectionAvatar from '../../assets/rec.png'
import Discover from './Discover/index.js'

import { useParams } from 'react-router'



const IndividualCollection = ()=> {

    const {collectionId} = useParams()

    const [nfts, setNfts] = useState([])

    const [collectionDetails, setCollectionDetails] =  useState({})

    useEffect(()=>{

        fetch('https://fantomsea-api.herokuapp.com/collection/getCollection', {
            method : 'POST',
            headers:{
                'Content-type' :'application/json'
            },
            body:JSON.stringify({
                collectionId : collectionId
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setNfts(data.nfts)
            setCollectionDetails(data.collectionDetails)

        })

    },[])


    return (
        <div>
            <div className="coverImageSection" style={{background: `url(${collectionDetails.collectionCover === undefined  ?  CollectionCover : collectionDetails.collectionCover === '' ? CollectionCover :   collectionDetails.collectionCover})`}} >

            </div>
        {/* <img src={collectionDetails.collectionCover === undefined  ?  CollectionCover : collectionDetails.collectionCover === '' ? CollectionCover :   collectionDetails.collectionCover}  className="collection-cover-image" /> */}

            <div className="collectionHero" >

            <img src={collectionDetails.collectionAvatar !== ( undefined|| '' ) ? collectionDetails.collectionAvatar : CollectionAvatar } className="collection-avatar" />


                <h1>{collectionDetails.collectionName} - {collectionDetails.collectionTicker}</h1>
{
    nfts.length > 0  ? <Discover nfts={nfts} /> : ""
}

            </div>

            <br/> <br/> <br/> <br/>

        </div>
    )
}

export default IndividualCollection
