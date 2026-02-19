import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Select from "react-select";
import { useLocation, useNavigate } from 'react-router-dom';
import '../../App.css'
import LoadingScreen from '../../Loading';
const config = require("../../Apiconfig.js");

const AddServiceScreen = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [Statusdrop, setStatusdrop] = useState([]);
  const [selectedTax, setSelectedTax] = useState(null);
  const [Taxdrop, setTaxdrop] = useState([]);
  const [status, setStatus] = useState('');
  const [tax, setTax] = useState('');
  const [ServiceID, setServiceID] = useState('');
  const [ServiceName, setServiceName] = useState('');
  const [Code, setCode] = useState('');
  const [Department, setDepartment] = useState('');
  const [Rate, setRate] = useState('');
  const [error, setError] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  const clearInputFields = () => {
    setServiceID("");
    setServiceName("");
    setCode("");
    setDepartment("");
    setRate("");
    setSelectedStatus("");
    setStatus("");
    setTax("");
    setSelectedTax("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setServiceID(selectedRow.ServiceID || "")
      setServiceName(selectedRow.ServiceName || "")
      setDepartment(selectedRow.Department || "")
      setRate(selectedRow.Rate || "")
      setStatus(selectedRow.Status || "")
      setTax(selectedRow.TaxApplicable || "")
      setSelectedStatus({
        label: selectedRow.Status,
        value: selectedRow.Status
      });
      setSelectedTax({
        label: selectedRow.TaxApplicable,
        value: selectedRow.TaxApplicable
      });
      setIsUpdated(true);
    } else if (mode === "create") {
      setServiceID("");
      setServiceName("");
      setCode("");
      setDepartment("");
      setRate("");
      setSelectedStatus("");
      setStatus("");
      setTax("");
      setSelectedTax("");
    }
  }, [mode, selectedRow, isUpdated]);

  const handleChangeStatus = (SelectSIDdrop) => {
    setSelectedStatus(SelectSIDdrop);
    setStatus(SelectSIDdrop ? SelectSIDdrop.value : "");
  };

  const handleChangeTax = (SelectSIDdrop) => {
    setSelectedTax(SelectSIDdrop);
    setTax(SelectSIDdrop ? SelectSIDdrop.value : "");
  };

  const handleSave = async () => {
    if (!ServiceID || !ServiceName || !Rate || !status) {
      setError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/ServiceInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ServiceID,
          Code,
          ServiceName,
          Department,
          Rate,
          TaxApplicable: tax,
          Status: status,
          Created_by: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem("selectedCompanyCode")
        }),
      });

      if (response.ok) {
        toast.success("Data inserted Successfully", {
          onClose: () => clearInputFields()
        });
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.error);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    } finally {
      setLoading(false)
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

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getTaxApplicable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setTaxdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionTax = Taxdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleNavigate = () => {
    navigate("/ServiceGrid");
  };

  const handleUpdate = async () => {
    if (!ServiceID || !ServiceName || !Rate || !status) {
      setError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/ServiceUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ServiceID,
          Code,
          ServiceName,
          Department,
          Rate,
          TaxApplicable: tax,
          Status: status,
          Modified_by: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem("selectedCompanyCode")
        }),
      });

      if (response.ok) {
        toast.success("Data inserted Successfully", {
          onClose: () => clearInputFields()
        });
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.error);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    } finally {
      setLoading(false)
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault(); // form submit avoid
      const nextIndex = index + 1;
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    }
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="d-flex justify-content-between border bg-white rounded-2 p-3 align-items-center mb-3 shadow-sm">
        <h2 className="mb-0 ms-3">{mode === "update" ? 'Update Service' : 'Add Service'}</h2>
        <button type="button" className="close btn btn-danger" onClick={handleNavigate} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="bg-white rounded-2 mb-3 shadow-sm border p-3">
        <div className="row g-3">
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !ServiceID ? 'text-danger' : ''}`}>
              Service Code<span className="text-danger">*</span>
            </label>
            <input
              name="ServiceID"
              className="form-control"
              type="text"
              value={ServiceID}
              readOnly={mode === "update"}
              onChange={(e) => setServiceID(e.target.value)}
              ref={(el) => (inputRefs.current[0] = el)}
              onKeyDown={(e) => handleKeyDown(e, 0)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !ServiceName ? 'text-danger' : ''}`}>Service Name<span className="text-danger">*</span></label>
            <input
              name="ServiceName"
              className="form-control"
              type="text"
              value={ServiceName}
              onChange={(e) => setServiceName(e.target.value)}
              ref={(el) => (inputRefs.current[1] = el)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
            />
          </div>
          {/* <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !Code ? 'text-danger' : ''}`}>Code<span className="text-danger">*</span></label>
            <input
              name="Code"
              className="form-control"
              type="text"
              value={Code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div> */}
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start`}>Department</label>
            <input
              name="Department"
              className="form-control"
              type="text"
              value={Department}
              onChange={(e) => setDepartment(e.target.value)}
              ref={(el) => (inputRefs.current[2] = el)}
              onKeyDown={(e) => handleKeyDown(e, 2)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !Rate ? 'text-danger' : ''}`}>Rate<span className="text-danger">*</span></label>
            <input
              name="Rate"
              className="form-control"
              type="text"
              value={Rate}
              onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setRate(value);
                  }
                }}
              ref={(el) => (inputRefs.current[3] = el)}
              onKeyDown={(e) => handleKeyDown(e, 3)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start`}>Tax Applicable</label>
            <Select
              id="Status"
              value={selectedTax}
              onChange={handleChangeTax}
              options={filteredOptionTax}
              ref={(el) => (inputRefs.current[4] = el)}
              onKeyDown={(e) => handleKeyDown(e, 4)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
            <Select
              id="Status"
              value={selectedStatus}
              onChange={handleChangeStatus}
              options={filteredOptionStatus}
              ref={(el) => (inputRefs.current[5] = el)}
              onKeyDown={(e) => handleKeyDown(e, 5)}
            />
          </div>
          <div class="col-md-3 mt-4 form-group d-flex justify-content-start mb-4">
            {mode === "create" ? (
              <button onClick={handleSave} className="mt-4" title="Save">
                <i class="fa-solid fa-floppy-disk"></i>
              </button>
            ) : (
              <button onClick={handleUpdate} className="mt-4" title="Update">
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceScreen;
