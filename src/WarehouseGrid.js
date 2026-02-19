import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import labels from "./Labels";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';
import { showConfirmationToast } from './ToastConfirmation';
const config = require('./Apiconfig');


function WarehouseGrid() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [drop, setDrop] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [warehouse_code, setwarehouse_code] = useState("");
  const [warehouse_name, setwarehouse_name] = useState("");
  const [status, setstatus] = useState("");
  const [location_no, setlocation_no] = useState("");
  const [Locationdrop, setLocationdrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const warehouseGridPermision = permissions
    .filter(permission => permission.screen_type === 'Warehouse')
    .map(permission => permission.permission_type.toLowerCase());

  /*testing for search criteria
    const [showAddUserForm, setShowAddUserForm] = useState(false);
   const [editedData, setEditedData] = useState([]);
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");*/

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/locationno`)
      .then((response) => response.json())
      .then((data) => {
        const LocationOption = data.map(option => option.location_no);
        setLocationdrop(LocationOption);
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
    }).then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusGriddrop(statusOption);
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


  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');
  };


  const handleSearch = async () => {
    setLoading(true);
    try {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      const response = await fetch(`${config.apiBaseUrl}/onlywarehsearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "company_code": company_code
        },
        body: JSON.stringify({ company_code: company_code, warehouse_code, warehouse_name, status, location_no }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
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


  const reloadGridData = () => {
    window.location.reload();
  };


  const columnDefs = [


    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Warehouse Code",
      field: "warehouse_code",
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
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },


    },
    {
      headerName: "Warehouse Name",
      field: "warehouse_name",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
      valueFormatter: (params) =>
        params.value
          ? params.value
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          : '',
    },
    {
      headerName: "Status",
      field: "status",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      // maxWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop
      },
      // valueFormatter: (params) => 
      //   params.value
      //     ? params.value
      //         .toLowerCase()
      //         .split(' ')
      //         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      //         .join(' ')
      //     : '',
    },
    {
      headerName: "Location No",
      field: "location_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 18,
        values: Locationdrop,
      },
      cellEditor: "agSelectCellEditor",
      // valueFormatter: (params) => 
      //   params.value
      //     ? params.value
      //         .toLowerCase()
      //         .split(' ')
      //         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      //         .join(' ')
      //     : '',
    },
  ];


  const defaultColDef = {
    resizable: true,
    wrapText: true,
    // sortable: true,
    // editable: true,
    // flex: 1,
    // filter: true,
    // floatingFilter: true,
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
      return {
        /* Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        Expenditure: row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks,*/
        "Warehouse Code": row.warehouse_code,
        "Warehouse Name": row.warehouse_name,
        "Status": row.status,
        "Location No": row.location_no,

      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Warehouse</title>");
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
    reportWindow.document.write("<h1><u>Warehouse Information</u></h1>");

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


  const handleNavigateToForm = () => {
    navigate("/AddWarehouse", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };
  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddWarehouse", { state: { mode: "update", selectedRow } });
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
      (row) => row.vendor_code === params.data.vendor_code && row.company_code === params.data.company_code && row.keyfield == params.data.keyfield
    );

    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      setEditedData((prevData) => {
        const existingIndex = prevData.findIndex(
          (item) => item.vendor_code === params.data.vendor_code && item.company_code === params.data.company_code && item.keyfield == params.data.keyfield
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

    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const modified_by = sessionStorage.getItem('selectedUserCode');
    // Filter the editedData state to include only the selected rows
    const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.warehouse_code === row.warehouse_code));

    if (selectedRowsData.length === 0) {
      toast.warning("Please select and modify at least one row to update its data");
      return;
    }
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        setLoading(true);
        try {


          const response = await fetch(`${config.apiBaseUrl}/warehouseupdate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "modified-by": modified_by
            },
            body: JSON.stringify({ editedData: selectedRowsData }), // Send only the selected rows for saving
            "company_code": company_code,
            "modified-by": modified_by

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
    if (selectedRows.length === 0) {
      toast.warning("Please select atleast One Row to Delete")
      return;
    }

    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const modified_by = sessionStorage.getItem('selectedUserCode');

    const warehouse_codesToDelete = selectedRows.map((row) => row.warehouse_code);
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/Warehousedelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "Modified-By": modified_by
            },
            body: JSON.stringify({ warehouse_codes: warehouse_codesToDelete }),
            "company_code": company_code,
            "modified_by": modified_by

          });

          if (response.ok) {
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
            <h1 className="page-title">Warehouse</h1>

            <div className="action-wrapper desktop-actions">
              {['add', 'all permission'].some(permission => warehouseGridPermision.includes(permission)) && (
                <div className="action-icon add" onClick={handleNavigateToForm}>
                  <span className="tooltip">Add</span>
                  <i class="fa-solid fa-user-plus"></i> </div>
              )}
              {['delete', 'all permission'].some(permission => warehouseGridPermision.includes(permission)) && (
                <div className="action-icon delete"
                  onClick={deleteSelectedRows}
                >
                  <span className="tooltip">Delete</span>
                  <i class="fa-solid fa-user-minus"></i>
                </div>
              )}

              {['update', 'all permission'].some(permission => warehouseGridPermision.includes(permission)) && (
                <div className="action-icon update"
                  onClick={saveEditedData}
                >
                  <span className="tooltip">Update</span>
                  <i class="fa-solid fa-pen-to-square"></i>
                </div>
              )}

              {['all permission', 'view'].some(permission => warehouseGridPermision.includes(permission)) && (
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

                {['add', 'all permission'].some(p => warehouseGridPermision.includes(p)) && (
                  <li className="dropdown-item" onClick={handleNavigateToForm}>
                    <i className="fa-solid fa-user-plus text-success fs-4"></i>
                  </li>
                )}

                {['delete', 'all permission'].some(p => warehouseGridPermision.includes(p)) && (
                  <li className="dropdown-item" onClick={deleteSelectedRows}>
                    <i className="fa-solid fa-user-minus text-danger fs-4"></i>
                  </li>
                )}

                {['update', 'all permission'].some(p => warehouseGridPermision.includes(p)) && (
                  <li className="dropdown-item" onClick={saveEditedData}>
                    <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
                  </li>
                )}

                {['all permission', 'view'].some(p => warehouseGridPermision.includes(p)) && (
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
                  id="wcode"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="please fill the warehouse code here"
                  value={warehouse_code}
                  onChange={(e) => setwarehouse_code(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={18}
                />
                <label for="wcode" class="exp-form-labels">Warehouse Code</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="inputGroup">
                <input
                  id="wname"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="please fill the warehouse name here"
                  value={warehouse_name}
                  onChange={(e) => setwarehouse_name(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={250}
                />
                <label for="wname" class="exp-form-labels">Warehouse Name</label>
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  options={filteredOptionStatus}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectStatus(true)}
                  onBlur={() => setIsSelectStatus(false)}
                />
                <label for="status" class="floating-label">Status</label>
              </div>
            </div>

            <div className="col-md-3">
              <div className="inputGroup">
                <input
                  id="wloc"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="please fill the location number here"
                  value={location_no}
                  onChange={(e) => setlocation_no(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={18}
                />
                <label for="wloc" class="exp-form-labels">Location No</label>
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
          <div class="ag-theme-alpine" style={{ height: 550, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onCellValueChanged={onCellValueChanged}
              rowSelection="multiple"
              onSelectionChanged={onSelectionChanged}
              pagination={true}
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
      </div> */}
    </div>



  );
}

export default WarehouseGrid;
