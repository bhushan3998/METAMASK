import { BigNumber, ethers } from "ethers"
import { Fragment, useState } from "react"
import { useLocation } from "react-router-dom"
import { IERC20 } from "../Artifacts/IERC20"
import MarketPlaceABI from "../Artifacts/MarketPlaceABI.json"
import EhisabERC721 from '../Artifacts/EhisabERC721.json'
import Modal from "./Modal"
import Spinner from "./Spinner"
import { accessERC20, ERC721_ADDRESS, getContract, MARKETPLACE_ADDRESS, PURCHASE_TIME_TEX, WETH_GOERLI_ADDRESS_KEY } from "./Utiles/Common"
import Voucher from "./Utiles/Voucher"


const stepsArray: Array<number> = []

export default () => {

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const signature = searchParams.get("signature")
    const owner_address = searchParams.get("owner")
    const salt = searchParams.get("salt")
    const auctionType = searchParams.get("auctionType")
    const quantity = searchParams.get("quantity")
    const endTime = searchParams.get("endTime")
    const tokenContract = searchParams.get("tokenContract")
    const price = searchParams.get("price")
    const token_Id = searchParams.get("tokenId")
    const img_cid = searchParams.get("img_cid")
    // const royality = searchParams.get("royality")
    const _end_date = Math.round(Number(endTime) / 1000)

    const [buyBtn, setBuyBtn] = useState<boolean>(false)
    const [amountLoading, setAmountLoading] = useState<boolean>(false)
    const [contractLoading, setContractLoading] = useState<boolean>(false)
    const [bidLoading, setBidLoading] = useState<boolean>(false)

    const [state, setstate] = useState({
        account: "",
        amount: "" as any
    })

    const handleState = (e: any) => {
        setstate({
            ...state,
            [e.target.name]: e.target.value
        })
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

        const abi = EhisabERC721.abi;
        try {
            const { contract, accounts } = await getContract(ERC721_ADDRESS, abi);
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

    const calculateWrappedAmount = (price: any, quantity: any, tax: number) => {
        stepsArray.push(1)
        setAmountLoading(true)
        const priceWithQuantity = Number(price) * Number(quantity)
        const priceFee = (priceWithQuantity * tax) / 100
        const actualPrice = priceFee + Number(priceWithQuantity)
        const commission = actualPrice - Number(priceWithQuantity)
        setAmountLoading(false)
        return { actualPrice, commission }
    }

    const wrappedContract = async (actualPrice: number, wrapped: string, marketplaceAddr: string) => {
        const etherPrice = ethers.utils.parseEther(Number(actualPrice).toFixed(18));
        const options = { value: etherPrice }
        const { allowanceERC20Tx, contract, provider, accounts, signer } = await accessERC20(wrapped, marketplaceAddr)
        const buyPrice = ethers.utils.formatEther(etherPrice)
        const allowancePrice = ethers.utils.formatEther(allowanceERC20Tx)
        if (Number(buyPrice) > Number(allowancePrice)) {
            setAmountLoading(true)
            const depositERC20Tx = await contract.deposit(options)
            await depositERC20Tx.wait();
            setAmountLoading(false)
            stepsArray.push(1)
            setContractLoading(true)
            const approvalERC20Tx = await contract.approve(marketplaceAddr, etherPrice)
            await approvalERC20Tx.wait();
            setContractLoading(false)
            stepsArray.push(2)
        }
        return { contract, accounts, provider, signer }
    }

    const finaliseAuction = async (quantity: number, tokenContract: string, wETHAddress: string, auction_type: number) => {
        // debugger
        const abi = MarketPlaceABI.abi
        const { contract, accounts, signer } = await getContract(MARKETPLACE_ADDRESS, abi)
        const { actualPrice, commission } = calculateWrappedAmount(price, quantity, PURCHASE_TIME_TEX)
        let _etherPrice = ethers.utils.parseEther(Number(price).toFixed(18));
        let _token_id = BigNumber.from(token_Id)

        await wrappedContract(actualPrice, wETHAddress, MARKETPLACE_ADDRESS)
        const bidAmount = ethers.utils.parseEther(Number(state.amount).toFixed(18))

        await Voucher.setToken(contract, signer);
        let isApprove = await approveMarktplace()
        if (isApprove) {

            const { signature, salt, auctionType, endTime } = await Voucher.CreateVoucher(accounts[0], auction_type, quantity, Number(_end_date), bidAmount, ERC721_ADDRESS);
            const voucher = [_token_id, _etherPrice, auctionType,quantity,endTime, salt]
            try {
                stepsArray.push(1, 2)
                setBidLoading(true)
                const contractTransaction = await contract.functions.bid721(state.account, owner_address, voucher, signature, bidAmount, tokenContract)
                console.log('contractTransaction', contractTransaction);
                const res = await contractTransaction.wait();
                setBidLoading(false)
                console.log('res', res);
                stepsArray.push(3)
                return res
            } catch (error) {
                console.log('finaliseAuction721 1 error', error);
                return null
            }
        }
    }

    const bid721 = async () => {
        // debugger
        try {
            setBuyBtn(true)
            let contractRes = await finaliseAuction(Number(quantity), tokenContract as string, WETH_GOERLI_ADDRESS_KEY, Number(auctionType));
            console.log('contractRes', contractRes);
            (window as any).document.getElementById("btn-close").click()
            setBuyBtn(false)
        } catch (error) {
            console.log('contractRes error', error);
        }
    }

    return (
        <Fragment>
            <div className="container">
                <div className="sign-details shadow  rounded-2 mx-auto">
                    <h1 className="text-center my-3 text-secondary fw-bold">Your Nft Dtails</h1>
                    <h1 className=" text-center text-secondary">Bid NFT</h1>
                    <div className="nft-card">
                        <div className="nft-image text-center ">
                            <img src={`https://ipfs.io/ipfs/${img_cid}`} alt="" className="rounded-3" width="300px" height="300px" />
                        </div>
                        <div className="details m-4">
                            <div className="d-flex">
                                <h5 className="fw-bolder">Owned By:</h5>
                                <h6 className="ms-3 mt-1 text-decoration-underline">{owner_address}</h6>
                            </div>
                            <div className="d-flex">
                                <h5 className="fw-bolder">Salt:</h5>
                                <h6 className="ms-3 mt-1">{salt}</h6>
                            </div>
                            <div className="my-2">
                                <h5 className="fw-bolder">Signature:</h5>
                                <span className="text-decoration-underline">{signature}</span>
                            </div>
                            <div className="d-flex">
                                <h5 className="fw-bolder">TokenContract :</h5>
                                <h6 className="ms-3 mt-1 text-decoration-underline">{tokenContract}</h6>
                            </div>
                            <div className="my-2 d-flex">
                                <h5 className="fw-bolder">Quantity :</h5>
                                <h6 className="ms-3 mt-1 ">{quantity}</h6>
                            </div>
                            <div className="d-flex">
                                <h5 className="fw-bolder">Price :</h5>
                                <h6 className="ms-3 mt-1">{price as any}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="create-a-bid">
                        <div className="Account-addr">
                            Account Addr:-
                            <input type="text" name="account" id="account" className="form-control" onChange={handleState} />
                        </div>
                        <div className="bidding-amount">
                            Bidding Amount:-
                            <input type="number" name="amount" id="amount" className="form-control" onChange={handleState} />
                        </div>
                    </div>
                </div>
                <div className="buy-nft text-center my-3">
                    <div className="buy-nft">
                        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" disabled={buyBtn} onClick={bid721}>{buyBtn ? <Spinner /> : ""}Buy</button>
                    </div>
                </div>
                <div className={`modal fade`} id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true"   >
                    <div className="modal-dialog modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Steps for Buying NFT</h1>
                                <button type="button" className="btn-close" id="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <Modal
                                stepsArray={stepsArray}
                                loading1={amountLoading}
                                loading2={contractLoading}
                                loading3={bidLoading}
                                values={['Calculate Wrapped Amount', "Deposit amount", 'Finalise Auction']}
                            />
                        </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}


