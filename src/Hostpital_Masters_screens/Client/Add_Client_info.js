import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Select from "react-select";
import "../../App.css";
import LoadingScreen from "../../Loading";
import { useLocation, useNavigate } from "react-router-dom";
const config = require("../../Apiconfig.js");

const AddClientScreen = () => {
  const [Agreementdrop, setAgreementdrop] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [ClientID, setClientID] = useState("");
  const [ClientName, setClientName] = useState("");
  const [ContactPerson, setContactPerson] = useState("");
  const [ContactNumber, setContactNumber] = useState("");
  const [AgreementType, setAgreementType] = useState("");
  const [selectedAgreement, setSelectedAgreement] = useState("");
  const [address_1, setaddress_1] = useState("");
  const [address_2, setaddress_2] = useState("");
  const [address_3, setaddress_3] = useState("");
  const [city, setcity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [citydrop, setcitydrop] = useState([]);
  const [state, setstate] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [statedrop, setstatedrop] = useState([]);
  const [country, setcountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countrydrop, setcountrydrop] = useState([]);
  const inputRefs = useRef([]);
  const [isUpdated, setIsUpdated] = useState(false);

  const { mode, selectedRow } = location.state || {};

  const clearInputFields = () => {
    setSelectedAgreement("");
    setClientName("");
    setContactPerson("");
    setContactNumber("");
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
      setClientID(selectedRow.ClientID || "");
      setClientName(selectedRow.ClientName || "");
      setContactPerson(selectedRow.ContactPerson || "");
      setContactNumber(selectedRow.ContactNumber || "");
      setAgreementType(selectedRow.AgreementType || "");
      setaddress_1(selectedRow.address_1 || "");
      setaddress_2(selectedRow.address_2 || "");
      setaddress_3(selectedRow.address_3 || "");
      setcity(selectedRow.city || "");
      setstate(selectedRow.state || "");
      setcountry(selectedRow.country || "");
      setSelectedCity({
        label: selectedRow.city,
        value: selectedRow.city,
      });
      setSelectedState({
        label: selectedRow.state,
        value: selectedRow.state,
      });
      setSelectedCountry({
        label: selectedRow.country,
        value: selectedRow.country,
      });
      setSelectedAgreement({
        label: selectedRow.AgreementType,
        value: selectedRow.AgreementType,
      });
      setIsUpdated(true);
    } else if (mode === "create") {
      setClientID("");
      setClientName("");
      setContactPerson("");
      setContactNumber("");
      setAgreementType("");
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
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/city`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setcitydrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setstatedrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/country`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setcountrydrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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

  const filteredOptionAgreement = Agreementdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setcity(selectedCity ? selectedCity.value : "");
  };

  const handleChangeState = (selectedState) => {
    setSelectedState(selectedState);
    setstate(selectedState ? selectedState.value : "");
  };

  const handleChangeCountry = (selectedCountry) => {
    setSelectedCountry(selectedCountry);
    setcountry(selectedCountry ? selectedCountry.value : "");
  };

  const handleChangeAgreement = (SelectedAgreement) => {
    setSelectedAgreement(SelectedAgreement);
    setAgreementType(SelectedAgreement ? SelectedAgreement.value : "");
  };

  const handleUpdate = async () => {
    if (
      !ClientID ||
      !ClientName ||
      !ContactNumber ||
      !address_1 ||
      !address_2 ||
      !city ||
      !state ||
      !country
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/ClientMasterUpdate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ClientID,
          ClientName,
          ContactPerson,
          ContactNumber,
          AgreementType,
          address_1,
          address_2,
          address_3,
          city,
          state,
          country,
          Modified_by: sessionStorage.getItem("selectedUserCode"),
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (response.ok) {
        toast.success("Data Updated Successfully", {
          onClose: () => clearInputFields(),
        });
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.error);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error Updated data:", error);
      toast.error("Error Updated data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (
      !ClientID ||
      !ClientName ||
      !ContactNumber ||
      !address_1 ||
      !address_2 ||
      !city ||
      !state ||
      !country
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/ClientMasterInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ClientID,
          ClientName,
          ContactPerson,
          ContactNumber,
          AgreementType,
          address_1,
          address_2,
          address_3,
          city,
          state,
          country,
          Created_by: sessionStorage.getItem("selectedUserCode"),
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (response.ok) {
        toast.success("Data inserted Successfully", {
          onClose: () => clearInputFields(),
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

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getTaxApplicable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setAgreementdrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleNavigate = () => {
    navigate("/SearchClient"); // Pass selectedRows as props to the Input component
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
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="d-flex justify-content-between border bg-white rounded-2 p-3 align-items-center mb-3 shadow-sm">
        <h2 className="mb-0 ms-3">
          {mode === "update" ? "Update Client" : "Add Client"}
        </h2>
        <button
          type="button"
          className="close btn btn-danger"
          onClick={handleNavigate}
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div className="card mb-3 shadow-sm p-3">
        <div className="row g-3">
          <div className="col-md-3">
            <label
              className={`form-label fw-semibold d-flex justify-content-start ${error && !ClientID ? "text-danger" : ""
                }`}
            >
              Client ID <span className="text-danger">*</span>
            </label>
            <input
              name="ClientID"
              className="form-control"
              type="text"
              value={ClientID}
              onChange={(e) => setClientID(e.target.value)}
              readOnly={mode === "update" && isUpdated}
              ref={(el) => (inputRefs.current[0] = el)}
              onKeyDown={(e) => handleKeyDown(e, 0)}
            />
          </div>
          <div className="col-md-3">
            <label
              className={`form-label fw-semibold d-flex justify-content-start ${error && !ClientName ? "text-danger" : ""
                }`}
            >
              Client Name<span className="text-danger">*</span>
            </label>
            <input
              name="ClientName"
              className="form-control"
              type="text"
              value={ClientName}
              onChange={(e) => setClientName(e.target.value)}
              ref={(el) => (inputRefs.current[1] = el)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
            />
          </div>
          <div className="col-md-3">
            <label
              className={`form-label fw-semibold d-flex justify-content-start ${formErrors.ContactPerson ? "text-danger" : ""
                }`}
            >
              Contact Person
            </label>
            <input
              name="ContactPerson"
              className="form-control"
              type="text"
              value={ContactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              maxLength={10}
              ref={(el) => (inputRefs.current[2] = el)}
              onKeyDown={(e) => handleKeyDown(e, 2)}
            />
          </div>
          <div className="col-md-3">
            <label
              className={`form-label fw-semibold d-flex justify-content-start ${formErrors.ContactNumber ? "text-danger" : ""
                }`}
            >
              Contact Number
            </label>
            <input
              name="ContactNumber"
              className="form-control"
              type="text"
              value={ContactNumber}
              onChange={(e) => {
                const value = e.target.value;

                // Only allow digits (0-9), no negative sign
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
            <label
              className={`form-label fw-semibold d-flex justify-content-start ${error && !address_1 ? "text-danger" : ""
                }`}
            >
              Address 1<span className="text-danger">*</span>
            </label>
            <input
              name="Address 1"
              className="form-control"
              type="text"
              value={address_1}
              onChange={(e) => setaddress_1(e.target.value)}
              ref={(el) => (inputRefs.current[4] = el)}
              onKeyDown={(e) => handleKeyDown(e, 4)}
            />
          </div>
          <div className="col-md-3">
            <label
              className={`form-label fw-semibold d-flex justify-content-start ${error && !address_2 ? "text-danger" : ""
                }`}
            >
              Address 2<span className="text-danger">*</span>
            </label>
            <input
              name="Address2"
              className="form-control"
              type="text"
              value={address_2}
              onChange={(e) => setaddress_2(e.target.value)}
              ref={(el) => (inputRefs.current[5] = el)}
              onKeyDown={(e) => handleKeyDown(e, 5)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold d-flex justify-content-start">
              Address 3
            </label>
            <input
              name="Address3"
              className="form-control"
              type="text"
              value={address_3}
              onChange={(e) => setaddress_3(e.target.value)}
              ref={(el) => (inputRefs.current[6] = el)}
              onKeyDown={(e) => handleKeyDown(e, 6)}
            />
          </div>
          <div className="col-md-3">
            <label
              className={`form-label fw-semibold d-flex justify-content-start ${error && !selectedCity ? "text-danger" : ""
                }`}
            >
              City<span className="text-danger">*</span>
            </label>
            <Select
              id="City"
              value={selectedCity}
              onChange={handleChangeCity}
              options={filteredOptionCity}
              className="exp-input-field"
              ref={(el) => (inputRefs.current[7] = el)}
              onKeyDown={(e) => handleKeyDown(e, 7)}
            />
          </div>
          <div className="col-md-3">
            <label
              className={`form-label fw-semibold d-flex justify-content-start ${error && !selectedState ? "text-danger" : ""
                }`}
            >
              State<span className="text-danger">*</span>
            </label>
            <Select
              id="State"
              value={selectedState}
              onChange={handleChangeState}
              options={filteredOptionState}
              className="exp-input-field"
              ref={(el) => (inputRefs.current[8] = el)}
              onKeyDown={(e) => handleKeyDown(e, 8)}
            />
          </div>
          <div className="col-md-3">
            <label
              className={`form-label fw-semibold d-flex justify-content-start ${error && !selectedCountry ? "text-danger" : ""
                }`}
            >
              Country<span className="text-danger">*</span>
            </label>
            <Select
              id="Country"
              value={selectedCountry}
              onChange={handleChangeCountry}
              options={filteredOptionCountry}
              className="exp-input-field"
              ref={(el) => (inputRefs.current[9] = el)}
              onKeyDown={(e) => handleKeyDown(e, 9)}
            />
          </div>
          <div className="col-md-3">
            <label
              className={`form-label fw-semibold d-flex justify-content-start ${formErrors.selectedAgreement ? "text-danger" : ""
                }`}
            >
              Agreement Type
            </label>
            <Select
              id="Agreement"
              value={selectedAgreement}
              onChange={handleChangeAgreement}
              options={filteredOptionAgreement}
              className="exp-input-field"
              ref={(el) => (inputRefs.current[10] = el)}
              onKeyDown={(e) => handleKeyDown(e, 10)}
            />
          </div>
          <div class="col-md-3 form-group d-flex justify-content-start mb-4">
            {mode === "create" ? (
              <button onClick={handleSave} className="mt-4" title="Save">
                <i class="fa-solid fa-floppy-disk"></i>
              </button>
            ) : (
              <button
                type="button" // ✅ Prevent default form submission
                onClick={handleUpdate}
                className="mt-4"
                title="Update"
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClientScreen;
