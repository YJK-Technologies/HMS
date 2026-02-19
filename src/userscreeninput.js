import { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";
import Select from 'react-select';
import LoadingScreen from './Loading';
const config = require('./Apiconfig');

function UserScreenInput({ }) {
  const [screensdrop, setscreensdrop] = useState([]);
  const [permissionsdrop, setpermissionsdrop] = useState([]);
  const [userdrop, setuserdrop] = useState([]);
  const [screen_type, setscreen_type] = useState("");
  const [permission_type, setpermission_type] = useState("");
  const [selectedscreens, setselectedscreens] = useState('');
  const [selectedpermissions, setselectedpermissions] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const permissiontype = useRef(null);
  const screentype = useRef(null);
  const roleId = useRef(null);
  const [role_id, setrole_id] = useState("");
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [roleiddrop, setroleiddrop] = useState([]);
  const created_by = sessionStorage.getItem('selectedUserCode');
  const [loading, setLoading] = useState(false);
  const [keyfield, setKeyfield] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);
  const [isSelectRole, setIsSelectRole] = useState(false);
  const [isSelectScreen, setIsSelectScreen] = useState(false);
  const [isSelectPermission, setIsSelectPermission] = useState(false);

  const location = useLocation()
  const { mode, selectedRow } = location.state || {};

  const clearInputFields = () => {
    setselectedpermissions("");
    setSelectedRole("");
    setselectedscreens("")
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setKeyfield(selectedRow.keyfield || "");
      setselectedpermissions({
        label: selectedRow.permission_type,
        value: selectedRow.permission_type,
      });
      setpermission_type(selectedRow.permission_type);
      setSelectedRole({
        label: selectedRow.role_id,
        value: selectedRow.role_id,
      });
      setrole_id(selectedRow.role_id);
      setselectedscreens({
        label: selectedRow.screen_type,
        value: selectedRow.screen_type,
      });
      setscreen_type(selectedRow.screen_type);
    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Screens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setscreensdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionscreens = screensdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangescreens = (selectedscreens) => {
    setselectedscreens(selectedscreens);
    setscreen_type(selectedscreens ? selectedscreens.value : '');
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setpermissionsdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionPermissions = permissionsdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangePermissions = (selectedpermissions) => {
    setselectedpermissions(selectedpermissions);
    setpermission_type(selectedpermissions ? selectedpermissions.value : '');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/usercode`)
      .then((data) => data.json())
      .then((val) => setuserdrop(val));
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

  const filteredOptionRole = roleiddrop.map((option) => ({
    value: option.role_id,
    label: `${option.role_id} - ${option.role_name}`,
  }));

  const handleChangeRole = (selectedRole) => {
    setSelectedRole(selectedRole);
    setrole_id(selectedRole ? selectedRole.value : '');
  };

  const handleInsert = async () => {
    if (
      !role_id,
      !screen_type,
      !permission_type
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/adduserscreenmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          role_id,
          screen_type,
          permission_type,
          created_by: sessionStorage.getItem('selectedUserCode')

        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
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

  const handleUpdate = async () => {
    if (
      !role_id,
      !screen_type,
      !permission_type
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/updateRoleRights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          role_id,
          screen_type,
          permission_type,
          modified_by: sessionStorage.getItem('selectedUserCode'),
          keyfield
        }),
      });
      if (response.status === 200) {
        console.log("Data updated successfully");
        setTimeout(() => {
          toast.success("Data updated successfully!", {
            onClose: () => clearInputFields(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/UserRights");
  };

  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      if (hasValueChanged) {
        await handleKeyDownStatus(e);
        setHasValueChanged(false);
      }

      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault();
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) {
      setHasValueChanged(false);
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">{mode === "update" ? 'Update Role Right' : 'Add Role Right'}</h1>

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
              ${selectedRole ? "has-value" : ""} 
              ${isSelectRole ? "is-focused" : ""}`}
            >
              <Select
                id="roleid"
                value={selectedRole}
                onChange={handleChangeRole}
                options={filteredOptionRole}
                placeholder=" "
                onFocus={() => setIsSelectRole(true)}
                onBlur={() => setIsSelectRole(false)}
                classNamePrefix="react-select"
                isClearable
                maxLength={18}
                ref={roleId}
                onKeyDown={(e) => handleKeyDown(e, screentype, roleId)}
              />
              <label className={`floating-label ${error && !role_id ? 'text-danger' : ''}`}>Role ID<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedscreens ? "has-value" : ""} 
              ${isSelectScreen ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                value={selectedscreens}
                onChange={handleChangescreens}
                options={filteredOptionscreens}
                placeholder=" "
                onFocus={() => setIsSelectScreen(true)}
                onBlur={() => setIsSelectScreen(false)}
                classNamePrefix="react-select"
                isClearable
                ref={screentype}
                onKeyDown={(e) => handleKeyDown(e, permissiontype, screentype)}
                required
              />
              <label for="state" className={`floating-label ${error && !screen_type ? 'text-danger' : ''}`}>Screen Type<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedpermissions ? "has-value" : ""} 
              ${isSelectPermission ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                value={selectedpermissions}
                onChange={handleChangePermissions}
                options={filteredOptionPermissions}
                placeholder=" "
                onFocus={() => setIsSelectPermission(true)}
                onBlur={() => setIsSelectPermission(false)}
                classNamePrefix="react-select"
                isClearable
                ref={permissiontype}
                // onKeyDown={(e) => handleKeyDown(e, permissiontype)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (mode === "create") {
                      handleInsert();
                    } else {
                      handleUpdate();
                    }
                  }
                }}
                required title="Please select a permission type here"
              />
              <label className={`floating-label ${error && !permission_type ? 'text-danger' : ''}`}>Permission Type<span className="text-danger">*</span></label>
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
export default UserScreenInput;