import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useLocation, useNavigate } from 'react-router-dom';
import Select from "react-select";
import LoadingScreen from '../../Loading';
const config = require("../../Apiconfig.js");

const AddPatientScreen = () => {
  const [selectedGender, setSelectedGender] = useState("");
  const [Genderdrop, setGenderdrop] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  const inputRefs = useRef([]);
  const [PatientID, setPatientID] = useState('');
  const [PatientName, setPatientName] = useState('');
  const [Gender, setGender] = useState('');
  const [DOB, setDOB] = useState('');
  const [ContactNumber, setContactNumber] = useState('');
  const [RCHID, setRCHID] = useState('');
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
  const [age, setage] = useState('');

  const clearInputFields = () => {
    setPatientID("");
    setPatientName("");
    setDOB("");
    setage("");
    setContactNumber("");
    setGender("");
    setRCHID("");
    setaddress_1("");
    setaddress_2("");
    setaddress_3("");
    setcity("");
    setSelectedCity("");
    setstate("");
    setSelectedState("");
    setcountry("");
    setSelectedCountry("");
    setSelectedGender("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setPatientID(selectedRow.PatientID || "")
      setPatientName(selectedRow.PatientName || "")
      setDOB(selectedRow.DOB || "")
      setage(selectedRow.age || "")
      setContactNumber(selectedRow.ContactNumber || "")
      setGender(selectedRow.Gender || "")
      setRCHID(selectedRow.RCHID || "")
      setaddress_1(selectedRow.address_1 || "")
      setaddress_2(selectedRow.address_2 || "")
      setaddress_3(selectedRow.address_3 || "")
      setcity(selectedRow.city || "")
      setstate(selectedRow.state || "")
      setcountry(selectedRow.country || "")
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
      setSelectedGender({
        label: selectedRow.Gender,
        value: selectedRow.Gender
      });
      setIsUpdated(true);
    } else if (mode === "create") {
      setPatientID("");
      setPatientName("");
      setDOB("");
      setContactNumber("");
      setGender("");
      setRCHID("");
      setaddress_1("");
      setaddress_2("");
      setaddress_3("");
      setcity("");
      setSelectedCity("");
      setstate("");
      setSelectedState("");
      setcountry("");
      setSelectedCountry("");
      setSelectedGender("");
    }
  }, [mode, selectedRow, isUpdated]);


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

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Gender`, {
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


  const filteredOptionGender = Genderdrop.map((option) => ({
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

  const handleChangeGender = (selectedOption) => {
    setSelectedGender(selectedOption);
    setGender(selectedOption ? selectedOption.value : '')
  };

  const handleUpdate = async () => {
    if (!PatientID || !PatientName || !DOB || !age || !ContactNumber || !address_1 || !address_2 || !city || !state || !country) {
      setError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/PatientMasterUpdate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PatientID,
          PatientName,
          Gender,
          DOB,
          ContactNumber,
          RCHID,
          address_1,
          address_2,
          address_3,
          city,
          state,
          country,
          age,
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


  const handleSave = async () => {
    if (!PatientID || !PatientName || !DOB || !age || !ContactNumber || !address_1 || !address_2 || !city || !state || !country) {
      setError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/PatientMasterInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PatientID,
          PatientName,
          Gender,
          DOB,
          ContactNumber,
          RCHID,
          address_1,
          address_2,
          address_3,
          city,
          state,
          country,
          age,
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

  const handleNavigate = () => {
    navigate("/SearchPatient");
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
        <h2 className="mb-0 ms-3">{mode === "update" ? 'Update Patient' : 'Add Patient'}</h2>
        <button type="button" className="close btn btn-danger" onClick={handleNavigate} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="card mb-3 shadow-sm p-3">
        <div className="row g-3">
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !PatientID ? 'text-danger' : ''}`}>Patient ID<span className="text-danger">*</span></label>
            <input
              name="PatientID"
              className="form-control"
              type="text"
              value={PatientID}
              onChange={(e) => setPatientID(e.target.value)}
              readOnly={mode === "update"}
              ref={(el) => (inputRefs.current[0] = el)}
              onKeyDown={(e) => handleKeyDown(e, 0)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !PatientName ? 'text-danger' : ''}`}>Patient Name<span className="text-danger">*</span></label>
            <input
              name="PatientName"
              className="form-control"
              type="text"
              value={PatientName}
              onChange={(e) => setPatientName(e.target.value)}
              ref={(el) => (inputRefs.current[1] = el)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !Gender ? 'text-danger' : ''}`}>Gender<span className="text-danger">*</span></label>
            <Select
              id="Gender"
              value={selectedGender}
              onChange={handleChangeGender}
              options={filteredOptionGender}
              className="exp-input-field"
              ref={(el) => (inputRefs.current[2] = el)}
              onKeyDown={(e) => handleKeyDown(e, 2)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !ContactNumber ? 'text-danger' : ''}`}>DOB<span className="text-danger">*</span></label>
            <input
              name="DOB"
              className="form-control"
              type="date"
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              ref={(el) => (inputRefs.current[3] = el)}
              onKeyDown={(e) => handleKeyDown(e, 3)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !age ? 'text-danger' : ''}`}>Age<span className="text-danger">*</span></label>
            <input
              name="DOB"
              className="form-control"
              type="number"
              value={age}
              maxLength={3}
              onChange={(e) => setage(e.target.value)}
              ref={(el) => (inputRefs.current[4] = el)}
              onKeyDown={(e) => handleKeyDown(e, 4)}
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
              ref={(el) => (inputRefs.current[5] = el)}
              onKeyDown={(e) => handleKeyDown(e, 5)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold d-flex justify-content-start">RCHID</label>
            <input
              name="RCHID"
              className="form-control"
              type="text"
              value={RCHID}
              onChange={(e) => setRCHID(e.target.value)}
              ref={(el) => (inputRefs.current[6] = el)}
              onKeyDown={(e) => handleKeyDown(e, 6)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !address_1 ? 'text-danger' : ''}`}>Address 1<span className="text-danger">*</span></label>
            <input
              name="Address 1"
              className="form-control"
              type="text"
              value={address_1}
              onChange={(e) => setaddress_1(e.target.value)}
              ref={(el) => (inputRefs.current[7] = el)}
              onKeyDown={(e) => handleKeyDown(e, 7)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !address_2 ? 'text-danger' : ''}`}>Address 2<span className="text-danger">*</span></label>
            <input
              name="Address2"
              className="form-control"
              type="text"
              value={address_2}
              onChange={(e) => setaddress_2(e.target.value)}
              ref={(el) => (inputRefs.current[8] = el)}
              onKeyDown={(e) => handleKeyDown(e, 8)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold d-flex justify-content-start">Address 3</label>
            <input
              name="Address3"
              className="form-control"
              type="text"
              value={address_3}
              onChange={(e) => setaddress_3(e.target.value)}
              ref={(el) => (inputRefs.current[9] = el)}
              onKeyDown={(e) => handleKeyDown(e, 9)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !selectedCity ? 'text-danger' : ''}`}>City<span className="text-danger">*</span></label>
            <Select
              id="City"
              value={selectedCity}
              onChange={handleChangeCity}
              options={filteredOptionCity}
              className="exp-input-field"
              ref={(el) => (inputRefs.current[10] = el)}
              onKeyDown={(e) => handleKeyDown(e, 10)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !selectedState ? 'text-danger' : ''}`}>State<span className="text-danger">*</span></label>
            <Select
              id="State"
              value={selectedState}
              onChange={handleChangeState}
              options={filteredOptionState}
              className="exp-input-field"
              ref={(el) => (inputRefs.current[11] = el)}
              onKeyDown={(e) => handleKeyDown(e, 11)}
            />
          </div>
          <div className="col-md-3">
            <label className={`form-label fw-semibold d-flex justify-content-start ${error && !selectedCountry ? 'text-danger' : ''}`}>Country<span className="text-danger">*</span></label>
            <Select
              id="Country"
              value={selectedCountry}
              onChange={handleChangeCountry}
              options={filteredOptionCountry}
              className="exp-input-field"
              ref={(el) => (inputRefs.current[12] = el)}
              onKeyDown={(e) => handleKeyDown(e, 12)}
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

export default AddPatientScreen;
