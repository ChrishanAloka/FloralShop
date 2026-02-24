import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ConfigProvider } from './context/ConfigContext';
import { NotificationProvider } from './context/NotificationContext';
import { PWAProvider } from './context/PWAContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CustomBouquetPage from './pages/CustomBouquetPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '60vh' }}>{children}</main>
      <Footer />
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
        <NotificationProvider>
          <PWAProvider>
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
                      <Route path="notifications" element={<NotificationsPage />} />
                      <Route path="login" element={<LoginPage />} />
                      <Route path="signup" element={<SignUpPage />} />
                      <Route path="*" element={<div className="text-center py-5"><h2 style={{ fontFamily: 'var(--font-display)' }}>🌸 Page not found</h2></div>} />
                    </Routes>
                  </Layout>
                } />
              </Routes>
            </CartProvider>
          </PWAProvider>
        </NotificationProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}