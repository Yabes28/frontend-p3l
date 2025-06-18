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
import Banner from './components/banner';
import NewArrivalSection from './components/newArrival';
import FormPenitip from './pages/FormPenitip';
import DaftarPenitip from './pages/DaftarPenitip';
import OrganisasiDashboard from './pages/OrganisasiDashboard';
import History from './pages/history';
import About from './pages/about';
import PegawaiDashboard from './pages/PegawaiDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PenitipList from './pages/PenitipList';
import CsDashboard from './pages/CsDashboard';
import FormPegawai from './pages/FormPegawai';
import Diskusi from './pages/Diskusi';
import PenitipDashboard from './pages/PenitipDashboard';
import GudangDashboard from './pages/GudangDashboard';
import NotaPenitipan from './pages/NotaPenitipan';
import TopRatedProducts from './pages/TopRatedProducts';
import BuyerTransactionHistory from './pages/BuyerTransactionHistory';
import Merchandise from './pages/Merchandise';
import LaporanPenjualanBulanan from './pages/LaporanPenjualanBulanan';
import LaporanKomisiBulanan from './pages/LaporanKomisiBulanan';
import LaporanStokGudang from './pages/LaporanStokGudang';
import ClaimReport from './pages/claimReport';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const jabatan = localStorage.getItem('tipe_akun'); // "admin"

  const isAdmin = jabatan === 'admin';

  return (
    <Router>
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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/penitip-list" element={<PenitipList />} />
        <Route path="/tambah-penitip" element={<FormPenitip />} />
        <Route path="/daftar-penitip" element={<DaftarPenitip />} />
        <Route path="/organisasi" element={<OrganisasiDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
        <Route path="/cs-dashboard" element={<CsDashboard />} />
        <Route path="/" element={<CsDashboard />} />
        <Route path="/data-penitip" element={<CsDashboard />} />
        <Route path="/semua-penukaran-merchandise" element={<CsDashboard />} />
        <Route path="/pegawai" element={<PegawaiDashboard />} />
        <Route path="/tambah-pegawai" element={<FormPegawai />} />
        <Route path="/diskusi" element={<Diskusi />} />
        <Route path="/CsDashboard" element={<CsDashboard />} />
        <Route path="/penitip" element={<PenitipDashboard />} />
        <Route path="/gudang" element={<GudangDashboard />} />
        <Route path="/gudang/nota-penitip" element={<NotaPenitipan />} />
        <Route path="/top-rated" element={<TopRatedProducts />} />
        <Route path="/buyer-history" element={<BuyerTransactionHistory />} />
        <Route path="/merchandise" element={<Merchandise />} />
        <Route path="/laporan-penjualan-bulanan" element={<LaporanPenjualanBulanan />} />
        <Route path="/laporan-komisi-bulanan" element={<LaporanKomisiBulanan />} />
        <Route path="/laporan-stok-gudang" element={<LaporanStokGudang />} />
        <Route path="/claim-report" element={<ClaimReport />} />
        
      </Routes>
      {!isAdmin && <Footer />}
    </Router>
  );
};

export default App;
