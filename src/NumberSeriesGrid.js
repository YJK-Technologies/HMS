import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from './ToastConfirmation';
import Select from "react-select";
import LoadingScreen from './Loading';
import labels from "./Labels"


function NumberSeriesGrid() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const config = require("./Apiconfig");
  const [Screen_Type, setScreen_Type] = useState("");
  const [editedData, setEditedData] = useState([]);
  const [selectedscreentype, setselectedscreentype] = useState("");
  const [screentypedrop, setscreentypedrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [booleangriddrop, setBooleangriddrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [isSelectedscreentype, setIsSelectscreentype] = useState(false);
  //code added by Haraish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const numberSeriesPermission = permissions
    .filter((permission) => permission.screen_type === "Number Series")
    .map((permission) => permission.permission_type.toLowerCase());

  console.log(numberSeriesPermission);



  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/screentype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setscreentypedrop(val));
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
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getboolean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const booleanOption = data.map(option => option.attributedetails_name);
        setBooleangriddrop(booleanOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);



  const filteredOptionscreentype = screentypedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));







  const handleChangescreentype = (selectedscreentype) => {
    setselectedscreentype(selectedscreentype);
    setScreen_Type(selectedscreentype ? selectedscreentype.value : "");
  };


  const reloadGridData = () => {
    window.location.reload();
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const response = await fetch(`${config.apiBaseUrl}/numberseriessearchdata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            company_code: company_code,
            Screen_Type: Screen_Type,
          },
          body: JSON.stringify({ company_code: company_code, Screen_Type: Screen_Type }), // Send company_no and company_name as search criteria
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
      headerName: "Screen Type",
      field: "Screen_Type",
      //  editable: true,
      cellStyle: { textAlign: "left" },

      // minWidth: 250,
      // maxWidth: 250,

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
      headerName: "Start Year",
      field: "Start_Year",
      editable: false,
      cellStyle: { textAlign: "left" },

      // minWidth: 10,
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
      headerName: "End Year",
      field: "End_Year",
      editable: false,
      cellStyle: { textAlign: "left" },
      // minWidth: 10,
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
      headerName: "Start No",
      field: "Start_No",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
    },
    {
      headerName: "Running No",
      field: "Running_No",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
    },
    {
      headerName: "End No",
      field: "End_No",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
    },
    {
      headerName: "Text",
      field: "comtext",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
    },
    {
      headerName: "Number Prefix",
      field: "number_prefix",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: booleangriddrop
      },
    },
    {
      headerName: "Status",
      field: "Status",
      editable: true,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop
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
        "Screen Type": row.Screen_Type,
        "Start Year": row.Start_Year,
        "End Year": row.End_Year,
        "Start No": row.Start_No,
        "Running No": row.Running_No,
        "End No": row.End_No,
        //"Founded Date": row.FoundedDate,
        //"Website URL": row.WebsiteURL,
        //"Company Logo": row.Company_logo,
        //"Contact Number": row.contact_no,
        //  "CEO Name": row.CEOName,
        // "Annual Report URL": row.AnnualReportURL,
        // "created by": row.created_by,
        // "created date": row.created_date,
        // "modfied by": row.modfied_by,
        // "modfied date": row.modfied_date,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>NumberSeries</title>");
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
    reportWindow.document.write("<h1><u>NumberSeries Information</u></h1>");

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
    navigate("/AddNumberSeries", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };
  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddNumberSeries", { state: { mode: "update", selectedRow } });
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
      (row) => row.Screen_Type === params.data.Screen_Type
    );

    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      setEditedData((prevData) => {
        const existingIndex = prevData.findIndex(
          (item) => item.Screen_Type === params.data.Screen_Type
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
    const modified_by = sessionStorage.getItem("selectedUserCode");
    // Filter the editedData state to include only the selected rows
    const selectedRowsData = editedData.filter((row) =>
      selectedRows.some(
        (selectedRow) => selectedRow.Screen_Type === row.Screen_Type
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
          const response = await fetch(
            `${config.apiBaseUrl}/saveEditedNumberseriesData`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "modified-by": modified_by,
              },
              body: JSON.stringify({ editedData: selectedRowsData }),
              modified_by: modified_by, // Send only the selected rows for saving
            }
          );

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

    const modified_by = sessionStorage.getItem("selectedUserCode");
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    // const ScreenTypdeDelete  =  {Screen_TypesToDelete:Array.isArray(rowData) ? rowData : [rowData] };
    const ScreenTypdeDelete = { Screen_TypesToDelete: selectedRows };

    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${config.apiBaseUrl}/numberseriesdeleteData`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Modified-By": modified_by,
                "company_code": company_code
              },
              body: JSON.stringify(ScreenTypdeDelete),
              modified_by: modified_by, company_code: company_code
            }
          );

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
        <div className="shadow-lg p-2 bg-body-tertiary rounded main-header-box">
          <div className="header-flex">
            <h1 className="page-title">Number Series</h1>

            <div className="action-wrapper desktop-actions">
              {["add", "all permission"].some((permission) =>
                numberSeriesPermission.includes(permission)
              ) && (
                  <div className="action-icon add" onClick={handleNavigatesToForm}>
                    <span className="tooltip">Add</span>
                    <i class="fa-solid fa-user-plus"></i>
                  </div>
                )}
              {["delete", "all permission"].some((permission) =>
                numberSeriesPermission.includes(permission)
              ) && (
                  <div className="action-icon delete"
                    onClick={deleteSelectedRows}
                  >
                    <span className="tooltip">Delete</span>
                    <i class="fa-solid fa-user-minus"></i>
                  </div>
                )}
              {["update", "all permission"].some((permission) =>
                numberSeriesPermission.includes(permission)
              ) && (
                  <div className="action-icon update"
                    onClick={saveEditedData}
                  >
                    <span className="tooltip">Update</span>
                    <i class="fa-solid fa-pen-to-square"></i>
                  </div>
                )}

              {["all permission", "view"].some((permission) =>
                numberSeriesPermission.includes(permission)
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

                {['add', 'all permission'].some(p => numberSeriesPermission.includes(p)) && (
                  <li className="dropdown-item" onClick={handleNavigatesToForm}>
                    <i className="fa-solid fa-user-plus text-success fs-4"></i>
                  </li>
                )}

                {['delete', 'all permission'].some(p => numberSeriesPermission.includes(p)) && (
                  <li className="dropdown-item" onClick={deleteSelectedRows}>
                    <i className="fa-solid fa-user-minus text-danger fs-4"></i>
                  </li>
                )}

                {['update', 'all permission'].some(p => numberSeriesPermission.includes(p)) && (
                  <li className="dropdown-item" onClick={saveEditedData}>
                    <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
                  </li>
                )}

                {['all permission', 'view'].some(p => numberSeriesPermission.includes(p)) && (
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
              <div
                className={`inputGroup selectGroup 
              ${selectedscreentype ? "has-value" : ""} 
              ${isSelectedscreentype ? "is-focused" : ""}`}
              >
                <Select
                  id="wcode"
                  isClearable
                  value={selectedscreentype}
                  onChange={handleChangescreentype}
                  // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  options={filteredOptionscreentype}
                  classNamePrefix="react-select"
                  placeholder=""
                  onFocus={() => setIsSelectscreentype(true)}
                  onBlur={() => setIsSelectscreentype(false)}
                  required
                  title="Please select a screen type"
                  maxLength={50}
                />
                <label for="tcode" class="floating-label">Screen Type</label>
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
          <div class="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
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

export default NumberSeriesGrid;
