import React, { useEffect, useState } from 'react';
import './Topbar2.css'; // Changed CSS file name
import 'bootstrap-icons/font/bootstrap-icons.css';
import logo from './main.png';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import DocumentPdf from './pdf/YJK_ERP_DOCUMENTATION.pdf';
import { ThemeProvider } from './ThemeContext';
import AppContent from './App_content';

// Assuming config is imported from Apiconfig

const TopBar = () => {
  const user_code = sessionStorage.getItem('selectedUserCode');
  const [selectedImage, setSelectedImage] = useState(null);
  const userImageBase64 = sessionStorage.getItem('user_image');
  const userImageSrc = userImageBase64 ? `data:image/png;base64,${userImageBase64}` : null;
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState(sessionStorage.getItem('selectedCompanyName') || '');
  const [locationName, setLocationName] = useState(sessionStorage.getItem('selectedLocationName') || '');
  const shortName = sessionStorage.getItem('selectedShortName');
  const config = require('./Apiconfig'); // Make sure config is defined

  // Redirect to login if not logged in
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login', { replace: true });
    window.history.pushState(null, null, window.location.href);
  };

  // Back button handling remains the same...
  useEffect(() => {
    const handleBackButton = () => {
      window.history.pushState(null, null, window.location.href);
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const handlesetting = () => {
    navigate("/Settings")
  }

  const handleAccount = () => {
    navigate("/AccountInformation")
  }

  // File and Image handlers remain the same...
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;

      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'File size exceeds 1MB. Please upload a smaller file.',
          confirmButtonText: 'OK'
        });
        return;
      }

      Swal.fire({
        title: 'Do you want to change your profile picture?',
        text: "You selected a new image. Do you want to save it?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
      }).then((result) => {
        if (result.isConfirmed) {
          setSelectedImage(file);
          handleSaveImage(file);
          handleInsert(file);
        } else {
          e.target.value = null;
        }
      });
    }
  };

  const handleSaveImage = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        sessionStorage.setItem('user_image', reader.result.split(',')[1]);
        setSelectedImage(null);

        Swal.fire(
          'Changed!',
          'Your profile picture has been updated.',
          'success'
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsert = async (file) => {
    try {
      const formData = new FormData();
      formData.append("user_code", user_code);
      if (file) {
        formData.append("user_img", file);
      }

      const response = await fetch(`${config.apiBaseUrl}/UpdateUserImage`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          Swal.fire({
            title: "Success",
            text: "Data inserted successfully!",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          })
        }, 1000);
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        Swal.fire({
          title: 'Error!',
          text: errorResponse.message,
          icon: 'error',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        console.error("Failed to insert data");
        Swal.fire({
          title: 'Error!',
          text: 'Failed to insert data',
          icon: 'error',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Error inserting data: ' + error.message,
        icon: 'error',
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      console.log('sessionStorage has changed!');
      setCompanyName(sessionStorage.getItem('selectedCompanyName') || '');
      setLocationName(sessionStorage.getItem('selectedLocationName') || '');
    };

    window.addEventListener('storageUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storageUpdate', handleStorageChange);
    };
  }, []);

  const handleOpenPDF = () => {
    window.open(DocumentPdf, '_blank');
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark Topnav">
      <div className="container-fluid">

        {/* 1. Logo and App Name */}
        <a className="navbar-brand d-flex align-items-center">
          {/* <img src={logo} alt="Logo" width="40" height="40" className="d-inline-block align-top logo-img" />
          <b className="app-name">
            <sub>
              <sub>
                <i>
                  <span className="hcm-text">HCM</span>
                </i>
              </sub>
            </sub>
          </b> */}
        </a>

        {/* 2. Right-aligned Content */}
        <div className="d-flex align-items-center topbar-right-content">

          {/* Company and Location Info - Hidden on very small screens */}
          <div className="d-none d-sm-block"></div>
          <div className="company-info d-none d-sm-block mb-2 text-center">
            <p className="company-name-text mb-0">{companyName}</p>
            <span className="location-name-text">{locationName}</span>
          </div>

          {/* Short Name and Location Info - Shown on very small screens */}
          <div className="d-sm-none"></div>
          <div className="company-info-mobile d-sm-none text-center">
            <p className="company-name-text-mobile mb-0">{shortName}</p>
            <span className="location-name-text-mobile">{locationName}</span>
          </div>

          {/* Welcome Message */}
          <div className="welcome-message d-none d-md-block">
            <p className="text-white mb-0">Welcome, {user_code}</p>
          </div>

          {/* Profile Dropdown */}
          <div className="profile-dropdown ms-3 mt-4">
            <a
              className="nav-link dropdown-toggle p-0"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {userImageSrc ? (
                <img
                  src={userImageSrc}
                  alt="User Avatar"
                  width="35"
                  height="35"
                  className="profile-avatar rounded-circle position-relative"
                  title={user_code}
                />
              ) : (
                <div
                  className="avatar-placeholder rounded-circle position-relative"
                  title={user_code}
                >
                  {user_code ? user_code.charAt(0) : 'U'}
                </div>
              )}
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li style={{ cursor: "pointer" }}>
                <a className="dropdown-item" onClick={handleAccount}>List of Companies</a>
              </li>
              <li style={{ cursor: "pointer" }}>
                <a className="dropdown-item" onClick={handlesetting}>Settings</a>
              </li>
              <li>
                <label className="dropdown-item" style={{ cursor: "pointer" }}>
                  Change Profile Picture
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              </li>
              {selectedImage && (
                <li style={{ cursor: "pointer" }}>
                  <button className="dropdown-item" onClick={handleSaveImage}>
                    Save Image
                  </button>
                </li>
              )}
              <li style={{ cursor: "pointer" }}>
                <a className="dropdown-item" onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>

          {/* Theme Dropdown */}
          <div className="dropdown theme-dropdown d-md-block ms-3">
            <a
              className="text-white p-0 theme-icon-link"
              href="#"
              id="dropdownMenuButton"
              role="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Change Theme"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-droplet-fill" viewBox="0 0 16 16">
                <path d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6M6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13" />
              </svg>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
              <ThemeProvider>
                <AppContent />
              </ThemeProvider>
            </ul>
          </div>

          {/* Help/Documentation */}
          <div className="help-icon ms-3">
            <a
              className="text-white p-0 theme-icon-link"
              style={{ cursor: "pointer" }}
              onClick={handleOpenPDF}
              title='Help / Documentation'
            >
              <i className="fas fa-question-circle fa-lg"></i>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;