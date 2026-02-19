import React, { useState, useEffect } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import LoadingScreen from '../Loading';
import BillingHelpPopup from '../BillingHelpPopup';
import CreatableSelect from "react-select/creatable";
const config = require("../Apiconfig");

const AddMothersScanScreen = () => {

    const [SNo, setSNo] = useState('');
    const [DateOfProcedure, setDateOfProcedure] = useState('');
    const [FormFSlNo, setFormFSlNo] = useState('');
    const [Name, setName] = useState('');
    const [Address, setAddress] = useState('');
    const [Age, setAge] = useState('');
    const [MaritalStatusDrop, setMaritalStatusDrop] = useState([]);
    const [ServiceDrop, setServiceDrop] = useState([]);
    const [SelectedMaritalStatus, setSelectedMaritalStatus] = useState('');
    const [MaritalStatus, setMaritalStatus] = useState('');
    const [MobileNumber, setMobileNumber] = useState('');
    const [RCHId, setRCHId] = useState('');
    const [No_Of_Children_Male_Female, setNo_Of_Children_Male_Female] = useState('');
    const [ReferredBy, setReferredBy] = useState('');
    const [ReferredTo, setReferredTo] = useState('');
    const [ScanImpression_WeeksDrop, setScanImpression_WeeksDrop] = useState([]);
    const [SelectedScanImpression_Weeks, setSelectedScanImpression_Weeks] = useState('');
    const [ScanImpression_Weeks, setScanImpression_Weeks] = useState('');
    const [ScanImpression_DaysDrop, setScanImpression_DaysDrop] = useState([]);
    const [SelectedScanImpression_Days, setSelectedScanImpression_Days] = useState('');
    const [SelectedService, setSelectedService] = useState('');
    const [ScanImpression_Days, setScanImpression_Days] = useState('');
    const [Service, setService] = useState('');
    const [LMP, setLMP] = useState('');
    const [MTPAdvice, setMTPAdvice] = useState("");
    const [PatientID, setPatientID] = useState("");
    const [Price, setPrice] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [open1, setOpen1] = React.useState(false);
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [Genderdrop, setGenderdrop] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [gender, setGender] = useState("");

    useEffect(() => {
        const currentDate = new Date().toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
        setDateOfProcedure(currentDate);
        // setLMP(currentDate);
    }, []);

    const handleSalesData = () => {
        setOpen1(true);
    };

    const handleClose = () => {
        setOpen1(false);
    };


    //UseEffects for Dropdown
    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');

        fetch(`${config.apiBaseUrl}/getMaritalStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setMaritalStatusDrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');

        fetch(`${config.apiBaseUrl}/getWeeks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setScanImpression_WeeksDrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');

        fetch(`${config.apiBaseUrl}/getDays`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setScanImpression_DaysDrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/GetServiceName`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => {
                setServiceDrop(val);

                // const noneOption = val.find(
                //     (option) =>
                //         option.ServiceID.toLowerCase() === "none" &&
                //         option.ServiceName.toLowerCase() === "none"
                // );

                // if (noneOption) {
                //     const defaultValue = {
                //         value: noneOption.ServiceID,
                //         label: `${noneOption.ServiceID}-${noneOption.ServiceName}`,
                //     };
                //     setSelectedService(defaultValue);
                //     setService(noneOption.ServiceID);
                // }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/getDoctorDropdown`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        company_code: sessionStorage.getItem("selectedCompanyCode"),
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch doctors");
                }

                const data = await response.json();

                const formattedOptions = data.map((doc) => ({
                    value: doc.DoctorName,
                    label: `${doc.DoctorID}-${doc.DoctorName}`,
                }));

                setDoctorOptions(formattedOptions);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchDoctors();
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');

        fetch(`${config.apiBaseUrl}/gender`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                setGenderdrop(val);

                const femaleOption = val.find(
                    (option) => option.attributedetails_name.toLowerCase() === "female"
                );

                if (femaleOption) {
                    const defaultGender = {
                        value: femaleOption.attributedetails_name,
                        label: femaleOption.attributedetails_name,
                    };
                    setSelectedGender(defaultGender);
                    setGender(defaultGender.value);
                }
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleChangeMaritalStatus = (SelectedMaritalStatus) => {
        setSelectedMaritalStatus(SelectedMaritalStatus);
        setMaritalStatus(SelectedMaritalStatus ? SelectedMaritalStatus.value : "");
    };

    const handleChangeWeeks = (SelectedScanImpression_Weeks) => {
        setSelectedScanImpression_Weeks(SelectedScanImpression_Weeks);
        setScanImpression_Weeks(SelectedScanImpression_Weeks ? SelectedScanImpression_Weeks.value : "");
    };

    const handleChangeDays = (SelectedScanImpression_Days) => {
        setSelectedScanImpression_Days(SelectedScanImpression_Days);
        setScanImpression_Days(SelectedScanImpression_Days ? SelectedScanImpression_Days.value : "");
    };

    const handleChangeService = (SelectedService) => {
        setSelectedService(SelectedService);
        // setService(SelectedService ? SelectedService.value : "");

        if (SelectedService && SelectedService.length > 0) {
            const selectedValues = SelectedService.map(option => option.value);
            setService(selectedValues.join(","));
        } else {
            setService("");
        }
    };

    const handleChangeGender = (selectedGender) => {
        setSelectedGender(selectedGender);
        setGender(selectedGender ? selectedGender.value : '');
    };

    const filteredOptionMaritalStatus = MaritalStatusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionService = ServiceDrop.map((option) => ({
        value: option.ServiceID,
        label: `${option.ServiceID}-${option.ServiceName}`,
    }));

    const filteredOptionWeeks = ScanImpression_WeeksDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionDays = ScanImpression_DaysDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionGender = Genderdrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const handleSave = async () => {
        if (!Name) {
            setError(" ");
            toast.warning('Error: Missing required fields');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/ANC_Mothers_ScanInsert`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    DateOfProcedure,
                    FormFSlNo,
                    Name,
                    Address,
                    Age: Age ? Age : 0,
                    MaritalStatus,
                    Types_of_Scan: Service ? Service : "None",
                    MobileNumber,
                    RCHId,
                    No_Of_Children_Male_Female,
                    ReferredBy,
                    ScanImpression_Weeks,
                    ScanImpression_Days,
                    LMP: LMP,
                    MTPAdvice,
                    ReferredTo,
                    PatientID,
                    Gender:gender,
                    Price: Price ? Price : 0,
                    company_code: sessionStorage.getItem("selectedCompanyCode"),
                    created_by: sessionStorage.getItem('selectedUserCode'),
                }),
            });

            if (response.ok) {
                const searchData = await response.json();
                const [{ SNo }] = searchData;
                setSNo(SNo);

                toast.success(`Data inserted successfully. Serial No: ${SNo}`, {
                    onClose: () => window.location.reload(),
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
        navigate("/MothersScan");
    };

    const handleBilling = async (data) => {
        if (data && data.length > 0) {
            const [{ PatientName, ContactNumber, Gender, Age }] = data;

            const patientName = document.getElementById('name');
            if (patientName) {
                patientName.value = PatientName;
                setName(PatientName);
            } else {
                console.error('name element not found');
            }

            const contactNumber = document.getElementById('mobile_number');
            if (contactNumber) {
                contactNumber.value = ContactNumber;
                setMobileNumber(ContactNumber);
            } else {
                console.error('mobile number element not found');
            }

            const age = document.getElementById('age');
            if (age) {
                age.value = Age;
                setAge(Age);
            } else {
                console.error('age element not found');
            }

        } else {
            console.log("Data not fetched...!");
        }
    };

    return (
        <div className="container-fluid Topnav-screen">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="d-flex p-3 bg-white rounded-2 justify-content-between align-items-center mb-2 shadow-sm">
                <h2 className="mb-0 ms-3 purbut">Add ANC Mothers Scan</h2>
                <button type="button" className="close btn purbut btn-danger" onClick={handleNavigate} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>

                <div class="mobileview">
                    <div class="d-flex justify-content-between">
                        <div className="d-flex justify-content-start">
                            <h1 align="left" className="h1">
                                Add ANC Mothers Scan
                            </h1>
                        </div>
                        <button type="button" className="close btn btn-danger mt-2" style={{ width: 45, height: 45 }} onClick={handleNavigate} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="card p-3 mb-3 shadow-sm">
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">Patient ID</label>
                        <div className="position-relative">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Patient ID"
                                value={PatientID}
                                onChange={(e) => setPatientID(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className={`form-label fw-semibold d-flex justify-content-start ${error && !Name ? 'text-danger' : ''}`}>Name<span className="text-danger">*</span></label>
                        <div className="position-relative">
                            <input
                                id="name"
                                className="form-control"
                                type="text"
                                placeholder="Enter Name"
                                value={Name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <span className="position-absolute searchIcon top-50 end-0 translate-middle-y me-3 text-muted" onClick={handleSalesData}>
                                <i className="fa fa-search"></i>
                            </span>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">Age </label>
                        <input
                            id="age"
                            className="form-control"
                            type="text"
                            value={Age}
                            maxLength={3}
                            placeholder="Enter Age"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setAge(value);
                                }
                            }}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className={`form-label fw-semibold d-flex justify-content-start `}>Address</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Address"
                            value={Address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className={`form-label fw-semibold d-flex justify-content-start`}>LMP </label>
                        <input
                            className="form-control"
                            type="date"
                            value={LMP}
                            onChange={(e) => setLMP(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            placeholder="Enter LMP "
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">Mobile Number</label>
                        <input
                            id="mobile_number"
                            className="form-control"
                            type="text"
                            placeholder="Enter Mobile Number "
                            value={MobileNumber}
                            maxLength={10}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setMobileNumber(value);
                                }
                            }}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">RCH Id </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter RCH Id "
                            value={RCHId}
                            onChange={(e) => setRCHId(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">No Of Children Male / Female</label>
                        <textarea
                            className="form-control"
                            type="text"
                            placeholder="Enter No Of Children Male / Female"
                            value={No_Of_Children_Male_Female}
                            onChange={(e) => setNo_Of_Children_Male_Female(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">Referred Doctor</label>
                        <CreatableSelect
                            className=""
                            isClearable
                            options={doctorOptions}
                            placeholder="Enter Referred By Doctor"
                            value={
                                doctorOptions.find((opt) => opt.value === ReferredBy) ||
                                (ReferredBy ? { value: ReferredBy, label: ReferredBy } : null)
                            }
                            onChange={(newValue) => {
                                if (newValue) {
                                    setReferredBy(newValue.value);
                                } else {
                                    setReferredBy(null);
                                }
                            }}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className={`form-label fw-semibold d-flex justify-content-start`}>Scan Impression Weeks</label>
                        <Select
                            value={SelectedScanImpression_Weeks}
                            onChange={handleChangeWeeks}
                            options={filteredOptionWeeks}
                            placeholder="Enter Scan Impression Weeks"
                        />
                    </div>
                    <div className="col-md-3">
                        <label className={`form-label fw-semibold d-flex justify-content-start`}>Scan Impression Days</label>
                        <Select
                            value={SelectedScanImpression_Days}
                            onChange={handleChangeDays}
                            options={filteredOptionDays}
                            placeholder="Enter Scan Impression Days" />
                    </div>
                    {/* <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">S.No</label>
                        <div className="position-relative">
                            <input
                               className="form-control"
                                type="number"
                                
                                value={SNo}
                                onChange={(e) => setSNo(e.target.value)}
                            />
                        </div>
                    </div> */}
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">Referred To Sister</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Referred To Sister"
                            value={ReferredTo}
                            onChange={(e) => setReferredTo(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className={`form-label fw-semibold d-flex justify-content-start ${error && !DateOfProcedure ? 'text-danger' : ''}`}>Date Of Procedure<span className="text-danger">*</span></label>
                        <input
                            className="form-control"
                            type="date"
                            value={DateOfProcedure}
                            onChange={(e) => setDateOfProcedure(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className={`form-label fw-semibold d-flex justify-content-start`}>Form F S.No</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Form F S.No "
                            value={FormFSlNo}
                            onChange={(e) => setFormFSlNo(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className={`form-label fw-semibold d-flex justify-content-start `}>Marital Status</label>
                        <Select
                            placeholder="Select Marital Status"
                            value={SelectedMaritalStatus}
                            className=""
                            onChange={handleChangeMaritalStatus}
                            options={filteredOptionMaritalStatus}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">MTP Advice </label>
                        <input
                            className="form-control"
                            type="text"
                            value={MTPAdvice}
                            onChange={(e) => setMTPAdvice(e.target.value)}
                            placeholder="Enter MTP Advice "
                        />
                    </div>
                    <div className="col-md-3">
                        <label className={`form-label fw-semibold d-flex justify-content-start`}>Types Of Scan</label>
                        <Select
                            value={SelectedService}
                            onChange={handleChangeService}
                            options={filteredOptionService}
                            placeholder="Enter Type Of Scans"
                            isMulti
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">Price</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Price"
                            value={Price}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setPrice(value);
                                }
                            }}
                        />
                    </div>
                    <div className="col-md-3 form-group mb-2">
                        <label className="form-label fw-semibold d-flex justify-content-start">
                            Gender
                        </label>
                        <div title="Select the Gender">
                            <Select
                                id="gender"
                                value={selectedGender}
                                onChange={handleChangeGender}
                                options={filteredOptionGender}
                                placeholder=""
                                maxLength={50}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 d-flex align-items-end gap-2">
                        <button className="btn btn-primary" onClick={handleSave}>
                            <i className="bi bi-save" /> Save
                        </button>
                    </div>
                    <div>
                        <BillingHelpPopup open={open1} handleClose={handleClose} handleBilling={handleBilling} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMothersScanScreen;