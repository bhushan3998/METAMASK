import { ethers } from "ethers"


export const BASE_URL = 'https://staging.acria.market:2083'

export const MARKETPLACE_ADDRESS = "0xD14B3d04b08608c26D39B59A50A65D1D5F590Da8"
export const WETH_GOERLI_ADDRESS_KEY = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
export const ERC721_ADDRESS = "0xf96cdb86aed0898a8f1aab7158b71b90797e1545"

export const ethereumInstalled = () => {
    return (window as any).ethereum
}

export const logintometamask = async () => {
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

export const getMyProvider = async () => {
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


// export const getContract = async (Address: any,abi:any) => {
//     const { provider, accounts } = await getMyProvider()
//     const signer = provider.getSigner()
//     const contract = new ethers.Contract(Address, abi, signer);
//     console.log("getContract contract", contract);
//     return { contract, accounts, provider, signer }
// }

export const getContract = async (address: string, abi: any) => {
    const ethereum = ethereumInstalled()
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(address, abi, signer);
    return { contract, accounts, provider, signer }
}