import logo from './logo.svg';
import './App.css';
import Header from "./components/Header"
import Home from "./pages/Home"
import {BrowserRouter, browserRouter,Route,Routes} from "react-router-dom"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Login from './pages/LoginPage';
function App() {
  return (<>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/products" element={<Products/>}/>
    <Route path="/product/:id" element={<ProductDetails/>}/>
    <Route path="/Login" element={<Login/>}/>

  </Routes>
  </BrowserRouter>
  </>
    
  );
}

export default App;
