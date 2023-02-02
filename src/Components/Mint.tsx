import axios from "axios"
import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import EhisabERC721 from '../Artifacts/EhisabERC721.json'
import Modal from "./Modal"
import Spinner from "./Spinner"
import { BASE_URL, ERC721_ADDRESS, getContract ,getMyProvider } from "./Utiles/Common"


const stepsArray: Array<number> = []



export default () => {
    const params = new URLSearchParams()

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

    const handleImage = async (e: any) => {
        let img = e.target.files[0]
        setImg(img)
        let image = URL.createObjectURL(img)
        setImgState(image)
    }

    const mintNow = async () => {
        setSpinner(true)
        setMintLoading(true)
        const abi = EhisabERC721.abi;
        const { contract } = await getContract(ERC721_ADDRESS , abi);
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
            console.log(waitRes.events[0].args.tokenId);
            let tokenId = waitRes.events[0].args.tokenId
            params.set("img_cid" , ImgCID)
            params.set("tokenId", tokenId as string);
            // await approveMarktplace()
            // await signMyToken()
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