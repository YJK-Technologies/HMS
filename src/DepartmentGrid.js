import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./test.css"
import { Dropdown, DropdownButton } from "react-bootstrap";
import labels from "./Labels";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from './ToastConfirmation';
import LoadingScreen from './Loading';
const config = require("./Apiconfig");



function Department() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [dept_id, setdept_id] = useState("");
  const [dept_name, setdept_name] = useState("");
  const [editedData, setEditedData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);    
  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const attributePermission = permissions
    .filter((permission) => permission.screen_type === "Attribute")
    .map((permission) => permission.permission_type.toLowerCase());

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleSearch = async () => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    
    setLoading(true);
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/DepartmentSerachData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dept_id, dept_name, company_code }), // Send  as search criteria
        }
      );
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully");
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found")
        setRowData([]);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error updating data: " + error.message );
    }finally {
      setLoading(false);
    }

  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Department Code",
      field: "dept_id",
      cellStyle: { textAlign: "center" },
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
      headerName: "Department Name",
      field: "dept_name",
      editable: true,
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Keyfield",
      field: "key_field",
      cellStyle: { textAlign: "center" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
      hide: true,
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    // flex: 1,
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
      return {
        "Department Code": row.dept_id,
        "Department Name": row.dept_name,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Department</title>");
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
    reportWindow.document.write("<h1><u>Department</u></h1>");

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

  const handleNavigatesToForm = () => {
    navigate("/AddDepartment", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };
  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddDepartment", { state: { mode: "update", selectedRow } });
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
      (row) => row.key_field === params.data.key_field
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      // Add the edited row data to the state
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };

  const saveEditedData = async () => {
    const selectedRowsData = editedData.filter((row) =>
      selectedRows.some(
        (selectedRow) => selectedRow.key_field === row.key_field))

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
          // Filter the editedData state to include only the selected rows

          const response = await fetch(`${config.apiBaseUrl}/UpdateDepartment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "modified-by": modified_by
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
            toast.warning(errorResponse.message || "Failed to Update");
          }
        } catch (error) {
          console.error("Error saving data:", error);
          toast.error("Error Updating Data: " + error.message);
        }finally {
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

    const modified_by = sessionStorage.getItem("selectedUserCode");

    const keyfieldsToDelete = selectedRows.map((row) => row.key_field);
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/DeleteDepartment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by,
            },
            body: JSON.stringify({
              key_field: keyfieldsToDelete,
            }),
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data Deleted successfully")
              handleSearch();
            }, 1000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete  ");
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
      <div className="shadow-lg p-2 bg-light rounded main-header-box">
          <div className="header-flex">
              <h1 className="page-title">Department</h1>

            <div className="action-wrapper desktop-actions">
              {["add", "all permission"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
                  <div className="action-icon add" onClick={handleNavigatesToForm}
                  >
                  <span className="tooltip">Add</span>
                    <i class="fa-solid fa-user-plus"></i>
                  </div>
                )}
              {["delete", "all permission"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
                 <div className="action-icon delete"
                    onClick={deleteSelectedRows}
                  >
                  <span className="tooltip">Delete</span>
                    <i class="fa-solid fa-user-minus"></i>
                  </div>
                )}
              {["update", "all permission"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
                  <div className="action-icon update" 
                    onClick={saveEditedData}
                  >
                  <span className="tooltip">Update</span>
                <i class="fa-solid fa-pen-to-square"></i>
                  </div>
                )}
              {["all permission", "view"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
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

                {['add', 'all permission'].some(p => attributePermission.includes(p)) && (
                  <li className="dropdown-item" onClick={handleNavigatesToForm}>
                    <i className="fa-solid fa-user-plus text-success fs-4"></i>
                  </li>
                )}

                {['delete', 'all permission'].some(p => attributePermission.includes(p)) && (
                  <li className="dropdown-item" onClick={deleteSelectedRows}>
                    <i className="fa-solid fa-user-minus text-danger fs-4"></i>
                  </li>
                )}

                {['update', 'all permission'].some(p => attributePermission.includes(p)) && (
                  <li className="dropdown-item" onClick={saveEditedData}>
                  <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
                  </li>
                )}

                {['all permission', 'view'].some(p => attributePermission.includes(p)) && (
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
                  id="depID"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the Department Code here"
                  value={dept_id}
                  maxLength={18}
                  onChange={(e) => setdept_id(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <label for="locno" class="exp-form-labels">Department Code</label>
              </div>
            </div>

          <div className="col-md-3">
            <div className="inputGroup">
                <input
                  id="depName"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the Department Name here"
                  value={dept_name}
                  maxLength={18}
                  onChange={(e) => setdept_name(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <label for="lname" class="exp-form-labels">Department Name</label>
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
          <div class="ag-theme-alpine" style={{ height: 450, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              rowSelection="multiple"
              pagination={true}
              paginationAutoPageSize={true}
              onSelectionChanged={onSelectionChanged}
              onCellValueChanged={onCellValueChanged}
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
              {labels.modifiedBy} : {modifiedBy}
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

export default Department;
