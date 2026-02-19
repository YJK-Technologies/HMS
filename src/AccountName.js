import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import { showConfirmationToast } from './ToastConfirmation';
import labels from "./Labels";
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function AccNameGrid() {
  const [editedData, setEditedData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [account_code, setaccount_code] = useState("");
  const [account_name, setaccount_name] = useState("");
  const [panno, setpanno] = useState("");
  const [acc_addr_1, setacc_addr_1] = useState("");
  const [acc_area_code, setacc_area_code] = useState("");
  const [acc_state_code, setacc_state_code] = useState("");
  const [acc_country_code, setacc_country_code] = useState("");
  const [acc_mobile_no, setacc_mobile_no] = useState("");
  const [base_accgroup_code, setbase_accgroup_code] = useState("");
  const [standard_accgroup_code, setstandard_accgroup_code] = useState("");
  const [user_accgroup_code, setuser_accgroup_code] = useState("");
  const [status, setstatus] = useState("");
  const [drop, setDrop] = useState([]);
  const [condrop, setCondrop] = useState([]);
  const [statedrop, setStatedrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [companygriddrop, setCompanyGriddrop] = useState([]);
  const [transactiongriddrop, setTransactionGriddrop] = useState([]);
  const [salesgriddrop, setSalesGriddrop] = useState([]);
  const [brokergriddrop, setBrokerGriddrop] = useState([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);


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

    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/Companyno`)
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map(option => option.company_no);
        setCompanyGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/trcode`)
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map(option => option.keyfield);
        setTransactionGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/smcode`)
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map(option => option.keyfield);
        setSalesGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/brcode`)
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map(option => option.attributedetails_name);
        setBrokerGriddrop(statusOption);
      })
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

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');
  };


  const reloadGridData = () => {
    try {
      window.location.reload();
    } catch (error) {
      console.error("Error reloading grid data:", error);

      toast.error("An error occurred while reloading grid data. Please try again later")
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAccNameSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'), account_code, account_name, acc_addr_1, acc_area_code, acc_state_code, acc_country_code,
          acc_mobile_no, base_accgroup_code, standard_accgroup_code, user_accgroup_code, status
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("Data fetched successfully");
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
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
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "Accountant Name",
      field: "account_name",
      editable: false,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "User Account Code",
      field: "user_accgroup_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Standard Account Code",
      field: "standard_accgroup_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Base Account Code",
      field: "base_accgroup_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Accountant Subcode",
      field: "account_subcode",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Address 1",
      field: "acc_addr_1",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Address 2",
      field: "acc_addr_2",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Address 3",
      field: "acc_addr_3",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Address4",
      field: "acc_addr_4",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "City",
      field: "acc_area_code",
      editable: true,
      cellStyle: { textAlign: "left" },
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
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: condrop,
      },
    },
    {
      headerName: "Status",
      field: "status",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
      },
    },
    {
      headerName: "IMEX No",
      field: "acc_imex_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Office No",
      field: "acc_office_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Residential No",
      field: "acc_resi_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Mobile No",
      field: "acc_mobile_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Fax No",
      field: "acc_fax_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Email ID",
      field: "acc_email_id",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {

      headerName: "Credit Limit",
      field: "acc_credit_limit",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Transport Code",
      field: "acc_transport_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: transactiongriddrop,
      },
    },
    {
      headerName: "Salesman Code",
      field: "acc_salesman_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: salesgriddrop,
      },
    },
    {
      headerName: "Broker Code",
      field: "acc_broker_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: brokergriddrop,
      },
    },
    {
      headerName: "Weekday Code",
      field: "acc_weekday_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Status",
      field: "status",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 10,
      },
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
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
        "IMEX No": formatValue(row.acc_imex_no),
        "Office No": formatValue(row.acc_office_no),
        "Resi No": formatValue(row.acc_resi_no),
        "Mobile No": formatValue(row.acc_mobile_no),
        "Fax No": formatValue(row.acc_fax_no),
        "Email ID": formatValue(row.acc_email_id),
        "Credit Limit": formatValue(row.acc_credit_limit),
        "Transport Code": formatValue(row.acc_transport_code),
        "Salesman Code": formatValue(row.acc_salesman_code),
        "Break Code": formatValue(row.acc_broker_code),
        "Weekday Code": formatValue(row.acc_weekday_code),
        "Base Account Code": formatValue(row.base_accgroup_code),
        "Standard Account Code": formatValue(row.standard_accgroup_code),
        "User Account Code": formatValue(row.user_accgroup_code),
        "Accountant Subcode": formatValue(row.account_subcode),
        "Status": formatValue(row.status),
      };
    });


    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Charts of Accounts</title>");
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
    reportWindow.document.write("<h1><u>Account Information</u></h1>");

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
    navigate("/AddAccountName", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  // Assuming you have a unique identifier for each row, such as 'id'
  // const onCellValueChanged = (params) => {
  //   const updatedRowData = [...rowData];
  //   const rowIndex = updatedRowData.findIndex(
  //     (row) => row.account_code === params.data.account_code // Use the unique identifier 
  //   );
  //   if (rowIndex !== -1) {
  //     updatedRowData[rowIndex][params.colDef.field] = params.newValue;
  //     setRowData(updatedRowData);

  //     // Add the edited row data to the state
  //     setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
  //   }
  // };

  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.account_code === params.data.account_code
    );

    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      setEditedData((prevData) => {
        const existingIndex = prevData.findIndex(
          (item) => item.account_code === params.data.account_code
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
    const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.account_code === row.account_code));

    if (selectedRowsData.length === 0) {

      toast.warning("Please select and modify at least one row to update its data")
      return;
    }
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const modified_by = sessionStorage.getItem('selectedUserCode');
          const company_code = sessionStorage.getItem('selectedCompanyCode');

          const response = await fetch(`${config.apiBaseUrl}/updateAccName`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by,
              "company_code": company_code
            },
            body: JSON.stringify({ editedData: selectedRowsData }), // Send only the selected rows for saving
            "modified_by": modified_by,
            "company_code": company_code,
          });
          if (response.status === 200) {
            setTimeout(() => {
              toast.success("Data Updated Successfully")
              handleSearch();
            }, 1000);
            return;
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to update data");
          }
        } catch (error) {
          console.error("Error saving data:", error);
          toast.error("Error Updating Data: " + error.message);
        }
      },
      () => {
        toast.info("Data update cancelled.");
      }
    );
  };

  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select atleast One Row to Delete");
      return;
    }

    const modified_by = sessionStorage.getItem('selectedUserCode');
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const account_codesToDelete = selectedRows.map((row) => row.account_code);

    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/AccNameDelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by,
              "company_code": company_code
            },
            body: JSON.stringify({ account_codes: account_codesToDelete }),
            modified_by: modified_by, company_code: company_code
          });

          if (response.ok) {
            console.log("Rows deleted successfully:", account_codesToDelete);
            setTimeout(() => {
              toast.success("Data Deleted successfully")
              handleSearch();
            }, 1000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
          }
        } catch (error) {
          console.error("Error saving data:", error);
          toast.error("Error Deleting Data: " + error.message);
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
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div align="">
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2">
          <div class="d-flex justify-content-between" >
            <div className="d-flex justify-content-start">
              <h1 className="purbut">
                Charts of Accounts
              </h1>
            </div>
            <div class="d-flex justify-content-end purbut me-3" >
              {['add', 'all permission'].some(permission => AccNamePermission.includes(permission)) && (
                <addbutton className="purbut" onClick={handleNavigatesToForm}
                  required title="Add Customer"> <i class="fa-solid fa-user-plus"></i> </addbutton>
              )}
              {['delete', 'all permission'].some(permission => AccNamePermission.includes(permission)) && (
                <delbutton className="purbut" onClick={deleteSelectedRows} required title="Delete">
                  <i class="fa-solid fa-user-minus"></i>
                </delbutton>
              )}
              {['update', 'all permission'].some(permission => AccNamePermission.includes(permission)) && (
                <savebutton className="purbut" onClick={saveEditedData} required title="Update">
                  <i class="fa-solid fa-floppy-disk"></i>
                </savebutton>
              )}
              {['all permission', 'view'].some(permission => AccNamePermission.includes(permission)) && (
                <printbutton className="purbut" onClick={generateReport} required title="Generate Report">
                  <i class="fa-solid fa-print"></i>
                </printbutton>
              )}
            </div>
            <div className="mobileview ">
              <div className="d-flex justify-content-between">
                <div className="d-flex justify-content-start">
                  <h1 className="h1">
                    Charts of Accounts
                  </h1>
                </div>
                <div className="d-flex justify-content-end">
                  <div class="dropdown me-3 mt-3">
                    <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fa-solid fa-list"></i>
                    </button>
                    <ul class="dropdown-menu menu">
                      <li class="iconbutton d-flex justify-content-center text-success">
                        {['add', 'all permission'].some(permission => AccNamePermission.includes(permission)) && (
                          <icon
                            class="icon"
                            onClick={handleNavigatesToForm}
                          >
                            <i class="fa-solid fa-user-plus"></i>
                          </icon>
                        )}
                      </li>
                      <li class="iconbutton  d-flex justify-content-center text-danger">
                        {['delete', 'all permission'].some(permission => AccNamePermission.includes(permission)) && (
                          <icon
                            class="icon"
                            onClick={deleteSelectedRows}
                          >
                            <i class="fa-solid fa-user-minus"></i>
                          </icon>
                        )}
                      </li>
                      <li class="iconbutton  d-flex justify-content-center text-primary ">
                        {['update', 'all permission'].some(permission => AccNamePermission.includes(permission)) && (
                          <icon
                            class="icon"
                            onClick={saveEditedData}
                          >
                            <i class="fa-solid fa-floppy-disk"></i>
                          </icon>
                        )}
                      </li>
                      <li class="iconbutton  d-flex justify-content-center ">
                        {['all permission', 'view'].some(permission => AccNamePermission.includes(permission)) && (
                          <icon
                            class="icon"
                            onClick={generateReport}
                          >
                            <i class="fa-solid fa-print"></i>
                          </icon>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg p-1 pb-4 bg-body-tertiary rounded  mb-2">
          <div className="row ms-4 mt-3 mb-3 me-4">
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cuscode" class="exp-form-labels">
                  Code
                </label>
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
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cusname" class="exp-form-labels">
                  Name
                </label>
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
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cusaddr1" class="exp-form-labels">
                  Address
                </label>
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
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cusarcode" class="exp-form-labels">
                  City
                </label>
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
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cusstatcode" class="exp-form-labels">
                  State
                </label>
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
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cuscountrycode" class="exp-form-labels">
                  Country
                </label>
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
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="contactno" class="exp-form-labels">
                  Contact No
                </label>
                <input
                  id="contactno"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the contact number here"
                  value={acc_mobile_no}
                  onChange={(e) => setacc_mobile_no(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={20}
                />
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label class="exp-form-labels">
                  Status
                </label>
                              <div title="Select the Status">        
                <Select
                  id="status"
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  options={filteredOptionStatus}
                  className="exp-input-field"
                  placeholder=""
                />
              </div>
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <div class=" d-flex justify-content-center mt-4 ">
                  <icon className="popups-btn fs-6 p-3" onClick={handleSearch} required title="Search"><i className="fas fa-search"></i></icon>
                  <icon className="popups-btn fs-6 p-3" onClick={reloadGridData} required title="Refresh"><FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" /></icon>
                </div>
              </div>
            </div>
          </div>
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
        </div></div>
      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.createdBy}: {createdBy}</p>
            <p className="col-md-">
              {labels.createdDate}: {createdDate}
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
      </div>
    </div>
  );
}


export default AccNameGrid;
