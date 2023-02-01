import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Buy from './Components/Buy';
import BuyingNFT from './Components/BuyingNFT';
import BuyOrSell from './Components/BuyOrSell';
import ERC721 from './Components/ERC721';
import Example from './Components/Example';
import MetaMaskWallet from './Components/MetaMaskWallet';
import MintNow from './Components/MintNow';

function App() {
  return (
    <>
    

      <BrowserRouter>
        <Routes>

          <Route path='/' element={<ERC721 />} />
          <Route path='buy' element={<Buy />} />

        {/* <Route path='/buyingnft' element={<BuyingNFT />} /> */}
          <Route path='metamaskwallet' element={<MetaMaskWallet />} />
          <Route path='mintnow' element={<MintNow />} />
          <Route path='buyorsell' element={<BuyOrSell />} />
          <Route path='example' element={<Example />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
