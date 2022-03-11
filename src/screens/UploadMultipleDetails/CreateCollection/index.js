import React,{useState, useEffect} from 'react'
import CircleImage from '../../../assets/rec.png'
import './createCollection.css'

const  CreateCollection = ()=> {

    return (
    
        <div className="mainDiv" >
            <h2>Collection</h2>

        <div className="flex-upload" >
            <img 
            src={CircleImage}
            className="image-style"
            > 

            <div className="flex-upload-actions" >

            </div>

            </img>
        </div>
        </div>
    )
}

export default CreateCollection
