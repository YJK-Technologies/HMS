import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import './EmployeeLoan.css'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import Select from 'react-select'
import axios from 'axios';
import ProjectInput from './EmpProjectinput.js';
import { showConfirmationToast } from '../ToastConfirmation';
const config = require('../Apiconfig');

function Input({ }) {

  const gridApiRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [StartDate, setStartDate] = useState(today);
  const [EndDate, setEndDate] = useState(today);
  const [PriorityLevel, setPriorityLevel] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [TaskStatus, setTaskStatus] = useState('');
  const [ProjectName, setProjectName] = useState('');
  const [ProjectManager, setProjectManager] = useState('');
  const [ProjectDescription, setProjectDescription] = useState('');
  const [status_type, setstatus_type] = useState("");
  const [rowData, setrowData] = useState([]); 
  const [PriorityDrop, setPriorityDrop] = useState([]);
  const [selectedPriortyLeavel, setSelectedPriortyLeavel] = useState('');
  const [selectedTaskStatus, setSelectedTaskStatus] = useState('');
  const [editedData, setEditedData] = useState([]);
  const [ProjectId, setProjectId] = useState("");
  const [Projectname, setProjectname] = useState("");
  const [Startdate, setStartdate] = useState("");
  const [Enddate, setEnddate] = useState("");
  const [Priority, setPriority] = useState("");
  const [selectedPriorty, setSelectedPriorty] = useState("");
  const [selctedTask, setSelectedTask] = useState("");
  const [Task, setTask] = useState("");
  const [StatusGriddrop, setStatusGriddrop] = useState([]);
  const [Taskstatusdrop, setTaskStatusdrop] = useState([]);
  const [Managerdrop, setManagerdrop] = useState([]);
  const [PriorityGridDrop, setPriorityGridDrop] = useState([]);
  const [filterOptionmanager, setfilterOptionmanager] = useState("");
  const [selectedmanager, setselectedmanager] = useState('');
  const [manager, setmanager] = useState("");
  const [selectedProject, setselectedproject] = useState("")
  const [EstimatedHours, setEstimatedHours] = useState("")

  const [createdBy, setCreatedBy] = useState("");

  const [modifiedBy, setModifiedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");



  const [error, setError] = useState('');



  const [ProjectID, setProjectID] = useState('');
  const navigate = useNavigate();


  const [hasValueChanged, setHasValueChanged] = useState(false);
  // const [companyImage, setCompanyImage] = useState("");
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [isUpdated, setIsUpdated] = useState(false);
  const location = useLocation();


  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [selectedRows, setSelectedRows] = useState([]);


  const modified_by = sessionStorage.getItem("selectedUserCode");

  // const options = [
  //   { value: 'add', label: 'Add' },
  //   { value: 'update', label: 'Update ' }
  // ];
  // const handleSelectChange = (selectedOption) => {
  //   setLoanAction(selectedOption.value);
  // };


  // const arrayBufferToBase64 = (buffer) => {
  //   let binary = "";
  //   const bytes = new Uint8Array(buffer);
  //   for (let i = 0; i < bytes.byteLength; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return window.btoa(binary);
  // };
  // const [data, setData] = useState([]);  // State to store the fetched data
  // const [loading, setLoading] = useState(true); 

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/Project", { state: { mode: "update", selectedRow } });
  };





  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      // minWidth: 110,
      // maxWidth: 110,
      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 20;
        const showIcons = isWideEnough;
        return (
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => saveEditedData(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => deleteSelectedRows(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },

    {
      headerName: "Project ID",
      field: "ProjectID",
      // minWidth: 250,
      // maxWidth: 250,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        // maxLength: 50,
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
      headerName: "Project Name",
      field: "ProjectName", filter: 'agTextColumnFilter',
      // minWidth: 210, maxWidth: 250,
      editable: true,
      // maxLength: 255
    },
    {
      headerName: "Project Description",
      field: "ProjectDescription",
      filter: 'agNumberColumnFilter',
      // minWidth: 250, maxWidth: 250,
      editable: true,
      // maxLength: 255

    },

    {
      headerName:
        "Project Manager",
      field: "ProjectManager",
      filter: 'agTextColumnFilter',
      // minWidth: 200, maxWidth: 250,
      editable: true
    },
    {
      headerName: "Start Date", field: "StartDate", filter: 'agDateColumnFilter', 
      // minWidth: 150, maxWidth: 150,
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-'));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: "End Date", field: "EndDate", filter: 'agDateColumnFilter', 
      // minWidth: 150, maxWidth: 150,
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-'));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },

    {
      headerName: "Priority Level",
      field: "PriorityLevel",
      filter: 'agNumberColumnFilter',
      // minWidth: 130,
      // maxWidth: 130,
      // maxLength: 15,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: PriorityGridDrop
      }
    },


    {
      headerName: "Task Status",
      field: "TaskStatus",
      filter: 'agNumberColumnFilter',
      // minWidth: 130,
      // maxWidth: 130,
      editable: true,
      // maxLength: 25,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: StatusGriddrop
      },
    },

  ];
  // const defaultColDef = {
  //   resizable: true,
  //   wrapText: true,
  //   sortable: true,
  //   editable: true,
  //   filter: true,
  // };

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const data = {
      ProjectID, // Assuming you already have ProjectID defined in your state or props
    };

    try {
      await axios.post(`${config.apiBaseUrl}/deleteProject`, data);
      toast.success("Data deleted successfully!");
    } catch (error) {
      toast.error("Error deleting data: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
     fetch(`${config.apiBaseUrl}/getPriority`, {
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
        setPriorityGridDrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getTaskstatus`, {
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
    fetch(`${config.apiBaseUrl}/ESSManager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // user_code: sessionStorage.getItem("selectedUserCode"),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then(setManagerdrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);

  const handleChangestatus = (selectedstatus) => {
    setSelectedTaskStatus(selectedstatus);
    setstatus_type(selectedstatus ? selectedstatus.value : '');
    setHasValueChanged(true);
  };

  const filteredOptionTransaction = Taskstatusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  //status
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getTaskstatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setTaskStatusdrop(val));
  }, []);



  const filteredOptionTask = [{ value: 'All', label: 'All' }, ...Taskstatusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }));

  const filteredOptionManagers = [{value:'All', label:'All'}, ...Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }))];

  // const filteredOptionManager = Array.isArray(Managerdrop) ? Managerdrop.map((option) => ({
  //   value: option.EmployeeId,
  //   label: `${option.user_code}-${option.user_name}`,
  // })) : [];  // Return an empty array if Managerdrop is not an array
  
  const handleChangeTask = (selectedstatus) => {
    setSelectedTask(selectedstatus);
    setTask(selectedstatus ? selectedstatus.value : '');
    setHasValueChanged(true);
  };

  const filteredOptionPriority = [{ value: 'All', label: 'All' }, ...PriorityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  const handleChangePriority = (selectedPriorty) => {
    setSelectedPriorty(selectedPriorty);
    setPriority(selectedPriorty ? selectedPriorty.value : '');
  };


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getPriority`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setPriorityDrop(val));
  }, []);

  const filteredOptionPriorityLevel = PriorityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangePriorityLevel = (selectedPriortyLeavel) => {
    setSelectedPriortyLeavel(selectedPriortyLeavel);
    setPriorityLevel(selectedPriortyLeavel ? selectedPriortyLeavel.value : '');
  };

  const handleChangemanager = (selectedOption) => {
    setselectedmanager(selectedOption);
    setProjectManager(selectedOption ? selectedOption.value : '');
    setError(false);
  };

  const handleChangeCode = (selectedOption) => {
    setselectedproject(selectedOption);
    setmanager(selectedOption ? selectedOption.value : '');
    setError(false);
  };


  // const handleUpdate = async (e) => {
  //   e.preventDefault(); 

  //   setIsSaving(true); 
  //   setMessage(''); 

  //   try {

  //     const data = {
  //       ProjectID,
  //       ProjectName,
  //       ProjectManager,
  //       ProjectDescription,
  //       StartDate,
  //       EndDate,
  //       PriorityLevel,
  //       TaskStatus: status_type,
  //       modified_by: sessionStorage.getItem('selectedUserCode') 
  //     };

  //     const response = await fetch(`${config.apiBaseUrl}/updateProject`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (response.status === 200) { 
  //       toast.success("Project data updated successfully!");
  //     } else {
  //       toast.error(response.data.message || "Failed to update project data");
  //     }
  //   } catch (error) {
  //     toast.error('Error updating data: ' + (error.response?.data?.message || error.message));
  //   } finally {
  //     setIsSaving(false); 
  //   }
  // };

  const handleSave = async (e) => {

    try {

      if (!ProjectName || !ProjectManager || !ProjectDescription || !StartDate || !EndDate || !PriorityLevel || !status_type ||!EstimatedHours) {
        setError(" ");
        toast.warning("Error:Missing Required Fields")
        return;
      }
      e.preventDefault();
      setSaveButtonVisible(true);
      setIsSaving(true);
      setMessage('');

      const data = {
        ProjectName,
        ProjectManager,
        ProjectDescription,
        StartDate,
        EndDate,
        PriorityLevel,
        EstimatedHours,
        TaskStatus: status_type,
        created_by: sessionStorage.getItem('selectedUserCode'),
        company_code:sessionStorage.getItem('selectedCompanyCode')
        

      };


      const response = await fetch(`${config.apiBaseUrl}/addProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        const { ProjectID } = searchData[0];
        setProjectID(ProjectID);
        toast.success("data inserted successfully!");

      }
      else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      }

    } catch (error) {
      toast.error("Error inserting data: " + error.message);
    }
  };
  const saveEditedData = async () => {

    try {

      const modified_by = sessionStorage.getItem('selectedUserCode');
      const selectedRowsData = Array.isArray(editedData) ? editedData.filter(row => row.ProjectID === row.ProjectID) : [editedData];
      console.log(selectedRowsData)
      const response = await fetch(`${config.apiBaseUrl}/updateProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "modified_by": modified_by,

        },
        body: JSON.stringify({ editedData: selectedRowsData,company_code:sessionStorage.getItem("selectedCompanyCode") }), // Send only the selected rows for saving


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


  };


  const deleteSelectedRows = async (rowData) => {
    const ProjectIDDelete = { ProjectIDToDelete: Array.isArray(rowData) ? rowData : [rowData] };
  
    showConfirmationToast(
      "Are you sure you want to delete the data in the selected rows?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/deleteProject`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(ProjectIDDelete),
          });
  
          if (response.ok) {
            toast.success("Data deleted successfully");
            setTimeout(() => {
              window.location.reload(); // Reload the entire page
            }, 3000); // Wait 3 seconds to let the user see the toast
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error("Error deleting data: " + error.message);
        }
      },
      () => {
        toast.info("Data delete cancelled.");
      }
    );
  };
  


  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleNavigate = () => {
    navigate("/Company");
  };

  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      if (hasValueChanged) {
        await handleKeyDownStatus(e);
        setHasValueChanged(false);
      }

      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault();
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) {
      setHasValueChanged(false);
    }
  };

  const onRowSelected = (event) => {
    if (event.node.isSelected()) {
      handleRowClick(event.data);
    }
  };
  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);

  };
  const handleRowClick = (rowData) => {
    setCreatedBy(rowData.created_by);
    setModifiedBy(rowData.modified_by);
    const formattedCreatedDate = formatDate(rowData.created_date);
    const formattedModifiedDate = formatDate(rowData.modified_date);
    setCreatedDate(formattedCreatedDate);
    setModifiedDate(formattedModifiedDate);
  };

  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.ProjectID === params.data.ProjectID
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setrowData(updatedRowData);

      // Add the edited row data to the state
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const reloadGridData = () => {
    window.location.reload();
  };
  const reloadData = () => {
   setrowData([])
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/projectSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ProjectID: ProjectId,
          ProjectName: Projectname,
          ProjectManager: manager,
          StartDate: Startdate,
          EndDate: Enddate,
          PriorityLevel: Priority,
          TaskStatus: Task,
          company_code: sessionStorage.getItem("selectedCompanyCode")
        })
      });
  
      if (response.ok) {
        const resultData = await response.json();
        setrowData(resultData);
      } else if (response.status === 404) {
        setrowData([]);
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data: " + error.message);
    }
  };
  
  const handleInsert = async (e) => {
    e.preventDefault();

    if (
      !ProjectName ||
      !ProjectDescription ||
      !ProjectManager


    ) {
      setError("Please fill all required fields");
      return;
    }

    setSaveButtonVisible(true);
    setIsSaving(true);
    setMessage('');

    try {
      const data = {
        ProjectName,
        ProjectManager,
        ProjectDescription,
        StartDate: StartDate,
        EndDate,
        PriorityLevel,
        TaskStatus,

        created_by: sessionStorage.getItem('selectedUserCode'),
      };

      const response = await fetch(`${config.apiBaseUrl}/addProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        const [{ ProjectID }] = searchData;
        setProjectID(ProjectID);
        toast.success("Project data inserted successfully");
      } else {
        throw new Error('Error in saving project data');
      }
    } catch (error) {
      setMessage('Error inserting data: ' + (error.response?.data?.message || error.message));
      toast.error('An error occurred while saving the project');
    } finally {
      setIsSaving(false);
    }
  };


  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

 




  const applyFilter = (field, value) => {
    if (!gridApiRef.current) return;  // Check if gridApi is available

    const filterInstance = gridApiRef.current.getFilterInstance(field);

    if (value === "") {
      filterInstance.setModel(null);  // Clear the filter if input is empty
    } else {
      filterInstance.setModel({ type: 'contains', filter: value });
    }

    gridApiRef.current.onFilterChanged();  // Apply the filter change to the grid
  };


  const handleNavigateToForm = () => {
    navigate("/EmpProjectinput"); // Pass selectedRows as props to the Input component
  };

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer
            position="top-right"
            className="toast-design" // Adjust this value as needed
            theme="colored"
          />
          <div className=" p-0 shadow-lg bg-white rounded">
            <div className="purbut mb-0 d-flex justify-content-between">
              <h1 align="left" className="">
                Project
              </h1>

              <div className="col-md-1 mt-3 me-5 purbut">

                <div class=" d-flex justify-content-end  me-3">
                  <div >
                    {/* <savebutton class=" text-dark"  onClick={handleNavigateToForm}>                       
                          <i class="fa-solid fa-user-plus"></i>
                          {" "}                   
                    </savebutton> */}
                  </div>
                  <div className="me-1 ">

                    {saveButtonVisible && (
                      <savebutton className="" onClick={handleSave}
                        required title="save">
                        <i class="fa-regular fa-floppy-disk"></i> </savebutton>
                    )}
                  </div>
                  <div className="ms-1">
                    {/* <delbutton 
         // onClick={handleDelete} 
         title="Delete" onClick={handleDelete} >
        <i class="fa-solid fa-trash"></i>
         </delbutton> */}
                  </div>
                  <div className="col-md-1">
                    <div className="ms-1">
                      <reloadbutton
                        className="purbut"
                        onClick={reloadGridData}
                        title="Reload" style={{ cursor: "pointer" }}>
                        <i className="fa-solid fa-arrow-rotate-right"></i>
                      </reloadbutton>
                    </div>
                  </div>
                </div>
              </div>

              <div class="dropdown mt-2 me-5 mobileview">
                <button
                  class="btn btn-primary dropdown-toggle p-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="fa-solid fa-list"></i>
                </button>
                <ul class="dropdown-menu menu">
                  <li class="iconbutton  d-flex justify-content-center text-success" onClick={handleSave}>
                    <icon
                      class="icon"
                    >
                      <i class="fa-regular fa-floppy-disk"></i></icon>
                  </li>
                  <li class="iconbutton  d-flex justify-content-center" onClick={reloadGridData}>
                    <icon
                      class="icon"
                    >
                      <i className="fa-solid fa-arrow-rotate-right"></i>
                    </icon>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="shadow-lg bg-white rounded-bottom mt-2 mb-2 p-3">
                <div class="row ms-3 me-3 ">
                  <div className="col-md-3 form-group mb-2">
                    <div className="exp-form-floating">
                      <div className="d-flex justify-content-start">
                        <div>
                          <label for="sname"> Project 
                            <span className="text-danger"></span></label>

                        </div>
                        <div>
                          {/* <span className="text-danger"></span> */}
                        </div>
                      </div>
                      <div class="d-flex justify-content-end">
                        <input
                          id="ProjectID"
                          className="exp-input-field form-control p-2"
                          type="text"
                          placeholder=""
                          required title="Please enter the Project ID"
                          value={ProjectID}
                          onChange={(e) => setProjectID(e.target.value)}
                          maxLength={50}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <label htmlFor="EmployeeId" className={`${error && !ProjectName ? 'red' : ''}`}>
                          Project Name
                        </label>
                        <div><span className="text-danger">*</span></div>
                      </div>
                      <input
                        id="loanID"
                        type="text"
                        className="form-control exp-input-field p-2"
                        required title="Please enter the Project Name"
                        maxLength={255}
                        value={ProjectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div> <label for="add1" className={`${error && !ProjectManager ? 'red' : ''}`}>
                          Project Manager
                        </label></div>
                        <div><span className="text-danger">*</span></div>
                      </div>
                      <Select
                        id="LoanEligibleAmount"
                        class="exp-input-field form-control p-2"
                        type="text"
                        placeholder=""
                        required title="Please enter the Project Manager"
                        value={selectedmanager}
                        options={filteredOptionManager}
                        onChange={handleChangemanager}
                        maxLength={18}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <label for="add3" className={`${error && !EstimatedHours ? 'red' : ''}`}>
                        Estimated Hours<span className="text-danger">*</span>
                      </label><input
                        id="EndDate"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required title="Please enter the Estimated Hour"
                        value={EstimatedHours}
                        onChange={(e) => setEstimatedHours(e.target.value)}
                        maxLength={100}

                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="sname" className={`${error && !ProjectDescription ? 'red' : ''}`}>
                            Project Description </label></div><div><span className="text-danger">*</span></div>
                      </div>

                      <textarea
                        id="Approvedby"
                        class="exp-input-field form-control "
                        required title="Please enter the Project Description"
                        value={ProjectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}

                      />

                      {/* {error && !approvedBy && <div className="text-danger">Project Description should not be blank</div>} */}



                    </div>
                  </div>

                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div> <label for="add2" className={`${error && !StartDate ? 'red' : ''}`}>
                          Start Date
                        </label> </div>
                        <div><span className="text-danger">*</span></div>
                      </div>
                      <input
                        id="StartDate"
                        class="exp-input-field form-control"
                        type="date"
                        placeholder=""
                        required title="Please Choose the Year"
                        value={StartDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        maxLength={100}

                      />

                    </div>
                  </div>

                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="add3" className={`${error && !EndDate ? 'red' : ''}`}>
                            End Date  </label></div>
                        <div><span className="text-danger">*</span></div></div>
                      <input
                        id="EndDate"
                        class="exp-input-field form-control"
                        type="date"
                        placeholder=""
                        required title="Please Choose the Year"
                        value={EndDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        maxLength={100}

                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div> <label for="tcode" className={`${error && !PriorityLevel ? 'red' : ''}`}>
                          Priority Level  </label></div>
                        <div><span className="text-danger">*</span></div></div>

                      <Select
                        id="PriorityLevel"
                        className="exp-input-field"
                        type="text"
                        required title="Please Select the Priority Level"
                        placeholder=""
                        value={selectedPriortyLeavel}
                        onChange={handleChangePriorityLevel}
                        options={filteredOptionPriorityLevel}
                        maxLength={15}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="tcode" className={`${error && !TaskStatus ? 'red' : ''}`}>
                             Status</label></div> <div><span className="text-danger">*</span></div>
                      </div>
                      <Select
                        id="TaskStatus"
                        className="exp-input-field"
                        type="text"
                        placeholder=""
                        required title="Please Select the Task Status"
                        value={selectedTaskStatus}
                        onChange={handleChangestatus}
                        options={filteredOptionTransaction}
                        maxLength={25}
                      />
                    </div>
                  </div>
                  </div>
                  </div>
                  <div className="shadow-lg p-3 bg-light rounded-bottom  mb-2">
                  <h4 className="ms-4">Search Criteria :</h4>

                  <div class="row ms-3 me-3 mb-3">
                    <div className="col-md-3 form-group mb-2">
                      <div className="exp-form-floating">
                        <div className="d-flex justify-content-start">
                          <div>
                            <label htmlFor="EmployeeId" className="exp-form-labels">
                              Project
                            </label>
                          </div>
                          <div>
                            <span className="text-danger"></span>
                          </div>
                        </div>
                        <div class="d-flex justify-content-end">
                          <input
                            id="EmployeeId"
                            className="exp-input-field form-control p-2"
                            type="text"
                            placeholder=""
                            required title="Please enter the Project ID"
                            value={ProjectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            //  onKeyPress={handleKeyPress}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            maxLength={50}
                          />
                        </div>
                    
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div><label for="cname" class="exp-form-labels">
                            Project Name
                          </label></div>
                          <div><span className="text-danger"></span></div>
                        </div>
                        <input
                          id="ProjectName"
                          type="text"
                          required title="Please enter the Project Name"
                          className="exp-input-field form-control p-2"
                          value={Projectname}
                          maxLength={255}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          onChange={(e) => setProjectname(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div> <label for="add1" class="exp-form-labels">
                            Project Manager
                          </label></div>
                          <div><span className="text-danger"></span></div>
                        </div>
                        <Select
                          id="ProjectManager"
                          class="exp-input-field"
                          type="text"
                          placeholder=""
                          required title="Please enter the Project Manager"
                          value={selectedProject}
                          options={filteredOptionManagers}
                          onChange={handleChangeCode}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          maxLength={18}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div> <label for="add2" class="exp-form-labels">
                            Start Date
                          </label> </div>
                          <div><span className="text-danger"></span></div>
                        </div>
                        <input
                          id="StartDate"
                          class="exp-input-field form-control"
                          type="date"
                          placeholder=""
                          required title="Please Choose the Year"
                          value={Startdate}
                          onChange={(e) => setStartdate(e.target.value)}
                          maxLength={100}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="add3" class="exp-form-labels  ">
                          End Date<div><span className="text-danger"></span></div>
                        </label><input
                          id="EndDate"
                          class="exp-input-field form-control"
                          type="date"
                          placeholder=""
                          required title="Please Choose the Year"
                          value={Enddate}
                          onChange={(e) => setEnddate(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          maxLength={100}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="tcode" class="exp-form-labels">
                          Priority Level <div><span className="text-danger"></span></div>
                        </label>
                        <Select
                          id="PriorityLevel"
                          className="exp-input-field"
                          type="text"
                          required title="Please Select the Priority Level"
                          placeholder=""
                          value={selectedPriorty}
                          onChange={handleChangePriority}
                          options={filteredOptionPriority}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          maxLength={15}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <label for="tcode" class="exp-form-labels  ">
                        Status <div><span className="text-danger"></span></div>
                        </label>
                        <Select
                          id="TaskStatus"
                          className="exp-input-field"
                          type="text"
                          placeholder=""
                          value={selctedTask}
                          required title="Please Select the Task Status"
                          onChange={handleChangeTask}
                          options={filteredOptionTask}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          maxLength={25}
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
                              required
                              onClick={reloadData}
                              title="Refresh"
                            >
                              <i class="fa-solid fa-rotate-right"></i>
                            </icon>
                          </div>
                        </div>{" "}
                      </div>
                    </div>
                  </div>
            
                <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    // defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    onCellValueChanged={onCellValueChanged}
                    rowSelection="multiple"
                    onSelectionChanged={onSelectionChanged}
                    paginationAutoPageSize={true}
                    onRowSelected={onRowSelected}
                    pagination={true}    
                    gridOptions={gridOptions}           
                  />
                </div>
                <div>
                </div>
                </div>
      </div>
      </div>

    </div>

  );



}
export default Input;
