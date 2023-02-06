import { Fragment, useState } from "react"
import EhisabERC721 from '../Artifacts/EhisabERC721.json'
import { ethers } from "ethers";
import Voucher from "./Utiles/Voucher";
import MARKETPLACE_ARTIFACTS from '../Artifacts/marketpalce.json'
import { ERC721_ADDRESS, getContract, MARKETPLACE_ADDRESS } from "./Utiles/Common";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import dayjs from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';
import { DatePicker } from 'antd';

const stepsArray: Array<number> = []

export default () => {
    const moment = require('moment');
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const imgCid = params.get("img_cid")
    const navigate = useNavigate()
    const [state, setState] = useState(
        {
            price: "",
            nftType: 0 as number,
            endTime: 0,
            // quantity: 0 as number
        }
    )

    const [approveLoading, setApproveLoading] = useState<boolean>(false)
    const [signLoading, setSignLoading] = useState<boolean>(false)
    const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'))

    const handleState = (event: any) => {
        setState({
            ...state,
            [event?.target.name]: event?.target.value
        })
    }

    const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
        return current && current < dayjs().startOf('day');
    }

    const onChange = (date: any) => {
        let date_value = (date.$d)
        let dateValueTimestamp = Math.round(date_value.getTime() / 1000);
        setState({
            ...state,
            endTime: dateValueTimestamp
        })
        setEndDate(moment(date_value).format('YYYY-MM-DD'))
    };

    const requestApprove = async (contract: any, address: string) => {
        try {
            const trasactionRes = await contract.functions.setApprovalForAll(address, true);
            const transactionSuccess = await trasactionRes.wait();
            setApproveLoading(false)
            console.log("requestApprove transactionSuccess", transactionSuccess);
            return transactionSuccess
        } catch (error: any) {
            return null
        }
    }

    const approveMarktplace = async () => {
        setApproveLoading(true)
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

    const signMyToken = async () => {
        stepsArray.push(1)
        setApproveLoading(false)
        setSignLoading(true)
        // debugger
        const abi = MARKETPLACE_ARTIFACTS.abi;
        const { contract, accounts, signer } = await getContract(MARKETPLACE_ADDRESS, abi)
        const ether = ethers.utils.parseEther(Number(state.price).toFixed(18));
        await Voucher.setToken(contract, signer);
        const { signature, salt, owner, minPrice, auctionType, quantity, endTime, tokenContract } = await Voucher.CreateVoucher(accounts[0], Number(state.nftType), Number(1), Number(state.endTime), ether, ERC721_ADDRESS);
        // stepsArray.push(3)
        params.set('signature', signature)
        params.set('owner', owner)
        params.set("salt", salt as any)
        params.set("minPrice", minPrice)
        params.set("auctionType", auctionType)
        params.set("quantity", quantity)
        params.set("endTime", endTime)
        params.set("tokenContract", tokenContract);
        params.set("price", state.price as any);

        console.log(endTime);
        
        // params.set("quantity", state.quantity as any)
        // params.set("royality", state.royality as any);
        stepsArray.push(2)
        setSignLoading(false);
        (window as any).document.getElementById("btn-close").click()
        if(state.nftType==1){
            navigate({ pathname: "/bid", search: params.toString() })
        }else{
            navigate({ pathname: "/buy", search: params.toString() })
        }
    }

    const putOnSale = async () => {
        try {
            await approveMarktplace()
            await signMyToken()
        } catch (error) {
            (window as any).document.getElementById("btn-close").click()
        }
    }

    return <Fragment>

        <div className="container">
            <h1 className="text-center text-secondary">Approve & Sign My Token</h1>
            <div className="nft-image text-center ">
                <img src={`https://ipfs.io/ipfs/${imgCid}`} alt="" className="rounded-3" width="300px" height="300px" />
            </div>
            <div className="price m-2">
                Price:-
                <input type="number" name="price" id="" className="form-control" onChange={handleState} placeholder="Enter Price" />
            </div>
            {/* <div className="price m-2">
                Quantity:-
                <input type="number" name="quantity" id="" className="form-control" onChange={handleState} placeholder="Enter Quantity" />
            </div> */}
            <div className="type m-2">
                Select NFT Type:-
                <select className="form-select" aria-label="Default select example" name="nftType" onChange={handleState} >
                    <option selected value={0} >Select NFT Type</option>
                    <option value={1}>Fixed</option>
                    <option value={2}>Auction</option>
                </select>
            </div>
            {state.nftType == 2 ? <DatePicker
                format='YYYY-MM-DD'
                className='w-100 form-control'
                defaultValue={dayjs(endDate, 'YYYY-MM-DD')}
                disabledDate={disabledDate}
                placeholder='YYYY-MM-DD'
                onChange={onChange}
                inputReadOnly
            /> : ""}
            <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={putOnSale}>Put On Sale</button>
            <div className={`modal fade`} id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true"   >
                <div className="modal-dialog modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Steps For Sign Token</h1>
                            <button type="button" className="btn-close" id="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <Modal
                            stepsArray={stepsArray}
                            loading1={approveLoading}
                            loading2={signLoading}
                            values={["Approve Marketplace", "Sign My Token"]}
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fragment>


}