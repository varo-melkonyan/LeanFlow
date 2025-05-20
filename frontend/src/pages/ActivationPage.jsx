import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ActivateAccount from './pages/ActivateAccount';

const ActivationPage = () => {
  const hasActivated = useRef(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); 
  const [errorMsg, setErrorMsg] = useState('');

useEffect(() => {
  const activate = async () => {
    try {
      const res = await axios.get(`https://leanflow.onrender.com/api/auth/activate/${token}`);
      console.log('✅ Activation response:', res.data);

      if (!hasActivated.current) {
        setStatus('success');
        hasActivated.current = true;

        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      if (!hasActivated.current) {
        setStatus('error');
        setErrorMsg(err.response?.data?.error || 'Unknown error');
      }
    }
  };

  activate();
}, [token, navigate]);



  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {status === 'pending' && <p>🔄 Activating your account...</p>}
      {status === 'success' && (
        <>
          <h2 className="text-2xl font-bold text-green-600 mb-2">✅ Account Activated!</h2>
          <p>You can now login. Redirecting...</p>
        </>
      )}
      {status === 'error' && (
  <>
    <h2 className="text-2xl font-bold text-red-600 mb-2">
      ❌ Activation Failed
    </h2>
    <p>{errorMsg === 'Account already activated'
      ? 'This account is already active. You can log in.'
      : 'This link may be expired or already used.'}
    </p>
  </>
)}
    </div>
  );
};

export default ActivationPage;
