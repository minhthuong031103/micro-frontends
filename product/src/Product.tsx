import { Toaster } from 'react-hot-toast';
import ProductPage from './ProductPage';
import { AuthContext, AuthProvider } from 'app_shell/AuthContext';
export default function Product() {
  return (
    <div className=" ">
      <AuthProvider>
        <Toaster />
        <ProductPage />
      </AuthProvider>
    </div>
  );
}
