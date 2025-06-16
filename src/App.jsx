// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import Cart from './pages/cart';
import Address from './pages/myAddress';
import AddAddress from './pages/AddAddres';
import EditAddress from './pages/EditAddres';
<<<<<<< Updated upstream
=======
import PegawaiDashboard from './pages/PegawaiDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CSDashboard from './pages/CSDashboard';
>>>>>>> Stashed changes
import Banner from './components/banner';
import NewArrivalSection from './components/newArrival';
import FormPenitip from './pages/FormPenitip';
import DaftarPenitip from './pages/DaftarPenitip';
<<<<<<< Updated upstream
import OrganisasiDashboard from './pages/OrganisasiDashboard';
import History from './pages/history';
import About from './pages/about';
import PegawaiDashboard from './pages/PegawaiDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CsDashboard from './pages/CsDashboard';
import FormPegawai from './pages/FormPegawai';
import Diskusi from './pages/Diskusi';
import PenitipDashboard from './pages/PenitipDashboard';
import GudangDashboard from './pages/GudangDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
=======
import FormPegawai from './pages/FormPegawai';
import Diskusi from './pages/Diskusi';
import OrganisasiDash from './pages/OrganisasiDashboard';
import ForgotPassword from './pages/ForgotPassword';
import UserForgotPassword from './pages/UserForgotPassword';
import DetailProduk from './pages/DetailProduk';
import Checkout from './pages/Checkout';
import Pembayaran from './pages/Pembayaran';
import UploadBuktiPembayaran from './pages/UploadBuktiPembayaran';
>>>>>>> Stashed changes

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const jabatan = localStorage.getItem(''); // "admin"

  const isAdmin = jabatan === '';

  return (
    <Router>
      <Routes>
        <Route path="/user-forgot-password" element={<UserForgotPassword />} />

        <Route
          path="/*"
          element={
            <>
              {!isAdmin && <Header />}
              <Routes>
                <Route
                  path="/"
                  element={
                    !isAdmin ? (
                      <>
                        <Banner />
                        <NewArrivalSection />
                      </>
                    ) : (
                      <AdminDashboard />
                    )
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/myAddress" element={<Address />} />
                <Route path="/AddAddres" element={<AddAddress />} />
                <Route path="/Editaddres/:id" element={<EditAddress />} />
                <Route path="/cs" element={<CSDashboard />} />
                <Route path="/pegawai" element={<PegawaiDashboard />} />
                <Route path="/tambah-penitip" element={<FormPenitip />} />
                <Route path="/daftar-penitip" element={<DaftarPenitip />} />
                <Route path="/tambah-pegawai" element={<FormPegawai />} />
                <Route path="/diskusi" element={<Diskusi />} />
                <Route path="/Admin" element={<AdminDashboard />} />
                <Route path="/organisasi" element={<OrganisasiDash />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/detailProduk/:id" element={<DetailProduk />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/pembayaran" element={<Pembayaran />} />
                <Route path="/upload/:orderId" element={<UploadBuktiPembayaran />} />
              </Routes>
              {!isAdmin && <Footer />}
            </>
          }
        />
<<<<<<< Updated upstream
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/myAddress" element={<Address />} />
        <Route path="/AddAddres" element={<AddAddress />} />
        <Route path="/Editaddres/:id" element={<EditAddress />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/tambah-penitip" element={<FormPenitip />} />
        <Route path="/daftar-penitip" element={<DaftarPenitip />} />
        <Route path="/organisasi" element={<OrganisasiDashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
        <Route path="/cs" element={<CsDashboard />} />
        <Route path="/pegawai" element={<PegawaiDashboard />} />
        <Route path="/tambah-pegawai" element={<FormPegawai />} />
        <Route path="/diskusi" element={<Diskusi />} />
        <Route path="/CsDashboard" element={<CsDashboard />} />
        <Route path="/penitip" element={<PenitipDashboard />} />
        <Route path="/gudang" element={<GudangDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />


=======
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
};

export default App;
