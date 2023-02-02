import { Fragment, useState } from "react"
import EhisabERC721 from '../Artifacts/EhisabERC721.json'
import { ethers } from "ethers";
import Voucher from "./Utiles/Voucher";
import MARKETPLACE_ARTIFACTS from '../Artifacts/marketpalce.json'
import { ERC721_ADDRESS, getContract, MARKETPLACE_ADDRESS } from "./Utiles/Common";

export default () => {

    const [state , setState] = useState(
        {
            price:"",
            nftType:""
        }
    )

    const params = new URLSearchParams()
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
        // setMintLoading(false)
        // stepsArray.push(1)
        // setApproveLoading(true)
        const abi = EhisabERC721.abi;
        try {
            const { contract, accounts } = await getContract(ERC721_ADDRESS , abi);
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
        // setApproveLoading(false)
        // stepsArray.push(2)
        // setSignLoading(true)
        // debugger
        const abi = MARKETPLACE_ARTIFACTS.abi;
        const { contract, accounts, signer } = await getContract(MARKETPLACE_ADDRESS ,abi)
        const ether = ethers.utils.parseEther(Number(state.price).toFixed(18));
        await Voucher.setToken(contract, signer);
        const { signature, salt, owner, minPrice, auctionType, quantity, endTime, tokenContract } = await Voucher.CreateVoucher(accounts[0], 1, Number(1), 0, ether, ERC721_ADDRESS);
        // stepsArray.push(3)
        // setResState({
        //     ...resState,
        //     signature: signature,
        //     owner: owner,
        //     salt: salt,
        //     minPrice: formatEther(minPrice),
        //     auctionType: auctionType,
        //     quantity: quantity,
        //     endTime: endTime,
        //     tokenContract: tokenContract,
        // })

       
        params.set('signature', signature)
        params.set('owner', owner)
        params.set("salt", salt as any)
        params.set("minPrice", minPrice)
        params.set("auctionType", auctionType)
        params.set("quantity", quantity)
        params.set("endTime", endTime)
        params.set("tokenContract", tokenContract);
        // params.set("price", state.price as any);
        // params.set("royality", state.royality as any);

        (window as any).document.getElementById("btn-close").click()
        // navigate({ pathname: "/buy", search: params.toString() })
        // setSignLoading(false)
    }

    const putOnSell = async() => {
            await approveMarktplace()
            await signMyToken()

    } 

    return<Fragment>



        </Fragment>
        
    
}