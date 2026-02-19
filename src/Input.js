import { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
// import './apps.css';
import Select from 'react-select'
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function Input({ }) {
  const [company_no, setCompany_no] = useState("");
  const [company_name, setCompany_name] = useState("");
  const [short_name, setShort_name] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [email_id, setEmail_id] = useState("");
  const [status, setStatus] = useState("");
  const [foundedDate, setFoundedDate] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [contact_no, setContact_no] = useState("");
  const [location_no, setlocation_no] = useState("");
  const [annualreportURL, setAnnualReportURL] = useState("");
  const [company_gst_no, setcompany_gst_no] = useState("");

  const [error, setError] = useState("");
  const [drop, setDrop] = useState([]);
  const [condrop, setCondrop] = useState([]);
  const [statedrop, setStatedrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [locationnodrop, setLocationdrop] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setselectedState] = useState('');
  const [selectedCountry, setselectedCountry] = useState('');
  const [selectedStatus, setselectedStatus] = useState('');
  const [selectedLocation, setselectedLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSignatureImage, setselectedSignatureImage] = useState(null);
  const [isSelectCity, setIsSelectCity] = useState(false);
  const [isSelectState, setIsSelectState] = useState(false);
  const [isSelectCountry, setIsSelectCountry] = useState(false);
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [isSelectLocation, setIsSelectLocation] = useState(false);

  const navigate = useNavigate();
  const companycode = useRef(null);
  const companyname = useRef(null);
  const shortname = useRef(null);
  const Address1 = useRef(null);
  const Address2 = useRef(null);
  const Address3 = useRef(null);
  const City = useRef(null);
  const State = useRef(null);
  const Pincode = useRef(null);
  const Country = useRef(null);
  const Email = useRef(null);
  const Status = useRef(null);
  const WebsiteUrl = useRef(null);
  const ContactNo = useRef(null);
  const companyGST = useRef(null);
  const annaual = useRef(null);
  const locatioN = useRef(null);
  const logo = useRef(null);
  const sign = useRef(null);
  const found = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [companyImage, setCompanyImage] = useState("");
  const [SignatureImage, setSignatureImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [isUpdated, setIsUpdated] = useState(false);
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  const clearInputFields = () => {
    setCompany_no("");
    setCompany_name("");
    setShort_name("");
    setAddress1("");
    setAddress2("");
    setAddress3("");
    setSelectedCity(null);
    setselectedState(null);
    setselectedCountry(null);
    setselectedStatus(null);
    setselectedLocation(null);
    setPincode("");
    setEmail_id("");
    setFoundedDate("");
    setWebsiteURL("");
    setContact_no("");
    setAnnualReportURL("");
    setSelectedImage("");
    setcompany_gst_no("")
    setselectedSignatureImage("");
    if (logo.current) {
      logo.current.value = null;
    }
    if (sign.current) {
      sign.current.value = null;
    }
  };

  console.log(selectedRow)

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
      setCompany_no(selectedRow.company_no || "");
      setCompany_name(selectedRow.company_name || "");
      setShort_name(selectedRow.short_name || "");
      setAddress1(selectedRow.address1 || "");
      setAddress2(selectedRow.address2 || "");
      setAddress3(selectedRow.address3 || "");
      setcompany_gst_no(selectedRow.company_gst_no || "");
      setSelectedCity({
        label: selectedRow.city,
        value: selectedRow.city,
      });
      setCity(selectedRow.city || "")
      setselectedState({
        label: selectedRow.state,
        value: selectedRow.state,
      });
      setState(selectedRow.state || "")
      setselectedCountry({
        label: selectedRow.country,
        value: selectedRow.country,
      });
      setCountry(selectedRow.country || "")
      setselectedStatus({
        label: selectedRow.status,
        value: selectedRow.status,
      });
      setStatus(selectedRow.status || '')
      setselectedLocation({
        label: selectedRow.location_no,
        value: selectedRow.location_no,
      });
      setlocation_no(selectedRow.location_no || "")
      setPincode(selectedRow.pincode || "");
      setEmail_id(selectedRow.email_id || "");
      setWebsiteURL(selectedRow.websiteURL || "");
      setContact_no(selectedRow.contact_no || "");
      setAnnualReportURL(selectedRow.annualReportURL || "");

      if (selectedRow.foundedDate) {
        const formattedDate = new Date(selectedRow.foundedDate).toISOString().split("T")[0];
        setFoundedDate(formattedDate);
      } else {
        setFoundedDate("");
      }

      if (selectedRow.company_logo && selectedRow.company_logo.data) {
        const base64Image = arrayBufferToBase64(selectedRow.company_logo.data);
        const file = base64ToFile(`data:image/jpeg;base64,${base64Image}`, 'company_logo.jpg');
        setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
        setCompanyImage(file)
      } else {
        setSelectedImage(null);
      }

      if (selectedRow.authorisedSignatur && selectedRow.authorisedSignatur.data) {
        const base64Image = arrayBufferToBase64(selectedRow.authorisedSignatur.data);
        const file = base64ToFile(`data:image/jpeg;base64,${base64Image}`, 'authorisedSignatur.jpg');
        setselectedSignatureImage(`data:image/jpeg;base64,${base64Image}`);
        setSignatureImage(file)
      } else {
        setselectedSignatureImage(null);
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

  const handleRemoveLogo = () => {
    setSelectedImage(null);
    if (logo.current) {
      logo.current.value = "";
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.warning("File size exceeds 1MB. Please upload a smaller file.");
        event.target.value = null;
        return;
      }

      const newUrl = URL.createObjectURL(file);
      setSelectedImage(newUrl);
      setCompanyImage(file);
    }
  };

  const handleRemoveSignature = () => {
    setselectedSignatureImage(null);
    if (logo.current) {
      logo.current.value = "";
    }
  };

  const handleFileSignature = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.warning('File size exceeds 1MB. Please upload a smaller file.');
        event.target.value = null;
        return;
      }
      setselectedSignatureImage(URL.createObjectURL(file));
      setSignatureImage(file);
    }
  };

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
      .then((val) => setDrop(val))
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
      .then((val) => setCondrop(val))
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
      .then((val) => setStatedrop(val))
      .catch((error) => console.error('Error fetching data:', error));
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

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/locationno`)
      .then((data) => data.json())
      .then((val) => setLocationdrop(val));
  }, []);

  const filteredOptionCity = drop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionState = statedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionCountry = condrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionLocation = locationnodrop.map((option) => ({
    value: option.location_no,
    label: `${option.location_no} - ${option.location_name}`,
  }));

  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setCity(selectedCity ? selectedCity.value : '');
  };

  const handleChangeState = (selectedState) => {
    setselectedState(selectedState);
    setState(selectedState ? selectedState.value : '');
  };

  const handleChangeCountry = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setCountry(selectedCountry ? selectedCountry.value : '');
  };

  const handleChangeStatus = (selectedStatus) => {
    setselectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
  };

  const handleChangeLocation = (selectedLocation) => {
    setselectedLocation(selectedLocation);
    setlocation_no(selectedLocation ? selectedLocation.value : '');
  };

  const handleInsert = async () => {
    if (
      !company_no ||
      !company_name ||
      !address1 ||
      !address2 ||
      !city ||
      !state ||
      !pincode ||
      !country ||
      !email_id ||
      !status ||
      !contact_no ||
      !location_no
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    if (!validateEmail(email_id)) {
      toast.warning("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("company_no", company_no);
      formData.append("company_name", company_name);
      formData.append("short_name", short_name);
      formData.append("address1", address1);
      formData.append("address2", address2);
      formData.append("address3", address3);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pincode", pincode);
      formData.append("country", country);
      formData.append("email_id", email_id);
      formData.append("status", status);
      formData.append("foundedDate", foundedDate);
      formData.append("contact_no", contact_no);
      formData.append("annualReportURL", annualreportURL);
      formData.append("websiteURL", websiteURL);
      formData.append("location_no", location_no);
      formData.append("company_gst_no", company_gst_no);
      formData.append("created_by", sessionStorage.getItem('selectedUserCode'));

      if (companyImage) {
        formData.append("company_logo", companyImage);
      }

      if (SignatureImage) {
        formData.append("authorisedSignatur", SignatureImage);
      }

      const response = await fetch(`${config.apiBaseUrl}/add`, {
        method: "POST",
        body: formData,
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {
        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message, {
      });
    } finally {
      setLoading(false);
    }
  };

  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleNavigate = () => {
    navigate("/Company");
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

  const handleUpdate = async () => {
    if (
      !company_no ||
      !company_name ||
      !address1 ||
      !address2 ||
      !selectedCity ||
      !selectedState ||
      !pincode ||
      !selectedCountry ||
      !email_id ||
      !selectedStatus ||
      !contact_no ||
      !location_no ||
      !companyImage
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    if (!validateEmail(email_id)) {
      toast.warning("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("company_no", company_no);
      formData.append("company_name", company_name);
      formData.append("short_name", short_name);
      formData.append("address1", address1);
      formData.append("address2", address2);
      formData.append("address3", address3);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pincode", pincode);
      formData.append("country", country);
      formData.append("email_id", email_id);
      formData.append("status", status);
      formData.append("foundedDate", foundedDate);
      formData.append("contact_no", contact_no);
      formData.append("annualReportURL", annualreportURL);
      formData.append("websiteURL", websiteURL);
      formData.append("location_no", location_no);
      formData.append("company_gst_no", company_gst_no);
      formData.append("modified_by", sessionStorage.getItem('selectedUserCode'));

      if (companyImage) {
        formData.append("company_logo", companyImage);
      }

      if (SignatureImage) {
        formData.append("authorisedSignatur", SignatureImage);
      }

      const response = await fetch(`${config.apiBaseUrl}/CompanyUpdate`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        console.log("Data Updated successfully");
        setIsUpdated(true);
        clearInputFields();
        toast.success("Data Updated successfully!")
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
    <div class="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">

          <h1 className="page-title">
            {mode === "update" ? "Update Company" : "Add Company"}
          </h1>

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
                id="cno"
                class="exp-input-field form-control"
                type="text"
                autoComplete="off"
                placeholder=" "
                required
                value={company_no}
                onChange={(e) => setCompany_no(e.target.value)}
                maxLength={18}
                ref={companycode}
                onKeyDown={(e) => handleKeyDown(e, companyname, companycode)}
                readOnly={mode === "update"}
              />
              <label for="cno" className={`exp-form-labels ${error && !company_no ? 'text-danger' : ''}`}>Company Code<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="cname"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                required
                value={company_name}
                onChange={(e) => setCompany_name(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, shortname, companyname)}
                maxLength={250}
                autoComplete="off"
                ref={companyname}
              />
              <label className={`exp-form-labels ${error && !company_name ? 'text-danger' : ''}`}>Company Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="sname"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                required
                autoComplete="off"
                value={short_name}
                onChange={(e) => setShort_name(e.target.value)}
                maxLength={250}
                ref={shortname}
                onKeyDown={(e) => handleKeyDown(e, Address1, shortname)}
              />
              <label for="sname" className="exp-form-labels">Short Name</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="add1"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                required
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                maxLength={250}
                ref={Address1}
                autoComplete="off"
                onKeyDown={(e) => handleKeyDown(e, Address2, Address1)}
              />
              <label for="add1" className={`exp-form-labels ${error && !address1 ? 'text-danger' : ''}`}>Address 1<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="add2"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                required title="Please enter the address"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                maxLength={250}
                ref={Address2}
                autoComplete="off"
                onKeyDown={(e) => handleKeyDown(e, Address3, Address2)}
              />
              <label for="add2" className={`exp-form-labels ${error && !address2 ? 'text-danger' : ''}`}>Address 2<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                required title="Please enter the address"
                value={address3}
                onChange={(e) => setAddress3(e.target.value)}
                maxLength={250}
                ref={Address3}
                autoComplete="off"
                onKeyDown={(e) => handleKeyDown(e, City, Address3)}
              />
              <label for="add3" className="exp-form-labels">Address 3</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedCity ? "has-value" : ""} 
              ${isSelectCity ? "is-focused" : ""}`}
            >
              <Select
                id="city"
                value={selectedCity}
                onChange={handleChangeCity}
                options={filteredOptionCity}
                placeholder=" "
                onFocus={() => setIsSelectCity(true)}
                onBlur={() => setIsSelectCity(false)}
                classNamePrefix="react-select"
                isClearable
                ref={City}
                onKeyDown={(e) => handleKeyDown(e, State, City)}
              />
              <label For="city" className={`floating-label ${error && !city ? 'text-danger' : ''}`}>City<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedState ? "has-value" : ""} 
              ${isSelectState ? "is-focused" : ""}`}
            >
              <Select
                id="state"
                isClearable
                value={selectedState}
                onChange={handleChangeState}
                options={filteredOptionState}
                classNamePrefix="react-select"
                placeholder=" "
                onFocus={() => setIsSelectState(true)}
                onBlur={() => setIsSelectState(false)}
                ref={State}
                onKeyDown={(e) => handleKeyDown(e, Pincode, State)}
              />
              <label for="state" className={`floating-label ${error && !state ? 'text-danger' : ''}`}>State<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="pin"
                class="exp-input-field form-control"
                type="number"
                autoComplete="off"
                placeholder=" "
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 100))}
                maxLength={100}
                ref={Pincode}
                onKeyDown={(e) => handleKeyDown(e, Country, Pincode)}
              />
              <label for="state" className={`exp-form-labels ${error && !pincode ? 'text-danger' : ''}`}>Pin Code<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedCountry ? "has-value" : ""} 
              ${isSelectCountry ? "is-focused" : ""}`}
            >
              <Select
                id="country"
                isClearable
                value={selectedCountry}
                onChange={handleChangeCountry}
                options={filteredOptionCountry}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectCountry(true)}
                onBlur={() => setIsSelectCountry(false)}
                ref={Country}
                onKeyDown={(e) => handleKeyDown(e, Email, Country)}
              />
              <label for="state" className={`floating-label ${error && !country ? 'text-danger' : ''}`}>Country<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="email"
                className="exp-input-field form-control"
                type="email"
                placeholder=" "
                autoComplete="off"
                required
                value={email_id}
                onChange={(e) => setEmail_id(e.target.value)}
                maxLength={150}
                ref={Email}
                onKeyDown={(e) => handleKeyDown(e, Status, Email)}
              />
              <label for="state" className={`exp-form-labels ${error && !email_id ? 'text-danger' : ''}`}>Email<span className="text-danger">*</span></label>
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
                placeholder=""
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
                ref={Status}
                onKeyDown={(e) => handleKeyDown(e, found, Status)}
              />
              <label for="state" className={`floating-label ${error && !status ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=" "
                autoComplete="off"
                required
                value={foundedDate}
                ref={found}
                onChange={(e) => setFoundedDate(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, WebsiteUrl, found)}
              />
              <label for="state" className="exp-form-labels">Founded Date</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="wurl"
                class="exp-input-field form-control"
                type="url"
                placeholder=" "
                autoComplete="off"
                required
                value={websiteURL}
                onChange={(e) => setWebsiteURL(e.target.value)}
                maxLength={150}
                ref={WebsiteUrl}
                onKeyDown={(e) => handleKeyDown(e, ContactNo, WebsiteUrl)}
              />
              <label for="wurl" className="exp-form-labels">Website URL</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="contno"
                class="exp-input-field form-control"
                type="number"
                placeholder=" "
                autoComplete="off"
                required
                value={contact_no}
                onChange={(e) => setContact_no(e.target.value.replace(/\D/g, '').slice(0, 50))}
                ref={ContactNo}
                onKeyDown={(e) => handleKeyDown(e, annaual, ContactNo)}
              />
              <label for="state" className={`exp-form-labels ${error && !contact_no ? 'text-danger' : ''}`}>Contact No<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="report"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                autoComplete="off"
                value={annualreportURL}
                onChange={(e) => setAnnualReportURL(e.target.value)}
                maxLength={150}
                ref={annaual}
                onKeyDown={(e) => handleKeyDown(e, companyGST, annaual)}
              />
              <label for="report" className="exp-form-labels">Annual Report URL</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="cusgstno"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                required
                autoComplete="off"
                value={company_gst_no}
                onChange={(e) => setcompany_gst_no(e.target.value)}
                maxLength={15}
                ref={companyGST}
                onKeyDown={(e) => handleKeyDown(e, locatioN, companyGST)}
              />
              <label for="cusgstno" className="exp-form-labels">GST No</label>
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
                value={selectedLocation}
                isClearable
                onChange={handleChangeLocation}
                options={filteredOptionLocation}
                classNamePrefix="react-select"
                placeholder=" "
                onFocus={() => setIsSelectLocation(true)}
                onBlur={() => setIsSelectLocation(false)}
                ref={locatioN}
                onKeyDown={(e) => handleKeyDown(e, logo, locatioN)}
              />
              <label for="locno" className={`floating-label ${error && !location_no ? 'text-danger' : ''}`}>Location No<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <div className="image-upload-container">
                {selectedImage ? (
                  <div className="image-preview-box">
                    <img
                      src={selectedImage}
                      alt="Uploaded Logo"
                      className="uploaded-image"
                    />
                    <button
                      type="button"
                      className="delete-image-btn"
                      onClick={handleRemoveLogo}
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder-box">
                    <div className="upload-icon-text">
                      <i className="fa-regular fa-image upload-icon me-1"></i>
                      <span>Upload Logo</span>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  id="locno"
                  className="exp-input-field form-control hidden-file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={logo}
                  onKeyDown={(e) => handleKeyDown(e, sign, logo)}
                />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <div className="image-upload-container" onClick={() => sign.current.click()}>

                {selectedSignatureImage ? (
                  <div className="image-preview-box">
                    <img
                      src={selectedSignatureImage}
                      alt="Uploaded Signature"
                      className="uploaded-image"
                    />

                    <button
                      type="button"
                      className="delete-image-btn"
                      onClick={handleRemoveSignature}
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder-box">
                    <div className="upload-icon-text">
                      <i className="fa-regular fa-image upload-icon me-1"></i>
                      <span>Upload Signature</span>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  className="exp-input-field form-control hidden-file-input"
                  accept="image/*"
                  ref={sign}
                  onChange={handleFileSignature}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (mode === "update") {
                        handleUpdate();
                      } else {
                        handleInsert();
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
export default Input;