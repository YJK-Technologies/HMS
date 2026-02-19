import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
import AttriHdrInputPopup from "./AttriHdrInput";
import { useLocation } from "react-router-dom";
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function AttriDetInput({ }) {
  const [open2, setOpen2] = React.useState(false);
  const [attributeheader_code, setAttributeheader_Code] = useState("");
  const [attributedetails_code, setAttributedetails_code] = useState("");
  const [attributedetails_name, setAttributedetails_name] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const navigate = useNavigate();
  const [statusdrop, setCodedrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const code = useRef(null);
  const subcode = useRef(null);
  const detailname = useRef(null);
  const description = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [isSelectCode, setIsSelectCode] = useState(false);




  console.log(selectedRows);
  const modified_by = sessionStorage.getItem("selectedUserCode");

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  const [isUpdated, setIsUpdated] = useState(false);


  console.log(selectedRow)

  const clearInputFields = () => {
    setSelectedHeader("");
    setAttributedetails_code("");
    setAttributedetails_name("");
    setDescriptions("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setSelectedHeader({
        label: selectedRow.attributeheader_code,
        value: selectedRow.attributeheader_code,
      });
      setAttributeheader_Code(selectedRow.attributeheader_code || "");
      setAttributedetails_code(selectedRow.attributedetails_code || "");
      setAttributedetails_name(selectedRow.attributedetails_name || "");
      setDescriptions(selectedRow.descriptions || "");
    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/hdrcode`)
      .then((data) => data.json())
      .then((val) => setCodedrop(val));
  }, []);

  const filteredOptionHeader = statusdrop.map((option) => ({
    value: option.attributeheader_code,
    label: option.attributeheader_code,
  }));

  const handleChangeHeader = (selectedHeader) => {
    setSelectedHeader(selectedHeader);
    setAttributeheader_Code(selectedHeader ? selectedHeader.value : '');
  };

  const handleInsert = async () => {
    if (!attributeheader_code || !attributedetails_code || !attributedetails_name) {
      setError(" ");
      toast.warning("Missing Required Fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addattridetData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          attributeheader_code,
          attributedetails_code,
          attributedetails_name,
          descriptions,
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
        toast.warning(errorResponse.message, {

        });
      } else {
        console.error("Failed to insert data");
        toast.error('Failed to insert data', {

        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message, {

      });
    }
    finally {
      setLoading(false);
    }
  };

  const handleNavigateToForm = () => {
    navigate("/AddAttributeHeader", { selectedRows }); // Pass selectedRows as props to the Input component
  };
  const handleNavigate = () => {
    navigate("/Attribute"); // Pass selectedRows as props to the Input component
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
    if (e.key === 'Enter' && hasValueChanged) {
      setHasValueChanged(false); 
    }
  };

  const handleClickOpen = (params) => {
    setOpen2(true);
    console.log("Opening popup...");
  };
  const handleClose = () => {
    setOpen2(false);
  };

  const handleUpdate = async () => {
    if (
      !attributeheader_code ||
      !attributedetails_code ||
      !attributedetails_name ||
      !descriptions

    ) {
      setError(" ");
      toast.warning("Missing Required Fields");
      return;
    }
    setLoading(true);


    try {
      const response = await fetch(`${config.apiBaseUrl}/AttributeUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attributeheader_code,
          attributedetails_code,
          attributedetails_name,
          descriptions,
          created_by,
          modified_by,
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
        toast.error("Failed to insert data");
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error Update data: ' + error.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">{mode === "update" ? 'Update Attribute Details' : 'Add Attribute Details'}</h1>
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
      ${selectedHeader ? "has-value" : ""} 
      ${isSelectCode ? "is-focused" : ""}`}
            >
              <Select
                id="HdrCode"
                value={selectedHeader}
                onChange={handleChangeHeader}
                options={filteredOptionHeader}
                placeholder=" "
                onFocus={() => setIsSelectCode(true)}
                onBlur={() => setIsSelectCode(false)}
                classNamePrefix="react-select"
                isClearable
                ref={code}
                readOnly={mode === "update"}
                isDisabled={mode === "update"}
                onKeyDown={(e) => handleKeyDown(e, subcode, code)}
              />

              <label className={`floating-label ${error && !attributeheader_code ? 'text-danger' : ''}`}>Code<span className="text-danger">*</span></label>

              {mode !== "update" && (
                <span
                  type="button"
                  className="select-add-btn"
                  title="Add Header"
                  onClick={handleClickOpen}
                >
                  <i className="fa-solid fa-plus"></i>
                </span>
              )}
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="adcode"
                class="exp-input-field form-control"
                type="text"
                autoComplete="off"
                placeholder=" "
                required
                value={attributedetails_code}
                onChange={(e) => setAttributedetails_code(e.target.value)}
                maxLength={18}
                ref={subcode}
                readOnly={mode === "update"}
                onKeyDown={(e) => handleKeyDown(e, detailname, subcode)}
              />
              <label for="rid" className={`exp-form-labels ${error && !attributedetails_code ? 'text-danger' : ''}`}>subcode<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="adnames"
                class="exp-input-field form-control"
                type="text"
                autoComplete="off"
                placeholder=" "
                value={attributedetails_name}
                onChange={(e) => setAttributedetails_name(e.target.value)}
                maxLength={250}
                ref={detailname}
                onKeyDown={(e) => handleKeyDown(e, description, detailname)}
              />
              <label for="rid" className={`exp-form-labels ${error && !attributedetails_name ? 'text-danger' : ''}`}>Detail Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="addesc"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                value={descriptions}
                onChange={(e) => setDescriptions(e.target.value)}
                maxLength={250}
                ref={description}
                // onKeyDown={(e) => handleKeyDown(e, description)}
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
              <label for="rid" className="exp-form-labels">Description</label>
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

          <div>
            <AttriHdrInputPopup open={open2} handleClose={handleClose} />
          </div>

        </div>
      </div>
    </div>
  );
}
export default AttriDetInput;