import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, DropdownButton } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import labels from "./Labels";
import LoadingScreen from './Loading';

import { showConfirmationToast } from './ToastConfirmation';



function BankAccGrid() {
  const [editedData, setEditedData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [account_code, setaccount_code] = useState("");
  const [account_name, setaccount_name] = useState("");
  const [account_type, setaccount_type] = useState("");
  const [acc_addr_1, setacc_addr_1] = useState("");
  const [acc_area_code, setacc_area_code] = useState("");
  const [acc_state_code, setacc_state_code] = useState("");
  const [acc_country_code, setacc_country_code] = useState("");
  const [loading, setLoading] = useState(false);
  const [branch, setbranch] = useState("");
  const [base_accgroup_code, setbase_accgroup_code] = useState("");
  const [standard_accgroup_code, setstandard_accgroup_code] = useState("");
  const [user_accgroup_code, setuser_accgroup_code] = useState("");
  const [selectedAcctype, setselectedAcctype] = useState('');
  const [accdrop, setaccdrop] = useState([]);
  const [accGriddrop, setaccGriddrop] = useState([]);
  const [drop, setDrop] = useState([]);
  const [condrop, setCondrop] = useState([]);
  const [statedrop, setStatedrop] = useState([]);
  const [isSelectAcctype, setIsSelectAcctype] = useState(false);
  const [error, setError] = useState("");
  const config = require('./Apiconfig');

  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");


  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const AccNamePermission = permissions
    .filter(permission => permission.screen_type === 'AccountName')
    .map(permission => permission.permission_type.toLowerCase());

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getacctype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    }).then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const Accounts = data.map(option => option.attributedetails_name);
        setaccGriddrop(Accounts);
      })
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
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const cityNames = data.map(option => option.attributedetails_name);
        setDrop(cityNames);
      })
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
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const countries = data.map(option => option.attributedetails_name);
        setCondrop(countries);
      })
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
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const States = data.map(option => option.attributedetails_name);
        setStatedrop(States);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);



  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getacctype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setaccdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);



  const filteredOptionAccountype = accdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  const handleChangeacc = (selectedAcctype) => {
    setselectedAcctype(selectedAcctype);
    setaccount_type(selectedAcctype ? selectedAcctype.value : '');
    setError(false);
  };



  const reloadGridData = () => {
    try {
      window.location.reload();
    } catch (error) {
      console.error("Error reloading grid data:", error);
      toast.warning("Error reloading grid data")
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getbankaccSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'), account_code, account_name, acc_addr_1, acc_area_code, acc_state_code, acc_country_code, account_type, branch
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("Data fetched successfully");
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error updating data: " + error.message);
    } finally {
      setLoading(false);
    }

  };



  const columnDefs = [

    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Accountant Code",
      field: "account_code",
      //editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 18,
      },
      cellRenderer: (params) => {
        const handleClick = () => {
          handleNavigateWithRowData(params.data);
        };

        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {params.value}
          </span>
        );
      }
    },
    {
      headerName: "Bank Name",
      field: "account_name",
      editable: false,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "User Account Code",
      field: "user_accgroup_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },

    {
      headerName: "Standard Account Code",
      field: "standard_accgroup_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Base Account Code",
      field: "base_accgroup_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },

    {
      headerName: "Address 1",
      field: "acc_addr_1",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Address 2",
      field: "acc_addr_2",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Address 3",
      field: "acc_addr_3",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Address 4",
      field: "acc_addr_4",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "City",
      field: "acc_area_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: drop,

      },

    },
    {
      headerName: "State",
      field: "acc_state_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statedrop,


      },
    },
    {
      headerName: "Country",
      field: "acc_country_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: condrop,
      },
    },

    {
      headerName: "Account No",
      field: "account_number",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "IFSC Code",
      field: "IFSC_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {

      headerName: "Branch ",
      field: "branch",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Account Type",
      field: "Account_type",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 200,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: accGriddrop,
      },
    },


  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    // sortable: true,
    //editable: true,
    // flex: 1,
    // filter: true,
    // floatingFilter: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const onSearchInputChange = (e) => {
    setSearchValue(e.target.value);
    if (gridApi) {
      gridApi.setQuickFilter(e.target.value);
    }
  };
  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate a report");
      return;
    }

    const reportData = selectedRows.map((row) => {
      const formatValue = (val) => (val !== undefined && val !== null ? val : '');

      const addressParts = [
        row.acc_addr_1,
        row.acc_addr_2,
        row.acc_addr_3,
        row.acc_addr_4,
        row.acc_area_code,
        row.acc_state_code,
        row.acc_country_code
      ].map(formatValue);

      const formattedAddress = `
        ${addressParts[0]},
        ${addressParts[1]},
        ${addressParts[2]}<br>
        ${addressParts[3]}<br>
        ${addressParts[4]}<br>
        ${addressParts[5]}<br>
        ${addressParts[6]}
      `;

      return {
        "Accountant Code": formatValue(row.account_code),
        "Accountant Name": formatValue(row.account_name),
        "Address": formattedAddress,
        "Base Account Code": formatValue(row.base_accgroup_code),
        "Standard Account Code": formatValue(row.standard_accgroup_code),
        "Account No": formatValue(row.account_number),
        "IFSC Code ": formatValue(row.IFSC_code),
        "Account Type ": formatValue(row.Account_type),
        "Branch": formatValue(row.branch),
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>BankAccount</title>");
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
    reportWindow.document.write("<h1><u>BankAccount  Information</u></h1>");

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



  /*const handleNavigateToForm = () => {
    navigate("/form");
  };*/

  const handleNavigatesToForm = () => {
    navigate("/AddBankAccount", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };
  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddBankAccount", { state: { mode: "update", selectedRow } });
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };
  // Assuming you have a unique identifier for each row, such as 'id'
  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.account_code === params.data.account_code // Use the unique identifier 
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      // Add the edited row data to the state
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };


  const saveEditedData = async () => {

    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const modified_by = sessionStorage.getItem('selectedUserCode');
    // Filter the editedData state to include only the selected rows
    const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.account_code === row.account_code));

    if (selectedRowsData.length === 0) {
      toast.warning("Please select and modify at least one row to update its data");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/updatebankAcc`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "modified-by": modified_by,
              "company_code": company_code
            },
            body: JSON.stringify({ editedData: selectedRowsData }), // Send only the selected rows for saving
          });

          if (response.status === 200) {
            setTimeout(() => {
              toast.success("Data Updated Successfully")
              handleSearch();
            }, 1000);
            return;
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error saving data:", error);
          toast.error("Error Updating Data: " + error.message);
        }
        finally {
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

    if (selectedRows.length === 0) {
      toast.warning("No Rows Selected");
      return;
    }

    const modified_by = sessionStorage.getItem('selectedUserCode');
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const account_codesToDelete = selectedRows.map((row) => row.account_code);

    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/AccNameDelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by,
              "company_code": company_code

            },
            body: JSON.stringify({ account_codes: account_codesToDelete }),
            "modified_by": modified_by,
            "company_code": company_code,

          });

          if (response.ok) {
            console.log("Rows deleted successfully:", account_codesToDelete);
            setTimeout(() => {
              toast.success("Data Deleted successfully")
              handleSearch();
            }, 1000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
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

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return 'N/A' if the date is missing
    const date = new Date(dateString);

    // Format as DD/MM/YYYY
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleRowClick = (rowData) => {
    setCreatedBy(rowData.created_by);
    setModifiedBy(rowData.modified_by);
    const formattedCreatedDate = formatDate(rowData.created_date);
    const formattedModifiedDate = formatDate(rowData.modified_date);
    setCreatedDate(formattedCreatedDate);
    setModifiedDate(formattedModifiedDate);
  };

  // Handler for when a row is selected
  const onRowSelected = (event) => {
    if (event.node.isSelected()) {
      handleRowClick(event.data);
    }
  };


  return (
    <div className="container-fluid Topnav-screen">
      <div>
        {loading && <LoadingScreen />}
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-2 bg-light rounded main-header-box">
          <div className="header-flex">
              <h1 className="page-title">Bank Accounts</h1>
            <div className="action-wrapper desktop-actions">
              {['add', 'all permission'].some(permission => AccNamePermission.includes(permission)) && (
                <div className="action-icon add" onClick={handleNavigatesToForm}> 
                  <span className="tooltip">Add</span>
                <i class="fa-solid fa-user-plus"></i> </div>
              )}
              {['delete', 'all permission'].some(permission => AccNamePermission.includes(permission)) && (
                <div className="action-icon delete"
                  onClick={deleteSelectedRows}
                >
                  <span className="tooltip">Delete</span>
                  <i class="fa-solid fa-user-minus"></i>
                </div>
              )}
              {['update', 'all permission'].some(permission => AccNamePermission.includes(permission)) && (
                <div className="action-icon update"
                  onClick={saveEditedData}
                >
                  <span className="tooltip">Update</span>
                <i class="fa-solid fa-pen-to-square"></i>
                </div>
              )}
              {['all permission', 'view'].some(permission => AccNamePermission.includes(permission)) && (
                <div className="action-icon print"
                  onClick={generateReport}
                >
                  <span className="tooltip">Print</span>
                  <i class="fa-solid fa-print"></i>
                </div>
              )}
            </div>

            {/* Mobile Dropdown */}
            <div className="dropdown mobile-actions">
              <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
                <i className="fa-solid fa-list"></i>
              </button>

              <ul className="dropdown-menu dropdown-menu-end text-center">

                {['add', 'all permission'].some(p => AccNamePermission.includes(p)) && (
                  <li className="dropdown-item" onClick={handleNavigatesToForm}>
                    <i className="fa-solid fa-user-plus text-success fs-4"></i>
                  </li>
                )}

                {['delete', 'all permission'].some(p => AccNamePermission.includes(p)) && (
                  <li className="dropdown-item" onClick={deleteSelectedRows}>
                    <i className="fa-solid fa-user-minus text-danger fs-4"></i>
                  </li>
                )}

                {['update', 'all permission'].some(p => AccNamePermission.includes(p)) && (
                  <li className="dropdown-item" onClick={saveEditedData}>
                  <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
                  </li>
                )}

                {['all permission', 'view'].some(p => AccNamePermission.includes(p)) && (
                  <li className="dropdown-item" onClick={generateReport}>
                    <i className="fa-solid fa-print fs-4"></i>
                  </li>
                )}

              </ul>
            </div>

          </div>
        </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-3">
            <div className="inputGroup">
                <input
                  id="cuscode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the code here"
                  value={account_code}
                  onChange={(e) => setaccount_code(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={18}
                />
                <label for="cuscode" class="exp-form-labels">Code</label>
              </div>
            </div>

          <div className="col-md-3">
            <div className="inputGroup">
                <input
                  id="cusname"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the name here"
                  value={account_name}
                  onChange={(e) => setaccount_name(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={250}
                />
                <label for="cusname" class="exp-form-labels">Name</label>
              </div>
            </div>

          <div className="col-md-3">
            <div className="inputGroup">
                 <input
                  id="cusaddr1"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the address here"
                  value={acc_addr_1}
                  onChange={(e) => setacc_addr_1(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={250}
                />
                <label for="cusaddr1" class="exp-form-labels">Address</label>
              </div>
            </div>

          <div className="col-md-3">
            <div className="inputGroup">
                <input
                  id="cusarcode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the area here"
                  value={acc_area_code}
                  onChange={(e) => setacc_area_code(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={100}
                />
                <label for="cusarcode" class="exp-form-labels">City</label>
              </div>
            </div>

          <div className="col-md-3">
            <div className="inputGroup">
                <input
                  id="cusstatcode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the state here"
                  value={acc_state_code}
                  onChange={(e) => setacc_state_code(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={100}
                />
                <label for="cusstatcode" class="exp-form-labels">State</label>
              </div>
            </div>

          <div className="col-md-3">
            <div className="inputGroup">
                 <input
                  id="cuscountrycode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the country here"
                  value={acc_country_code}
                  onChange={(e) => setacc_country_code(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={100}
                />
                <label for="cuscountrycode" class="exp-form-labels">Country</label>
              </div>
            </div>


          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedAcctype ? "has-value" : ""} 
              ${isSelectAcctype ? "is-focused" : ""}`}
            >
                  <Select
                    id="acctype"
                    isClearable
                    value={selectedAcctype}
                    onChange={handleChangeacc}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    options={filteredOptionAccountype}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectAcctype(true)}
                onBlur={() => setIsSelectAcctype(false)}
                  />
                <label class="floating-label">Account Type</label>
              </div>
            </div>

          <div className="col-md-3">
            <div className="inputGroup">
                <input
                  id="branch"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the contact number here"
                  value={branch}
                  onChange={(e) => setbranch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={20}
                />
                <label for="contactno" class="exp-form-labels">Branch</label>
              </div>
            </div>

          {/* Search + Reload Buttons */}
          <div className="col-12">
            <div className="search-btn-wrapper">
              <div className="icon-btn search" onClick={handleSearch}>
                <span className="tooltip">Search</span>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>

              <div className="icon-btn reload" onClick={reloadGridData}>
                <span className="tooltip">Reload</span>
                <i className="fa-solid fa-rotate-right"></i>
              </div>
            </div>
          </div>

          </div>
          </div>



          {/* <p>Result Set</p> */}


      <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
          <div class="ag-theme-alpine" style={{ height: 485, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onCellValueChanged={onCellValueChanged}
              rowSelection="multiple"
              pagination={true}
              onSelectionChanged={onSelectionChanged}
              paginationAutoPageSize={true}
              onRowSelected={onRowSelected}
            />
          </div>
        </div>
      </div>

      {/* <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.createdBy}: {createdBy}</p>
            <p className="col-md-">
              {labels.createdDate} : {createdDate}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              {labels.modifiedBy}: {modifiedBy}
            </p>
            <p className="col-md-6">
              {labels.modifiedDate}: {modifiedDate}
            </p>
          </div>
        </div>
      </div> */}
    </div>

  );
}

export default BankAccGrid;
