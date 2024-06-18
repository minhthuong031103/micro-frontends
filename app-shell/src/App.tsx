import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import Layout from './Layout';
import Product from 'product/Product';
import ProductDetail from 'product/ProductDetail';
import Order from 'order/Order';
import { Toaster } from 'react-hot-toast';
import LoginPage from './LoginPage';
import { RegisterPage } from './RegisterPage';
export default function App() {
  return (
    <Router basename="/">
      <Routes>
        {/* <Route path="/">
          <Route index element={<Navigate to="/login" />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route> */}

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/products" />} />
          <Route path="products" element={<Product />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="/orders" element={<Order />} />
        </Route>
      </Routes>
    </Router>
  );
}
