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
import AdminDashboard from './pages/AdminDashboard';
import Banner from './components/banner';
import NewArrivalSection from './components/newArrival';
import FormPenitip from './pages/FormPenitip';
import DaftarPenitip from './pages/DaftarPenitip';
import OrganisasiDashboard from './pages/OrganisasiDashboard';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const jabatan = localStorage.getItem('jabatan'); // "admin"

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
        <Route path="/tambah-penitip" element={<FormPenitip />} />
        <Route path="/daftar-penitip" element={<DaftarPenitip />} />
        <Route path="/organisasi" element={<OrganisasiDashboard />} />
      </Routes>
      {!isAdmin && <Footer />}
    </Router>
  );
};

export default App;
