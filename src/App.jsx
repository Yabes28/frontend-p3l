import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Banner from './components/banner';
import NewArrivalSection from './components/newArrival';
import Login from './pages/login';
import Register from './pages/register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './pages/profile';
import Cart from './pages/cart';
import Address from './pages/myAddress';
import AddAddress from './pages/AddAddres';
import EditAddress from './pages/EditAddres';


function App() {
  return (
    <Router>
      <Header />
      
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <NewArrivalSection />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/myAddress" element={<Address />} />
        <Route path="/AddAddres" element={<AddAddress />} />
        <Route path="/Editaddres/:id" element={<EditAddress />} />

      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
