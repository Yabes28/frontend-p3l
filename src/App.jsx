import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Banner from './components/banner';
import NewArrivalSection from './components/newArrival';
import Login from './pages/login';
import Register from './pages/register';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
