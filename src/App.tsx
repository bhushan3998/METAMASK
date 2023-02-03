import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Buy from './Components/Buy';
import Mint from './Components/Mint';
import Sign from './Components/Sign';

function App() {
  return (
    <>
    

      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Mint />} />
          <Route path='sign' element={<Sign />} />
          <Route path='buy' element={<Buy />} />
  
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
