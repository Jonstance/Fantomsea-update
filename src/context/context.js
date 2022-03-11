import {createContext, useState} from 'react'

export const AppContext = createContext()

const AppProvider = (props)=>{

    const [userAccountAddress, setUserAccountAddress] = useState('')
    const [userData, setUserData] = useState({})

    const [provider, userAccountProvider]  = useState('')

    const [isStateUserLoggedIn, setIsStateUserLoggedIn] = useState(false)

    const [userProfilePageControl, setUserProfilePageControl] = useState('created')

    const [importNFTMode, setImportNFTMode]  = useState(false)

    const [nftImportData, setNftImportData] =  useState({})

    const [isUserToUploadNFT, setIsUserToUploadNFT] = useState(false)

    const [isExternalNFTViewed, setIsExternalDataViewed] = useState(false)
    
    const [nftDataInWallet, setNftDataInWallet] = useState({})


    const [userBalance, setUserBalance] = useState(0.00)


    return(
        <AppContext.Provider value={{
            userAccountAddress,
            setUserAccountAddress,
            userData,
             setUserData, 
             userProfilePageControl, 
             setUserProfilePageControl, 
             isStateUserLoggedIn, 
             setIsStateUserLoggedIn,
             isUserToUploadNFT,
             setIsUserToUploadNFT,
             importNFTMode,
             setImportNFTMode,
             nftImportData,
             setNftImportData, 
             userBalance,
             setUserBalance, 
             isExternalNFTViewed,
             setIsExternalDataViewed,
             nftDataInWallet,
             setNftDataInWallet, 
             provider, 
             userAccountProvider
             }} >
            {props.children}
        </AppContext.Provider>
    )

}



export default AppProvider

