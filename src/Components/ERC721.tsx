import { ethers } from "ethers"
import { formatEther } from "ethers/lib/utils"
import { Fragment, useRef, useState } from "react"
import { useNavigate, useNavigation } from "react-router-dom"
import EhisabERC721 from '../Artifacts/EhisabERC721.json'
import { IERC20 } from "../Artifacts/IERC20"
import MARKETPLACE_ARTIFACTS from '../Artifacts/marketpalce.json'
import Modal from "./Modal"
import ProgressBar from "./ProgressBar"
import Spinner from "./Spinner"

import Voucher from "./Utiles/Voucher"

export default () => {
    const PURCHASE_TIME_TAX = 0.10
    const ERC20_address = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
    const ERC721_ADDRESS = "0xf96cdb86aed0898a8f1aab7158b71b90797e1545"
    const MARKETPLACE_ADDRESS = "0xc047A78f99458D56932b761a93D6CfCB13Bd298c"
 
    const [state, setState] = useState<any>({
        royality: "",
        price: "",
        uri: ""
    })
    const [currentAccount, setCurrentAccount] = useState<any>()
    const [barState, setBarState] = useState<string>("0")
    const [connectButton, setConnectButton] = useState<string>("Connect")
    const [mintBtn, setMintBtn] = useState<string>("Mint Now")
    const [spinner, setSpinner] = useState(false)
    const [mintLoading , setMintLoading] = useState<boolean>(false)
    const [approveLoading , setApproveLoading] = useState<boolean>(false)
    const [signLoading , setSignLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const [resState, setResState] = useState({
        signature: "" as any,
        owner: "" as any,
        minPrice: "" as any,
        auctionType: "" as any,
        quantity: "" as any,
        endTime: "" as any,
        tokenContract: "" as any,
        salt: "" as any,
    })

    const handleState = (event: any) => {
        setState({
            ...state,
            [event?.target.name]: event?.target.value
        })
    }
    console.log(state);
    const ethereumInstalled = () => {
        return (window as any).ethereum
    }
    const logintometamask = async () => {
        const ethereum = ethereumInstalled()
        if (ethereum) {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
                const chainId = await ethereum.request({ method: 'eth_chainId' })
                const provider = new ethers.providers.Web3Provider(ethereum)

                console.log('accounts', accounts);

                console.log('chainId', chainId);
                console.log('provider', provider);
                return { accounts, chainId, provider }
            } catch (error) {
                console.log(error);
                return null
            }
        } else {
            console.log('Install Ethereum');
            return null
        }
        // getMyProvider()
    }
    console.log(currentAccount);
    const getMyProvider = async () => {
        try {
            const { accounts, eth_chainId, provider }: any = await logintometamask();
            let balanceInWei = await provider.getBalance(accounts[0])
            let gasPriceInWei = await provider.getGasPrice()
            let balanceInEth = ethers.utils.formatEther(balanceInWei)
            let gasPriceInEth = ethers.utils.formatEther(gasPriceInWei)
            console.log('balanceInEth', balanceInEth);
            console.log("gasPriceInEth", gasPriceInEth);
            setCurrentAccount(accounts[0])
            setConnectButton("Connected")
            return { provider, accounts, eth_chainId, balanceInEth, gasPriceInEth, error: null }
        } catch (error) {
            console.log("getMyProvider error", error);
            // debugger
            return { error }
        }
    }

  
    const getERC721Contract = async () => {
        const abi = EhisabERC721.abi;
        const { provider, accounts } = await getMyProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(ERC721_ADDRESS, abi, signer);

        return { contract, accounts }
    }

    const getMarketPlaceContract = async () => {
        debugger
        const abi = MARKETPLACE_ARTIFACTS.abi;
        const { provider, accounts } = await getMyProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(MARKETPLACE_ADDRESS, abi, signer);
        console.log("getMarketPlaceContract contract", contract);
        return { contract, accounts, provider, signer }
    }

    const requestApprove = async (contract: any, address: string) => {
        try {
            const trasactionRes = await contract.functions.setApprovalForAll(address, true);
            const transactionSuccess = await trasactionRes.wait();
            console.log("requestApprove transactionSuccess", transactionSuccess);
            return transactionSuccess
        } catch (error: any) {
            return null
        }
    }


    const approveMarktplace = async () => {
        setMintLoading(false)
        setApproveLoading(true)
        try {
            const { contract, accounts } = await getERC721Contract();
            const isApproveForAllRes = await contract.functions.isApprovedForAll(accounts[0], MARKETPLACE_ADDRESS);
            if (Array.isArray(isApproveForAllRes) && isApproveForAllRes.length) {
                let isApproved = isApproveForAllRes[0]
                if (isApproved) {
                    return isApproved
                } else {
                    return await requestApprove(contract, MARKETPLACE_ADDRESS)
                }
            } else {
                return await requestApprove(contract, MARKETPLACE_ADDRESS)
            }
        } catch (error) {
            console.log("error", error);
            return null
        }
    }

    const signMyToken = async () => {
        setApproveLoading(false)
        setSignLoading(true)

        debugger
        const { contract, accounts, signer } = await getMarketPlaceContract()
        const ether = ethers.utils.parseEther(Number(state.price).toFixed(18));
        await Voucher.setToken(contract, signer);
        const { signature, salt, owner, minPrice, auctionType, quantity, endTime, tokenContract } = await Voucher.CreateVoucher(accounts[0], 1, Number(1), 0, ether, ERC721_ADDRESS);


        setResState({
            ...resState,
            signature: signature,
            owner: owner,
            salt: salt,
            minPrice: formatEther(minPrice),
            auctionType: auctionType,
            quantity: quantity,
            endTime: endTime,
            tokenContract: tokenContract,
        })
        setSignLoading(false)
    }






    // QmPXYB9JFUhioiiGWeVCMMQ9nmrsynNLJc91T3ArdKnpZh

    const mintNow = async () => {
        setSpinner(true)
        setMintLoading(true)

        const { contract } = await getERC721Contract();
        const contractRes = await contract.functions.mint(state.uri, Number(state.royality))
        const waitRes = await contractRes.wait()
        setMintBtn("Approve For All")
        console.log('waitRes', waitRes);
        
        await approveMarktplace()
        
        setMintBtn("Sign My token")
        
        await signMyToken()
        
        setBarState('100')
        setMintBtn("Completed")
        setSpinner(false)
        navigate("/buy")


    }

   

    return <Fragment>
        <div className="container">
            {/* <ProgressBar barWidth={barState} /> */}
            <h1 className="text-center text-secondary">MINT Task</h1>
            <div className="nft-card text-center">

                <div className="connect-Wallet-address">
                    {currentAccount ? <div className="Wallet-address  h5">
                        Address:{currentAccount}
                    </div> : ""}

                </div>

                <div className="wallert-connect-btn">
                    <button className="btn btn-sm btn-primary" onClick={getMyProvider}>{connectButton}</button>
                </div>

                {<div className={`nft-card `}>
                    <div className="input-field">

                        <div className="m-2">
                            <input type="text" value={state.uri} placeholder="Enter URL" name="uri" className="form-control" onChange={handleState} />
                        </div>
                        <div className="m-2">
                            <input type="text" value={state.price} placeholder="Enter Price" name="price" className="form-control" onChange={handleState} />
                        </div>
                        <div className="m-2">
                            <input type="text" value={state.royality} placeholder="Enter Royality" name="royality" className="form-control" onChange={handleState} />
                        </div>
                    </div>

                </div>}
                <button className={`btn btn-primary `} data-bs-toggle="modal" data-bs-target="#exampleModal" disabled={!(state.price && state.uri && state.royality) || spinner} onClick={mintNow}>{spinner ? <Spinner /> : ""} {mintBtn}</button>
                <Modal  mintLoading={mintLoading} approveLoading={approveLoading} signLoading={signLoading} />

                {/* <button onClick={modalFun}> Open modal</button/> */}
                
            </div>
            {resState.signature ? <div className="details">
                <h6>Signature: {resState.signature}</h6>
                <h6>Owner: {resState.owner}</h6>
                <h6>Salt: {resState.salt}</h6>
                <h6>MinPrice: {resState.minPrice}</h6>

                <h6>Quantity: {resState.quantity}</h6>
                <h6>EndTime: {resState.endTime}</h6>
                <h6>TokenContract: {resState.tokenContract}</h6>
            </div> : ""
            }
            <div className="error-msg">
             {/* <button onClick={buy}>BUY</button> */}
                {/* <h5 className="text-warning">
                    {errorMessage}
                </h5> */}
            </div>
        </div>
    </Fragment>
}