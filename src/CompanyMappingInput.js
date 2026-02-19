import { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import LoadingScreen from './Loading';

const config = require("./Apiconfig");

function UserComMap_input({ }) {
  const [user_code, setuser_code] = useState("");
  const [company_no, setcompany_no] = useState("");
  const [location_no, setlocation_no] = useState("");
  const [status, setstatus] = useState("");
  const [order_no, setorder_no] = useState();
  const [usercodedrop, setusercodedrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [companynodrop, setcompanynodrop] = useState([]);
  const [locationnodrop, setlocationnodrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const usercode = useRef(null);
  const companycode = useRef(null);
  const locno = useRef(null);
  const Status = useRef(null);
  const Orderno = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const modified_by = sessionStorage.getItem("selectedUserCode");

  const [isUpdated, setIsUpdated] = useState(false);
  const [keyfiels, setKeyfiels] = useState('');

  const [isSelectUser, setIsSelectUser] = useState(false);
  const [isSelectCompany, setIsSelectCompany] = useState(false);
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const [isSelectStatus, setIsSelectStatus] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  console.log(selectedRow);

  const clearInputFields = () => {
    setSelectedUser("");
    setuser_code("");
    setSelectedCompany("");
    setSelectedLocation("");
    setSelectedStatus("");
    setorder_no("");
  };


  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setorder_no(selectedRow.order_no || "");
      setKeyfiels(selectedRow.keyfiels || "");
      setuser_code(selectedRow.user_code || "");
      setcompany_no(selectedRow.company_no || "");
      setlocation_no(selectedRow.location_no || "");
      setstatus(selectedRow.status || "");
      setSelectedUser({
        label: selectedRow.user_code,
        value: selectedRow.user_code,
      });
      setSelectedCompany({
        label: selectedRow.company_no,
        value: selectedRow.company_no,
      });
      setSelectedLocation({
        label: selectedRow.location_no,
        value: selectedRow.location_no,
      });
      setSelectedStatus({
        label: selectedRow.status,
        value: selectedRow.status,
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
    fetch(`${config.apiBaseUrl}/Companyno`)
      .then((data) => data.json())
      .then((val) => setcompanynodrop(val));
  }, []);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/locationno`)
      .then((data) => data.json())
      .then((val) => setlocationnodrop(val));
  }, []);

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

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionUser = usercodedrop.map((option) => ({
    value: option.user_code,
    label: `${option.user_code} - ${option.user_name}`,
  }));

  const filteredOptionCompany = companynodrop.map((option) => ({
    value: option.company_no,
    label: `${option.company_no} - ${option.company_name}`,
  }));

  const filteredOptionLocation = locationnodrop.map((option) => ({
    value: option.location_no,
    label: `${option.location_no} - ${option.location_name}`,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : "");
  };

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setuser_code(selectedUser ? selectedUser.value : "");
  };

  const handleChangeCompany = (selectedCompany) => {
    setSelectedCompany(selectedCompany);
    setcompany_no(selectedCompany ? selectedCompany.value : "");
  };

  const handleChangeLocation = (selectedLocation) => {
    setSelectedLocation(selectedLocation);
    setlocation_no(selectedLocation ? selectedLocation.value : "");
  };

  const handleInsert = async () => {
    if (!user_code || !company_no || !location_no || !status) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addCompanyMappingData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            user_code,
            company_no,
            location_no,
            status,
            order_no,
            created_by: sessionStorage.getItem("selectedUserCode"),
          }),
        }
      );
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
    navigate("/CompanyMapping"); // Pass selectedRows as props to the Input component
  };

  const handleKeyDown = async (
    e,
    nextFieldRef,
    value,
    hasValueChanged,
    setHasValueChanged
  ) => {
    if (e.key === "Enter") {
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
    if (e.key === "Enter" && hasValueChanged) {
      // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };


  const handleUpdate = async () => {
    if (!user_code || !company_no || !location_no || !status) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/CompanyMappingUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          user_code,
          company_no,
          location_no,
          status,
          order_no,
          modified_by,
          keyfiels
        }),
      });
      // if (response.status === 200) {
      //   console.log("Data Updated successfully");
      //   setIsUpdated(true);
      //   clearInputFields();
      //   toast.success("Data Updated successfully!")
      if (response.ok) {
        toast.success("Data updated successfully", {
          onClose: () => clearInputFields()
        });
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">{mode === "update" ? 'Update Company Mapping' : 'Add Company Mapping'} </h1>

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
                isClearable
                value={selectedUser}
                onChange={handleChangeUser}
                options={filteredOptionUser}
                classNamePrefix="react-select"
                placeholder=" "
                onFocus={() => setIsSelectUser(true)}
                onBlur={() => setIsSelectUser(false)}
                ref={usercode}
                onKeyDown={(e) =>
                  handleKeyDown(e, companycode, usercode)
                }
              />
              <label className={`floating-label ${error && !user_code ? 'text-danger' : ''}`}>
                User Code<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedCompany ? "has-value" : ""} 
              ${isSelectCompany ? "is-focused" : ""}`}
            >
              <Select
                id="comno"
                isClearable
                value={selectedCompany}
                onChange={handleChangeCompany}
                options={filteredOptionCompany}
                classNamePrefix="react-select"
                placeholder=" "
                onFocus={() => setIsSelectCompany(true)}
                onBlur={() => setIsSelectCompany(false)}
                ref={companycode}
                onKeyDown={(e) =>
                  handleKeyDown(e, locno, companycode)
                }
              />
              <label for="rid" className={`floating-label ${error && !company_no ? 'text-danger' : ''}`}>
                Company Code<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedLocation ? "has-value" : ""} 
              ${isSelectLocation ? "is-focused" : ""}`}
            >
              <Select
                id="locno"
                isClearable
                value={selectedLocation}
                onChange={handleChangeLocation}
                options={filteredOptionLocation}
                classNamePrefix="react-select"
                placeholder=" "
                onFocus={() => setIsSelectLocation(true)}
                onBlur={() => setIsSelectLocation(false)}
                ref={locno}
                onKeyDown={(e) => handleKeyDown(e, Status, locno)}
              />
              <label for="rid" className={`floating-label ${error && !location_no ? 'text-danger' : ''}`}>Location No<span className="text-danger">*</span></label>
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
                isClearable
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
                classNamePrefix="react-select"
                placeholder=" "
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
                ref={Status}
                onKeyDown={(e) => handleKeyDown(e, Orderno, Status)}
              />
              <label for="rid" className={`floating-label ${error && !status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="ordno"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required
                autoComplete="off"
                value={order_no}
                onChange={(e) =>
                  setorder_no(
                    e.target.value.replace(/\D/g, "").slice(0, 50)
                  )
                }
                maxLength={50}
                ref={Orderno}
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
              <label for="ordno" class="exp-form-labels">Order No</label>
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
export default UserComMap_input;
