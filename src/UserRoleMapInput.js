import { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from 'react-select'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from "react-router-dom";
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function UserRoleInput({ }) {
  const [user_code, setuser_code] = useState("");
  const [role_id, setrole_id] = useState("");
  const [usercodedrop, setusercodedrop] = useState([]);
  const [roleiddrop, setroleiddrop] = useState([]);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();
  const usercode = useRef(null);
  const roleid = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelectUser, setIsSelectUser] = useState(false);
  const [isSelectRole, setIsSelectRole] = useState(false);

  const modified_by = sessionStorage.getItem("selectedUserCode");

  const [isUpdated, setIsUpdated] = useState(false);
  const [keyfield, setKeyfield] = useState('');
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  console.log(selectedRow);

  const clearInputFields = () => {
    setSelectedUser("");
    setSelectedRole("");

  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setuser_code(selectedRow.user_code || "");
      setrole_id(selectedRow.order_no || "");
      setKeyfield(selectedRow.keyfield || "");
      setSelectedUser({
        label: selectedRow.user_code,
        value: selectedRow.user_code,
      });
      setSelectedRole({
        label: selectedRow.role_id,
        value: selectedRow.role_id,
      });

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/usercode`)
      .then((data) => data.json())
      .then((val) => setusercodedrop(val));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/roleid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setroleiddrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionUser = usercodedrop.map((option) => ({
    value: option.user_code,
    label: `${option.user_code} - ${option.user_name}`,
  }));

  const filteredOptionRole = roleiddrop.map((option) => ({
    value: option.role_id,
    label: `${option.role_id} - ${option.role_name}`,
  }));

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setuser_code(selectedUser ? selectedUser.value : '');
  };

  const handleChangeRole = (selectedRole) => {
    setSelectedRole(selectedRole);
    setrole_id(selectedRole ? selectedRole.value : '');
  };

  const handleInsert = async () => {
    if (
      !user_code ||
      !role_id
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addUserRoleMappingData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          user_code,
          role_id,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
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

  const handleNavigate = () => {
    navigate("/UserRoleMapping"); // Pass selectedRows as props to the Input component
  };

  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      // Check if the value has changed and handle the search logic
      if (hasValueChanged) {
        await handleKeyDownStatus(e); // Trigger the search function
        setHasValueChanged(false); // Reset the flag after the search
      }

      // Move to the next field if the current field has a valid value
      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault(); // Prevent moving to the next field if the value is empty
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
    if (!user_code ||
      !role_id) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/RoleMappingUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          user_code,
          role_id,
          modified_by,
          keyfield
        }),
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
        console.error("Failed to insert data");
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
          <h1 className="page-title">{mode === "update" ? 'Update Role Mapping' : 'Add Role Mapping'}</h1>

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
            <div
              className={`inputGroup selectGroup 
              ${selectedUser ? "has-value" : ""} 
              ${isSelectUser ? "is-focused" : ""}`}
            >
              <Select
                id="usercode"
                value={selectedUser}
                onChange={handleChangeUser}
                options={filteredOptionUser}
                placeholder=" "
                onFocus={() => setIsSelectUser(true)}
                onBlur={() => setIsSelectUser(false)}
                classNamePrefix="react-select"
                isClearable
                maxLength={18}
                ref={usercode}
                onKeyDown={(e) => handleKeyDown(e, roleid, usercode)}
              />
              <label className={`floating-label ${error && !user_code ? 'text-danger' : ''}`}>User Code<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedRole ? "has-value" : ""} 
              ${isSelectRole ? "is-focused" : ""}`}
            >
              <Select
                id="roleid"
                value={selectedRole}
                onChange={handleChangeRole}
                options={filteredOptionRole}
                className="exp-input-field"
                placeholder=" "
                onFocus={() => setIsSelectRole(true)}
                onBlur={() => setIsSelectRole(false)}
                classNamePrefix="react-select"
                isClearable
                maxLength={18}
                ref={roleid}
                // onKeyDown={(e) => handleKeyDown(e, roleid)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (mode === "create") {
                      handleInsert();
                    } else {
                      handleUpdate();
                    }
                  }
                }}
              />
              <label className={`floating-label ${error && !role_id ? 'text-danger' : ''}`}>Role ID<span className="text-danger">*</span></label>
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
export default UserRoleInput;