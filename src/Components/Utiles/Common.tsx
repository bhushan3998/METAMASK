import { ethers } from "ethers"

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

export default  {
    ethereumInstalled,
    logintometamask
}