import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Product from './Product';
import ProductDetailPage from './ProductDetailPage';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Product />
      <ProductDetailPage />
    </>
  );
}

export default App;
