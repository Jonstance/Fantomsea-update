import React from 'react'
import './nftsInWallet.css'
import Card from '../Card/index'
const  NFTsInWallet = ({nftItem, importNft})=> {
    return (
        <div style={{paddingTop:"30px"}}>
        {
            nftItem.map((eachNftItem, i)=>{
                if(eachNftItem.supports_erc.includes("erc721")){
                    return <div  key={i} style={{marginTop:"20px", alignContent:"center"}}>
                    <h3 style={{textAlign:'center'}}>NFT Token Name : {eachNftItem.contract_name}</h3>
                    <br/>

                    <p> Contract Address : {eachNftItem.contract_address} </p>
                    {
                        eachNftItem.nft_data.map((eachItem,i)=>{
                            if(eachItem.external_data.image === null || eachItem.external_data.image.trim() === ''){

                            }
                            else{
                                return <div key={i} style={{paddingTop:"30px"}}>

                                    <h3 style={{textAlign:"center"}} > NFT Name :  {eachItem.external_data.name}  </h3>
                                    <br/>
                                <Card item={eachItem} />

                                <button className="importButton" onClick={
                                    eachItem.contractAddress = eachNftItem.contract_address,
                                    eachItem.collectionName  = eachNftItem.contract_name,
                                    eachItem.collectionTicker =  eachNftItem.contract_ticker_symbol,
                                    ()=>importNft(eachItem)
                                    } >Import </button>
                            </div>
                            }
                        })
                    }
                </div>
                }
                
            })
        }
        </div>
    )
}

export default NFTsInWallet