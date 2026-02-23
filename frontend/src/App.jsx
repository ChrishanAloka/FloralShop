import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ConfigProvider } from './context/ConfigContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CustomBouquetPage from './pages/CustomBouquetPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

function AdminLayout() {
  return <AdminPage />;
}

export default function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Admin routes — no shared navbar */}
            <Route path="/admin/*" element={<AdminLayout />} />

            {/* Main site routes */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route index element={<HomePage />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="custom-bouquet" element={<CustomBouquetPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="*" element={<div className="text-center py-5"><h2 style={{ fontFamily: 'var(--font-display)' }}>🌸 Page not found</h2></div>} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}