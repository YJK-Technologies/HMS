import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import './loginsass.scss'
import Doctor from './Images/Medicine2.svg';
import ForgotPopup from "./Forgotpopup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

const Login = () => {
  const navigate = useNavigate();
  const [user_code, setuser_code] = useState('');
  const [user_password, setuser_password] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [showCapsLockWarning, setShowCapsLockWarning] = useState(false);
  const [loading, setLoading] = useState(false);


  const secretKey = 'yjk26012024';

  useEffect(() => {
    const handleCapsLock = (e) => {
      if (e instanceof KeyboardEvent && e.getModifierState('CapsLock')) {
        setIsCapsLockOn(true);
        setShowCapsLockWarning(true);
        setTimeout(() => setShowCapsLockWarning(false), 2000);
      } else {
        setIsCapsLockOn(false);
        setShowCapsLockWarning(false);
      }
    };

    window.addEventListener('keydown', handleCapsLock);
    window.addEventListener('keyup', handleCapsLock);

    return () => {
      window.removeEventListener('keydown', handleCapsLock);
      window.removeEventListener('keyup', handleCapsLock);
    };
  }, []);


  const arrayBufferToBase64 = (arrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading before anything begins

    try {
      const encryptedUserCode = CryptoJS.AES.encrypt(user_code, secretKey).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(user_password, secretKey).toString();

      const response = await fetch(`${config.apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_code: encryptedUserCode,
          user_password: encryptedPassword
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const [{ user_code, role_id, user_images, email_id }] = data;

        // Store image if exists
        if (user_images && user_images.data) {
          const userImageBase64 = arrayBufferToBase64(user_images.data);
          sessionStorage.setItem('user_image', userImageBase64);
        }

        // Store basic user info
        sessionStorage.setItem('isLoggedIn', true);
        sessionStorage.setItem('user_code', user_code);
        sessionStorage.setItem('role_id', role_id);
        sessionStorage.setItem('userEmailId', email_id);

        // Run all required functions sequentially
        await UserPermission(role_id);
        await fetchUserData(user_code);

        // Navigate after everything finishes
        navigate('/HMSDashboard');

      } else {
        const errorData = await response.json();
        setLoginError(errorData.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setLoginError('Error:', error.message);
    } finally {
      setLoading(false); // End loading only when everything is done
    }
  };

  const UserPermission = async (role_id) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getUserPermission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('permissions', JSON.stringify(data));
        window.dispatchEvent(new Event("permissionsUpdated"));
      } else {
        const errorData = await response.json();
        setLoginError('Error:', errorData.message);
      }
    } catch (error) {
      setLoginError('Error:', error.message);
    }
  };

  const fetchUserData = async (user_code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getusercompany`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_code })
      });

      if (response.ok) {
        const searchData = await response.json();
        handleSave(searchData[0]);
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        setLoginError(errorResponse.message);
      }
    } catch (error) {
      setLoginError("Error fetching search data:", error);
    }
  };

  const handleSave = (data) => {
    if (data) {
      sessionStorage.setItem('selectedCompanyCode', data.company_no);
      sessionStorage.setItem('selectedCompanyName', data.company_name);
      sessionStorage.setItem('selectedLocationCode', data.location_no);
      sessionStorage.setItem('selectedLocationName', data.location_name);
      sessionStorage.setItem('selectedShortName', data.short_name);
      sessionStorage.setItem('selectedUserName', data.user_name);
      sessionStorage.setItem('selectedUserCode', data.user_code);
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="page-wrapper">
      {loading && <LoadingScreen />}
      <div className="login-container">
        <div className="left-section">
          <img
            src={Doctor}
            alt="Doctor and Nurse"
            className="illustration-img"
          />
        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >
          <h2>WELCOME!</h2>

          {loginError && (
            <div style={{ color: 'red', padding: '1px' }}>{loginError}</div>
          )}

          <input
            type="text"
            placeholder="Your Usercode"
            autoComplete="off"
            value={user_code}
            onChange={(e) => setuser_code(e.target.value)}
          />

          <div className="password-wrapper">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={user_password}
              onChange={(e) => setuser_password(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {showCapsLockWarning && isCapsLockOn && (
            <div style={{ color: 'red', padding: '5px' }}>Caps Lock is on</div>
          )}

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>

          <a className="forgot-link" onClick={handleClick}>
            Forgot your password?
          </a>

          <ForgotPopup open={open} handleClose={handleClose} />
        </form>
      </div>
    </div>
  );
};


export default Login;