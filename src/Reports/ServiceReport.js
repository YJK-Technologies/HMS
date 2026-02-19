import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
// import "./apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";

const config = require("../Apiconfig.js");

function ServiceReport() {
  const [ServiceID, setServiceID] = useState("");
  const [SelectedServiceId, setSelectedServiceId] = useState("");
  const [rowData, setRowData] = useState([]);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const companyName = sessionStorage.getItem('selectedCompanyName');
  const [serviceidDropdrop, setserviceidDropdrop] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [Start_Date, setStart_Date] = useState('');
  const [End_Date, setEnd_Date] = useState('');

  const navigate = useNavigate();

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

    setStartDate(formatDate(firstDay));
    setEndDate(formatDate(lastDay));
  }, []);

  const columnDefs = [
    {
      headerCheckboxSelection: true,
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
      headerName: "Service ID",
      field: "ServiceID",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Service Name",
      field: "ServiceName",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Patient ID",
      field: "PatientID",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Patient Name",
      field: "PatientName",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Gender",
      field: "Gender",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Age",
      field: "age",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    // {
    //   headerName: "Visit No",
    //   field: "VisitNo",
    //   editable: true,
    //   cellStyle: { textAlign: "left" },
    //   cellEditorParams: {
    //     maxLength: 250,
    //   },
    // },
    {
      headerName: "Doctor ID",
      field: "DoctorID",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Doctor Name",
      field: "DoctorName",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Contact Number",
      field: "ContactNumber",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Client ID",
      field: "ClientID",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Client Name",
      field: "ClientName",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "PaymentMode",
      field: "PaymentModeID",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Gross Amount",
      field: "GrossAmount",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Discount",
      field: "Discount",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Net Amount",
      field: "NetAmount",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Received Amount",
      field: "ReceivedAmount",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Balance Amount",
      field: "BalanceAmount",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
  ]

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleExportToExcel = () => {
    if (rowData.length === 0) {
      toast.warning('There is no data to export.');
      return;
    }
    const headerData = [
      ['Service Report'],
      [`Company Name: ${companyName}`],
      [`Date Range: ${Start_Date} to ${End_Date}`],
      []
    ];

    const transformedData = transformRowData(rowData);

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: 'A5' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Service');
    XLSX.writeFile(workbook, 'Service_Report.xlsx');

  }
  const safeToString = (value) => (value !== null && value !== undefined ? value.toString() : "");

  const transformRowData = (data) => {
    return data.map(row => ({
      "Bill No": safeToString(row.BillNo),
      "Bill Date": safeToString(row.BillDate),
      "Service ID": safeToString(row.ServiceID),
      "Service Name": safeToString(row.PatientName),
      "Patient ID": safeToString(row.PatientID),
      "Patient Name": safeToString(row.PatientName),
      "Client ID": safeToString(row.ClientID),
      "Client Name": safeToString(row.ClientName),
      "Contact Number": safeToString(row.ContactNumber),
      "Age": safeToString(row.age),
      "Gender": safeToString(row.Gender),
      // "Visit No": safeToString(row.VisitNo),
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

  const reloadGridData = () => {
    try {
      window.location.reload();
    } catch (error) {
      console.error("Error reloading grid data:", error);
    }
  };

  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to generate a report");
      return
    };
    const reportData = selectedRows.map((row) => {
      const safeValue = (val) => (val !== undefined && val !== null ? val : '');
      return {

        "Bill No": safeValue(row.BillNo),
        "Bill Date": safeValue(row.BillDate),
        "Service ID": safeValue(row.ServiceID),
        "Service Name": safeValue(row.PatientName),
        "Patient ID": safeValue(row.PatientID),
        "Patient Name": safeValue(row.PatientName),
        "Client ID": safeValue(row.ClientID),
        "Client Name": safeValue(row.ClientName),
        "Contact Number": safeValue(row.ContactNumber),
        "Age": safeValue(row.age),
        "Gender": safeValue(row.Gender),
        // "Visit No": safeValue(row.VisitNo),
        "Doctor ID": safeValue(row.DoctorID),
        "Doctor Name": safeValue(row.DoctorName),
        "PaymentMode ID": safeValue(row.PaymentModeID),
        "Gross Amount": safeValue(row.GrossAmount),
        "Discount": safeValue(row.Discount),
        "Net Amount": safeValue(row.NetAmount),
        "Received Amount": safeValue(row.ReceivedAmount),
        "Balance Amount": safeValue(row.BalanceAmount),
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Service</title>");
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
    reportWindow.document.write("<h1><u>Service InFormation</u></h1>");

    // Create table with headers
    reportWindow.document.write("<table><thead><tr>");
    Object.keys(reportData[0]).forEach((key) => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write("</tr></thead><tbody>");

    // Populate the rows
    reportData.forEach((row) => {
      reportWindow.document.write("<tr>");
      Object.values(row).forEach((value) => {
        reportWindow.document.write(`<td>${value}</td>`);
      });
      reportWindow.document.write("</tr>");
    });

    reportWindow.document.write("</tbody></table>");

    reportWindow.document.write(
      '<button class="report-button" onclick="window.print()">Print</button>'
    );
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
  };

  const filteredOptionServiceID = Array.isArray(serviceidDropdrop)
    ? serviceidDropdrop.map((option) => ({
      value: option.ServiceID,
      label: `${option.ServiceID} - ${option.ServiceName}`,
    }))
    : [];

  const handleChangeServiceID = (SelectedServiceId) => {
    setSelectedServiceId(SelectedServiceId);
    setServiceID(SelectedServiceId ? SelectedServiceId.value : "");
  };

  useEffect(() => {
    const fetchUserCodes = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/GetServiceName`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const updatedData = [
            { ServiceID: "ALL", ServiceName: "All" },
            ...data];

          setserviceidDropdrop(updatedData);

          const defaultOption = {
            value: "ALL",
            label: "All"
          };
          setSelectedServiceId(defaultOption);
          setServiceID(defaultOption.value);
        } else {
          console.warn("No data found for user codes");
          setserviceidDropdrop([]);
        }
      } catch (error) {
        console.error("Error fetching user codes:", error);
      }
    };

    fetchUserCodes();
  }, []);

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const onRowSelected = (event) => {
    if (event.node.isSelected()) {
      handleRowClick(event.data);
    }
  };

  const handleRowClick = (rowData) => {
    setCreatedBy(rowData.created_by);
    setModifiedBy(rowData.modified_by);
    const formattedCreatedDate = formatDate(rowData.created_date);
    const formattedModifiedDate = formatDate(rowData.modified_date);
    setCreatedDate(formattedCreatedDate);
    setModifiedDate(formattedModifiedDate);
  };

  const goBack = () => {
    navigate("/HMSDashboard");
  };

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
      const response = await fetch(`${config.apiBaseUrl}/GetServiceReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ServiceID: ServiceID,
          StartDate: StartDate,
          EndDate: EndDate,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (response.ok) {
        const searchData = await response.json();

        if (Array.isArray(searchData) && searchData.length > 0) {
          const firstItem = searchData[0];
          setStart_Date(formatDate(firstItem.StartDate) || "");
          setEnd_Date(formatDate(firstItem.EndDate) || "");
        }

        const newRows = (Array.isArray(searchData) ? searchData : []).map(
          (matchedItem) => ({
            BillNo: matchedItem.BillNo,
            BillDate: formatDate(matchedItem.BillDate),
            ServiceID: matchedItem.ServiceID,
            ServiceName: matchedItem.ServiceName,
            PatientID: matchedItem.PatientID,
            PatientName: matchedItem.PatientName,
            Gender: matchedItem.Gender,
            VisitNo: matchedItem.VisitNo,
            DoctorID: matchedItem.DoctorID,
            DoctorName: matchedItem.DoctorName,
            ContactNumber: matchedItem.ContactNumber,
            ClientID: matchedItem.ClientID,
            ClientName: matchedItem.ClientName,
            PaymentModeID: matchedItem.PaymentModeID,
            GrossAmount: matchedItem.GrossAmount,
            Discount: matchedItem.Discount,
            NetAmount: matchedItem.NetAmount,
            ReceivedAmount: matchedItem.ReceivedAmount,
            BalanceAmount: matchedItem.BalanceAmount,
            age: matchedItem.age,
          })
        );

        setRowData(newRows);
        console.log("data fetched successfully", searchData);
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
      toast.error("Error fetching search data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-body-tertiary rounded  mb-2 mt-2">
        <div className=" d-flex justify-content-between  ">
          <h1 align="left" className="purbut ">
            Service Report
          </h1>
          <div className="mobileview">
            <div class="d-flex justify-content-between mt-2 me-4" >
              <h1 className='h1' style={{ marginRight: "5px" }}>Service Report</h1>
              <div className="dropdown p-1 me-4 pt-2">
                <button className="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fa-solid fa-list"></i>
                </button>
                <ul className="dropdown-menu ">
                  <li>
                    <icon class="iconbutton d-flex justify-content-center" onClick={handleExportToExcel}>
                      <i class="fa-solid fa-print"></i>
                    </icon>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="purbut">
            <div className="d-flex justify-content-end me-5">
              <addbutton className=" mt-3 mb-3 rounded-3" onClick={handleExportToExcel}>
                <i class="fa-solid fa-file-excel"></i>
              </addbutton>
              <addbutton className=" mt-3 mb-3 rounded-3" onClick={generateReport}>
                <i className="fa-solid fa-print"></i>
              </addbutton>
              <div class="mt-4">
                <delbutton class="" style={{ cursor: "pointer" }} onClick={goBack}>
                  <i class="fa-solid fa-circle-xmark"></i>
                </delbutton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
        <div className="row  mt-3 mb-3 ms-1 me-1">
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="usercode" class="exp-form-labels">
                From Date
              </label>
              <input
                id="usercode"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please fill the user code here"
                value={StartDate}
                onChange={(e) => setStartDate(e.target.value)}
                maxLength={18}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="username" class="exp-form-labels">
                To Date
              </label>
              <input
                id="username"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please fill the user name here"
                value={EndDate}
                onChange={(e) => setEndDate(e.target.value)}
                maxLength={250}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="usts" class="exp-form-labels">
                ServiceID
              </label>
              <div title="Select the User Status">
                <Select
                  id="status"
                  value={SelectedServiceId}
                  onChange={handleChangeServiceID}
                  options={filteredOptionServiceID}
                  className="exp-input-field"
                  placeholder=""
                />
              </div>
            </div>
          </div>
          <div className="col-md-3 form-group mt-4">
            <div class="exp-form-floating">
              <div class=" d-flex  justify-content-center">
                <div class=''>
                  <icon className="popups-btn fs-6 p-3"
                    onClick={handleSearch}
                    required title="Search">
                    <i className="fas fa-search"></i>
                  </icon>
                </div>
                <div>
                  <icon className="popups-btn fs-6 p-3" onClick={reloadGridData} required title="Reload">
                    <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" />
                  </icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ag-theme-alpine" style={{ height: 390, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            rowSelection="multiple"
            onSelectionChanged={onSelectionChanged}
            onRowSelected={onRowSelected}
            paginationAutoPageSize={true}
            pagination={true}
          />
        </div>
      </div>
    </div>
  )
}




export default ServiceReport;