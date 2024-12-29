// src/hooks/useAuth.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpUser, loginUser } from '../../api/userApi';
import { signUpUserWithGoogle }from '../../api/authApi';

export const useAuth = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSignupSubmit = async (data) => {
    try {
      await signUpUser(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Sign up failed:', err.message);
      setError(err.message);
    }
  };

  const onLoginSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.message);
      setError(err.message);
    }
  };

  const handleSignupWithGoogle = async () => {
    try {
      const data = await signUpUserWithGoogle();
      window.location.href = data.url;
    } catch (err) {
      console.error('Sign up with Google failed:', err.message);
      setError(err.message);
    }
  };

  return {
    onSignupSubmit,
    onLoginSubmit,
    handleSignupWithGoogle,
    error,
  };
};

