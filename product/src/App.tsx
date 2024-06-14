import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Product from './Product';

function App() {
  const [count, setCount] = useState(0);

  return <Product />;
}

export default App;
