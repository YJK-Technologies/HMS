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
import Select from 'react-select';
import labels from "./Labels";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from './ToastConfirmation';
import LoadingScreen from './Loading';



function CustomerDetGrid() {
  const [editedData, setEditedData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [customer_code, setcustomer_code] = useState("");
  const [customer_name, setcustomer_name] = useState("");
  const [panno, setpanno] = useState("");
  const [customer_gst_no, setcustomer_gst_no] = useState("");
  const [customer_addr_1, setcustomer_addr_1] = useState("");
  const [customer_area, setcustomer_area] = useState("");
  const [customer_state, setcustomer_state] = useState("");
  const [customer_country, setcustomer_country] = useState("");
  const [customer_mobile_no, setcustomer_mobile_no] = useState("");
    const [loading, setLoading] = useState(false);
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
  const config = require('./Apiconfig');

  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
    const [selectedCustomer, setselectedCust] = useState('');
    const [ default_customer, setdefaultCust] = useState('');
     const [customerdrop, setcustomerdrop] = useState([]);

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const customerdetPermission = permissions
    .filter(permission => permission.screen_type === 'Customer')
    .map(permission => permission.permission_type.toLowerCase());



  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');
    
  //   fetch(`${config.apiBaseUrl}/status`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   })
  //         .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const statusOption = data.map(option => option.attributedetails_name);
  //       setStatusGriddrop(statusOption);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/Companyno`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const statusOption = data.map(option => option.company_no);
  //       setCompanyGriddrop(statusOption);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/trcode`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const statusOption = data.map(option => option.keyfield);
  //       setTransactionGriddrop(statusOption);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/smcode`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const statusOption = data.map(option => option.keyfield);
  //       setSalesGriddrop(statusOption);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/brcode`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const statusOption = data.map(option => option.attributedetails_name);
  //       setBrokerGriddrop(statusOption);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');
    
  //   fetch(`${config.apiBaseUrl}/status`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   })
  //     .then((data) => data.json())
  //     .then((val) => setStatusdrop(val))
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');
    
  //   fetch(`${config.apiBaseUrl}/city`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const cityNames = data.map(option => option.attributedetails_name);
  //       setDrop(cityNames);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');
    
  //   fetch(`${config.apiBaseUrl}/country`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const countries = data.map(option => option.attributedetails_name);
  //       setCondrop(countries);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');
    
  //   fetch(`${config.apiBaseUrl}/state`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Extract city names from the fetched data
  //       const States = data.map(option => option.attributedetails_name);
  //       setStatedrop(States);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeCustomer = (selectedCustomer) => {
    setselectedCust(selectedCustomer);
    setdefaultCust(selectedCustomer ? selectedCustomer.value : '');
  };

 
  // useEffect(() => {
  //   const company_code = sessionStorage.getItem('selectedCompanyCode');
    
  //   fetch(`${config.apiBaseUrl}/getdefCustomer`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ company_code })
  //   })
  //     .then((data) => data.json())
  //     .then((val) => setcustomerdrop(val))
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);


  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');
  };

  const filteredOptioncustomer = customerdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


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
      const response = await fetch(`${config.apiBaseUrl}/customerSearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), customer_code, customer_name, panno, customer_gst_no, customer_addr_1, customer_area, customer_state, customer_country, customer_mobile_no, status,default_customer })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("Data fetched successfully");
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found")
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error updating data: " + error.message);
    }
    finally {
      setLoading(false);
    }
  };



  const columnDefs = [

    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Code",
      field: "customer_code",
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
      },
    },
    {
      headerName: "Name",
      field: "customer_name",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    // {
    //   headerName: "Company Code",
    //   field: "company_code",
    //   editable: true,
    //   cellStyle: { textAlign: "left" },
    //   // minWidth: 250,
    //   // maxWidth: 250,
    //   cellEditor: "agSelectCellEditor",
    //   cellEditorParams: {
    //     values: companygriddrop,
    //   },
    // },
    {
      headerName: "Address 1",
      field: "customer_addr_1",
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
      field: "customer_addr_2",
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
      field: "customer_addr_3",
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
      field: "customer_addr_4",
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
      field: "customer_area",
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
      field: "customer_state",
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
      field: "customer_country",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
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
      // minWidth: 250,
      // maxWidth: 250,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
      },
    },
    {
      headerName: "PAN No",
      field: "panno",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "GST No",
      field: "customer_gst_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 15,
      },
    },
    {
      headerName: "IMEX No",
      field: "customer_imex_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Office No",
      field: "customer_office_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Residential No",
      field: "customer_resi_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Mobile No",
      field: "customer_mobile_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Fax No",
      field: "customer_fax_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 250,
      // maxWidth: 250,
      cellEditorParams: {
        maxLength: 20,
      },
    },
    {
      headerName: "Email ID",
      field: "customer_email_id",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {

      headerName: "Credit Limit",
      field: "customer_credit_limit",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Transport Code",
      field: "customer_transport_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: transactiongriddrop,
      },
    },
    {
      headerName: "Salesman Code",
      field: "customer_salesman_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: salesgriddrop,
      },
    },
    {
      headerName: "Broker Code",
      field: "customer_broker_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: brokergriddrop,
      },
    },
    {
      headerName: "Weekday Code",
      field: "customer_weekday_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Contact person",
      field: "contact_person",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Office Type",
      field: "office_type",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Salesman Code",
      field: "customer_salesman_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Default Customer",
      field: "default_customer",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      hide: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    // flex: 1,
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
      toast.warning("Please select at least one row to generate a report");
      return
    };

    const reportData = selectedRows.map((row) => {
      return {
        "Customer Code": row.customer_code,
        "Customer Name": row.customer_name,
        "Customer Address 1": row.customer_addr_1,
        "Customer Address 2": row.customer_addr_2,
        "Customer Address 3": row.customer_addr_3,
        "Customer Address 4": row.customer_addr_4,
        "City": row.customer_area,
        "State": row.customer_state,
        "Country": row.customer_country,
        "Status": row.status,
        "PAN No": row.panno,
        "GST No": row.customer_gst_no,
        "Customer IMEX No": row.customer_imex_no,
        "Customer Office No": row.customer_office_no,
        "Customer Resi No": row.customer_resi_no,
        "Mobile No": row.customer_mobile_no,
        "Fax No": row.customer_fax_no,
        "Email ID": row.customer_email_id,
        "Credit Limit": row.customer_credit_limit,
        "Transport Code": row.customer_transport_code,
        "Salesman Code": row.customer_salesman_code,
        "Break Code": row.customer_broker_code,
        "Weekday Code": row.customer_weekday_code,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Customer</title>");
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
    reportWindow.document.write("<h1><u>Customer Information</u></h1>");

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
    navigate("/AddCustomerDetails", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };
  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddCustomerDetails", { state: { mode: "update", selectedRow } });
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
      (row) => row.customer_code === params.data.customer_code && row.company_code === params.data.company_code && row.keyfield == params.data.keyfield
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      // Add the edited row data to the state
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };


  const saveEditedData = async () => {
    const modified_by = sessionStorage.getItem('selectedUserCode');
    // Filter the editedData state to include only the selected rows
    const selectedRowsData = editedData.filter(row =>
      selectedRows.some(selectedRow =>
        selectedRow.customer_code === row.customer_code && selectedRow.company_code === row.company_code
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

          const response = await fetch(`${config.apiBaseUrl}/updcustomerdetData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "modified-by": modified_by
            },
            body: JSON.stringify({
              customer_codesToUpdate: selectedRowsData.map(row => row.customer_code),
              company_codesToUpdate: selectedRowsData.map(row => row.company_code),
              updatedData: selectedRowsData,
            }),
          });

          if (response.status === 200) {
            setTimeout(() => {
              toast.success("Data updated successfully")
              handleSearch();
            }, 3000);
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
      toast.warning("Please select atleast One Row to Delete")
      return;
    }

    const modified_by = sessionStorage.getItem('selectedUserCode');
    const company_code = sessionStorage.getItem('selctedCompanyCode');
    const keyfieldsToDelete = selectedRows.map((row) => row.keyfield);

    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/customerdeleteData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by,
              "company-code": company_code,
            },
            body: JSON.stringify({ keyfieldsToDelete}),
            "modified_by": modified_by// Corrected the key name to match the server-side expectation
          });

          if (response.ok) {
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
        }finally {
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
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div className=" d-flex justify-content-between  ">
            <div class="d-flex justify-content-start">
              <h1 align="left" className="purbut me-5">
                Customer
              </h1></div>


            <div className="d-flex justify-content-end purbut me-3">
              {['add', 'all permission'].some(permission => customerdetPermission.includes(permission)) && (
                <addbutton className="" onClick={handleNavigatesToForm}
                  required title="Add Customer"> <i class="fa-solid fa-user-plus"></i> </addbutton>
              )}
              {['delete', 'all permission'].some(permission => customerdetPermission.includes(permission)) && (
                <delbutton
                  className="purbut"
                  onClick={deleteSelectedRows}
                  required
                  title="Delete"
                >
                  <i class="fa-solid fa-user-minus"></i>
                </delbutton>
              )}
              {['update', 'all permission'].some(permission => customerdetPermission.includes(permission)) && (
                <savebutton
                  className="purbut"
                  onClick={saveEditedData}
                  required
                  title="Update"
                >
                  <i class="fa-solid fa-floppy-disk"></i>
                </savebutton>
              )}
              {['all permission', 'view'].some(permission => customerdetPermission.includes(permission)) && (
                <printbutton
                  class="purbut"
                  onClick={generateReport}
                  required
                  title="Generate Report"
                >
                  <i class="fa-solid fa-print"></i>
                </printbutton>
              )}
            </div>


            <div class="mobileview">
              <div class="d-flex justify-content-between">
                <div className="d-flex justify-content-start">
                  <h1 align="left" className="h1" >Customer</h1>
                </div>

                <div class="dropdown mt-1 me-5">
                  <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-list"></i>
                  </button>

                  <ul class="dropdown-menu menu">

                    <li class="iconbutton d-flex justify-content-center text-success">
                      {['add', 'all permission'].some(permission => customerdetPermission.includes(permission)) && (
                        <icon
                          class="icon"
                          onClick={handleNavigatesToForm}
                        >
                          <i class="fa-solid fa-user-plus"></i>
                          {" "}
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center text-danger">
                      {['delete', 'all permission'].some(permission => customerdetPermission.includes(permission)) && (
                        <icon
                          class="icon"
                          onClick={deleteSelectedRows}
                        >

                          <i class="fa-solid fa-user-minus"></i>
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center text-primary ">
                      {['update', 'all permission'].some(permission => customerdetPermission.includes(permission)) && (
                        <icon
                          class="icon"
                          onClick={saveEditedData}
                        >
                          <i class="fa-solid fa-floppy-disk"></i>
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center ">
                      {['all permission', 'view'].some(permission => customerdetPermission.includes(permission)) && (
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


        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">

          <div className="row ms-4 mb-3 mt-3 me-4">
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cuscode" class="exp-form-labels">
                  Code
                </label><input
                  id="cuscode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the code here"
                  value={customer_code}
                  onChange={(e) => setcustomer_code(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={18}
                />

              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cusname" class="exp-form-labels">
                  Name
                </label><input
                  id="cusname"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the name here"
                  value={customer_name}
                  onChange={(e) => setcustomer_name(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={250}
                />

              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="panno" class="exp-form-labels">
                  Pan No
                </label> <input
                  id="panno"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the Pan number here"
                  value={panno}
                  onChange={(e) => setpanno(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={18}
                />

              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cusgst" class="exp-form-labels">
                  GST No
                </label><input
                  id="cusgst"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the GST number here"
                  value={customer_gst_no}
                  onChange={(e) => setcustomer_gst_no(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={15}
                />

              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cusaddr1" class="exp-form-labels">
                  Address
                </label> <input
                  id="cusaddr1"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the address here"
                  value={customer_addr_1}
                  onChange={(e) => setcustomer_addr_1(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={250}
                />

              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cusarcode" class="exp-form-labels">
                  City
                </label><input
                  id="cusarcode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the area here"
                  value={customer_area}
                  onChange={(e) => setcustomer_area(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={100}
                />

              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cusstatcode" class="exp-form-labels">
                  State
                </label><input
                  id="cusstatcode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the state here"
                  value={customer_state}
                  onChange={(e) => setcustomer_state(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={100}
                />

              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="cuscountrycode" class="exp-form-labels">
                  Country
                </label> <input
                  id="cuscountrycode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the country here"
                  value={customer_country}
                  onChange={(e) => setcustomer_country(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={100}
                />

              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="contactno" class="exp-form-labels">
                  Contact No
                </label><input
                  id="contactno"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the contact number here"
                  value={customer_mobile_no}
                  onChange={(e) => setcustomer_mobile_no(e.target.value)}
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
            <div className="col-md-3 form-group mb-2 ">
                <div class="exp-form-floating">
                  <label for="cusweek" class="exp-form-labels">
                  Default Customer
                  </label>
                  <Select
                    id="officeType"
                    value={selectedCustomer}
                    onChange={handleChangeCustomer}
                    options={filteredOptioncustomer}
                    className="exp-input-field"
                    placeholder=""
                  />
                </div>
              </div>
            <div className="col-md-3 form-group mt-4">
              <div class="exp-form-floating">
                <div class=" d-flex  justify-content-center">

                  <div class=''><icon className="popups-btn fs-6 p-3" onClick={handleSearch} required title="Search"><i className="fas fa-search"></i></icon></div>
                  <div><icon className="popups-btn fs-6 p-3" onClick={reloadGridData} required title="Refresh"><FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" /></icon></div>
                </div> </div></div>





          </div>

          {/* <p>Result Set</p> */}

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

      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.createdBy}: {createdBy}</p>
            <p className="col-md-">
              {labels.createdDate} : {createdDate}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              {labels.modifiedBy} : {modifiedBy}
            </p>
            <p className="col-md-6">
              {labels.modifiedDate} : {modifiedDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetGrid;
