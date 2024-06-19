import OrderPage from './OrderPage';
import { AuthContext, AuthProvider } from 'app_shell/AuthContext';

import { Toaster } from 'react-hot-toast';

export default function Order() {
  return (
    <div className=" ">
      <AuthProvider>
        <Toaster />

        <OrderPage />
      </AuthProvider>
    </div>
  );
}
