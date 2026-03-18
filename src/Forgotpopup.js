import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "./ForgotPopup.css";

const ForgotPopup = ({ open, handleClose }) => {
  const [email_id, setemail_id] = useState('');
  const [user_code, setuser_code] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [new_password, setNew_Password] = useState('');
  const [loginError, setLoginError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("popup-overlay")) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [open, handleClose]);

  if (!open) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5500/forgetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_id, user_code }),
      });

      if (response.ok) {
        setOtpSent(true);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        setLoginError("User doesn't exist. Register as a new user");
      }
    } catch (error) {
      console.error('Error:', error.message);
      setLoginError("Internal server error occurred!");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5500/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_id, enteredOtp }),
      });

      if (response.ok) {
        console.log('OTP verified successfully');
        setPassword(true);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        setOtpError("Invalid OTP");
      }
    } catch (error) {
      console.error('Error:', error.message);
      setOtpError("Internal server error occurred!");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === new_password) {
      try {
        const response = await fetch('http://localhost:5500/passwords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email_id, user_password: new_password, user_code }),
        });
        const data = await response.json();
        if (response.ok) {
          handleClose();

          toast.success("Password updated successfully")
          console.log('Password updated successfully');
        } else {

          toast.error("Error updating password")
          console.log('Error updating password');
        }
      } catch (error) {

        toast.error("Error updating password")
        console.log('Error updating password');
      }
    } else {
      setOtpError('Wrong Otp');
      toast.error("Wrong Otp")
    }
  };

  return (
    <div className="forgot-overlay">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="forgot-modal">
        <div className="forgot-header">
          <h5>Verification</h5>
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>
        <hr />

        <div className="forgot-body">
          {password ? (
            <>
              <div className="form-group">
                <label htmlFor="newPassword">Enter New Password</label>
                <input
                  id="newPassword"
                  className="form-control"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  className="form-control"
                  type="password"
                  value={new_password}
                  onChange={(e) => setNew_Password(e.target.value)}
                />
              </div>
              <button className="btn btn-success action-btn" onClick={handlePasswordSubmit}>
                <i className="bi bi-arrow-right-circle"></i>
              </button>
            </>
          ) : otpSent ? (
            <>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  id="otp"
                  className="form-control"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                />
              </div>
              <button className="btn btn-success action-btn" onClick={handleOtpSubmit}>
                <i className="bi bi-arrow-right-circle"></i>
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>User Code</label>
                <input
                  className="form-control"
                  value={user_code}
                  onChange={(e) => setuser_code(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email ID</label>
                <input
                  className="form-control"
                  type="email"
                  value={email_id}
                  onChange={(e) => setemail_id(e.target.value)}
                />
              </div>
              <button className="btn btn-success action-btn" onClick={handleEmailSubmit}>
                <i className="bi bi-check-circle-fill"></i> Verify
              </button>
            </>
          )}

          {/* Error messages */}
          {otpError && <div className="text-danger mt-2">{otpError}</div>}
          {loginError && <div className="text-danger mt-2">{loginError}</div>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPopup;
