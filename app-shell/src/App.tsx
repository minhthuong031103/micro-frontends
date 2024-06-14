import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import Layout from './Layout';
import Product from 'product/Product';
import Order from 'order/Order';
export default function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Home</div>} />
          <Route path="/products" element={<Product />} />
          <Route path="/orders" element={<Order />} />
        </Route>
      </Routes>
    </Router>
  );
}
