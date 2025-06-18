import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const UserForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setMessage('Password dan konfirmasi tidak cocok');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/user-forgot-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      setMessage('Password berhasil diubah, silakan login ulang');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Konfirmasi password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <button type="submit">Ubah Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserForgotPassword;