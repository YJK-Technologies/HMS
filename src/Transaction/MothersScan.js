import { useState, useEffect } from "react";
import Select from "react-select";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '../Loading';
import { showConfirmationToast } from '../ToastConfirmation';
import * as XLSX from "xlsx-js-style";
import CreatableSelect from "react-select/creatable";

const config = require("../Apiconfig");

const ANC_Mothers_ScanScreen = () => {

    const [rowData, setRowData] = useState([]);
    const [maritalStatusDrop, setMaritalStatusdrop] = useState([]);
    const [scanImpression_WeeksDrop, setScanImpression_Weeksdrop] = useState([]);
    const [scanImpression_DaysDrop, setScanImpression_Daysdrop] = useState([]);
    const [SNo, setSNo] = useState('');
    const [FromDate, setFromDate] = useState('');
    const [ToDate, setToDate] = useState('');
    const [FormFSlNo, setFormFSlNo] = useState('');
    const [Name, setName] = useState('');
    const [Address, setAddress] = useState('');
    const [Age, setAge] = useState('');
    const [MaritalStatusDrop, setMaritalStatusDrop] = useState([]);
    const [ServiceDrop, setServiceDrop] = useState([]);
    const [Servicedrop, setServicedrop] = useState([]);
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
    const [loading, setLoading] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [editedData, setEditedData] = useState([]);
    const companyName = sessionStorage.getItem('selectedCompanyName');
    const [doctorOptions, setDoctorOptions] = useState([]);
    const navigate = useNavigate();
    const [Genderdrop, setGenderdrop] = useState([]);
    const [GenderDrop, setGenderDrop] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [gender, setGender] = useState("");

    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const MothersScanPermission = permissions
        .filter(permission => permission.screen_type === 'MothersScan')
        .map(permission => permission.permission_type.toLowerCase());

    useEffect(() => {
        const currentDate = new Date().toISOString().split("T")[0];
        setFromDate(currentDate);
        setToDate(currentDate);
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

    const columnDefs = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            headerName: "Date Of Procedure",
            field: "DateOfProcedure",
            editable: true,
        },
        {
            headerName: "No",
            field: "No"
        },
        {
            headerName: "Form F S.No",
            field: "FormFSlNo",
            editable: true,
        },
        {
            headerName: "S.No",
            field: "SNo"
        },
        {
            headerName: "Patient ID",
            field: "PatientID",
            editable: true,
        },
        {
            headerName: "Name",
            field: "Name",
            editable: true,
        },
        {
            headerName: "Address",
            field: "Address",
            editable: true,
        },
        {
            headerName: "Age",
            field: "Age",
            editable: true,
        },
        {
            headerName: "Marital Status",
            field: "MaritalStatus",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: maritalStatusDrop
            },
            editable: true,
        },
        {
            headerName: "Types Of Scan",
            field: "Types_of_Scan",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: Servicedrop.map(s => s.ServiceID),
            },
            valueFormatter: (params) => {
                if (!params.value) return "";
                const serviceIds = params.value.toString().split(",");
                const names = serviceIds.map(id => {
                    const service = Servicedrop.find(s => s.ServiceID === id.trim());
                    return service ? service.ServiceName : id;
                });
                return names.join(", ");
            },
            editable: true,
        },
        {
            headerName: "Price",
            field: "Price",
            editable: true,
        },
        {
            headerName: "Mobile Number",
            field: "MobileNumber",
            editable: true,
            cellEditor: 'agTextCellEditor',
            cellEditorParams: {
                useFormatter: true,
                maxLength: 10,
            },
            valueSetter: (params) => {
                if (/^\d*$/.test(params.newValue)) {
                    params.data.MobileNumber = params.newValue;
                    return true;
                }
                return false;
            }
        },
        {
            headerName: "RCH Id",
            field: "RCHId",
            editable: true,
        },
        {
            headerName: "No Of Children Male / Female",
            field: "No_Of_Children_Male_Female",
            editable: true,
        },
        {
            headerName: "Referred Doctor",
            field: "ReferredBy",
            editable: true,
        },
        {
            headerName: "Referred To Sister",
            field: "ReferredTo",
            editable: true,
        },
        {
            headerName: "Scan Impression Weeks",
            field: "ScanImpression_Weeks",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: scanImpression_WeeksDrop
            },
            editable: true,
        },
        {
            headerName: "Scan Impression Days",
            field: "ScanImpression_Days",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: scanImpression_DaysDrop
            },
            editable: true,
        },
        {
            headerName: "LMP",
            field: "LMP",
            editable: true,
        },
        {
            headerName: "MTP Advice",
            field: "MTPAdvice",
            editable: true,
        },
        {
            headerName: "Gender",
            field: "Gender",
            cellEditor: "agSelectCellEditor",
            editable: true,
            cellEditorParams: {
                values: Genderdrop
            },
        }
    ];

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
            .then((data) => {
                const maritalStatus = data.map(option => option.attributedetails_name);
                setMaritalStatusdrop(maritalStatus);
            })
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
            .then((data) => {
                const weeks = data.map(option => option.attributedetails_name);
                setScanImpression_Weeksdrop(weeks);
            })
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
            .then((data) => {
                const weeks = data.map(option => option.attributedetails_name);
                setScanImpression_Daysdrop(weeks);
            })
            .catch((error) => console.error('Error fetching data:', error));
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
            .then((data) => {
                const gender = data.map(option => option.attributedetails_name);
                setGenderdrop(gender);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');

        fetch(`${config.apiBaseUrl}/GetServiceName`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((data) => {
                setServicedrop(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

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
            .then((val) => {
                setMaritalStatusDrop(val);
                setSelectedMaritalStatus({ value: "All", label: "All" }); // default All
                setMaritalStatus("All");
            })
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
            .then((val) => {
                setScanImpression_WeeksDrop(val);
                setSelectedScanImpression_Weeks({ value: "All", label: "All" }); // default All
                setScanImpression_Weeks("All");
            })
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
            .then((val) => {
                setScanImpression_DaysDrop(val);
                setSelectedScanImpression_Days({ value: "All", label: "All" }); // default All
                setScanImpression_Days("All");
            })
            .catch((error) => console.error('Error fetching data:', error));
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
                setGenderDrop(val);
                setSelectedGender({ value: "All", label: "All" });
                setGender("All");
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');

        fetch(`${config.apiBaseUrl}/GetServiceName`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => {
                setServiceDrop(val);
                setSelectedService({ value: "All", label: "All" });
                setService("All");
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
        setService(SelectedService ? SelectedService.value : "");
    };

    const handleChangeGender = (selectedGender) => {
        setSelectedGender(selectedGender);
        setGender(selectedGender ? selectedGender.value : '');
    };

    const filteredOptionMaritalStatus = [{ value: "All", label: "All" },
    ...MaritalStatusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    })),
    ];

    const filteredOptionService = [{ value: "All", label: "All" },
    ...ServiceDrop.map((option) => ({
        value: option.ServiceID,
        label: `${option.ServiceID}-${option.ServiceName}`,
    })),
    ];

    const filteredOptionWeeks = [{ value: "All", label: "All" },
    ...ScanImpression_WeeksDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    })),
    ];

    const filteredOptionDays = [{ value: "All", label: "All" },
    ...ScanImpression_DaysDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    })),
    ];

    const filteredOptionGender = [{ value: "All", label: "All" },
    ...GenderDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    })),
    ];

    const handleNavigatesToForm = () => {
        navigate("/AddMothersScan");
    };

    const handleNavigateWithRowData = (selectedRow) => {
        navigate("/AddMothersScan", { state: { mode: "update", selectedRow } });
    };

    const generateSerialNumberByDate = (data, dateField) => {
        let serialMap = {};
        return data.map((row) => {
            const date = row[dateField];
            if (!serialMap[date]) {
                serialMap[date] = 1;
            } else {
                serialMap[date] += 1;
            }
            return {
                ...row,
                No: serialMap[date]
            };
        });
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/GetSearchANC`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    SNo,
                    FromDate,
                    ToDate,
                    FormFSlNo,
                    Name,
                    Address,
                    Age,
                    MaritalStatus,
                    Types_of_Scan: Service,
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
                    Gender: gender,
                    company_code: sessionStorage.getItem("selectedCompanyCode"),
                })
            });
            if (response.ok) {
                let searchData = await response.json();
                searchData = generateSerialNumberByDate(searchData, "DateOfProcedure");
                setRowData(searchData);
                console.log(searchData)
                console.log("data fetched successfully")
            } else if (response.status === 404) {
                console.log("Data not found");
                toast.warning("Data not found");
                setRowData([]);
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to fetch data");
                setRowData([]);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("Error fetching search data:", error);
        } finally {
            setLoading(false);
        }
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedRows(selectedData);
    };

    const onCellValueChanged = (params) => {
        const updatedRowData = [...rowData];
        const rowIndex = updatedRowData.findIndex(
            (row) => row.SNo === params.data.SNo
        );

        if (rowIndex !== -1) {
            updatedRowData[rowIndex][params.colDef.field] = params.newValue;
            setRowData(updatedRowData);

            setEditedData((prevData) => {
                const existingIndex = prevData.findIndex(
                    (item) => item.SNo === params.data.SNo
                );

                if (existingIndex !== -1) {
                    const updatedEdited = [...prevData];
                    updatedEdited[existingIndex] = updatedRowData[rowIndex];
                    return updatedEdited;
                } else {
                    return [...prevData, updatedRowData[rowIndex]];
                }
            });
        }
    };

    const saveEditedData = async () => {
        const selectedRowsData = editedData.filter(row =>
            selectedRows.some(selectedRow =>
                selectedRow.SNo === row.SNo
            )
        );

        if (selectedRowsData.length === 0) {
            toast.warning("Please select and modify at least one row to update its data");
            return;
        }

        showConfirmationToast(
            "Are you sure you want to update the data in the selected rows?",
            async () => {
                setLoading(true);
                try {
                    const modified_by = sessionStorage.getItem('selectedUserCode');
                    const company_code = sessionStorage.getItem("selectedCompanyCode");

                    const response = await fetch(`${config.apiBaseUrl}/ANC_Baby_ScanLoopUpdate`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "modified_by": modified_by,
                            "company_code": company_code,
                        },
                        body: JSON.stringify({ ANC_Baby_ScanData: selectedRowsData }),
                        "modified_by": modified_by,
                        "company_code": company_code,
                    });

                    if (response.status === 200) {
                        toast.success("Data Updated Successfully", {
                            onClose: () => handleSearch(),
                            autoClose: 1000,
                        });
                        return;
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Failed to Updating data");
                    }
                } catch (error) {
                    console.error("Error Updating data:", error);
                    toast.error("Error Updating Data: " + error.message);
                } finally {
                    setLoading(false);
                }
            },
            () => {
                toast.info("Data updated cancelled.");
            }
        );
    };

    const deleteSelectedRows = async () => {
        const selectedRows = gridApi.getSelectedRows();

        const modified_by = sessionStorage.getItem('selectedUserCode');
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        if (selectedRows.length === 0) {
            toast.warning("Please select atleast One Row to Delete")
            return;
        }

        showConfirmationToast(
            "Are you sure you want to Delete the data in the selected rows?",
            async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${config.apiBaseUrl}/ANC_Baby_ScanLoopDelete`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "modified_by": modified_by,
                            "company_code": company_code,

                        },
                        body: JSON.stringify({ ANC_Baby_ScanData: selectedRows }),
                        "modified_by": modified_by,
                        "company_code": company_code,
                    });

                    if (response.ok) {
                        toast.success("Data Deleted successfully")
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Failed to delete data");
                    }
                } catch (error) {
                    console.error("Error deleting rows:", error);
                    toast.error('Error Deleting Data: ' + error.message);
                } finally {
                    setLoading(false);
                }
            },
            () => {
                toast.info("Data Delete cancelled.");
            }
        );
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const generateReport = () => {
        const selectedRows = gridApi.getSelectedRows();
        if (selectedRows.length === 0) {
            toast.warning("Please select at least one row to generate a report");
            return
        };

        const reportData = selectedRows.map((row) => {
            const safeValue = (val) => (val !== undefined && val !== null ? val : '');

            const serviceIds = row.Types_of_Scan ? row.Types_of_Scan.split(",") : [];

            const serviceName = serviceIds
                .map(id => {
                    const s = ServiceDrop.find(x => x.ServiceID === id.trim());
                    return s ? s.ServiceName : id;
                })
                .join(", ");

            return {
                "S.No": safeValue(row.SNo),
                "Date Of Procedure": safeValue(row.DateOfProcedure),
                "Form F S.No": safeValue(row.FormFSlNo),
                "Patient ID": safeValue(row.PatientID),
                "Name": safeValue(row.Name),
                "Address": safeValue(row.Address),
                "Age": safeValue(row.Age),
                "Types Of Scan": safeValue(serviceName),
                "Price": safeValue(row.Price),
                "Marital Status": safeValue(row.MaritalStatus),
                "Mobile Number": safeValue(row.MobileNumber),
                "RCH Id": safeValue(row.RCHId),
                "No Of Children Male / Female": safeValue(row.No_Of_Children_Male_Female),
                "Referred Doctor": safeValue(row.ReferredBy),
                "Referred To Sister": safeValue(row.ReferredTo),
                "Scan Impression Weeks": safeValue(row.ScanImpression_Weeks),
                "Scan Impression Days": safeValue(row.ScanImpression_Days),
                "LMP": safeValue(row.LMP),
                "MTP Advice": safeValue(row.MTPAdvice),
                "Gender": safeValue(row.Gender),
            };
        });

        const reportWindow = window.open("", "_blank");
        reportWindow.document.write("<html><head><title>ANC Mothers Scan</title>");
        reportWindow.document.write("<style>");
        reportWindow.document.write(`
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            h1 {
                color: maroon;
                text-align: center;
                font-size: 24px;
                margin-bottom: 30px;
                text-decoration: underline;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            th, td {
                padding: 10px;
                text-align: left;
                border: 1px solid #ddd;
                vertical-align: top;
            }
            th {
                background-color: maroon;
                color: white;
                font-weight: bold;
            }
            td {
                background-color: #fdd9b5;
            }
            tr:nth-child(even) td {
                background-color: #fff0e1;
            }
            .report-button {
                display: block;
                width: 150px;
                margin: 20px auto;
                padding: 10px;
                background-color: maroon;
                color: white;
                border: none;
                cursor: pointer;
                font-size: 16px;
                text-align: center;
                border-radius: 5px;
            }
            .report-button:hover {
                background-color: darkred;
            }
            @media print {
                .report-button {
                    display: none;
                }
                body {
                    margin: 0;
                    padding: 0;
                }
            }
          `);
        reportWindow.document.write("</style></head><body>");
        reportWindow.document.write("<h1><u>ANC Mothers Scan</u></h1>");

        reportWindow.document.write("<table><thead><tr>");
        Object.keys(reportData[0]).forEach((key) => {
            reportWindow.document.write(`<th>${key}</th>`);
        });
        reportWindow.document.write("</tr></thead><tbody>");

        reportData.forEach((row) => {
            reportWindow.document.write("<tr>");
            Object.values(row).forEach((value) => {
                reportWindow.document.write(`<td>${value}</td>`);
            });
            reportWindow.document.write("</tr>");
        });

        reportWindow.document.write("</tbody></table>");

        reportWindow.document.write(
            '<button class="report-button" title="Print" onclick="window.print()">Print</button>'
        );
        reportWindow.document.write("</body></html>");
        reportWindow.document.close();
    };

    const transformRowData = (data) => {
        if (!Array.isArray(data)) return [];

        return data.map((row, index) => {
            const serviceIds = row.Types_of_Scan ? row.Types_of_Scan.split(",") : [];

            const serviceName = serviceIds
                .map(id => {
                    const s = ServiceDrop.find(x => x.ServiceID === id.trim());
                    return s ? s.ServiceName : id;
                })
                .join(", ");

            return [
                row.SNo,
                row.DateOfProcedure || "",
                row.FormFSlNo?.toString() || "",
                row.PatientID || "",
                row.Name || "",
                row.Address || "",
                row.Age?.toString() || "",
                row.MaritalStatus || "",
                serviceName || "",
                row.Price?.toString() || "",
                row.MobileNumber?.toString() || "",
                row.RCHId?.toString() || "",
                row.No_Of_Children_Male_Female?.toString() || "",
                row.ReferredBy || "",
                row.ReferredTo || "",
                `${row.ScanImpression_Weeks || ""} ${row.ScanImpression_Days || ""}`,
                row.LMP || "",
                row.MTPAdvice || "",
                row.Gender || ""
            ];
        });
    };

    const handleExportToExcel = async () => {
        if (!Array.isArray(rowData) || rowData.length === 0) {
            toast.warning("There is no data to export.");
            return;
        }

        try {
            const response = await fetch(`${config.apiBaseUrl}/GetExcelMother_Scan`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    SNo,
                    FromDate,
                    ToDate,
                    FormFSlNo,
                    Name,
                    Address,
                    Age,
                    MaritalStatus,
                    Types_of_Scan: Service,
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
                    Gender: gender,
                    company_code: sessionStorage.getItem("selectedCompanyCode"),
                }),
            });

            let summaryData = null;
            if (response.ok) {
                const data = await response.json();
                summaryData = data[0];
            }

            const headerData = [
                ["List of ANC Mothers Scan Findings (More than 12 Weeks)"],
                [`Name of Scan Center: ${companyName || "-"}`],
                ["PC - PNDT Reg No.: PNA/"],
                [`Month: ${summaryData?.MonthRange || "-"}`],
                [""]
            ];

            const columnHeaders = [
                "S.no", "Date of Procedure", "Sl. No. of Form F", "Patient ID", "Name", "Address", "Age",
                "Marital Status", "Types Of Scan", "Price", "Mobile Number", "RCH id", "No of Children Male / Female",
                "Referred Doctor", "Referred To Sister", "Scan Impression", "LMP", "MTP advice if any", "Gender"
            ];

            const transformedData = transformRowData(rowData);

            const summaryRows = summaryData ? [
                [], ["Summary"],
                [`Total Scans: ${summaryData.TotalScans}`],
                [`Below 12 Weeks: ${summaryData.Below12Weeks}`],
                [`12 Weeks or Above: ${summaryData.AboveOrEqual12Weeks}`],
                [`MTP Advice Given: ${summaryData.MTPAdviceCount}`],
            ] : [];

            const finalData = [
                ...headerData,
                columnHeaders,
                ...transformedData,
                ...summaryRows
            ];

            const ws = XLSX.utils.aoa_to_sheet(finalData);

            // merges and widths
            ws["!merges"] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 17 } },
                { s: { r: 1, c: 0 }, e: { r: 1, c: 17 } },
                { s: { r: 2, c: 0 }, e: { r: 2, c: 17 } },
                { s: { r: 3, c: 0 }, e: { r: 3, c: 17 } },
            ];
            ws["!cols"] = [
                { wch: 6 }, { wch: 18 }, { wch: 15 }, { wch: 20 },
                { wch: 25 }, { wch: 6 }, { wch: 15 }, { wch: 15 },
                { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 25 },
                { wch: 15 }, { wch: 20 }
            ];

            // ---- STYLE: borders + bold header ----
            const borderAllThin = {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            };

            const headerRow = headerData.length;              // row index of column headers
            const startDataRow = headerRow + 1;               // first data row index
            const lastDataRow = headerRow + transformedData.length; // last data row index
            const colCount = columnHeaders.length;

            // Bold + border for header row
            for (let c = 0; c < colCount; c++) {
                const addr = XLSX.utils.encode_cell({ r: headerRow, c });
                if (!ws[addr]) ws[addr] = { t: "s", v: "" };
                ws[addr].s = {
                    font: { bold: true },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: borderAllThin,
                };
            }

            // Borders for all data cells
            for (let r = startDataRow; r <= lastDataRow; r++) {
                for (let c = 0; c < colCount; c++) {
                    const addr = XLSX.utils.encode_cell({ r, c });
                    if (!ws[addr]) ws[addr] = { t: "s", v: "" }; // ensure cell exists so style applies
                    ws[addr].s = {
                        ...(ws[addr].s || {}),
                        border: borderAllThin,
                    };
                }
            }

            // (Optional) make the "Summary" label bold
            if (summaryData) {
                const summaryLabelRow = lastDataRow + 2; // empty row + "Summary" row
                const addr = XLSX.utils.encode_cell({ r: summaryLabelRow, c: 0 });
                if (ws[addr]) {
                    ws[addr].s = { font: { bold: true } };
                }
            }

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "ANC Mothers Scan");
            XLSX.writeFile(wb, "ANC_Mothers_Scan.xlsx");
        } catch (err) {
            console.error("Excel Export Error:", err);
            toast.error("Failed to export Excel");
        }
    };

    return (
        <div className="container-fluid Topnav-screen">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="d-flex p-3 bg-body-tertiary rounded-2 justify-content-between align-items-center mb-2 shadow-sm">
                <h2 className="mb-0 purbut fs-3">ANC Mothers Scan</h2>
                <div className="d-sm-flex purbut">
                    {["add", "all permission"].some((permission) => MothersScanPermission.includes(permission)) && (
                        <addbutton className="purbut" title="Add ANC Mothers Scan" onClick={handleNavigatesToForm}>
                            <i class="fa-solid fa-user-plus"></i>
                        </addbutton>
                    )}
                    {["delete", "all permission"].some((permission) => MothersScanPermission.includes(permission)) && (
                        <delbutton className="purbut" title="Delete ANC Mothers Scan" onClick={deleteSelectedRows}>
                            <i class="fa-solid fa-user-minus"></i>
                        </delbutton>
                    )}
                    {["update", "all permission"].some((permission) => MothersScanPermission.includes(permission)) && (
                        <savebutton className="purbut" title="Update ANC Mothers Scan" onClick={saveEditedData}>
                            <i className="bi bi-floppy-fill"></i>
                        </savebutton>
                    )}
                    <savebutton className="purbut" title="Generate Excel" onClick={handleExportToExcel}>
                        <i className="bi bi-file-earmark-excel-fill"></i>
                    </savebutton>
                    {["view", "all permission"].some((permission) => MothersScanPermission.includes(permission)) && (
                        <printbutton className="purbut" title="Generate Report" onClick={generateReport}>
                            <i className="bi bi-printer-fill"></i>
                        </printbutton>
                    )}
                </div>
                <div class="mobileview">
                    <div class="d-flex justify-content-between">
                        <div className="d-flex justify-content-start">
                            <h1 align="left" className="h1">
                                ANC Mothers Scan
                            </h1>
                        </div>
                        <div class="dropdown mt-1" >
                            <button
                                class="btn btn-primary dropdown-toggle p-1"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i class="fa-solid fa-list"></i>
                            </button>
                            <ul class="dropdown-menu menu">
                                <li class="iconbutton d-flex justify-content-center text-dark">
                                    {['add', 'all permission'].some(permission => MothersScanPermission.includes(permission)) && (
                                        <icon class="icon" onClick={handleNavigatesToForm}>
                                            <i class="fa-solid fa-user-plus"></i>
                                        </icon>
                                    )}
                                </li>
                                <li class="iconbutton  d-flex justify-content-center text-danger">
                                    {['delete', 'all permission'].some(permission => MothersScanPermission.includes(permission)) && (
                                        <icon class="icon" onClick={deleteSelectedRows}>
                                            <i class="fa-solid fa-user-minus"></i>
                                        </icon>
                                    )}
                                </li>
                                <li class="iconbutton  d-flex justify-content-center text-success">
                                    {['update', 'all permission'].some(permission => MothersScanPermission.includes(permission)) && (
                                        <icon class="icon" onClick={saveEditedData}>
                                            <i className="bi bi-floppy-fill"></i>
                                        </icon>
                                    )}
                                </li>
                                <li class="iconbutton  d-flex justify-content-center text-success">
                                    <icon class="icon" onClick={handleExportToExcel}>
                                        <i className="bi bi-file-earmark-excel-fill"></i>
                                    </icon>
                                </li>
                                <li class="iconbutton  d-flex justify-content-center">
                                    {['all permission', 'view'].some(permission => MothersScanPermission.includes(permission)) && (
                                        <icon class="icon" onClick={generateReport}>
                                            <i class="fa-solid fa-print"></i>
                                        </icon>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card p-3 mb-2 bg-body-tertiary shadow-sm">
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">S.No </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter S.No"
                            value={SNo}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setSNo(value);
                                }
                            }}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">Date Of Procedure From Date</label>
                        <input
                            className="form-control"
                            type="date"
                            value={FromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">Date Of Procedure To Date</label>
                        <input
                            className="form-control"
                            type="date"
                            value={ToDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
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
                        <label className={`form-label fw-semibold d-flex justify-content-start`}>Name<span className="text-danger">*</span></label>
                        <div className="position-relative">
                            <input
                                id="name"
                                className="form-control"
                                type="text"
                                placeholder="Enter Name"
                                value={Name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">Age </label>
                        <input
                            id="age"
                            className="form-control"
                            type="text"
                            placeholder="Enter Age"
                            value={Age}
                            maxLength={3}
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
                            placeholder="Enter LMP "
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">Mobile Number</label>
                        <input
                            id="mobile_number"
                            className="form-control"
                            type="text"
                            placeholder="Enter Mobile Number"
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
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter No Of Children Male / Female"
                            value={No_Of_Children_Male_Female}
                            onChange={(e) => setNo_Of_Children_Male_Female(e.target.value)}
                        />
                    </div>
                    {/* <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">
                            Referred Doctor
                        </label>
                        <input
                            className="form-control"
                            list="doctorList"
                            type="text"
                            placeholder="Enter or Select Referred Doctor"
                            value={ReferredBy}
                            onChange={(e) => setReferredBy(e.target.value)}
                        />
                        <datalist id="doctorList">
                            <option value="Kumar" />
                            <option value="Pavun" />
                            <option value="John" />
                            <option value="Meena" />
                        </datalist>
                    </div> */}
                    <div className="col-md-3">
                        <label className="form-label fw-semibold d-flex justify-content-start">
                            Referred Doctor
                        </label>
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
                            placeholder="Enter Scan Impression Days"
                        />
                    </div>
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
                    <div className="d-flex justify-content-end align-items-end gap-2 ">
                        <button className="btn btn-primary" title="Search" onClick={handleSearch}><i className="bi bi-search" /></button>
                        <button className="btn btn-secondary" title="Reload" onClick={() => window.location.reload()}><i className="bi bi-arrow-clockwise" /></button>
                    </div>
                </div>
            </div>

            <div className="card p-2 shadow-sm bg-body-tertiary">
                <div className="ag-theme-alpine" style={{ height: 450, width: "100%" }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        onGridReady={onGridReady}
                        pagination={true}
                        rowSelection="multiple"
                        paginationAutoPageSize={true}
                        onSelectionChanged={onSelectionChanged}
                        onCellValueChanged={onCellValueChanged}
                    />
                </div>
            </div>
        </div>
    );
};

export default ANC_Mothers_ScanScreen;