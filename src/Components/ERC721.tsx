import axios from "axios"
import { ethers } from "ethers"
import { formatEther } from "ethers/lib/utils"
import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import EhisabERC721 from '../Artifacts/EhisabERC721.json'
import MARKETPLACE_ARTIFACTS from '../Artifacts/marketpalce.json'
import Modal from "./Modal"
import Spinner from "./Spinner"
import Voucher from "./Utiles/Voucher"


const stepsArray: Array<number> = []
let BASE_URL = 'https://staging.acria.market:2083'

export default () => {

    const ERC20_address = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
    const ERC721_ADDRESS = "0xf96cdb86aed0898a8f1aab7158b71b90797e1545"
    const MARKETPLACE_ADDRESS = "0xc047A78f99458D56932b761a93D6CfCB13Bd298c"

    const [currentAccount, setCurrentAccount] = useState<any>()
    const [connectButton, setConnectButton] = useState<string>("Connect")
    const [mintBtn, setMintBtn] = useState<string>("Mint Now")
    const [spinner, setSpinner] = useState(false)
    const [mintLoading, setMintLoading] = useState<boolean>(false)
    const [approveLoading, setApproveLoading] = useState<boolean>(false)
    const [signLoading, setSignLoading] = useState<boolean>(false)
    const [img, setImg] = useState<any>()

    const [imgState, setImgState] = useState<any>()
    const navigate = useNavigate()



    const [resState, setResState] = useState<any>({
        signature: '',
        owner: "",
        salt: "",
        minPrice: "",
        auctionType: "",
        quantity: "",
        endTime: "",
        tokenContract: "",
    })


    const [state, setState] = useState({
        name: "" as string,
        price: 0 as number,
        description: "" as string,
        nftType: "" as string,
        endDate: "" as any,
        royality: 0 as number

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
    }

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

    // const getMyProvider = async () => {
    //     try {
    //         const { accounts, eth_chainId, provider }: any = await logintometamask();
    //         let balanceInWei = await provider.getBalance(accounts[0])
    //         let gasPriceInWei = await provider.getGasPrice()
    //         let balanceInEth = ethers.utils.formatEther(balanceInWei)
    //         let gasPriceInEth = ethers.utils.formatEther(gasPriceInWei)
    //         console.log('balanceInEth', balanceInEth);
    //         console.log("gasPriceInEth", gasPriceInEth);
    //         setCurrentAccount(accounts[0])
    //         setConnectButton("Connected")
    //         return { provider, accounts, eth_chainId, balanceInEth, gasPriceInEth, error: null }
    //     } catch (error) {
    //         console.log("getMyProvider error", error);
    //         // debugger
    //         return { error }
    //     }
    // }



    const getERC721Contract = async () => {
        const abi = EhisabERC721.abi;
        const { provider, accounts } = await getMyProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(ERC721_ADDRESS, abi, signer);
        return { contract, accounts }
    }

    const getMarketPlaceContract = async () => {
        // debugger
        const abi = MARKETPLACE_ARTIFACTS.abi;
        const { provider, accounts } = await getMyProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(MARKETPLACE_ADDRESS, abi, signer);
        console.log("getMarketPlaceContract contract", contract);
        return { contract, accounts, provider, signer }
    }



    // const getContract = async () => {
    //     // debugger
    //     const abi = MARKETPLACE_ARTIFACTS.abi;
    //     const { provider, accounts } = await getMyProvider()
    //     const signer = provider.getSigner()
    //     const contract = new ethers.Contract(MARKETPLACE_ADDRESS, abi, signer);
    //     console.log("getMarketPlaceContract contract", contract);
    //     return { contract, accounts, provider, signer }
    // }

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
        stepsArray.push(1)
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
        stepsArray.push(2)
        setSignLoading(true)
        // debugger
        const { contract, accounts, signer } = await getMarketPlaceContract()
        const ether = ethers.utils.parseEther(Number(state.price).toFixed(18));
        await Voucher.setToken(contract, signer);
        const { signature, salt, owner, minPrice, auctionType, quantity, endTime, tokenContract } = await Voucher.CreateVoucher(accounts[0], 1, Number(1), 0, ether, ERC721_ADDRESS);
        // debugger
        stepsArray.push(3)

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

        const params = new URLSearchParams()
        params.set('signature', signature)
        params.set('owner', owner)
        params.set("salt", salt as any)
        params.set("minPrice", minPrice)
        params.set("auctionType", auctionType)
        params.set("quantity", quantity)
        params.set("endTime", endTime)
        params.set("tokenContract", tokenContract);
        params.set("price", state.price as any);
        params.set("royality", state.royality as any);

        (window as any).document.getElementById("btn-close").click()
        navigate({ pathname: "/buy", search: params.toString() })
        setSignLoading(false)
    }

    const handleImage = async (e: any) => {
        let img = e.target.files[0]
        setImg(img)
        let image = URL.createObjectURL(img)
        setImgState(image)
    }

    const mintNow = async () => {
        setSpinner(true)
        setMintLoading(true)
        ///
        const { contract } = await getERC721Contract();
        try {
            const formData = new FormData();
            formData.append("file", img)

            let apiRes = await axios.post(`${BASE_URL}/upload/ipfs/file`, formData)
            let ImgCID = apiRes.data.data
            let item = {
                image: `ipfs://${ImgCID}`,
                name: state.name,
                price: state.price,
                description: state.description,
            }

            const metadata = JSON.stringify(item)
            const metaRes = await axios.post(`${BASE_URL}/Upload/ipfs/metadata`, { metadata: metadata })
            const contractRes = await contract.functions.mint(metaRes.data.data, Number(state.royality))
            const waitRes = await contractRes.wait()

            await approveMarktplace()
            await signMyToken()
            setSpinner(false);

        } catch (error) {
            console.log(error);

        }
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
                <div className="nftImage m-2">
                    <div className="ImageSection" >
                        <img src={imgState} alt="" style={{ height: "150px", width: "150px" }} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label"> Upload Image:-</label>
                        <input className="form-control" type="file" id="formFile" name="file" onChange={handleImage} />
                    </div>
                </div>

                <div className="nftDetails">
                    <div className="name m-2">
                        Name:-
                        <input type="text" name="name" id="" className="form-control" onChange={handleState} placeholder='Create NFT Name' />
                    </div>
                    <div className="price m-2">
                        Price:-
                        <input type="number" name="price" id="" className="form-control" onChange={handleState} placeholder="Enter Price" />
                    </div>
                    <div className="description m-2">
                        Description:-
                        <input type="text" name="description" id="" className="form-control" onChange={handleState} placeholder='Enter Description' />
                    </div>
                    {/* <div className="type m-2">
                        Select NFT Type:-
                        <select className="form-select" aria-label="Default select example" name="nftType" onChange={handleState} >
                            <option selected >Select NFT Type</option>
                            <option value="1">Fixed</option>
                            <option value="2">Auction</option>
                        </select>
                    </div>
                    {state.nftType == '2' ? <div className="endDate m-2" >
                        Auction End Date:-
                        <input type="date" name="endDate" id="" className="form-control" onChange={handleState} placeholder="Enter End Date" />
                    </div> : ""} */}
                    <div className="royality m-2">
                        Royality:-
                        <input type="number" name="royality" id="" className="form-control" onChange={handleState} placeholder='Enter Royality' />
                    </div>
                </div>
                <button className={`btn btn-primary `} data-bs-toggle="modal" data-bs-target="#exampleModal" disabled={spinner} onClick={mintNow}>{spinner ? <Spinner /> : ""} {mintBtn}</button>
                <div className={`modal fade`} id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true"   >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                <button type="button" className="btn-close" id="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <Modal StepArray={stepsArray} spinner={spinner} mintLoading={mintLoading} approveLoading={approveLoading} signLoading={signLoading} />
                        </div>
                    </div>
                </div>

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