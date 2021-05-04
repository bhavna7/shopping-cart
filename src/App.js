import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import ProductsList from './containers/ProductsList';
import Cart from './containers/Cart';


import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="grid-container">
          <main>
            <Route path="/cart" component={Cart} />
            <Route path="/" component={ProductsList} exact />
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
