import { ethers } from "ethers"
import { Fragment } from "react"
import { IERC20 } from "../Artifacts/IERC20"

export default () => {
    const ERC20_address = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
const ERC721_ADDRESS = "0xf96cdb86aed0898a8f1aab7158b71b90797e1545"
const MARKETPLACE_ADDRESS = "0xc047A78f99458D56932b761a93D6CfCB13Bd298c"

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
    // console.log(currentAccount);
    const getMyProvider = async () => {
        try {
            const { accounts, eth_chainId, provider }: any = await logintometamask();
            let balanceInWei = await provider.getBalance(accounts[0])
            let gasPriceInWei = await provider.getGasPrice()
            let balanceInEth = ethers.utils.formatEther(balanceInWei)
            let gasPriceInEth = ethers.utils.formatEther(gasPriceInWei)
            console.log('balanceInEth', balanceInEth);
            console.log("gasPriceInEth", gasPriceInEth);
            // setCurrentAccount(accounts[0])
            // setConnectButton("Connected")
            return { provider, accounts, eth_chainId, balanceInEth, gasPriceInEth, error: null }
        } catch (error) {
            console.log("getMyProvider error", error);
            // debugger
            return { error }
        }
    }


    const getContract = async (address: any , abi:any) => {
        const { provider, accounts } = await getMyProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(address , abi, signer);

        return { contract, accounts, provider , signer }
    }


    const calculateWrappedAmount = (price : any, quantity: any, tax : any) => {
        const priceWithQuantity = Number(price) * Number(quantity)
        const priceFee = (priceWithQuantity * Number(tax)) / 100
        const actualPrice = priceFee + Number(priceWithQuantity)
        const commission = actualPrice - Number(priceWithQuantity)
        return { actualPrice, commission }
    }


    const accessERC20 = async (address : any, marketplaceAddr: any) => {
        const abi = IERC20();
        const { contract, accounts, provider, signer} = await getContract(address, abi);
        const allowanceERC20Tx = await contract.allowance(accounts[0], marketplaceAddr)
        const balanceOfERC20Tx = await contract.balanceOf(accounts[0])
        return { allowanceERC20Tx, balanceOfERC20Tx, contract, provider, accounts, signer }
    }

    const wrappedContract = async (actualPrice : any, wrapped:any, marketplaceAddr :any) => {
        const etherPrice = ethers.utils.parseEther(Number(actualPrice).toFixed(18));
        const options = { value: etherPrice }
        const { allowanceERC20Tx, contract, provider,  accounts, signer } = await accessERC20(wrapped, marketplaceAddr)
        const buyPrice = ethers.utils.formatEther(etherPrice)
        const allowancePrice = ethers.utils.formatEther(allowanceERC20Tx)
        debugger
    
        if (Number(buyPrice) > Number(allowancePrice)) {
            const depositERC20Tx = await contract.deposit(options)
            await depositERC20Tx.wait();
            const approvalERC20Tx = await contract.approve(marketplaceAddr, etherPrice)
            await approvalERC20Tx.wait();
        }
        return { contract, accounts, provider, signer }
    }


 

    const buy = async() => {
        const {actualPrice , commission} = calculateWrappedAmount(0.0001 , 1 ,10);
        const wrp = wrappedContract(actualPrice , ERC20_address , MARKETPLACE_ADDRESS,)
        console.log(wrp);
        

    }
    return (<Fragment>
        <div className="container">
        {/* {resState.signature ? <div className="details">
                <h6>Signature: {resState.signature}</h6>
                <h6>Owner: {resState.owner}</h6>
                <h6>Salt: {resState.salt}</h6>
                <h6>MinPrice: {resState.minPrice}</h6>

                <h6>Quantity: {resState.quantity}</h6>
                <h6>EndTime: {resState.endTime}</h6>
                <h6>TokenContract: {resState.tokenContract}</h6>
            </div> : ""
            } */}
        </div>
        <div className="BuyButton">
            <button className="btn btn-primary" onClick={buy}>Buy</button>
        </div>
    </Fragment>
    )
}


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