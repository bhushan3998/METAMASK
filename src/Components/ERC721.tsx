import { ethers } from "ethers"
import { Fragment } from "react"
import EhisabERC721 from '../Artifacts/EhisabERC721.json'
import Erc1155 from "../Artifacts/Erc1155.json"
export default () => {


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
    const getMyProvider = async () => {
        try {
            const { accounts, eth_chainId, provider }: any = await logintometamask();
            let balanceInWei = await provider.getBalance(accounts[0])
            
            
            let gasPriceInWei = await provider.getGasPrice()
            
            let balanceInEth = ethers.utils.formatEther(balanceInWei)
            let gasPriceInEth = ethers.utils.formatEther(gasPriceInWei)
            console.log('balanceInEth', balanceInEth);
            console.log("gasPriceInEth" , gasPriceInEth);
            return { provider, accounts, eth_chainId, balanceInEth, gasPriceInEth, error: null }
        } catch (error) {
            console.log("getMyProvider error", error);
            // debugger
            return { error }
        }
    }
    const getERC721Contract = async () => {
        const abi = EhisabERC721.abi;

        console.log(abi);
        const { provider, accounts, eth_chainId, balanceInEth, gasPriceInEth } = await getMyProvider()
        const signer = provider.getSigner()
        const tx = signer.sendTransaction({
            to: "0xC15AaEE5434Ff45F4222d84284d828e49DbbB0e3",
            value: ethers.utils.parseEther("0.010")
        });

        const contract = new ethers.Contract('0xC15AaEE5434Ff45F4222d84284d828e49DbbB0e3', abi, signer);
        return { contract, provider, accounts, eth_chainId, balanceInEth, gasPriceInEth }
    }

    // const getERC1155Contract = async () => {
    //     const abi = Erc1155.abi;
    //     const { provider, accounts } = await getMyProvider()
    //     const signer = provider.getSigner()
    //     console.log(signer);
    //     const contract = new ethers.Contract('0xf96cdb86aed0898a8f1aab7158b71b90797e1545', abi, signer);
    //     return { contract, accounts }
    // }

    // console.log(Erc1155.abi);



    // const mintNow = async () => {
    //     const { contract, provider, accounts, eth_chainId, balanceInEth, gasPriceInEth } = await getERC721Contract();
    //     const contractRes = await contract.functions.mint('0x8bEd31ED78De116Fc85CBAc7B1e6f609c721ba17', 10)
    //     console.log('contractRes', contractRes);
    //     const waitRes = await contractRes.wait()
    //     console.log('waitRes', waitRes);
    //     // debugger

    // }

    // const Name = async () => {
    //     const {contract } = await getERC721Contract();
    //     const contractRes = await contract?.functions?.name()
    //     console.log('contractRes' , contractRes);
    //     // const waitRes = await contractRes?.wait()
    //     // console.log('wait', waitRes);
    // }


    // const Balance = async () => {
    // const {contract } = await getERC721Contract();
    // const contractRes = await contract?.functions?.balanceOf('0xf96cdb86aed0898a8f1aab7158b71b90797e1545')
    // console.log('contractRes' , contractRes);
    // const waitRes = await contractRes?.wait()1
    //     console.log('wait', waitRes);
    // }

    // const TokenID = async () => {
    //     const {contract } = await getERC721Contract();
    //     const contractRes = await contract?.functions?.ownerOf('70')
    //     console.log('contractRes' , contractRes);
    //     // const waitRes = await contractRes?.wait()
    //     // console.log('wait', waitRes);
    // }


    // const Symbol = async () => {
    //     const { contract } = await getERC721Contract();
    //     const contractRes = await contract?.functions?.symbol()
    //     console.log('contractRes', contractRes);
    //     // const waitRes = await contractRes?.wait()
    //     // console.log('wait', waitRes);
    // }

    // const Transfer = async () => {
    //     const { contract , accounts } = await getERC721Contract();
    //     const transferBalance = await contract?.event?.Transfer("0x8bed31ed78de116fc85cbac7b1e6f609c721ba17" , '0x1f961528976D029ec776574CF0c0F125D79404DF' , 10)
    //     console.log(transferBalance);
        




        
    //     // const tokenUnits = await contract?.functions?.decimals();
    //     // console.log("tokenUnits" ,tokenUnits);
    //     // const tokenName = await contract?.functions?.name();
    //     // console.log("tokenName" , tokenName);
    //     // const tokenBalance = await contract?.functions?.balanceOf('0xf96cdb86aed0898a8f1aab7158b71b90797e1545');     
    //     // console.log("tokenBalance" ,tokenBalance);
            
    
    //     // const tokenBalanceInEther = ethers.utils.formatUnits(tokenBalance);
        
    //     // const contractRes = await contract?.functions?.tokenURI('5853')
    //     // console.log('contractRes', contractRes);
    //     // const waitRes = await contractRes?.wait()
    //     // console.log('wait', waitRes);
    // }

    return <Fragment>
        <div className="text-center d-flex">
            <button className="btn btn-primary m-5" onClick={logintometamask}>Connect To MetaMask</button>
            <button className="btn btn-primary m-5" onClick={getERC721Contract}>Mint Now</button>
        </div>
    </Fragment>
}