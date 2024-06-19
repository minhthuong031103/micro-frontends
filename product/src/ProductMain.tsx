import React from 'react';
import { Router, Routes } from 'react-router-dom';

const ProductMain = () => {
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
};

export default ProductMain;
