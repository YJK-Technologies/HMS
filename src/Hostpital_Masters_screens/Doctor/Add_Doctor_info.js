import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Select from "react-select";
import LoadingScreen from '../../Loading';
const config = require("../../Apiconfig.js");

const AddDoctorScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdated, setIsUpdated] = useState(false);
  const [DoctorID, setDoctorID] = useState('');
  const [DoctorName, setDoctorName] = useState('');
  const [Specialization, setSpecialization] = useState('');
  const [ContactNumber, setContactNumber] = useState('');
  const [Status, setStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [Statusdrop, setStatusdrop] = useState([]);
  const [address_1, setaddress_1] = useState('');
  const [address_2, setaddress_2] = useState('');
  const [address_3, setaddress_3] = useState('');
  const [city, setcity] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [citydrop, setcitydrop] = useState([]);
  const [state, setstate] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [statedrop, setstatedrop] = useState([]);
  const [country, setcountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countrydrop, setcountrydrop] = useState([]);
  const inputRefs = useRef([]);
  const { mode, selectedRow } = location.state || {};

  const clearInputFields = () => {
    setDoctorID("");
    setDoctorName("");
    setSpecialization("");
    setContactNumber("");
    setStatus("");
    setSelectedStatus("");
    setaddress_1("");
    setaddress_2("");
    setaddress_3("");
    setcity("");
    setSelectedCity("");
    setstate("");
    setSelectedState("");
    setcountry("");
    setSelectedCountry("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setDoctorID(selectedRow.DoctorID || "")
      setDoctorName(selectedRow.DoctorName || "")
      setSpecialization(selectedRow.Specialization || "")
      setContactNumber(selectedRow.ContactNumber || "")
      setStatus(selectedRow.Status || "")
      setaddress_1(selectedRow.address_1 || "")
      setaddress_2(selectedRow.address_2 || "")
      setaddress_3(selectedRow.address_3 || "")
      setcity(selectedRow.city || "")
      setstate(selectedRow.state || "")
      setcountry(selectedRow.country || "")
      setSelectedStatus({
        label: selectedRow.Status,
        value: selectedRow.Status
      });
      setSelectedCity({
        label: selectedRow.city,
        value: selectedRow.city
      });
      setSelectedState({
        label: selectedRow.state,
        value: selectedRow.state
      });
      setSelectedCountry({
        label: selectedRow.country,
        value: selectedRow.country
      });
      setIsUpdated(true);
    } else if (mode === "create") {
      setDoctorID("");
      setDoctorName("");
      setSpecialization("");
      setContactNumber("");
      setStatus("");
      setSelectedStatus("");
      setaddress_1("");
      setaddress_2("");
      setaddress_3("");
      setcity("");
      setSelectedCity("");
      setstate("");
      setSelectedState("");
      setcountry("");
      setSelectedCountry("");
    }
  }, [mode, selectedRow, isUpdated]);

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
    fetch(`${config.apiBaseUrl}/city`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setcitydrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setstatedrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/country`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setcountrydrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionStatus = Statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionCity = citydrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionState = statedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionCountry = countrydrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
  };

  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setcity(selectedCity ? selectedCity.value : '');
  };

  const handleChangeState = (selectedState) => {
    setSelectedState(selectedState);
    setstate(selectedState ? selectedState.value : '');
  };

  const handleChangeCountry = (selectedCountry) => {
    setSelectedCountry(selectedCountry);
    setcountry(selectedCountry ? selectedCountry.value : '');
  };

  const handleUpdate = async () => {
    if (!DoctorID || !DoctorName || !Specialization || !ContactNumber || !Status ||
      !address_1 || !address_2 || !city || !state || !country) {
      setError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/DoctorMasterUpdate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          DoctorID, DoctorName, Specialization, ContactNumber, Status,
          address_1, address_2, address_3, city, state, country, Modified_by: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem("selectedCompanyCode")
        }),
      });

      if (response.ok) {
        toast.success("Data updated successfully", {
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
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!DoctorID || !DoctorName || !Specialization || !ContactNumber || !Status ||
      !address_1 || !address_2 || !city || !state || !country) {
      setError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/DoctorMasterInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DoctorID, DoctorName, Specialization, ContactNumber, Status,
          address_1, address_2, address_3, city, state, country, Created_by: sessionStorage.getItem('selectedUserCode'),
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
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/SearchDoctor");
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
    <div>
      <div className="container-fluid Topnav-screen">
        {loading && <LoadingScreen />}
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
        <div className="d-flex justify-content-between border bg-white rounded-2 p-3 align-items-center mb-3 shadow-sm">
          <h2 className="mb-0 ms-3">{mode === "update" ? 'Update Doctor' : 'Add Doctor'}</h2>
          <button type="button" onClick={handleNavigate} className="close btn btn-danger" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="card mb-3 shadow-sm p-3">
          <div className="row g-3">
            <div className="col-md-3">
              <label className={`form-label fw-semibold d-flex justify-content-start ${error && !DoctorID ? 'text-danger' : ''}`}>Doctor ID<span className="text-danger">*</span></label>
              <input
                name="DoctorID"
                className="form-control"
                type="text"
                value={DoctorID}
                onChange={(e) => setDoctorID(e.target.value)}
                readOnly={mode === "update" && isUpdated}
                ref={(el) => (inputRefs.current[0] = el)}
                onKeyDown={(e) => handleKeyDown(e, 0)}
              />
            </div>
            <div className="col-md-3">
              <label className={`form-label fw-semibold d-flex justify-content-start ${error && !DoctorName ? 'text-danger' : ''}`}>Doctor Name<span className="text-danger">*</span></label>
              <input
                name="DoctorName"
                className="form-control"
                type="text"
                value={DoctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                ref={(el) => (inputRefs.current[1] = el)}
                onKeyDown={(e) => handleKeyDown(e, 1)}
              />
            </div>
            <div className="col-md-3">
              <label className={`form-label fw-semibold d-flex justify-content-start ${error && !Specialization ? 'text-danger' : ''}`}>Specialization<span className="text-danger">*</span></label>
              <input
                name="Specialization"
                className="form-control"
                type="text"
                value={Specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                ref={(el) => (inputRefs.current[2] = el)}
                onKeyDown={(e) => handleKeyDown(e, 2)}
              />
            </div>
            <div className="col-md-3">
              <label className={`form-label fw-semibold d-flex justify-content-start ${error && !ContactNumber ? 'text-danger' : ''}`}>Contact Number<span className="text-danger">*</span></label>
              <input
                name="ContactNumber"
                className="form-control"
                type="text"
                value={ContactNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setContactNumber(value);
                  }
                }}
                maxLength={10}
                ref={(el) => (inputRefs.current[3] = el)}
                onKeyDown={(e) => handleKeyDown(e, 3)}
              />
            </div>
            <div className="col-md-3">
              <label className={`form-label fw-semibold d-flex justify-content-start ${error && !Status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
              <Select
                id="status"
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
                className="exp-input-field"
                ref={(el) => (inputRefs.current[3] = el)}
                onKeyDown={(e) => handleKeyDown(e, 3)}
              />
            </div>
            <div className="col-md-3">
              <label className={`form-label fw-semibold d-flex justify-content-start ${error && !address_1 ? 'text-danger' : ''}`}>Address 1<span className="text-danger">*</span></label>
              <input
                name="ContactNumber"
                className="form-control"
                type="text"
                value={address_1}
                onChange={(e) => setaddress_1(e.target.value)}
                maxLength={10}
                ref={(el) => (inputRefs.current[4] = el)}
                onKeyDown={(e) => handleKeyDown(e, 4)}
              />
            </div>
            <div className="col-md-3">
              <label className={`form-label fw-semibold d-flex justify-content-start ${error && !address_2 ? 'text-danger' : ''}`}>Address 2<span className="text-danger">*</span></label>
              <input
                name="ContactNumber"
                className="form-control"
                type="text"
                value={address_2}
                onChange={(e) => setaddress_2(e.target.value)}
                maxLength={10}
                ref={(el) => (inputRefs.current[5] = el)}
                onKeyDown={(e) => handleKeyDown(e, 5)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold d-flex justify-content-start">Address 3</label>
              <input
                name="ContactNumber"
                className="form-control"
                type="text"
                value={address_3}
                onChange={(e) => setaddress_3(e.target.value)}
                maxLength={10}
                ref={(el) => (inputRefs.current[6] = el)}
                onKeyDown={(e) => handleKeyDown(e, 6)}
              />
            </div>
            <div className="col-md-3">
              <label className={`form-label fw-semibold d-flex justify-content-start ${error && !city ? 'text-danger' : ''}`}>City<span className="text-danger">*</span></label>
              <Select
                id="status"
                value={selectedCity}
                onChange={handleChangeCity}
                options={filteredOptionCity}
                className="exp-input-field"
                ref={(el) => (inputRefs.current[7] = el)}
                onKeyDown={(e) => handleKeyDown(e, 7)}
              />
            </div>
            <div className="col-md-3">
              <label className={`form-label fw-semibold d-flex justify-content-start ${error && !state ? 'text-danger' : ''}`}>State<span className="text-danger">*</span></label>
              <Select
                id="status"
                value={selectedState}
                onChange={handleChangeState}
                options={filteredOptionState}
                className="exp-input-field"
                ref={(el) => (inputRefs.current[8] = el)}
                onKeyDown={(e) => handleKeyDown(e, 8)}
              />
            </div>
            <div className="col-md-3">
              <label className={`form-label fw-semibold d-flex justify-content-start ${error && !country ? 'text-danger' : ''}`}>Country<span className="text-danger">*</span></label>
              <Select
                id="status"
                value={selectedCountry}
                onChange={handleChangeCountry}
                options={filteredOptionCountry}
                className="exp-input-field"
                ref={(el) => (inputRefs.current[9] = el)}
                onKeyDown={(e) => handleKeyDown(e, 9)}
              />
            </div>
            <div class="col-md-3 mt-4 form-group d-flex justify-content-start mb-4">
              {mode === "create" ? (
                <button onClick={handleSave} className="mt-4" title="Save">
                  <i class="fa-solid fa-floppy-disk"></i>
                </button>
              ) : (
                <button type="button" onClick={handleUpdate} className="mt-4" title="Update">
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorScreen;
