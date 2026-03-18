import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Select from "react-select";
import '../../App.css'
const config = require("../../Apiconfig.js");

const company_code = sessionStorage.getItem('selectedCompanyCode');
const AddClientScreen = () => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [Statusdrop, setStatusdrop] = useState([]);
  const [Status, setStatus] = useState("");
  const [formErrors, setFormErrors] = useState({});

 const initialClientData = {
  PaymentModeID: "",
  PaymentMode: "",
  Description: "",
  Status: "",
  Created_by: company_code,
  Created_date: new Date().toISOString(),
};



  const [ClientData, setClientData] = useState(initialClientData);

const handleChange = (e) => {
  const { name, value } = e.target;
  setClientData((prev) => ({
    ...prev,
    [name]: value,
  }));
  setFormErrors((prev) => ({ ...prev, [name]: "" }));
};

 const validateForm = () => {
  const errors = {};
  const {
    PaymentModeID,
    PaymentMode,
    Description,
    Created_by,
    Created_date
  } = ClientData;

  if (!PaymentModeID.trim()) errors.PaymentModeID = "Client ID is required";
  if (!PaymentMode.trim()) errors.PaymentMode = "Client Name is required";
  if (!Description.trim()) errors.Description = "Contact Person is required";
  if (!Created_by.trim()) errors.Created_by = "Created By is required";
  if (!Created_date) errors.Created_date = "Created Date is required";

  setFormErrors(errors);

  if (Object.keys(errors).length > 0) {
    toast.error("Please fill all fields correctly");
    return false;
  }

  return true;
};


const getInputClass = (fieldName) => {
  return formErrors[fieldName] ? "form-control is-invalid" : "form-control";
};




  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}/HMS_PaymentModeInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ClientData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Client added successfully!");

        // Reset form
        setClientData({
          ...initialClientData,
          Created_date: new Date().toISOString(),
        });
      } else {
        toast.error("Server Error: " + data.message);
      }
    } catch (err) {
      toast.error("An error occurred: " + err.message);
    }
  };


 useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Status`, {
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


  const filteredOptionStatus = Statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

 const handleChangeStatus = (selectedOption) => {
  setSelectedStatus(selectedOption);
  setClientData((prev) => ({
    ...prev,
    Status: selectedOption ? selectedOption.value : "",
  }));
  setFormErrors((prev) => ({ ...prev, Status: "" }));
};


  return (
    <div className="container-fluid Topnav-screen">
       <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="d-flex justify-content-between border bg-white rounded-2 p-3 align-items-center mb-3 shadow-sm">
        <h2 className="mb-0 ms-3">Add Payment Mode</h2>
        <button type="button" className="close btn btn-danger" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div className="card mb-3 shadow-sm p-3">
        <div className="row g-3">
          <div className="col-md-3">
           <label className={`form-label fw-semibold d-flex justify-content-start ${formErrors.PaymentModeID ? "text-danger" : ""}`}> Payment Mode ID</label>
            
            <input
              name="PaymentModeID"
              className="form-control"
              type="text"
              value={ClientData.PaymentModeID}
              
              onChange={handleChange}
            />
         

          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${formErrors.PaymentMode ? "text-danger" : ""}`}>Payment Mode</label>
            <input
              name="PaymentMode"
              className="form-control"
              type="text"
              value={ClientData.PaymentMode}
              onChange={handleChange}
            />

          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${formErrors.Description ? "text-danger" : ""}`}>Description
            </label>
           <input
              name="Description"
              className="form-control"
              type="text"
              value={ClientData.Description}
              onChange={handleChange}
              maxLength={10}
            />

          </div>
        
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${formErrors.Status ? "text-danger" : ""}`}>Status</label>
            <Select
              id="Status"
              value={selectedStatus}
              onChange={handleChangeStatus}
              options={filteredOptionStatus}
              className="exp-input-field"
            />

          </div>
         
          <div className="col-md-3 d-flex align-items-end gap-2">
            <button className="btn btn-primary" onClick={handleSave}>
              <i className="bi bi-save" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClientScreen;
