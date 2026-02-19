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
import * as XLSX from 'xlsx';
const config = require("../Apiconfig");

const BillingReport = () => {
    const [rowData, setRowData] = useState([]);
    const [BillNo, setBillNo] = useState('');
    const [FromDate, setFromDate] = useState('');
    const [ToDate, setToDate] = useState('');
    const [Name, setName] = useState('');
    const [Start_Date, setStart_Date] = useState('');
    const [End_Date, setEnd_Date] = useState('');
    const [loading, setLoading] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const companyName = sessionStorage.getItem('selectedCompanyName');
    const navigate = useNavigate();

    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const BillingReportPermission = permissions
        .filter(permission => permission.screen_type === 'BillingReport')
        .map(permission => permission.permission_type.toLowerCase());


    useEffect(() => {
        const today = new Date();

        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const formatDate = (date) => {
            let year = date.getFullYear();
            let month = String(date.getMonth() + 1).padStart(2, "0");
            let day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        setFromDate(formatDate(firstDay));
        setToDate(formatDate(lastDay));
    }, []);

    const columnDefs = [
        {
            checkboxSelection: true,
            headerName: "S.No",
            field: "SNo",
            cellStyle: { textAlign: "center" },
            editable: false,
            valueGetter: (params) => params.node.rowIndex + 1,
        },
        {
            headerName: "Bill No",
            field: "BillNo",
            cellStyle: { textAlign: "center" },
            editable: false,
        },
        {
            headerName: "Bill Date",
            field: "BillDate",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Patient ID",
            field: "PatientID",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Patient Name",
            field: "PatientName",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Client ID",
            field: "ClientID",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Client Name",
            field: "ClientName",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Contact Number",
            field: "ContactNumber",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Age",
            field: "age",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Gender",
            field: "Gender",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        // {
        //     headerName: "Visit No",
        //     field: "VisitNo",
        //     editable: false,
        //     cellStyle: { textAlign: "center" },
        // },
        {
            headerName: "Doctor ID",
            field: "DoctorID",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Doctor Name",
            field: "DoctorName",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "PaymentMode",
            field: "PaymentModeID",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Gross Amount",
            field: "GrossAmount",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Discount",
            field: "Discount",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Net Amount",
            field: "NetAmount",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Received Amount",
            field: "ReceivedAmount",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
        {
            headerName: "Balance Amount",
            field: "BalanceAmount",
            editable: false,
            cellStyle: { textAlign: "center" },
        },
    ];

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/GetBillingReport`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    BillNo, StartDate: FromDate, EndDate: ToDate, PatientName: Name, company_code: sessionStorage.getItem("selectedCompanyCode")
                })
            });
            if (response.ok) {
                const searchData = await response.json();
                if (searchData.length > 0) {
                    const firstItem = searchData[0];
                    setStart_Date(formatDate(firstItem.StartDate) || "");
                    setEnd_Date(formatDate(firstItem.EndDate) || "");
                }

                const newRows = searchData.map((matchedItem) => ({
                    BillDate: formatDate(matchedItem.BillDate),
                    BillNo: matchedItem.BillNo,
                    PatientID: matchedItem.PatientID,
                    PatientName: matchedItem.PatientName,
                    ClientID: matchedItem.ClientID,
                    ClientName: matchedItem.ClientName,
                    ContactNumber: matchedItem.ContactNumber,
                    age: matchedItem.age,
                    Gender: matchedItem.Gender,
                    VisitNo: matchedItem.VisitNo,
                    DoctorID: matchedItem.DoctorID,
                    DoctorName: matchedItem.DoctorName,
                    PaymentModeID: matchedItem.PaymentModeID,
                    GrossAmount: matchedItem.GrossAmount,
                    Discount: matchedItem.Discount,
                    NetAmount: matchedItem.NetAmount,
                    ReceivedAmount: matchedItem.ReceivedAmount,
                    BalanceAmount: matchedItem.BalanceAmount,
                }));

                const GrossAmount = newRows.reduce((sum, row) => sum + row.GrossAmount, 0);
                const Discount = newRows.reduce((sum, row) => sum + row.Discount, 0);
                const NetAmount = newRows.reduce((sum, row) => sum + row.NetAmount, 0);
                const ReceivedAmount = newRows.reduce((sum, row) => sum + row.ReceivedAmount, 0);
                const BalanceAmount = newRows.reduce((sum, row) => sum + row.BalanceAmount, 0);

                const totalRow = {
                    BillDate: "",
                    BillNo: null,
                    PatientID: "",
                    PatientName: "",
                    ClientID: "",
                    ClientName: "",
                    ContactNumber: "",
                    age: "",
                    Gender: "",
                    VisitNo: "",
                    DoctorID: "",
                    DoctorName: "",
                    PaymentModeID: "Total",
                    GrossAmount: GrossAmount,
                    Discount: Discount,
                    NetAmount: NetAmount,
                    ReceivedAmount: ReceivedAmount,
                    BalanceAmount: BalanceAmount
                };

                setRowData([...newRows, totalRow]);
                // setRowData(searchData);
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

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const PrintHeaderData = async (transactionNo) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/getBillingHeader`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ BillNo: transactionNo, company_code: sessionStorage.getItem('selectedCompanyCode') })
            });

            if (response.ok) {
                const searchData = await response.json();
                return searchData;
            } else if (response.status === 404) {
                console.log("Data not found");
            } else {
                console.log("Bad request");
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
        }
    };

    const PrintDetailData = async (transactionNo) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/getBillingDetail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ BillNo: transactionNo, company_code: sessionStorage.getItem('selectedCompanyCode') })
            });

            if (response.ok) {
                const searchData = await response.json();
                return searchData;
            } else if (response.status === 404) {
                console.log("Data not found");
            } else {
                console.log("Bad request");
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
        }
    };

    const generateReport = async () => {
        const selectedRows = gridApi.getSelectedRows();
        if (selectedRows.length === 0) {
            toast.warning("Please select at least one row to generate a report");
            return;
        }

        const transactionNo = selectedRows[0].BillNo;
        setLoading(true);

        try {
            const headerData = await PrintHeaderData(transactionNo);
            const detailData = await PrintDetailData(transactionNo);

            if (headerData && detailData) {
                console.log("All API calls completed successfully");

                sessionStorage.setItem('BillHeader', JSON.stringify(headerData));
                sessionStorage.setItem('BillDetail', JSON.stringify(detailData));

                window.open('/SalesPrint1', '_blank');

            } else {
                console.log("Failed to fetch some data");
                toast.error("Transaction No Does Not Exits");
            }

        } catch (error) {
            console.error("Error executing API calls:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const safeToString = (value) => (value !== null && value !== undefined ? value.toString() : "");

    const transformRowData = (data) => {
        return data.map(row => ({
            "Bill No": safeToString(row.BillNo),
            "Bill Date": safeToString(row.BillDate),
            "Patient ID": safeToString(row.PatientID),
            "Patient Name": safeToString(row.PatientName),
            "Client ID": safeToString(row.ClientID),
            "Client Name": safeToString(row.ClientName),
            "Contact Number": safeToString(row.ContactNumber),
            "Age": safeToString(row.age),
            "Gender": safeToString(row.Gender),
            "Visit No": safeToString(row.VisitNo),
            "Doctor ID": safeToString(row.DoctorID),
            "Doctor Name": safeToString(row.DoctorName),
            "PaymentMode ID": safeToString(row.PaymentModeID),
            "Gross Amount": safeToString(row.GrossAmount),
            "Discount": safeToString(row.Discount),
            "Net Amount": safeToString(row.NetAmount),
            "Received Amount": safeToString(row.ReceivedAmount),
            "Balance Amount": safeToString(row.BalanceAmount),
        }));
    };

    const handleExportToExcel = () => {
        if (rowData.length === 0) {
            toast.warning('There is no data to export.');
            return;
        }

        const headerData = [
            ['Billing Report'],
            [`Company Name: ${companyName}`],
            [`Date Range: ${Start_Date} to ${End_Date}`],
            []
        ];

        const transformedData = transformRowData(rowData);

        const worksheet = XLSX.utils.aoa_to_sheet(headerData);

        XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: 'A5' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Billing');
        XLSX.writeFile(workbook, 'Billing_Report.xlsx');
    };

    const goBack = () => {
        navigate("/HMSDashboard");
    };

    return (
        <div className="container-fluid Topnav-screen">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="d-flex p-3 bg-body-tertiary rounded-2 justify-content-between align-items-center mb-2 shadow-sm">
                <h2 className="mb-0 purbut fs-3">Billing Report</h2>
                <div className="d-sm-flex purbut">
                    <printbutton className="purbut" onClick={handleExportToExcel}>
                        <i className="bi bi-file-earmark-excel-fill"></i>
                    </printbutton>
                    {["view", "all permission"].some((permission) => BillingReportPermission.includes(permission)) && (
                        <printbutton className="purbut" onClick={generateReport}>
                            <i className="bi bi-printer-fill"></i>
                        </printbutton>
                    )}
                    <delbutton class="" style={{ cursor: "pointer" }} onClick={goBack}>
                        <i class="fa-solid fa-circle-xmark"></i>
                    </delbutton>
                </div>
                <div class="mobileview">
                    <div class="d-flex justify-content-between">
                        <div className="d-flex justify-content-start">
                            <h1 align="left" className="h1">
                                Billing Report
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
                                <li class="iconbutton  d-flex justify-content-center text-dark">
                                    <icon class="icon" onClick={handleExportToExcel}>
                                        <i className="bi bi-file-earmark-excel-fill"></i>
                                    </icon>
                                </li>
                                <li class="iconbutton  d-flex justify-content-center">
                                    {['all permission', 'view'].some(permission => BillingReportPermission.includes(permission)) && (
                                        <icon class="icon" onClick={generateReport}>
                                            <i class="fa-solid fa-print"></i>
                                        </icon>
                                    )}
                                </li>
                                <li class="iconbutton text-danger d-flex justify-content-center">
                                    <icon class="icon" onClick={goBack}>
                                        <i class="fa-solid fa-circle-xmark"></i>
                                    </icon>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card p-3 mb-2 bg-body-tertiary shadow-sm">
                <div className="row g-3">
                    <div className="col-md-2">
                        <label className="form-label fw-semibold d-flex justify-content-start">From Date</label>
                        <input
                            className="form-control"
                            type="date"
                            value={FromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label fw-semibold d-flex justify-content-start">To Date</label>
                        <input
                            className="form-control"
                            type="date"
                            value={ToDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label fw-semibold d-flex justify-content-start">Bill No </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Bill No"
                            value={BillNo}
                            onChange={(e) => setBillNo(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label fw-semibold d-flex justify-content-start">Name</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Name"
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3 d-flex align-items-end gap-2">
                        <button className="btn btn-primary" onClick={handleSearch}><i className="bi bi-search" /></button>
                        <button className="btn btn-secondary" onClick={() => window.location.reload()}><i className="bi bi-arrow-clockwise" /></button>
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
                    />
                </div>
            </div>
        </div>
    )
}

export default BillingReport;