import { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import Select from 'react-select'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';
import { ToastContainer, toast } from 'react-toastify';

const config = require('./Apiconfig');

function UserInput({ }) {
  const [user_code, setUser_code] = useState("");
  const [user_name, setUser_name] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [user_password, setUser_password] = useState("");
  const [user_status, setUser_status] = useState("");
  const [log_in_out, setLog_in_out] = useState("");
  const [role_id, setRole] = useState("");
  const [email_id, setEmail_id] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLog, setSelectedLog] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [statusdrop, setStatusdrop] = useState([]);
  const [roleDrop, setRoleDrop] = useState([]);
  const [Genderdrop, setGenderdrop] = useState([]);
  const [Loginoroutdrop, setLoginoroutdrop] = useState([]);
  const [error, setError] = useState("");
  const [user_images, setuser_image] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const usercode = useRef(null);
  const username = useRef(null);
  const firstname = useRef(null);
  const lastname = useRef(null);
  const password = useRef(null);
  const Status = useRef(null);
  const loginlogout = useRef(null);
  const usertype = useRef(null);
  const email = useRef(null);
  const Dob = useRef(null);
  const Gender = useRef(null);
  const ImagE = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const modified_by = sessionStorage.getItem("selectedUserCode");

  const [isUpdated, setIsUpdated] = useState(false);
  const [isSelectGender, setIsSelectGender] = useState(false);
  const [isSelectLog, setIsSelectLog] = useState(false);
  const [isSelectRole, setIsSelectRole] = useState(false);
  const [isSelectStatus, setIsSelectStatus] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  console.log(selectedRow);

  const clearInputFields = () => {
    setUser_code("");
    setUser_name("");
    setFirst_name("");
    setLast_name("");
    setSelectedStatus("");
    setSelectedRole("");
    setSelectedLog("");
    setSelectedGender("");
    setEmail_id("");
    setDob("");
    setSelectedImage("");
    if (ImagE.current) {
      ImagE.current.value = null;
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setUser_code(selectedRow.user_code || "");
      setUser_name(selectedRow.user_name || "");
      setFirst_name(selectedRow.first_name || "");
      setLast_name(selectedRow.last_name || "");
      setUser_password(selectedRow.user_password || "");
      setRole(selectedRow.role_id || "");
      setLog_in_out(selectedRow.log_in_out || "");
      setUser_status(selectedRow.user_status || "");
      setGender(selectedRow.gender || "");
      setSelectedStatus({
        label: selectedRow.user_status,
        value: selectedRow.user_status,
      });
      setSelectedRole({
        label: selectedRow.role_id,
        value: selectedRow.role_id,
      });
      setSelectedLog({
        label: selectedRow.log_in_out,
        value: selectedRow.log_in_out,
      });
      setSelectedGender({
        label: selectedRow.gender,
        value: selectedRow.gender,
      });
      setEmail_id(selectedRow.email_id || "");

      if (selectedRow.dob) {
        const formattedDate = new Date(selectedRow.dob).toISOString().split("T")[0];
        setDob(formattedDate);
      } else {
        setDob("");
      }

      if (selectedRow.user_images && selectedRow.user_images.data) {
        const base64Image = arrayBufferToBase64(selectedRow.user_images.data);
        const file = base64ToFile(`data:image/jpeg;base64,${base64Image}`, 'user_image.jpg');
        setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
        setuser_image(file);
      } else {
        setSelectedImage(null);
        setuser_image(null);
      }

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  const base64ToFile = (base64Data, fileName) => {
    if (!base64Data || !base64Data.startsWith("data:")) {
      throw new Error("Invalid base64 string");
    }

    const parts = base64Data.split(',');
    if (parts.length !== 2) {
      throw new Error("Base64 string is not properly formatted");
    }

    const mimePart = parts[0];
    const dataPart = parts[1];

    const mime = mimePart.match(/:(.*?);/);
    if (!mime || !mime[1]) {
      throw new Error("Could not extract MIME type");
    }

    const binaryString = atob(dataPart);
    const len = binaryString.length;
    const uint8Array = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    const fileBlob = new Blob([uint8Array], { type: mime[1] });
    return new File([fileBlob], fileName, { type: mime[1] });
  };


  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {

        toast.error('File size exceeds 1MB. Please upload a smaller file.')
        event.target.value = null;
        return;
      }
      if (file) {
        setSelectedImage(URL.createObjectURL(file));
        setuser_image(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (ImagE.current) {
      ImagE.current.value = "";
    }
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Loginorout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setLoginoroutdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/gender`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setGenderdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/UserRole`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setRoleDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionRole = roleDrop.map((option) => ({
    value: option.role_id,
    label: option.role_name,
  }));

  const filteredOptionLog = Loginoroutdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionGender = Genderdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setUser_status(selectedStatus ? selectedStatus.value : '');
  };

  const handleChangeRole = (selectedRole) => {
    setSelectedRole(selectedRole);
    setRole(selectedRole ? selectedRole.value : '');
  };

  const handleChangeLog = (selectedLog) => {
    setSelectedLog(selectedLog);
    setLog_in_out(selectedLog ? selectedLog.value : '');
  };

  const handleChangeGender = (selectedGender) => {
    setSelectedGender(selectedGender);
    setGender(selectedGender ? selectedGender.value : '');
  };

  const handleInsert = async () => {
    if (
      !user_code ||
      !user_name ||
      !first_name ||
      !last_name ||
      !user_password ||
      !user_status ||
      !role_id ||
      !email_id ||
      !dob
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    if (!validateEmail(email_id)) {
      toast.warning("Invalid email format.");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
      formData.append("user_code", user_code);
      formData.append("user_name", user_name);
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      formData.append("user_password", user_password);
      formData.append("user_status", user_status);
      formData.append("log_in_out", log_in_out);
      formData.append("email_id", email_id);
      formData.append("dob", dob);
      formData.append("role_id", role_id);
      formData.append("gender", gender);
      formData.append("created_by", sessionStorage.getItem("selectedUserCode"));

      if (user_images) {
        formData.append("user_img", user_images); // Appending the image file
      }

      const response = await fetch(`${config.apiBaseUrl}/useradd`, {
        method: "POST",
        body: formData, // Sending formData
      });

      if (response.ok) {
        toast.success("Data inserted Successfully", {
          onClose: () => clearInputFields()
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error('Failed to insert data');
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleNavigate = () => {
    navigate("/User"); // Pass selectedRows as props to the Input component
  };

  // const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
  //   if (e.key === 'Enter') {
  //     // Check if the value has changed and handle the search logic
  //     if (hasValueChanged) {
  //       await handleKeyDownStatus(e); // Trigger the search function
  //       setHasValueChanged(false); // Reset the flag after the search
  //     }

  //     // Move to the next field if the current field has a valid value
  //     if (value) {
  //       nextFieldRef.current.focus();
  //     } else {
  //       e.preventDefault(); // Prevent moving to the next field if the value is empty
  //     }
  //   }
  // };

  const handleKeyDown = (e, nextRef, currentRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // For update mode, skip to Email from Log In/Out
      if (mode === 'update' && currentRef === loginlogout) {
        email.current?.focus();
      } else {
        nextRef?.current?.focus();
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) { // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };


  const handleUpdate = async () => {
    if (
      !user_code ||
      !user_name ||
      !first_name ||
      !last_name ||
      !user_password ||
      !selectedRole ||
      !email_id ||
      !selectedStatus ||
      !dob
    ) {
      setError(" ");
      toast.warning("Please fill all required fields.");
      return;
    }

    if (!validateEmail(email_id)) {
      toast.warning("Invalid email format.");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
      formData.append("user_code", user_code);
      formData.append("user_name", user_name);
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      formData.append("user_password", user_password);
      formData.append("user_status", selectedStatus.value);
      formData.append("log_in_out", selectedLog.value);
      formData.append("email_id", email_id);
      formData.append("dob", dob);
      formData.append("status", selectedStatus.value);
      formData.append("gender", selectedGender.value);
      formData.append("role_id", selectedRole.value);
      formData.append("modified_by", modified_by);

      if (user_images) {
        formData.append("user_images", user_images);
      }
      const response = await fetch(`${config.apiBaseUrl}/UserUpdates`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Data updated successfully", {
          onClose: () => clearInputFields()
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to Update data");
        toast.error("Failed to Update data");
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">{mode === "update" ? 'Update User' : 'Add User'}</h1>
          <div className="action-wrapper">
            <div className="action-icon delete" onClick={handleNavigate}>
              <span className="tooltip">Close</span>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="ucode"
                class="exp-input-field form-control"
                type="text"
                autoComplete="off"
                placeholder=" "
                required
                value={user_code}
                onChange={(e) => setUser_code(e.target.value)}
                maxLength={18}
                ref={usercode}
                onKeyDown={(e) => handleKeyDown(e, username, usercode)}
                readOnly={mode === "update"}
              />
              <label for="state" className={`exp-form-labels ${error && !user_code ? 'text-danger' : ''}`}>User Code<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="uname"
                class="exp-input-field form-control"
                type="text"
                autoComplete="off"
                placeholder=" "
                required
                value={user_name}
                onChange={(e) => setUser_name(e.target.value)}
                maxLength={250}
                ref={username}
                onKeyDown={(e) => handleKeyDown(e, firstname, username)}
              />
              <label for="state" className={`exp-form-labels ${error && !user_name ? 'text-danger' : ''}`}>User Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fname"
                class="exp-input-field form-control"
                type="text"
                autoComplete="off"
                placeholder=" "
                required
                value={first_name}
                onChange={(e) => setFirst_name(e.target.value)}
                maxLength={250}
                ref={firstname}
                onKeyDown={(e) => handleKeyDown(e, lastname, firstname)}
              />
              <label for="state" class="exp-form-labels" className={`${error && !first_name ? 'text-danger' : ''}`}>First Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="lname"
                class="exp-input-field form-control"
                type="text"
                autoComplete="off"
                placeholder=" "
                required
                value={last_name}
                onChange={(e) => setLast_name(e.target.value)}
                maxLength={250}
                ref={lastname}
                onKeyDown={(e) => handleKeyDown(e, password, lastname)}
              />
              <label for="state" className={`exp-form-labels ${error && !last_name ? 'text-danger' : ''}`}>Last Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="upass"
                class="exp-input-field form-control"
                type="text"
                autoComplete="off"
                placeholder=" "
                required
                value={user_password}
                onChange={(e) => setUser_password(e.target.value)}
                maxLength={50}
                ref={password}
                onKeyDown={(e) => handleKeyDown(e, Status, password)}
              />
              <label for="state" className={`exp-form-labels ${error && !user_password ? 'text-danger' : ''}`}>Password<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectStatus ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
                placeholder=" "
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
                classNamePrefix="react-select"
                isClearable
                maxLength={50}
                ref={Status}
                onKeyDown={(e) => handleKeyDown(e, loginlogout, Status)}
              />
              <label for="state" className={`floating-label ${error && !user_status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedLog ? "has-value" : ""} 
              ${isSelectLog ? "is-focused" : ""}`}
            >
              <Select
                id="loginout"
                value={selectedLog}
                onChange={handleChangeLog}
                options={filteredOptionLog}
                placeholder=" "
                onFocus={() => setIsSelectLog(true)}
                onBlur={() => setIsSelectLog(false)}
                classNamePrefix="react-select"
                isClearable
                maxLength={3}
                ref={loginlogout}
                onKeyDown={(e) => handleKeyDown(e, usertype, loginlogout)}
              />
              <label className="exp-form-labels">Log In/Out</label>
            </div>
          </div>

          {mode !== 'update' && (
            <div className="col-md-3">
              <div
                className={`inputGroup selectGroup 
              ${selectedRole ? "has-value" : ""} 
              ${isSelectRole ? "is-focused" : ""}`}
              >
                <Select
                  id="usertype"
                  value={selectedRole}
                  onChange={handleChangeRole}
                  options={filteredOptionRole}
                  placeholder=" "
                  onFocus={() => setIsSelectRole(true)}
                  onBlur={() => setIsSelectRole(false)}
                  classNamePrefix="react-select"
                  isClearable
                  maxLength={50}
                  ref={usertype}
                  onKeyDown={(e) => handleKeyDown(e, email, usertype)}
                />
                <label for="state" className={`floating-label ${error && !user_status ? 'text-danger' : ''}`}>Role ID<span className="text-danger">*</span></label>
              </div>
            </div>
          )}

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="uemail"
                class="exp-input-field form-control"
                type="email"
                autoComplete="off"
                placeholder=" "
                required
                value={email_id}
                onChange={(e) => setEmail_id(e.target.value)}
                maxLength={150}
                ref={email}
                onKeyDown={(e) => handleKeyDown(e, Dob, email)}
              />
              <label for="state" className={`exp-form-labels ${error && !email_id ? 'text-danger' : ''}`}>Email<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="udob"
                class="exp-input-field form-control"
                type="date"
                autoComplete="off"
                placeholder=" "
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                ref={Dob}
                onKeyDown={(e) => handleKeyDown(e, Gender, Dob)}
              />
              <label for="state" className={`exp-form-labels ${error && !dob ? 'text-danger' : ''}`}>DOB<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedGender ? "has-value" : ""} 
              ${isSelectGender ? "is-focused" : ""}`}
            >
              <Select
                id="gender"
                value={selectedGender}
                onChange={handleChangeGender}
                options={filteredOptionGender}
                placeholder=" "
                onFocus={() => setIsSelectGender(true)}
                onBlur={() => setIsSelectGender(false)}
                classNamePrefix="react-select"
                isClearable
                maxLength={50}
                ref={Gender}
                onKeyDown={(e) => handleKeyDown(e, ImagE, Gender)}
              />
              <label for="gender" className="floating-label">Gender</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <div className="image-upload-container" onClick={() => ImagE.current.click()}>
                {selectedImage ? (
                  <div className="image-preview-box">
                    <img
                      src={selectedImage}
                      alt="Uploaded Signature"
                      className="uploaded-image"
                    />

                    <button
                      type="button"
                      className="delete-image-btn"
                      onClick={handleRemoveImage}
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder-box">
                    <div className="upload-icon-text">
                      <i className="fa-regular fa-image upload-icon me-1"></i>
                      <span>Upload Image</span>
                    </div>
                  </div>
                )}

                <input type="file"
                  className="exp-input-field form-control hidden-file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={ImagE}
                  // onKeyDown={(e) => handleKeyDown(e, ImagE)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const fileInput = ImagE.current;
                      if (fileInput && fileInput.files.length > 0) {
                        if (mode === "update") {
                          handleUpdate();
                        } else {
                          handleInsert();
                        }
                      } else {
                        fileInput.click();
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div class="col-12">
            <div className="search-btn-wrapper">
              {mode === "create" ? (
                <div className="icon-btn save" onClick={handleInsert}>
                  <span className="tooltip">Save</span>
                  <i class="fa-solid fa-floppy-disk"></i>
                </div>
              ) : (
                <div className="icon-btn update" onClick={handleUpdate}>
                  <span className="tooltip">Update</span>
                  <i class="fa-solid fa-pen-to-square"></i>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserInput;