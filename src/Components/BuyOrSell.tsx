import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import EhisabERC721 from '../Artifacts/EhisabERC721.json'

const BuyOrSell = () => {
    const [account , setAccount] = useState<any>()
    const [state , setState] = useState<any>({
        addr:"",
        amount:""
    })
    const [sender , setSender] = useState<any>()

     
    const walletCard = () =>{
        if((window as any).ethereum){
            (window as any).ethereum.request({method:'eth_requestAccounts'}).then((balance: any)=>{
        (window as any).ethereum.request({
            method:'eth_getBalance', 
            params:[balance[0] , "latest"]
        }).then((balance: any) => {
            
            console.log(ethers.utils.formatEther(balance))
        })
        console.log(balance) 
        setAccount(balance)
    })

          }else{
            alert("install metamask extension!!")
          }
    }




    const handleChange = (e: any) =>{
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const send = async () => {
        const ethereumInstalled = () => {
            return (window as any).ethereum
        }
        const ethereum = ethereumInstalled()
        if (ethereum) {
            try {
                await ethereum.request({ method: 'eth_requestAccounts' })
                const chainId = await ethereum.request({ method: 'eth_chainId' })
                const provider = new ethers.providers.Web3Provider(ethereum)

                const signer = provider.getSigner()
                const tx = signer.sendTransaction({
                    to: ethers.utils.getAddress(state.addr) ,
                    value: ethers.utils.parseEther(`${state.amount}`)
                });
                console.log(tx);
                
            } catch (error) {
                console.log(error);
                return null
            }
        } else {
            console.log('Install Ethereum');

        }
    }

    useEffect(() => {
        if ((window as any).ethereum) {
            (window as any).ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          (window as any).ethereum.on("accountsChanged", () => {
            window.location.reload();
          });
          walletCard()
        }
      },[]);

    



    return (
        <>
            <div className="container row text-center ">
            <div className="text mt-3">
                    <h6> Sender Account Address </h6>
                <input type="text" className='col-12 me-4' name="addr" id="name" disabled placeholder='sender Account Address ' value={account} />
                </div>
           
                <div className="text mt-3">
                    <h6>Recevier Account Address </h6>
                <input type="text" className='col-12 me-4' name="addr" id="name" placeholder='Account Address ' onChange={handleChange} />
                </div>
                <div className="amount mt-3">
                    <h6>Sending Amount</h6>
                <input type="number" className='col-12' name="amount" id="number" placeholder='Sending Amount' onChange={handleChange} />
                </div>
                <div className="sellbtn mt-3 ">
                    <button className="btn btn-primary col-4" onClick={send}>send</button>
                
                </div>
                <div className="sellbtn mt-3 ">
                    <button className="btn btn-primary col-4" onClick={walletCard}>Connect</button>
                    
                </div>
            </div>
        </>
    )
}
export default BuyOrSell