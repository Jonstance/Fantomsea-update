export const setLocalStorageData = (userAddress)=>{

    localStorage.setItem('fantomSeaAddress', userAddress)
    return true
}

export const getLocalStorage = ()=>{
    let storedItem = localStorage.getItem('fantomSeaAddress')

    if(storedItem !== null){
        return {
            "addressFound" : true,
            "userAddress" : storedItem
        }
    }
    else{
        return {
            "addressFound" : false,
        } 
    }
}

export const clearLocalStorage = ()=>{

localStorage.clear('fantomSeaAddress')

}