import React from "react";
import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import Circle from '../DashboardImages/circle.svg'
import axios from "axios";
import { Doughnut, Bar } from "react-chartjs-2";
import { getElementAtEvent } from "react-chartjs-2";
import Vector from './Team.png';
import Select from "react-select";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../Apiconfig';
import { publicIpv4 } from "public-ip";
import { useNavigate } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const Dashboard = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [time, updateTime] = useState(new Date());
  const [viewChart, setViewChart] = useState(true);
  const [timer, setTimer] = useState("00:00:00");
  const [secondsPassed, setSecondsPassed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [NewJoinees, setNewJoinees] = useState([]);
  const [SelectedManager, setSelectedManager] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [manager, setManager] = useState("");
  const [Managerdrop, setManagerdrop] = useState([]);
  const [error, setError] = useState(null);
  const [FromDate, setFromDate] = useState([]);
  const gridApiRef = useRef(null);
  const gridColumnApiRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [rowDataTeamList, setRowDataTeamList] = useState([]);
  const user_code = sessionStorage.getItem('selectedUserCode');

  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [Manager, setmanager] = useState("");
  const [aadharNo, setAadharNo] = useState("");
  const [pfNo, setPfNo] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("");
  const [maritalStatusDrop, setMaritalStatusDrop] = useState([]);
  const [shift, setShift] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [shiftDrop, setShiftDrop] = useState([]);
  const [deviceDetails, setDeviceDetails] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState("");
  const [totalActiveEmployees, setTotalActiveEmployees] = useState(0);
  const [formattedTotalActiveEmployees, setFormattedTotalActiveEmployees] = useState('0');
  const [TotalNetEarnings, setTotalNetEarnings] = useState(0);
  const [formatedTotalEarnings, setformatedTotalEarnings] = useState('0');
  const [FormatedTotalPayslip, setFormatedTotalPayslip] = useState('0');
  const [TotalPayslips, setTotalPayslips] = useState(0)
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof totalActiveEmployees === 'number') {
      setFormattedTotalActiveEmployees(totalActiveEmployees.toLocaleString('en-IN'));
    } else {
      setFormattedTotalActiveEmployees('0');
    }
  }, [totalActiveEmployees]);

  useEffect(() => {
    if (typeof TotalNetEarnings === 'number') {
      setformatedTotalEarnings(TotalNetEarnings.toLocaleString('en-IN'));
    } else {
      setformatedTotalEarnings('0');
    }
  }, [TotalNetEarnings]);

  useEffect(() => {
    if (typeof TotalPayslips === 'number') {
      setFormatedTotalPayslip(TotalPayslips.toLocaleString('en-IN'));
    } else {
      setFormatedTotalPayslip('0');
    }
  }, [TotalPayslips]);

  useEffect(() => {
    const fetchTotalActiveEmployees = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");

        const response = await fetch(`${config.apiBaseUrl}/TotalActiveEmployees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].TotalActiveEmployeesWithPayslip !== undefined) {
          const [{ TotalActiveEmployeesWithPayslip }] = data;
          setTotalActiveEmployees(TotalActiveEmployeesWithPayslip);
        } else {
          console.warn("Unexpected response or empty data:", data);
          setTotalActiveEmployees(0); // fallback
        }
      } catch (error) {
        console.error('Error fetching TotalActiveEmployees:', error);
        setTotalActiveEmployees(0); // fallback
      }
    };

    fetchTotalActiveEmployees();
  }, []);
  useEffect(() => {
    const fetchTotalNetEarnings = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");

        const response = await fetch(`${config.apiBaseUrl}/TotalNetEarnings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].TotalNetEarnings_PreviousMonth !== undefined) {
          const [{ TotalNetEarnings_PreviousMonth }] = data;
          setTotalNetEarnings(TotalNetEarnings_PreviousMonth);
        } else {
          console.warn("Unexpected or empty response for Net Earnings:", data);
          setTotalNetEarnings(0); // fallback
        }
      } catch (error) {
        console.error("Error fetching Total Net Earnings:", error);
        setTotalNetEarnings(0); // fallback
      }
    };

    fetchTotalNetEarnings();
  }, []);




  useEffect(() => {
    const fetchTotalPayslips = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");

        const response = await fetch(`${config.apiBaseUrl}/TotalPayslips`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].TotalPayslips !== undefined) {
          const [{ TotalPayslips }] = data;
          setTotalPayslips(TotalPayslips);
        } else {
          console.warn("Unexpected or empty response for Total Payslips:", data);
          setTotalPayslips(0);
        }
      } catch (error) {
        console.error("Error fetching Total Payslips:", error);
        setTotalPayslips(0);
      }
    };

    fetchTotalPayslips();
  }, []);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        // Get Device Details
        const userAgent = navigator.userAgent;
        setDeviceDetails(userAgent);

        // Get IP Address
        const ip = await publicIpv4(); // Correct function
        setIpAddress(ip);

        // Get Location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation(`${latitude}, ${longitude}`);
            },
            (error) => {
              console.error("Error fetching location:", error);
              setLocation("Location unavailable");
            }
          );
        } else {
          setLocation("Geolocation not supported");
        }
      } catch (error) {
        console.error("Error fetching device info:", error);
      }
    };

    fetchDeviceInfo();
  }, []);


  const handleChangeShift = (selectedShift) => {
    setSelectedShift(selectedShift);
    setShift(selectedShift ? selectedShift.value : '');
  };

  const filteredOptionShift = [{ value: 'All', label: 'All' }, ...shiftDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getcompanyshift`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setShiftDrop(val));
  }, []);


  const handleChangeMartial = (selectedMarital) => {
    setSelectedMaritalStatus(selectedMarital);
    setMaritalStatus(selectedMarital ? selectedMarital.value : '');
  };

  const filteredOptionMartial = [{ value: 'All', label: 'All' }, ...maritalStatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getMartial`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setMaritalStatusDrop(val));
  }, []);

  const startTimer = () => {
    const startTime = Date.now() - secondsPassed * 1000; // Start from where it left off
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
      setSecondsPassed(elapsed);
      setTimer(formatTime(elapsed));
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };


  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/LeaveStatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            manager: user_code,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });

        const data = await response.json();
        const formattedRequests = data.map((row) => ({
          id: row.EmployeeId,
          EmployeeId: row.EmployeeId,
          EmployeeName: row.EmployeeName,
          FromDate: formatDate(row.FromDate),
          ToDate: formatDate(row.ToDate),
          LeaveType: row.LeaveType,
          LeaveDays: row.LeaveDays,
          status: row.LeaveStatus,
        }));
        setLeaveRequests(formattedRequests);
      } catch (err) {
        setError(err.message || 'Error fetching leave requests');
        setLeaveRequests([])
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();

    const interval = setInterval(fetchLeaveRequests, 5000);

    return () => clearInterval(interval);
  }, []);



  const handleApproval = async (id, FromDate, isApproved) => {
    try {
      const leaveStatus = isApproved ? "Approved" : "Rejected";

      const [day, month, year] = FromDate.split("-");
      const backendDate = `${year}-${month}-${day}`;

      const response = await fetch(`${config.apiBaseUrl}/LeaveAuthorization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EmployeeId: id,
          LeaveStatus: leaveStatus,
          FromDate: backendDate,
        }),
      });

      if (response.ok) {
        toast.success("Leave status updated successfully.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to process the request.");
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("Error updating leave status:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      updateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bufferToBlobUrl = (buffer) => {
    const blob = new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob); // Creates a Blob URL
    return url;
  };

  // Fetch data from the backend
  const fetchNewJoins = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/NewJoinee`, {
        company_code: sessionStorage.getItem("selectedCompanyCode")
      });
      const employeesWithImages = response.data.map((joinee) => {
        return {
          ...joinee,
          Photos: joinee.Photos && joinee.Photos.data ? bufferToBlobUrl(joinee.Photos.data) : '', // Use bufferToBlobUrl if data exists
        };
      });
      setNewJoinees(response.data);
      setNewJoinees(employeesWithImages); // Set the data with Blob URL
    } catch (error) {
      console.error("Error fetching upcoming birthdays:", error);
    }
  };


  useEffect(() => {
    fetchNewJoins();
  }, []);

  const fetchBirthdaysinfo = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/UpcomingBirthday`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      const employeesWithImages = responseData.map((person) => {
        console.log(person.Photos);  // Check image buffer structure

        return {
          ...person,
          Photos:
            person.Photos && person.Photos.data
              ? bufferToBlobUrl(person.Photos.data)
              : "",
        };
      });

      setUpcomingBirthdays(employeesWithImages);
    } catch (error) {
      console.error("Error fetching upcoming birthdays:", error);
    }
  };

  useEffect(() => {
    fetchBirthdaysinfo();
  }, []);


  const [teamData, setTeamData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to handle loading


  const fetchTeamData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/TeamListChart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manager: manager, company_code: sessionStorage.getItem("selectedCompanyCode")

        }),
      });
      console.log(manager);

      const data = await response.json();
      console.log(data);

      if (Array.isArray(data) && data.length > 0) {
        const teamNames = data.map((item) => item.DEPARTMENT);
        const teamDistribution = data.map((item) => item.EMPLOYEE);

        setTeamData({
          labels: teamNames,
          datasets: [
            {
              label: "Team Distribution",
              data: teamDistribution,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
              borderColor: '#fff',
              borderWidth: 2,
            },
          ],
        });
      } else {
        setTeamData({ labels: [], datasets: [] });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTeamData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchGridData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/TeamList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manager: manager, company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const data = await response.json();
      setRowDataTeamList(data)
    } catch (error) {
      console.error("Error fetching grid data:", error);
      setRowDataTeamList([]);
    }
  };

  useEffect(() => {
    if (!manager) return;

    if (viewChart) {
      fetchTeamData();
    } else {
      fetchGridData();
    }
  }, [manager, viewChart]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getManager`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setManagerdrop(val));
  }, []);

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.manager,
    label: option.manager,
  }));

  const handleChangeManager = (SelectedManager) => {
    setSelectedManager(SelectedManager);
    setManager(SelectedManager ? SelectedManager.value : '');
  };

  const teamOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  // AG Grid columns
  const columnDefsList = [
    {
      headerName: "Employee Id",
      field: "EmployeeId",
      onCellClicked: (params) => {
        const empId = params.value;
        navigate('/AddEmployeeInfo', { state: { employeeId: empId } });
      },
    },
    {
      headerName: "Employee Name",
      field: "EmployeeName",
    },
    {
      headerName: "Department",
      field: "department_ID",
    },
    {
      headerName: "Designation",
      field: "designation_ID",
    },
  ];



  // AG Grid columns
  const columnDefs = [
    {
      headerName: "Employee ID",
      field: "Employeeid",
    },
    {
      headerName: "Employee Name",
      field: "First_Name",
    },
    {
      headerName: "Department",
      field: "department_ID",
    },
    {
      headerName: "Designation",
      field: "designation_ID",
    },
    {
      headerName: "Manager",
      field: "manager",
    },
    {
      headerName: "Shift",
      field: "shift",
    },
    {
      headerName: "Aadhaar No",
      field: "AAdhar_no",
    },
    {
      headerName: "PF No",
      field: "PFNo",
    },
    {
      headerName: "Account No",
      field: "Account_NO",
    },
    {
      headerName: "Marital Status",
      field: "marital_status",
    },
    {
      headerName: "Shift",
      field: "shift",
    },
    {
      headerName: "DOJ",
      field: "DOJ",
      valueFormatter: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      headerName: "DOL",
      field: "DOL",
      valueFormatter: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      updateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  // const handleInsert = async () => {
  //   try {
  //     const response = await fetch(`${config.apiBaseUrl}/addDailyattendance`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         EmployeeId: sessionStorage.getItem("selectedUserCode"),
  //       }),
  //     });

  //     if (response.status === 200) {
  //       toast.success("Data inserted successfully!");
  //       setIsCheckedIn((prev) => {
  //         if (prev) {
  //           stopTimer(); // Stop the timer if checked out
  //         } else {
  //           startTimer(); // Start or resume the timer if checked in
  //         }
  //         return !prev; // Toggle check-in state
  //       });
  //     } else if (response.status === 400) {
  //       const errorResponse = await response.json();
  //       toast.warning(errorResponse.message);
  //     } else {
  //       toast.error("Failed to insert data");
  //     }
  //   } catch (error) {
  //     toast.error("Error inserting data: " + error.message);
  //   }
  // };

  const handleTime = async () => {
    try {
      const route = isCheckedIn ? "/DailyLogOUT" : "/DailyLogin";
      const response = await fetch(`${config.apiBaseUrl}${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: sessionStorage.getItem('selectedUserCode'),
          DeviceDetails: deviceDetails,
          IP_Address: ipAddress,
          Location: location,
        }),
      });

      if (response.status === 200) {
        setIsCheckedIn((prev) => {
          const newState = !prev;
          sessionStorage.setItem("isCheckedIn", newState);

          if (newState) {
            // When checking in, resume from last elapsed time
            let lastElapsedTime = sessionStorage.getItem("lastElapsedTime")
              ? parseInt(sessionStorage.getItem("lastElapsedTime"))
              : 0;
            sessionStorage.setItem("elapsedTime", lastElapsedTime);
            startTimer();
          } else {
            stopTimer();
          }
          return newState;
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      } else {
        toast.error("Failed to insert data");
      }
    } catch (error) {
      toast.error("Error inserting data: " + error.message);
    }
  };

  // useEffect(() => {
  //   if (sessionStorage.getItem("elapsedTime")) {
  //     const storedTime = parseInt(sessionStorage.getItem("elapsedTime"));
  //     const hours = String(Math.floor(storedTime / 3600)).padStart(2, "0");
  //     const minutes = String(Math.floor((storedTime % 3600) / 60)).padStart(2, "0");
  //     const seconds = String(storedTime % 60).padStart(2, "0");
  //     setTimer(`${hours}:${minutes}:${seconds}`);
  //   }
  // }, []);


  // const handleRowSelection = (id, isChecked) => {
  //   if (isChecked) {
  //     console.log(`Row with ID ${id} selected`);
  //   } else {
  //     console.log(`Row with ID ${id} deselected`);
  //   }
  // };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelection = (id, isChecked) => {
    setSelectedRows((prev) =>
      isChecked ? [...prev, id] : prev.filter((rowId) => rowId !== id)
    );
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/EmpSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Employeeid: employeeId,
          First_Name: employeeName,
          department_ID: department,
          designation_ID: designation,
          AAdhar_no: aadharNo,
          marital_status: maritalStatus,
          PFNo: pfNo,
          Account_NO: accountNo,
          shift: shift,
          manager: sessionStorage.getItem("selectedUserCode"),
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log(searchData)
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  // useEffect(() => {
  //   const fetchAttendanceData = async () => {
  //     const manager = sessionStorage.getItem('selectedUserCode');
  //     try {
  //       const response = await fetch(`${config.apiBaseUrl}/OverallAttendance`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           manager: manager, company_code: sessionStorage.getItem("selectedCompanyCode"),
  //         }),
  //       });

  //       const data = await response.json();

  //       if (!Array.isArray(data) || data.length === 0) {
  //         throw new Error("Invalid or empty data");
  //       }

  //       const statusColors = {
  //         Present: "#4CAF50",  // Green
  //         Absent: "#F44336",   // Red
  //         Late: "#FF9800",     // Orange
  //         HalfDay: "#2196F3",  // Blue
  //         Leave: "#9C27B0",    // Purple
  //       };

  //       const labels = data.map((item) => item.Status);
  //       const values = data.map((item) => item.Employees);

  //       const backgroundColors = labels.map((status) => statusColors[status] || "#9E9E9E");

  //       setChartData({
  //         labels: labels,
  //         datasets: [
  //           {
  //             label: "Overall Attendance",
  //             data: values,
  //             backgroundColor: backgroundColors,
  //             borderColor: "#ccc",
  //             borderWidth: 1,
  //           },
  //         ],
  //       });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchAttendanceData();
  // }, []);

  const [announcement, setAnnouncement] = useState("Loading...");

  const fetchAnnouncement = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAnnouncementText`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setAnnouncement(data[0].MessageTitle);
      } else {
        setAnnouncement("No announcements available.");
      }
    } catch (error) {
      console.error("Failed to fetch announcement:", error);
      setAnnouncement("Error loading announcements");
    }
  };

  useEffect(() => {
    fetchAnnouncement();
    const interval = setInterval(fetchAnnouncement, 5000);
    return () => clearInterval(interval);
  }, []);

  //Over All Attendance Function
  const [showChart, setShowChart] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [leaveRowData, setLeaveRowData] = useState([]);
  const chartRef = useRef();

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchLeaveStatusData = async (LeaveStatus = '') => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/DashboardOverallAttendanceData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manager: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          LeaveStatus: LeaveStatus
        })
      });

      const result = await response.json();

      if (Array.isArray(result)) {
        setLeaveRowData(result);
      } else {
        setLeaveRowData([]);
      }
    } catch (error) {
      console.error("Failed to fetch leave data", error);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/OverallAttendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manager: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem('selectedCompanyCode'),
        })
      });

      const result = await response.json();

      if (Array.isArray(result)) {
        const labels = result.map(item => item.Status);
        const dataValues = result.map(item => item.Employees);
        const backgroundColors = result.map(item =>
          item.Status === "Present"
            ? "green"
            : item.Status === "Leave"
              ? "blue"
              : "red"
        );

        const chart = {
          labels,
          datasets: [
            {
              label: "Overall Attendance",
              data: dataValues,
              backgroundColor: backgroundColors,
              borderRadius: 0,
              barThickness: 70
            }
          ]
        };

        setChartData(chart);
      } else {
        console.warn("Unexpected response format:", result);
      }
    } catch (error) {
      console.error("Failed to fetch chart data", error);
    }
  };

  const onBarClick = (event) => {
    const elements = getElementAtEvent(chartRef.current, event);

    if (!elements || elements.length === 0) return;

    const clickedIndex = elements[0].index;
    const clickedLabel = chartData.labels[clickedIndex];

    console.log("Clicked on:", clickedLabel);
    setShowChart(false);
    fetchLeaveStatusData(clickedLabel);
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const handleToggle = () => {
    const newState = !showChart;
    setShowChart(newState);

    if (!newState) {
      fetchLeaveStatusData('');
    }
  };

  const columnLeave = [
    {
      headerName: 'S.No',
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 80,
      cellStyle: { textAlign: 'center' }
    },
    { headerName: 'Date', field: 'Date' },
    { headerName: 'Employee ID', field: 'EmployeeId' },
    { headerName: 'Employee Name', field: 'EmployeeName' },
    { headerName: 'Department', field: 'department_ID' },
    { headerName: 'Designation', field: 'designation_ID' },
    { headerName: 'Manager', field: 'Manager' },
    { headerName: 'Attendance Status', field: 'AttendanceStatus' }
  ];

  return (
    <div className="container-fluid Topnav-screen pb-4 pt-2">
      <ToastContainer className="mt-5" style={{ position: "top-right", autoClose: 3000, marginTop: "100px" }} />
      <div className="d-flex flex-column flex-md-row justify-content-between p-1 rounded-4 shadow-lg bg-white">
        <div className="col-12 col-md-8 mb-3 mb-md-0">
          <div className="ticker-wrapper mt-1">
            <div className="ticker-text mt-1">{announcement}</div>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-3 mt-md-0">
          <div className="col-md-5 form-group mb-0">
            <label htmlFor="timing" className="exp-form-labels"></label>
            <input
              id="timing"
              className="form-control col-md-5"
              type="text"
              readOnly
              value={timer}
            />
          </div>
          <button
            // onClick={handleInsert}
            onClick={startTimer}
            className="btn btn-success shadow-none btn-sm ms-md-3"
            style={{
              backgroundColor: isCheckedIn ? "red" : "green",
              color: "white",
            }}
            title={isCheckedIn ? "Check Out" : "Check In"}
          >
            {isCheckedIn ? "Check Out" : "Check In"}
          </button>
        </div>
      </div>
      <div className="dashboard mt-3 row g-1">
        <div className="col-md-12 row">
          <div className="col-md-4 mt-1">
            <div className="dashboard-card bg-primary animated-bg" style={{ cursor: "pointer" }}>
              <img src={Circle} className='dashboard-image' alt='' />
              <div className="text-white fw-bold">Total Active Employees</div>
              <div className="text-white fs-4 d-flex mt-2"> {formattedTotalActiveEmployees}</div>
              <div className="graph-line">
              </div>
            </div>
          </div>
          <div className="col-md-4 mt-1">
            <div className="dashboard-card bg-success animated-bg" style={{ cursor: "pointer" }}>
              <img src={Circle} className='dashboard-image' alt='' />
              <div className="text-white fw-bold">Total Salary Generated</div>
              <div className="text-white fs-4 d-flex mt-2">
                ₹ {formatedTotalEarnings}
              </div>
              <div className="graph-line">
              </div>
            </div>
          </div>
          <div className="col-md-4 mt-1">
            <div className="dashboard-card bg-danger animated-bg" style={{ cursor: "pointer" }}>
              <img src={Circle} className='dashboard-image' alt='' />
              <div className="text-white fw-bold">Number of Salary Generated</div>
              <div className="text-white fs-4 d-flex mt-2">
                {FormatedTotalPayslip}
              </div>
              <div className="graph-line">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 mt-2">
        <div className="col-lg-6">
          <div className="card attendance-overview-card rounded-4 shadow-lg h-100">
            <div className="d-flex justify-content-between align-items-center p-3">
              <h6 className="card-title mb-0">Today Attendance</h6>
              <button className="shadow-none btn btn-outline-primary" onClick={handleToggle}>
                {showChart ? "Leave Chart" : "Show Chart"}
              </button>
            </div>

            <div className="productivity-chart-container" style={{ width: "100%", height: "280px", padding: "20px" }}>
              {showChart ? (
                chartData ? (
                  <Bar ref={chartRef} data={chartData} options={chartOptions} onClick={onBarClick} />
                ) : (
                  <p>Loading...</p>
                )
              ) : (
                <div className="ag-theme-alpine" style={{ height: 255, width: '100%' }}>
                  <AgGridReact
                    rowData={leaveRowData}
                    columnDefs={columnLeave}
                    rowHeight={30}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card leave-approvals-card rounded-4 shadow-lg h-100" style={{ maxHeight: "465px", paddingBottom: "80px" }}>
            {/* <div className="card-body"> */}
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="card-title">Leave Approvals</h6>
            </div>
            <ul className="list-group mt-3">
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request, index) => (
                  request.status === "Pending" && (
                    <li
                      key={index}
                      className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
                    >
                      <div className="d-flex align-items-start mb-2 mb-md-0 w-100">
                        <input
                          type="checkbox"
                          className="form-check-input me-3 mt-1"
                          id={`select-row-${index}`}
                          onChange={(e) =>
                            handleRowSelection(request.id, request.FromDate, e.target.checked)
                          }
                        />
                        <label htmlFor={`select-row-${index}`} className="w-100">
                          <div className="fw-medium text-dark">{request.EmployeeId}</div>
                          <small className="text-muted d-block mb-1">{request.EmployeeName}</small>
                          <div className="d-flex flex-wrap gap-2 text-muted small">
                            <span><strong>Leave Type:</strong> {request.LeaveType}</span>
                            <span><strong>From:</strong> {request.FromDate}</span>
                            <span><strong>To:</strong> {request.ToDate}</span>
                            <span><strong>Days:</strong> {request.LeaveDays}</span>
                          </div>
                        </label>
                      </div>

                      <div className="d-flex justify-content-end mt-2 mt-md-0">
                        <button
                          className="btn btn-success shadow-none btn-sm me-2"
                          onClick={() => handleApproval(request.id, request.FromDate, true)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger shadow-none btn-sm"
                          onClick={() => handleApproval(request.id, request.FromDate, false)}
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  )
                ))
              ) : (
                <li className="list-group-item text-center text-muted">No data available</li>
              )}
            </ul>
            {/* </div> */}
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-3">
          <div className="card NewJoinees rounded-4 shadow-lg h-100" style={{ maxHeight: "420px", paddingBottom: "80px" }}>
            {/* <div className="card-body"> */}
            <div className="d-flex justify-content-between flex-wrap align-items-center">
              <h6 className="card-title">New Joinees</h6>
            </div>
            <div id="newJoineesCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner" >
                {NewJoinees.length > 0 ? (
                  NewJoinees.map((joinee, index) => (
                    <div
                      key={joinee.id}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                      <div className="new-joinee-card text-center">
                        <img
                          src={joinee.Photos}
                          width={110}
                          height={110}
                          alt={`${joinee.EmployeeId}`}
                          className="d-block mx-auto rounded"
                        />
                        <p className="badge rounded-pill text-bg-info fs-6 mt-2">
                          {joinee.department_ID} - {joinee.EmployeeId}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted mt-3">No new joinees</p>
                )}
              </div>
              {NewJoinees.length > 1 && (
                <div className="NewJoineesbtn">
                  <button
                    className="carousel-control-prev NewJoineesbtn"
                    type="button"
                    data-bs-target="#newJoineesCarousel"
                    data-bs-slide="prev"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill text-dark" viewBox="0 0 16 16">
                      <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                    </svg>
                  </button>
                  <button
                    className="carousel-control-next NewJoineesbtn"
                    type="button"
                    data-bs-target="#newJoineesCarousel"
                    data-bs-slide="next"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill text-dark" viewBox="0 0 16 16">
                      <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {/* </div> */}
          </div>
        </div>
        <div className="col-lg-3">
          <div className="card Birthday rounded-4 shadow-lg h-100" >
            {/* <div className="card-body"> */}
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="card-title">Upcoming Birthdays</h6>
            </div>
            <div className="birthday-container">
              {upcomingBirthdays.length > 0 ? (
                upcomingBirthdays.map((person) => (
                  <div key={person.id} className="birthday-card">
                    <div className="d-flex justify-content-center mt-2">
                      <div className="">
                        <img
                          src={person.Photos}
                          width={110}
                          height={110}
                          style={{ borderRadius: "20px" }}
                          alt={person.Plainimg}
                        />
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <h3 className="text-dark">{person.EmployeeName}</h3>
                      <p className="badge p-1 text-bg-warning fs-6">🎉🎂🎉🎂</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted mt-3">No Upcoming Birthdays</p>
              )}
            </div>
            {/* </div> */}
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card rounded-4 shadow-lg h-100">
            {/* <div className="card-body"> */}
            <div className="d-flex justify-content-between">
              <h6 className="card-title mb-2">My Team</h6>
              <div className="d-flex justify-content-end">
                <Select
                  id="status"
                  value={SelectedManager}
                  onChange={handleChangeManager}
                  options={filteredOptionManager}
                  className="col-md-12"
                />
                <button
                  className=" shadow-none col-md-6"
                  onClick={() => {
                    setViewChart(!viewChart);
                    if (viewChart) {
                      fetchGridData();
                    }
                  }}
                >
                  {viewChart ? "Team List" : "Chart"}
                </button>
              </div>
            </div>
            {viewChart ? (
              <div className="d-flex justify-content-between row pb-2">
                <div className="col-sm-1">
                  <img src={Vector} width={230} height={230} />
                </div>
                <div className="col-md-8 col-12">
                  <div className="chart-container mt-2" style={{ height: 250, width: "100%" }}>
                    {teamData?.labels?.length > 0 ? (
                      <Doughnut data={teamData} options={teamOptions} />
                    ) : (
                      <div>No data </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="ag-theme-alpine mt-4 rounded-4" style={{ height: 255, width: '100%' }}>
                <AgGridReact
                  columnDefs={columnDefsList}
                  rowData={rowDataTeamList}
                  rowHeight={30}
                />
              </div>
            )}
            {/* </div> */}
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-12">
          <div className="card Birthday rounded-4 shadow-lg h-100">
            <h6 className="d-flex justify-content-start ms-3 fw-bold fs-5 me-3">Employee Details</h6>
            <div className="row ms-3 me-3 mb-2-me-1">
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">Employee ID</label>
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    value={employeeId}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setEmployeeId(e.target.value)} />
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">Employee Name</label>
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    value={employeeName}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setEmployeeName(e.target.value)} />
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">Department</label>
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    placeholder=""
                    type="text"
                    value={department}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setDepartment(e.target.value)} />
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">Designation</label>
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    value={designation}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setDesignation(e.target.value)} />
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">Manager</label>
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    value={Manager}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setmanager(e.target.value)} />
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">Aadhaar No</label>
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    value={aadharNo}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setAadharNo(e.target.value)} />
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">PF No</label>
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    value={pfNo}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setPfNo(e.target.value)} />
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">Account No</label>
                  <input
                    id="status"
                    className="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    value={accountNo}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setAccountNo(e.target.value)} />
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">Marital Status</label>
                  <Select
                    id="status"
                    className="exp-input-field"
                    type="text"
                    options={filteredOptionMartial}
                    onChange={handleChangeMartial}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    value={selectedMaritalStatus} />
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">Shift</label>
                  <Select
                    id="status"
                    className="exp-input-field"
                    type="text"
                    options={filteredOptionShift}
                    onChange={handleChangeShift}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    value={selectedShift} />
                </div>
              </div>
              <div className="col-md-3 form-group mt-4">
                <div class="exp-form-floating">
                  <div class=" d-flex  justify-content-center">
                    <div class=''>
                      <icon onClick={handleSearch} className="text-dark popups-btn fs-6" required title="Search"><i class="fa-solid fa-magnifying-glass"></i></icon></div>
                    <div>
                      <icon onClick={reloadGridData} className="popups-btn text-dark fs-6" required title="Refresh"><i class="fa-solid fa-arrow-rotate-right" /></icon></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="ag-theme-alpine mt-2 rounded-4" style={{ height: 440, width: '100%' }}>
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData}
                  suppressRowClickSelection={true}
                  onGridReady={(params) => {
                    gridApiRef.current = params.api;
                    gridColumnApiRef.current = params.columnApi;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
