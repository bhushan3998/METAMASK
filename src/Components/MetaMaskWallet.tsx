import { ethers } from "ethers"
import { useState } from "react"

const MetaMaskWallet =() =>{
    const [account  , setAccount] = useState<any>()

    
    const walletCard = () =>{
        if((window as any).ethereum){
            (window as any).ethereum.request({method:'eth_requestAccounts'}).then((balance: any)=>{
        (window as any).ethereum.request({
            method:'eth_getBalance', 
            params:[balance[0] , "latest"]
        }).then((balance: any) => {
            console.log(balance) 
            console.log(ethers.utils.formatEther(balance))
        })
        console.log(balance) 
    })

          }else{
            alert("install metamask extension!!")
          }
    }


    return(
        <>
        <div className="div">MetaMaskWallet</div>
        <button className="btn btn-primary" onClick={walletCard}>Button</button>

        </>
    )
}
export default MetaMaskWallet