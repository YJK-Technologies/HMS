import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, DropdownButton } from "react-bootstrap";
import swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";
import { showConfirmationToast } from './ToastConfirmation';
import LoadingScreen from './Loading';
import labels from "./Labels";

const config = require("./Apiconfig");

function UserGrid() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [drop, setDrop] = useState([]);
  const [user_code, setuser_code] = useState("");
  const [user_name, setuser_name] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [user_status, setuser_status] = useState("");
  const [user_type, setuser_type] = useState("");
  const [dob, setdob] = useState("");
  const [gender, setgender] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [error, setError] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [Usertypedrop, setUsertypedrop] = useState([]);
  const [Genderdrop, setGenderdrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [usergriddrop, setUserGriddrop] = useState([]);
  const [gendergriddrop, setGenderGriddrop] = useState([]);
  const [loggriddrop, setLogGriddrop] = useState([]);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelectGender, setIsSelectGender] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const userPermission = permissions
    .filter((permission) => permission.screen_type === "User")
    .map((permission) => permission.permission_type.toLowerCase());

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
        const statusOption = data.map((option) => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/Usertype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map((option) => option.attributedetails_name);
        setUserGriddrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
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
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map((option) => option.attributedetails_name);
        setGenderGriddrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Loginorout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })

      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map((option) => option.attributedetails_name);
        setLogGriddrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
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

    fetch(`${config.apiBaseUrl}/Usertype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setUsertypedrop(val))
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
      .then((val) => setGenderdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionUser = Usertypedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionGender = Genderdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setuser_status(selectedStatus ? selectedStatus.value : "");
    setHasValueChanged(true);
  };

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setuser_type(selectedUser ? selectedUser.value : "");
    setHasValueChanged(true);
  };

  const handleChangeGender = (selectedGender) => {
    setSelectedGender(selectedGender);
    setgender(selectedGender ? selectedGender.value : "");
    setHasValueChanged(true);
  };

  const handleNavigateToForm = () => {
    navigate("/AddUser", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddUser", { state: { mode: "update", selectedRow } });
  };

  const reloadGridData = () => {
    try {
      window.location.reload();
    } catch (error) {
      console.error("Error reloading grid data:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const response = await fetch(`${config.apiBaseUrl}/usersearchcriteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          company_code: company_code,
        },
        body: JSON.stringify({
          company_code: company_code,
          user_code,
          user_name,
          first_name,
          last_name,
          user_status,
          user_type,
          dob,
          gender,
        }), // Send company_no and company_name as search criteria
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
    } finally {
      setLoading(false);
    }
  };


  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "User Code",
      field: "user_code",
      cellStyle: { textAlign: "left" },
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
      headerName: "User Name",
      field: "user_name",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "First Name",
      field: "first_name",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Last Name",
      field: "last_name",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    // {
    //   headerName: "User Image",
    //   field: "user_images",
    //   editable: true,
    //   cellStyle: { textAlign: "center" },
    //   minWidth: 150,
    //   cellEditorParams: {
    //     maxLength: 250,
    //   },
    //   cellRenderer: (params) => {
    //     if (params.value) {
    //       const base64Image = arrayBufferToBase64(params.value.data);
    //       return (
    //         <img src={`data:image/jpeg;base64,${base64Image}`}
    //           alt="Item Image"
    //           style={{ width: " 50px", height: "50px" }}
    //         />
    //       );
    //     } else {
    //       return "";
    //     }
    //   },
    // },
    {
      headerName: "User Status",
      field: "user_status",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
      },
    },
    {
      headerName: "Log In/Out",
      field: "log_in_out",
      cellStyle: { textAlign: "left" },
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: loggriddrop,
        maxLength: 150,
      },
    },
    {
      headerName: "User Type",
      field: "user_type",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        maxLength: 50,
        values: usergriddrop,
      },
    },
    {
      headerName: "Email",
      field: "email_id",
      editable: true,
      cellStyle: { textAlign: "left" },
      valueFormatter: (params) => {
        return params.value ? params.value.toLowerCase() : "";
      },
      cellEditorParams: {
        maxLength: 150,
      },
    },
    {
      headerName: "DOB",
      field: "dob",
      editable: true,
      cellStyle: { textAlign: "left" },
      valueFormatter: (params) => {
        if (!params.value) return ""; // Return an empty string if the value is null or undefined
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, "0"); // Get day (padStart ensures double-digit format)
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month (+1 because months are zero-indexed)
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; // Return formatted date string with day, month, and year
      },
    },
    {
      headerName: "Gender",
      field: "gender",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        maxLength: 10,
        values: gendergriddrop,
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
      toast.warning("Please select at least one row to generate a report");
      return
    };
    const reportData = selectedRows.map((row) => {
      const safeValue = (val) => (val !== undefined && val !== null ? val : '');

      return {
        "User Code": safeValue(row.user_code),
        "User Name": safeValue(row.user_name),
        "First Name": safeValue(row.first_name),
        "Last Name": safeValue(row.last_name),
        "User Status": safeValue(row.user_status),
        "Log In/Out": safeValue(row.log_in_out),
        "Email Id": safeValue(row.email_id),
        "DOB": safeValue(formatDate(row.dob)),
        "Gender": safeValue(row.gender),
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>User</title>");
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
    reportWindow.document.write("<h1><u>User Information</u></h1>");

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
      '<button class="report-button" title="Print" onclick="window.print()">Print</button>'
    );
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
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
  //     (row) => row.user_code === params.data.user_code // Use the unique identifier
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
      (row) => row.user_code === params.data.user_code
    );

    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      setEditedData((prevData) => {
        const existingIndex = prevData.findIndex(
          (item) => item.user_code === params.data.user_code
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

    const selectedRowsData = editedData.filter((row) =>
      selectedRows.some(
        (selectedRow) => selectedRow.user_code === row.user_code
      )
    );

    if (selectedRowsData.length === 0) {
      toast.warning("Please select a row to update its data");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {

        try {
          const company_code = sessionStorage.getItem("selectedCompanyCode");
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const response = await fetch(`${config.apiBaseUrl}/userupdate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "Modified-By": modified_by,
            },
            body: JSON.stringify({ editedData: selectedRowsData }),
            company_code: company_code,
            modified_by: modified_by,
          });

          if (response.ok) {
            console.log("Data saved successfully!");
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
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select atleast One Row to Delete");
      return;
    }

    const company_code = sessionStorage.getItem("selectedCompanyCode");
    const modified_by = sessionStorage.getItem("selectedUserCode");

    const user_codesToDelete = selectedRows.map((row) => row.user_code);

    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {

        try {
          const response = await fetch(`${config.apiBaseUrl}/userdelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "Modified-By": modified_by,
            },
            body: JSON.stringify({ user_codes: user_codesToDelete }),
            company_code: company_code,
            modified_by: modified_by,
          });

          if (response.ok) {
            console.log("Rows deleted successfully:", user_codesToDelete);
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
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === "Enter" && hasValueChanged) {
      await handleSearch();
      setHasValueChanged(false);
    }
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
              <h1 className="page-title">User</h1>
            <div className="action-wrapper desktop-actions">
              {["add", "all permission"].some((permission) => userPermission.includes(permission)) && (
                <div className="action-icon add" onClick={handleNavigateToForm}>
                  <span className="tooltip">Add</span>
                  <i class="fa-solid fa-user-plus"></i>
                </div>
              )}
              {["delete", "all permission"].some((permission) => userPermission.includes(permission)) && (
                <div className="action-icon delete" onClick={deleteSelectedRows}>
                  <span className="tooltip">Delete</span>
                  <i class="fa-solid fa-user-minus"></i>
                </div>
              )}
              {["update", "all permission"].some((permission) => userPermission.includes(permission)) && (
                <div className="action-icon update" onClick={saveEditedData}>
                  <span className="tooltip">Update</span>
                  <i class="fa-solid fa-pen-to-square"></i>
                </div>
              )}
              {["all permission", "view"].some((permission) => userPermission.includes(permission)) && (
                <div className="action-icon print"onClick={generateReport}>
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

                {['add', 'all permission'].some(p => userPermission.includes(p)) && (
                  <li className="dropdown-item" onClick={handleNavigateToForm}>
                    <i className="fa-solid fa-user-plus text-success fs-4"></i>
                  </li>
                )}

                {['delete', 'all permission'].some(p => userPermission.includes(p)) && (
                  <li className="dropdown-item" onClick={deleteSelectedRows}>
                    <i className="fa-solid fa-user-minus text-danger fs-4"></i>
                  </li>
                )}

                {['update', 'all permission'].some(p => userPermission.includes(p)) && (
                  <li className="dropdown-item" onClick={saveEditedData}>
                    <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
                  </li>
                )}

                {['all permission', 'view'].some(p => userPermission.includes(p)) && (
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
              <div class="inputGroup">
                <input
                  id="usercode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the user code here"
                  value={user_code}
                  onChange={(e) => setuser_code(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  maxLength={18}
                />
                <label for="usercode" class="exp-form-labels">User Code</label>
              </div>
            </div>

          <div className="col-md-3">
            <div className="inputGroup">
                <input
                  id="username"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the user name here"
                  value={user_name}
                  onChange={(e) => setuser_name(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  maxLength={250}
                />
                <label for="username" class="exp-form-labels">User Name</label>
              </div>
            </div>

          <div className="col-md-3">
            <div className="inputGroup">
                <input
                  id="firstname"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the first name here"
                  value={first_name}
                  onChange={(e) => setfirst_name(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  maxLength={250}
                />
                <label for="firstname" class="exp-form-labels">First Name</label>
              </div>
            </div>

          <div className="col-md-3">
            <div className="inputGroup">
                <input
                  id="lastname"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the last name here"
                  value={last_name}
                  onChange={(e) => setlast_name(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  maxLength={250}
                />
                <label for="lastname" class="exp-form-labels">Last Name</label>
              </div>
            </div>
            
          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectFocused ? "is-focused" : ""}`}
            >
                <Select
                  id="status"
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  onKeyDown={handleKeyDownStatus}
                  options={filteredOptionStatus}
                classNamePrefix="react-select"
                placeholder=" "
                onFocus={() => setIsSelectFocused(true)}
                onBlur={() => setIsSelectFocused(false)}
                isClearable
                />
                <label for="usts" class="floating-label">User Status</label>
              </div>
            </div>

            {/* <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="utype" class="exp-form-labels">
                  User Type
                </label>
                <div title="Select the User Type">         
                   <Select
                  id="usertype"
                  value={selectedUser}
                  onChange={handleChangeUser}
                  onKeyDown={handleKeyDownStatus}
                  options={filteredOptionUser}
                  className="exp-input-field"
                  placeholder=""
                />
              </div>
              </div>
            </div> */}

          <div className="col-md-3">
            <div className="inputGroup">
                <input
                  id="dob"
                  className="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required
                  title="Please fill the DOB here"
                  value={dob}
                  onChange={(e) => setdob(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <label for="dob" class="exp-form-labels">DOB</label>
              </div>
            </div>
          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedGender ? "has-value" : ""} 
              ${isSelectGender ? "is-focused" : ""}`}
            >                <Select
                  id="gender"
                  isClearable
                  value={selectedGender}
                  onChange={handleChangeGender}
                  onKeyDown={handleKeyDownStatus}
                  options={filteredOptionGender}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectGender(true)}
                onBlur={() => setIsSelectGender(false)}
                />
                <label for="gender" class="floating-label">Gender</label>
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

      <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
          <div class="ag-theme-alpine" style={{ height: 390, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onCellValueChanged={onCellValueChanged}
              rowSelection="multiple"
              onSelectionChanged={onSelectionChanged}
              pagination={true}
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
              {labels.createdDate}:  {createdDate}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              {labels.modifiedBy}: {modifiedBy}
            </p>
            <p className="col-md-6">
              {labels.modifiedDate} : {modifiedDate}
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default UserGrid;
