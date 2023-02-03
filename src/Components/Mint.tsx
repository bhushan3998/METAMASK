import axios from "axios"
import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import EhisabERC721 from '../Artifacts/EhisabERC721.json'
import Modal from "./Modal"
import Spinner from "./Spinner"
import { BASE_URL, ERC721_ADDRESS, getContract, getMyProvider } from "./Utiles/Common"

const stepsArray: Array<number> = []

export default () => {

    const [currentAccount, setCurrentAccount] = useState<any>()
    const [connectButton, setConnectButton] = useState<string>("Connect")
    const [balance, setBalance] = useState<any>("")
    const [createBtnLoading, setSetCreatebtnLoading] = useState<boolean>(false)
    const [img, setImg] = useState<any>()
    const [imageLoading, setSetImageLoading] = useState<boolean>(false)
    const [mintLoading, setMintLoading] = useState<boolean>(false)
    const [imgState, setImgState] = useState<any>()
    const [state, setState] = useState({
        name: "" as string,
        description: "" as string,
        royality: 0 as any
    })

    const searchParams = new URLSearchParams()
    const navigate = useNavigate()

    const handleState = (event: any) => {
        setState({
            ...state,
            [event?.target.name]: event?.target.value
        })
    }

    const handleImage = async (e: any) => {
        let img = e.target.files[0]
        setImg(img)
        let image = URL.createObjectURL(img)
        setImgState(image)
    }

    const myProvider = async () => {
        const { accounts, balanceInEth }: any = await getMyProvider()
        setCurrentAccount(accounts)
        console.log('accounts', accounts);
        setBalance(balanceInEth)
        console.log("balanceInEth", balanceInEth);
        setConnectButton("Connected")
    }

    const mint = async () => {
        const abi = EhisabERC721.abi;
        try {
            setSetImageLoading(true)
            const formData = new FormData();
            formData.append("file", img)
            let apiRes = await axios.post(`${BASE_URL}/upload/ipfs/file`, formData)
            let ImgCID = apiRes.data.data
            searchParams.set("img_cid", ImgCID)
            const { contract } = await getContract(ERC721_ADDRESS, abi);
            let item = {
                image: `ipfs://${ImgCID}`,
                name: state.name,
                description: state.description,
            }

            const metadata = JSON.stringify(item)
            const metaRes = await axios.post(`${BASE_URL}/Upload/ipfs/metadata`, { metadata: metadata })
            setSetImageLoading(false)
            setMintLoading(true)
            const contractRes = await contract.functions.mint(metaRes.data.data, Number(state.royality))
            const waitRes = await contractRes.wait()
            console.log(waitRes);
            let tokenId = waitRes.events[0].args.tokenId._hex
            setMintLoading(false)
            searchParams.set("tokenId", tokenId as string);
            setSetCreatebtnLoading(false);
            (window as any).document.getElementById("btn-close").click()
            navigate({ pathname: "/sign", search: searchParams.toString()})
        } catch (error) {
            console.log(error);
        }
    }

    return <Fragment>
        <div className="container">
            {/* <ProgressBar barWidth={barState} /> */}
            <h1 className="text-center text-secondary">Create NFT</h1>
            <div className="nft-card text-center">

                <div className="connect-Wallet-address">
                    {currentAccount ? <div className="Wallet-address  h5">
                        Address:{currentAccount}
                    </div> : ""}
                    {balance ? <div className="Wallet-address  h5">
                        Balance:{balance}
                    </div> : ""}

                </div>

                <div className="wallert-connect-btn">
                    <button className="btn btn-sm btn-primary" onClick={myProvider}>{connectButton}</button>
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

                    <div className="description m-2">
                        Description:-
                        <input type="text" name="description" id="" className="form-control" onChange={handleState} placeholder='Enter Description' />
                    </div>

                    <div className="royality m-2">
                        Royality:-
                        <input type="number" name="royality" id="" className="form-control" onChange={handleState} placeholder='Enter Royality' />
                    </div>
                </div>
                <button className={`btn btn-primary `} data-bs-toggle="modal" data-bs-target="#exampleModal" disabled={createBtnLoading || !(state.name && state.royality && state.description)} onClick={mint}>{createBtnLoading ? <Spinner /> : ""} Create NFT</button>

                <div className={`modal fade`} id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true"   >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                <button type="button" className="btn-close" id="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <Modal
                                StepArray={stepsArray}
                                loading1={imageLoading}
                                loading2={mintLoading}
                                value1="Uploading Image"
                                value2="Minting NFT"
                            />
                        </div>
                    </div>
                </div>

            </div>


            <div className="error-msg">
                {/* <button onClick={buy}>BUY</button> */}
                {/* <h5 className="text-warning">
                    {errorMessage}
                </h5> */}
            </div>
        </div>
    </Fragment>
}