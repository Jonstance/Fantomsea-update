export const setLocalStorageData = (userAddress)=>{

    localStorage.setItem('BilliseaAddress', userAddress)
    return true
}

export const getLocalStorage = ()=>{
    let storedItem = localStorage.getItem('BilliseaAddress')

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

localStorage.clear('BilliseaAddress')

}