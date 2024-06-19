import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Product from './Product';
import ProductDetailPage from './ProductDetailPage';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import ProductDetail from './ProductDetail';
import ProductPage from './ProductPage';

function App() {
  return (
    <>
      <Product />
    </>
  );
}

export default App;
