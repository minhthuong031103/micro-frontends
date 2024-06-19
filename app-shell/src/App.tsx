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
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
export default function App() {
  const { jwt } = useContext(AuthContext);
  console.log('🚀 ~ App ~ jwt:', jwt);
  return (
    <Router basename="/">
      <Routes>
        {!jwt ? (
          <Route path="/">
            <Route index element={<Navigate to="/login" />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/products" />} />
            <Route path="products" element={<Product />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<Order />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}
