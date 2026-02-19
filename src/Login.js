import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import './loginsass.scss'
import ForgotPopup from "./Forgotpopup";
import login from './Images/login.svg'

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
  const [isPageLoading, setIsPageLoading] = useState(false);


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
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);

    try {
      const encryptedUserCode = CryptoJS.AES.encrypt(user_code, secretKey).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(user_password, secretKey).toString();

      console.log("encryptedUserCode", encryptedUserCode)
      console.log("encryptedPassword", encryptedPassword)

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

        if (user_images && user_images.data) {
          const userImageBase64 = arrayBufferToBase64(user_images.data);
          sessionStorage.setItem('user_image', userImageBase64);
          console.log("Stored Image in sessionStorage:", sessionStorage.getItem('user_image'));
        }

        console.log('Login successful');
        sessionStorage.setItem('isLoggedIn', true);
        sessionStorage.setItem('user_code', user_code);
        sessionStorage.setItem('role_id', role_id);
        sessionStorage.setItem('userEmailId', email_id)

        await UserPermission(role_id);
        await fetchUserData(user_code);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        setLoginError(errorData.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setLoginError('Internal server error occurred!');
    } finally {
      setIsPageLoading(false);
    }
  };



  const UserPermission = async (role_id) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getUserPermission`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role_id }),
      });

      if (response.ok) {
        const data = await response.json();

        sessionStorage.setItem('permissions', JSON.stringify(data));
        const storedPermissions = JSON.parse(sessionStorage.getItem('permissions'));
        console.log('Stored permissions:', storedPermissions);

        window.dispatchEvent(new Event("permissionsUpdated"));

      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getusercompany`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_code })
      });

      if (response.ok) {
        const searchData = await response.json();
        if (searchData.length > 0) {
          const { user_code, user_name, company_no, company_name, location_name, location_no } = searchData[0];
          handleSave(searchData[0]);

          navigate('/AccountInformation');

          // window.location.reload();

        } else {
          console.log("Data not found");
        }
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
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

  const [loading, setLoading] = useState(false);

  return (
    <>
      {isPageLoading}
      <div className="login-page">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>

        <div className="main-container">

          {/* LEFT DESIGN PANEL */}
          <div className="design-panel">
            <div className="welcome-section">
              <h1 className="welcome-heading">
                WELCOME TO <br />
                <span className="booky-text">YJK</span>
              </h1>
            </div>

            <div className="illustration-placeholder">
              <img src={login} alt="Login" />
            </div>
          </div>

          <div className="signup-panel login-input-area">
            <h2 className="signup-title">Login</h2>

            <form className="signup-form" onSubmit={handleLogin}>

              <label htmlFor="email" className="input-label">User Code</label>
              <input
                type="text"
                id="email"
                placeholder="User Code"
                autoComplete="off"
                value={user_code}
                onChange={(e) => setuser_code(e.target.value)}
                required
              />

              <label htmlFor="password" className="input-label">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  placeholder="Password"
                  autoComplete="off"
                  type={showPassword ? "text" : "password"}
                  value={user_password}
                  onChange={(e) => setuser_password(e.target.value)}
                  required
                />

                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </span>
              </div>

              {showCapsLockWarning && isCapsLockOn && (
                <div style={{ color: "red", padding: "5px" }}>Caps Lock is on</div>
              )}

              {loginError && (
                <div style={{ color: "red", padding: "5px" }}>{loginError}</div>
              )}

              <div className="form-options">
                <div className="remember-me-container">
                  <input type="checkbox" id="remember-me" className="custom-checkbox" />
                  <label htmlFor="remember-me" className="checkbox-label">Remember Me</label>
                </div>

                <a onClick={handleClick} className="forgot-password-link">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className={`create-account-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    Please Wait
                    <span className="spinner"></span>
                  </>
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>

            <ForgotPopup open={open} handleClose={handleClose} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;