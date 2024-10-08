import logo from './logo.svg';
import './App.css';
import Header from "./componenets/Header"
import Home from "./pages/Home"
import {BrowserRouter, browserRouter,Route,Routes} from "react-router-dom"
import Products from "./pages/Products"
function App() {
  return (<>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/products" element={<Products/>}/>
  </Routes>
  </BrowserRouter>
  </>
    
  );
}

export default App;
