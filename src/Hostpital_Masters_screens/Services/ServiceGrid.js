import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "../../apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import labels from "../../Labels";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from '../../ToastConfirmation';
import LoadingScreen from '../../Loading';
import Select from "react-select";

const config = require('../../Apiconfig');


function ServiceGrid() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [ServiceID, setServiceID] = useState("");
  const [Code, setCode] = useState("");
  const [ServiceName, setServiceName] = useState("");
  const [Department, setDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [Status, setStatus] = useState("");
  const [Statusdrop, setstatusdrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  const [editedData, setEditedData] = useState([]);
  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const attributePermission = permissions
    .filter(permission => permission.screen_type === 'ServiceGrid')
    .map(permission => permission.permission_type.toLowerCase());



  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

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

  // Define the function to reload the grid data
  const reloadGridData = () => {
    window.location.reload();
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((data) => {
        const status = data.map(option => option.attributedetails_name);
        setstatusdrop(status);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    try {
      const response = await fetch(`${config.apiBaseUrl}/ServiceSearchCreteria`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ServiceID,
            Code,
            ServiceName,
            Status,
            Department,
            company_code: company_code,
          }),
        }
      );

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Service Code",
      field: "ServiceID",
      cellStyle: { textAlign: "center" },
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
      headerName: "Service Name",
      field: "ServiceName",
      cellStyle: { textAlign: "center" },
      editable: true,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    // {
    //   headerName: "Code",
    //   field: "Code",
    //   editable: true,
    //   cellStyle: { textAlign: "center" },
    //   // minWidth: 150,
    //   cellEditorParams: {
    //     maxLength: 250,
    //   },
    // },
    {
      headerName: "Department",
      field: "Department",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Rate",
      field: "Rate",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Status",
      field: "Status",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Statusdrop
      },
    },
    {
      headerName: "Tax Applicable",
      field: "TaxApplicable",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
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

      return {
        "Service Code": safeValue(row.ServiceID),
        "Service Name": safeValue(row.ServiceName),
        "Department": safeValue(row.Department),
        "Rate": safeValue(row.Rate),
        "Status": safeValue(row.Status),
        "Tax Applicable": safeValue(row.TaxApplicable),
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Service Details</title>");
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
    reportWindow.document.write("<h1><u>Service Details</u></h1>");

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
    navigate("/AddServiceinfo", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/AddServiceinfo", { state: { mode: "update", selectedRow } });
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.ServiceID === params.data.ServiceID
    );

    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      setEditedData((prevData) => {
        const existingIndex = prevData.findIndex(
          (item) => item.ServiceID === params.data.ServiceID
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
    const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.ServiceID === row.ServiceID));
    if (selectedRowsData.length === 0) {
      toast.warning("Please select a row to update its data");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const modified_by = sessionStorage.getItem('selectedUserCode');
          const company_code = sessionStorage.getItem("selectedCompanyCode");

          const response = await fetch(`${config.apiBaseUrl}/updateServiceGrid`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "modified-by": modified_by,
            },
            body: JSON.stringify({ editedData: selectedRowsData })
          });

          if (response.status === 200) {
            setTimeout(() => {
              toast.success("Data Updated Successfully");
              handleSearch();
            }, 3000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to update");
          }
        } catch (error) {
          console.error("Error saving data:", error);
          toast.error("Error Updating Data: " + error.message);
        } finally {
          setLoading(false);
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
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/ServiceDelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "modified_by": modified_by,
              "company_code": company_code,
            },
            body: JSON.stringify({ deletedServiceId: selectedRows }),
            "modified_by": modified_by,
            "company_code": company_code,
          });

          if (response.ok) {
            toast.success("Data Deleted Successfully")
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
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div className=" d-flex justify-content-between  ">
            <div class="d-flex justify-content-start">
              <h1 align="left" className="purbut me-5">
                Service
              </h1>
            </div>
            <div className="d-flex justify-content-end purbut me-3">
              {["add", "all permission"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
                  <addbutton
                    className="purbut"
                    onClick={handleNavigatesToForm}
                    required
                    title="Add Service"
                  >
                    <i class="fa-solid fa-user-plus"></i>{" "}
                  </addbutton>
                )}
              {["delete", "all permission"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
                  <delbutton
                    className="purbut"
                    onClick={deleteSelectedRows}
                    required
                    title="Delete Service"
                  >
                    <i class="fa-solid fa-user-minus"></i>
                  </delbutton>
                )}
              {["update", "all permission"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
                  <savebutton
                    className="purbut"
                    onClick={saveEditedData}
                    required
                    title="Update Service"
                  >
                    <i class="fa-solid fa-floppy-disk"></i>
                  </savebutton>
                )}
              {["all permission", "view"].some((permission) =>
                attributePermission.includes(permission)
              ) && (
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
                  <h1 align="left" className="h1">
                    Service
                  </h1>
                </div>
                <div class="dropdown mt-1 me-5" >
                  <button
                    class="btn btn-primary dropdown-toggle p-1"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu menu">
                    <li class="iconbutton d-flex justify-content-center text-success">
                      {['add', 'all permission'].some(permission => attributePermission.includes(permission)) && (
                        <icon
                          class="icon"
                          onClick={handleNavigatesToForm}
                        >
                          <i class="fa-solid fa-user-plus"></i>
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center text-danger">
                      {['delete', 'all permission'].some(permission => attributePermission.includes(permission)) && (
                        <icon
                          class="icon"
                          onClick={deleteSelectedRows}
                        >
                          <i class="fa-solid fa-user-minus"></i>
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center text-primary ">
                      {['update', 'all permission'].some(permission => attributePermission.includes(permission)) && (
                        <icon
                          class="icon"
                          onClick={saveEditedData}
                        >
                          <i class="fa-solid fa-floppy-disk"></i>
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center ">
                      {['all permission', 'view'].some(permission => attributePermission.includes(permission)) && (
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
          <div className="row ms-4 mt-3 mb-3 me-4">
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="locno" class="exp-form-labels">
                  Service Code
                </label>
                <input
                  id="locno"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the header code here"
                  value={ServiceID}
                  maxLength={18}
                  onChange={(e) => setServiceID(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            {/* <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="lname" class="exp-form-labels">
                  Code
                </label>
                <input
                  id="lname"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the sub code here"
                  value={Code}
                  maxLength={18}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div> */}
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="lname" class="exp-form-labels">
                  Service Name
                </label>
                <input
                  id="lname"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the sub code here"
                  value={ServiceName}
                  maxLength={18}
                  onChange={(e) => setServiceName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="lname" class="exp-form-labels">
                  Departmemt
                </label>
                <input
                  id="lname"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the sub code here"
                  value={Department}
                  maxLength={18}
                  onChange={(e) => setDepartment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="state" class="exp-form-labels">
                  Status
                </label>
                <Select
                  id="state"
                  className="exp-input-field "
                  type="text"
                  placeholder=""
                  required
                  title="Please fill the description here"
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  options={filteredOptionStatus}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="col-md-2 form-group mt-4">
              <div class="exp-form-floating">
                <div class=" d-flex justify-content-center ">
                  <div class="">
                    <icon
                      className="popups-btn fs-6 p-3"
                      onClick={handleSearch}
                      required
                      title="Search"
                    >
                      <i className="fas fa-search"></i>
                    </icon>
                  </div>
                  <div>
                    <icon
                      className="popups-btn fs-6 p-3"
                      onClick={reloadGridData}
                      required
                      title="Refresh"
                    >
                      <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" />
                    </icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              {labels.createdBy}: {createdBy}
            </p>
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

export default ServiceGrid;
