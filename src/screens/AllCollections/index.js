import React, { useEffect, useState } from 'react'
import './index.css'


import CollectionCover from '../../assets/collection-cover.jpg'
import Discover from './Discover'

const  AllCollections = ()=> {


    const [arrayOfAllCollections, setArrayOfAllCollections] = useState([])

    useEffect(()=>{

        fetch('https://fantomsea-api.herokuapp.com/collection/getAll')
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setArrayOfAllCollections(data)
        })

    },[])

    const getMoreCollections = ()=>{
        fetch('https://fantomsea-api.herokuapp.com/collection/getMore', {
            method : 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({
                lastId : arrayOfAllCollections[arrayOfAllCollections.length-1]._id
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.length === 0){
                alert("No More Collections")
            }else{
                setArrayOfAllCollections([...arrayOfAllCollections, ...data])
            }
        })
    }


    return (
        <div>

                <h1 style={{textAlign:'center', marginTop:'10px'}}> All Collections in Fantom Sea </h1>

            <Discover collectionData={arrayOfAllCollections} CollectionCover={CollectionCover} />

<br/><br/><br/>

<div className='buttonDiv' >
              <button onClick={()=>getMoreCollections()} className='loadMoreButton'>
                <span>Load more</span>
              </button>
            </div>

        </div>
    )
}

export default AllCollections
