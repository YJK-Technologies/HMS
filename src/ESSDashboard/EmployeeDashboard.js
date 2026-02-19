import React from "react";
import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Doughnut, Bar, Line } from "react-chartjs-2";
import Vector from './plain_image.jpg'
import config from '../Apiconfig';
import { showEightHourToast } from "../GlobalToast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Modal, Button } from "react-bootstrap"; // Assuming Bootstrap
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { publicIpv4 } from "public-ip";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = (payslip) => {
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    return localStorage.getItem("isCheckedIn") === "true";
  });
  const Today = new Date().toISOString().split("T")[0];
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [rowData, setRowData] = useState('');
  const [NewJoinees, setNewJoinees] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [startdate, setstartdate] = useState(Today);
  const [enddate, setenddate] = useState(Today);
  const [timer, setTimer] = useState("00:00:00");
  const intervalRef = useRef(null);
  const hasStoppedRef = useRef(false);
  const user_code = sessionStorage.getItem('selectedUserCode');
  const [deviceDetails, setDeviceDetails] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [holidayRowData, setHolidayRowData] = useState([]);
  const [payslipData, setPayslipData] = useState({});
  const [lastCheckIn, setLastCheckIn] = useState(null);

  
 const {
    Basic,
    Bonus,
    Company_Pf_Contribution,
    Conveyance,
    EmployeeId,
    HRA,
    LeaveDeduction,
    Location_name,
    Medical,
    Net_Earnings,
    Other_Allowance,
    PFNo,
    PF_both_share,
    ProfessionalTax,
    SalaryDate,
    SalaryMonth,
    Special_Allowance,
    StaffLoan_SalaryAdvance,
    TDS,
    Total_Earnigs,
    Total_Leave,
    company_code,
    company_logo,
    company_name,
    designation_ID,
    employeename,
    mail_id,
    otherDeductions,
    Gross_deductions,
    total_working_days,
    PF_contribution_employee
  } = payslip;


const handleDownloadPdf = () => {
  const input = printRef.current;
  if (!input) return;

  html2canvas(input, {
    scale: 5,
    scrollY: -window.scrollY,
    useCORS: true,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF( 'a4');

    const imgProps = pdf.getImageProperties(imgData);
    const margin = 1;
    const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);
    pdf.save(`Payslip_${payslipData.EmployeeId}_${payslipData.SalaryMonth}.pdf`);
  });
};








   const getImageFromBuffer = (bufferData) => {
    const base64String = btoa(
      new Uint8Array(bufferData).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/png;base64,${base64String}`;
  };


    const logoSrc = getImageFromBuffer(company_logo?.data);

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

  const fetchHolidays = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getHolidayDate`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          EmployeeId: sessionStorage.getItem('selectedUserCode'),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        const holidaysArray = [];
        const leaveArray = [];

        data.forEach((item) => {
          if (item.HOLIDAYS) {
            holidaysArray.push(item.HOLIDAYS.split("T")[0]);
          }
          if (item.LEAVEDATE) {
            leaveArray.push(item.LEAVEDATE.split("T")[0]);
          }
        });

        setHolidays(holidaysArray);
        setLeaves(leaveArray);
      } else {
        throw new Error('Failed to load data');
      }
    } catch (err) {
      console.log(err.message || 'Failed to load holidays and leaves');
    }
  };

  // Fetch holidays when the component mounts
  useEffect(() => {
    fetchHolidays();
  }, []);

  // Fetch holidays when the component mounts
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/EmployeeDashboardTotalLeave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        EmployeeId: sessionStorage.getItem('selectedUserCode'),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setLeaveData(val));
  }, []);

  const reloadGridData = () => {
    window.location.reload();
  };


  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/ESSEmployeeDashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startdate,
          end_date: enddate,
          userid: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem('selectedCompanyCode')
        }),
      });

      if (response.ok) {
        const searchData = await response.json();
        const newRows = searchData.map((matchedItem) => ({
          work_date: formatDates(matchedItem.work_date),
          First_CheckIn: matchedItem.First_CheckIn,
          Last_CheckOut: matchedItem.Last_CheckOut,
          total_worked_hours: matchedItem.total_worked_hours,
          Total_login_Hours: matchedItem.Total_login_Hours,
        }));
        setRowData(newRows);
      } else if (response.status === 404) {
        setRowData([]);
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

  const formatDates = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  // AG Grid columns
  const holidayCols = [
    {
      headerName: "Holiday Date",
      field: "HOLIDAYS",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
    {
      headerName: "Festival Name",
      field: "Description",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
  ];

  const Employeecol = [
    {
      headerName: "Date",
      field: "work_date",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
    {
      headerName: "Check In",
      field: "First_CheckIn",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
    {
      headerName: "Check Out",
      field: "Last_CheckOut",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
    {
      headerName: "Total Worked Hours",
      field: "total_worked_hours",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
    {
      headerName: "Total Login  Hours",
      field: "Total_login_Hours",
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" }
    },
  ];

  useEffect(() => {
    const fetchHolidayGridData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/GetClr`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code: sessionStorage.getItem("selectedCompanyCode") }),

        });
        if (response.ok) {
          const searchData = await response.json();
          const newRows = searchData.map((matchedItem) => ({
            HOLIDAYS: formatDates(matchedItem.HOLIDAYS),
            Description: matchedItem.Description,
          }));
          setHolidayRowData(newRows);
        } else if (response.status === 404) {
          console.log("Data Not found");
          setHolidayRowData([])
        } else {
          const errorResponse = await response.json();
          toast.warning(errorResponse.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };
    fetchHolidayGridData();
  }, []);

  const bufferToBlobUrl = (buffer) => {
    const blob = new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob); // Creates a Blob URL
    return url;
  };

  const fetchNewJoins = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/EmployeeDashboardNewJoinee`, {
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
      console.error("Error fetching new joinees:", error);
    }
  };

  useEffect(() => {
    fetchNewJoins();
  }, []);


  //Calender Design 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // Get current month and year
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Calculate days in the current month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of the week (0 = Sunday)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month

  // Get today's date
  const today = new Date();

  // Handle navigation
  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const prevMonth = new Date(prevDate);
      prevMonth.setMonth(prevDate.getMonth() - 1);
      return prevMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const nextMonth = new Date(prevDate);
      nextMonth.setMonth(prevDate.getMonth() + 1);
      return nextMonth;
    });
  };

  // Generate calendar grid
  const daysArray = Array.from({ length: firstDayOfMonth }, () => "").concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  // Format a date as YYYY-MM-DD
  const formatDate = (year, month, day) => {
    if (!day) return null;
    const date = new Date(year, month, day);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Check if a day is a weekend
  const isWeekend = (day) => {
    const date = new Date(year, month, day);
    return date.getDay() === 0 || date.getDay() === 6 // Sunday (0) or Saturday (6)
  };

  const isHoliday = (day) => {
    if (!day) return false; // Handle empty days
    const formattedDate = formatDate(year, month, day);
    return holidays.includes(formattedDate);
  };

  const isLeave = (day) => {
    if (!day) return false;
    const formattedDate = formatDate(year, month, day);
    return leaves.includes(formattedDate);
  };

  // Check if a day is today
  const isToday = (day) => day &&
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year;



  const [chartData, setChartData] = useState({
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Maximum Focus",
        data: [30, 50, 45, 60, 55, 80, 70], // Simulated data
        borderColor: "#FF4D4D",
        backgroundColor: "rgba(255, 77, 77, 0.2)",
        borderWidth: 2,
        tension: 0.4, // Smooth curves
        pointRadius: 0,
        hoverRadius: 6, // Points appear larger on hover
        hitRadius: 20, // No points on the line
      },
      {
        label: "Minimum Focus",
        data: [10, 20, 15, 25, 30, 40, 35], // Simulated data
        borderColor: "#7B61FF",
        backgroundColor: "rgba(123, 97, 255, 0.2)",
        borderWidth: 2,
        tension: 0.4, // Smooth curves
        pointRadius: 0,
        hoverRadius: 6, // Points appear larger on hover
        hitRadius: 20, // No points on the line
      },
    ],
  });

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#666", // Label color
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false }, // Remove gridlines on x-axis
        ticks: { color: "#aaa" },
      },
      y: {
        grid: { color: "#eee", display: false }, // Light gridlines
        ticks: { color: "#aaa", stepSize: 25 }, // Custom steps for better readability
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => ({
        ...prev,
        datasets: prev.datasets.map((dataset) => ({
          ...dataset,
          data: dataset.data.map((value) => value + Math.round(Math.random() * 10 - 5)), // Randomized updates
        })),
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  const handleLeave = () => {
    navigate('/LeaveReq')
  }

  const fetchBirthdaysinfo = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/EmployeeDashboardUpcomingBirthday`, {
        company_code: sessionStorage.getItem("selectedCompanyCode")
      });
      const employeesWithImages = response.data.map((person) => {
        return {
          ...person,
          Photos: person.Photos && person.Photos.data ? bufferToBlobUrl(person.Photos.data) : '',
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


  //Check In Check Out Function
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedDate = localStorage.getItem("lastCheckDate");

    if (isCheckedIn && savedDate === today) {
      startTimer();
    }

    return () => clearInterval(intervalRef.current);
  }, [isCheckedIn]);

  const startTimer = () => {
    let storedElapsedTime = parseInt(localStorage.getItem("elapsedTime")) || 0;

    let startTime =
      parseInt(localStorage.getItem("startTime")) ||
      Date.now() - storedElapsedTime * 1000;

    localStorage.setItem("startTime", startTime);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      localStorage.setItem("elapsedTime", elapsedTime);

      const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, "0");
      const seconds = String(elapsedTime % 60).padStart(2, "0");

      setTimer(`${hours}:${minutes}:${seconds}`);

      if (elapsedTime === 28800 && !localStorage.getItem("mailSent")) {
        sendAutoMail();
        localStorage.setItem("mailSent", "true");
        showEightHourToast(() => {
          console.log("User acknowledged the toast");
        });
      }
    }, 1000);
  };

  const sendAutoMail = async () => {
    const userEmail = sessionStorage.getItem("userEmailId");

    try {
      const response = await fetch(`${config.apiBaseUrl}/sendAutoMail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        console.log("Email sent successfully");
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending mail:", error.message);
    }
  };

  const stopTimer = () => {
    if (hasStoppedRef.current) return; 
    hasStoppedRef.current = true;

    clearInterval(intervalRef.current);

    const startTime = parseInt(localStorage.getItem("startTime"));
    const currentTime = Date.now();

    let lastElapsedTime = 0;
    if (!isNaN(startTime)) {
      lastElapsedTime = Math.floor((currentTime - startTime) / 1000);
    }

    console.log("Calculated Elapsed Time:", lastElapsedTime);

    localStorage.setItem("lastElapsedTime", lastElapsedTime);
    localStorage.removeItem("elapsedTime");
    localStorage.removeItem("startTime");
  };

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
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          DeviceDetails: deviceDetails,
          IP_Address: ipAddress,
          Location: location,
        }),
      });

      if (response.status === 200) {
        setIsCheckedIn((prev) => {
          const newState = !prev;
          localStorage.setItem("isCheckedIn", newState);

          const today = new Date().toISOString().split("T")[0];
          const lastDate = localStorage.getItem("lastCheckDate");

          if (newState) {
            if (lastDate === today) {
              const lastElapsedTime = parseInt(localStorage.getItem("lastElapsedTime")) || 0;
              localStorage.setItem("elapsedTime", lastElapsedTime);
            } else {
              localStorage.setItem("elapsedTime", 0);
              localStorage.setItem("lastElapsedTime", 0);
            }

            localStorage.setItem("lastCheckDate", today);
            hasStoppedRef.current = false; // ✅ Allow stopTimer again
            startTimer();
          } else {
            stopTimer();
          }
          return newState;
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      toast.error("Error inserting data: " + error.message);
    }
  };

  useEffect(() => {
    const storedTime = parseInt(localStorage.getItem("elapsedTime")) || 0;
    const hours = String(Math.floor(storedTime / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((storedTime % 3600) / 60)).padStart(2, "0");
    const seconds = String(storedTime % 60).padStart(2, "0");
    setTimer(`${hours}:${minutes}:${seconds}`);

    localStorage.setItem("lastCheckDate", new Date().toISOString().split("T")[0]);
  }, []);

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




  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [showModal, setShowModal] = useState(false);
  const printRef = useRef();

const handlePreview = async () => {
  try {
    const salary_month = selectedPeriod;
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    const Employeeid = sessionStorage.getItem('selectedUserCode')

    const body = {
      salary_month,
      company_code,
      Employeeid,
    };

    const response = await fetch(`${config.apiBaseUrl}/Getpayslip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Failed to fetch payslip");

    const data = await response.json();
    console.log("Payslip Data:", data.Basic);
    setPayslipData(data[0]);

    setShowModal(true);
  } catch (err) {
    console.error(err);
    alert("Error fetching payslip");
  }
};




  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Payslip Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .text-end { text-align: right; }
            .fw-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  return (
    <div className="container-fluid  Topnav-screen pb-4 pt-2">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
    <div className=" p-2 bg-white shadow-lg rounded-4">
    <div className="row align-items-center">
    
    {/* Greeting Section */}
    <div className="col-12 col-md-8 mb-3 mb-md-0">
     <div className="ticker-wrapper">
              <div className="ticker-text mt-1">{announcement}</div>
            </div>
    </div>

    {/* Right Section: user_code, timer, and button */}
    <div className="col-12 col-md-4">
    <div className="d-flex flex-wrap justify-content-end align-items-center gap-2">
              <div className="badge rounded-pill text-bg-success">{user_code}</div>
              <input
                id="timing"
                className="form-control"
                type="text"
                readOnly
                value={timer}
                style={{ maxWidth: "120px" }}
              />
              <button
                onClick={handleTime}
                className="btn"
                style={{
                  backgroundColor: isCheckedIn ? "red" : "green",
                  color: "white",
                }}
                title={isCheckedIn ? "Check OUT" : "Check IN"}
              >
                <i className="fa-solid fa-clock me-2"></i>
                {isCheckedIn ? "Check OUT" : "Check IN"}
              </button>
            </div>
    </div>

  </div>
</div>







          <div className="row">
        <div className="col-md-6    mb-3 mt-3">
          <div className="card rounded-4 shadow-lg h-100">
            <div className="">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold fs-5">Leave Balance</h6>
                <div className="d-flex justify-content-end ">
                  <button className="border-none p-1 " onClick={handleLeave} style={{ fontSize: "12px" }}>Apply Leave</button>
                </div>
              </div>
              <div className="row">
                {leaveData.length > 0 ? (
                  leaveData.map((leave, index) => (
                    <div key={index} className="col-md-3 col-12 mt-0 p-1">
                      <div className="card h-100">
                        <div className={`leave-icon fs-6 ${leave.leavetype}  rounded-5`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-capsule" viewBox="0 0 16 16">
                            <path d="M1.828 8.9 8.9 1.827a4 4 0 1 1 5.657 5.657l-7.07 7.071A4 4 0 1 1 1.827 8.9Zm9.128.771 2.893-2.893a3 3 0 1 0-4.243-4.242L6.713 5.429z" />
                          </svg>
                        </div>
                        <h6 className="fw-bolder fs-7 mt-4 mb-0">{leave.leavetype}</h6>
                        <h6 className="fs-7 text-dark ms-0">Total Leave: {leave.totalleave}</h6>
                        <h6 className="fs-7 text-primary">Available: {leave.availableleave}</h6>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No leave data available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

         <div className="col-md-2 mb-3 mt-3">
        <div className="card rounded-4 shadow-lg h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mt-0">
              <div className="d-flex justify-content-start">
                <h6 className="card-title">Payslip Analysis</h6>
              </div>
              
            </div>

            {/* Input: Month-Year Selector */}
            <div className="form-group mt-3">
              <label className="d-flex justify-content-start mt-4">Select Period</label>
              <input
                type="month"
                className="form-control"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
            </div>
<div>
            {/* Preview Button */}
           {selectedPeriod && (
  <div className="mt-3 p-1">
    <button className="btn btn-primary" onClick={handlePreview}>
      <i className="bi bi-printer ms-1"></i> Preview
    </button>
  </div>
)}
          </div>
        </div>
      </div>


</div>
      
        <div className="col-lg-4 col-md-3 mt-3 mb-3 ">
          <div className="card rounded-4 shadow-lg p-0">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-4" style={{ maxHeight: "100px", paddingBottom: "10px" }}>
                <div className="d-flex justify-content-start ms-3 mt-3">
                  <h6 className="card-title">Alloted Holidays</h6>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="p-1"
                    onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                  >
                    {isCalendarVisible ? <i className="fa-solid fa-sliders"></i> : <i className="fa-solid fa-toggle-off"></i>}
                  </button>
                </div>
              </div>
              {isCalendarVisible && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <button onClick={handlePrevMonth} className="p-1">
                      Prev
                    </button>
                    <h5 className="text-center">
                      {currentDate.toLocaleString("default", { month: "short" })} {currentDate.getFullYear()}
                    </h5>
                    <button onClick={handleNextMonth} className="p-1 ">
                      Next
                    </button>
                  </div>
                  <div className="calendar-grid">
                    <div className="d-grid grid-template-columns-7 text-center fw-bold">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                        <div key={index}>{day}</div>
                      ))}
                    </div>
                    <div className="d-grid grid-template-columns-7 text-center">
                      {daysArray.map((day, index) => {
                        const isDayToday = isToday(day);
                        const isDayWeekend = day && isWeekend(day);
                        const isDayHoliday = day && isHoliday(day);
                        const isDayLeave = isLeave(day);
                        return (
                          <div
                            key={index}
                            className={`day-cell ${isDayToday
                              ? "today-cell"
                              : isDayHoliday
                                ? "holiday-cell"
                                : isDayWeekend
                                  ? "weekend-cell"
                                  : isDayLeave
                                    ? "leave-cell"
                                    : ""
                              }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Employee Details Component */}
              {!isCalendarVisible && (
                <div className="p-0">
                  <div className="ag-theme-alpine rounded-4" style={{ height: 352, width: "100%", borderRadius: "15px" }}>
                    <AgGridReact columnDefs={holidayCols} rowData={holidayRowData} />
                  </div>
                </div>
              )}

              <style jsx>{`
            .calendar-grid {
              display: flex;
              flex-direction: column;
              gap: 1px;
            }

            .leave-cell {
              background-color:rgb(252, 61, 61) !important;
              color:#ffff
            }

            .grid-template-columns-7 {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 3px;
            }

            .day-cell {
              padding: 8px;
              background-color: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 60px;
              padding-left: 5px;
            }

            .weekend-cell {
              background-color: #ffe5e5;
            }

            .holiday-cell {
              background-color:rgb(86, 219, 115);
            }

            .today-cell {
              background-color: #cce5ff;
              font-weight: bold;
              border: 2px solid #007bff;
            }

            .day-cell:hover {
              background-color: #e9ecef;
              cursor: pointer;
            }
          `}</style>
            </div>
          </div>
        </div>

      </div>
      <div className="row">
        <div className="col-lg-3">
          <div className="card NewJoinees rounded-4 shadow-lg h-100" style={{ maxHeight: "465px", paddingBottom: "80px" }}>
       
            <div className="card-body">
              <div className="d-flex justify-content-between flex-wrap align-items-center">
                <h6 className="card-title">New Joinees</h6>
                {/* <span className="dropdown-icon">⋮</span> */}
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
                            width={150}
                            height={150}
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
                    NewJoinees.map((joinee, index) => (
                      <div
                        // key={joinee.id}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                      >
                        <div className="new-joinee-card text-center">
                          <img
                            src={Vector}
                            width={180}
                            height={180}
                            alt=" No New Joinees"
                            className="d-block mx-auto rounded"
                          />
                          <p className="badge rounded-pill text-bg-info fs-6 mt-2">
                            No New Joinees
                          </p>
                        </div>
                      </div>
                    ))
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi Fbi-caret-left-fill text-dark" viewBox="0 0 16 16">
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
            </div>
          </div>



        </div>
        <div className="col-lg-3 ">
          <div className="card Birthday rounded-4 shadow-lg h-100 mt-2" style={{ maxHeight: "465px", paddingBottom: "80px" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="card-title">Upcoming Birthdays</h6>
                {/* <span className="dropdown-icon">⋮</span> */}
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
                      <div className="col-12 mt-4">
                        <h3 className="text-dark">{person.EmployeeName}</h3>
                        <p className="badge p-1 text-bg-warning fs-6">🎉🎂🎉🎂</p>
                      </div>
                    </div>
                  ))
                ) : (
                  upcomingBirthdays.map((person) => (
                    <div key={person.id} className="birthday-card">
                      <div className="d-flex justify-content-center mt-2">
                        <div className="">
                          <img
                            src={person.Vector}
                            width={110}
                            height={110}
                            style={{ borderRadius: "20px" }}
                            alt={person.Vector}
                          />
                        </div>
                      </div>
                      <div className="col-12 mt-4">
                        <h3 className="text-dark">There is no one birthdays</h3>
                        <p className="badge p-1 text-bg-warning fs-6">🎉🎂🎉🎂</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-8 mt-2 ">
          <div className="card Birthday rounded-4 shadow-lg h-100 mt-2">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="card-title">Productivity</h6>
                {/* <span className="dropdown-icon">⋮</span> */}
              </div>
              <div className="productivity-chart-container" style={{ width: "100%", height: "315px", padding: "20px" }}>
                <Line data={chartData} options={chartOptions} />

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-12 col-md-12 mt-4">
        <div className="card Birthday rounded-4 shadow-lg h-100 ">
          <div className="card-body">

            <h6 className="d-flex justify-content-start ms-3 fw-bold fs-5">Search Criteria </h6>
            {/* <h6 className="d-flex justify-content-start ms-3 fw-bold fs-5">Employee Details</h6> */}

            <div className="row ms-3 me-3">
              <div className="col-md-4 ms-4 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">From Date</label>
                  <input
                    id="startdate"
                    class="exp-input-field form-control"
                    type="date"
                    placeholder=""
                    required title="Please enter the founded date"
                    value={startdate}
                    onChange={(e) => setstartdate(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              <div className="col-md-4 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">To Date</label>
                  <input
                    id="enddate"
                    class="exp-input-field form-control"
                    type="date"
                    placeholder=""
                    required title="Please enter the founded date"
                    value={enddate}
                    onChange={(e) => setenddate(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="col-md-2 form-group mb-2 mt-4">
                <div class="exp-form-floating">
                  <div class=" d-flex  justify-content-center">
                    <div class=''>
                      <icon className="popups-btn fs-6 p-3"
                        onClick={handleSearch}
                        required title="Search">
                        <i className="fas fa-search"></i>
                      </icon>
                    </div>
                    <div>
                      <icon className="popups-btn fs-6 p-3"
                        onClick={reloadGridData}
                        required title="Refresh">
                        <i className="fa-solid fa-arrow-rotate-right" />
                      </icon>
                    </div>
                  </div>
                </div>
              </div>
                <div className="ag-theme-alpine mt-4 rounded-4" style={{ height: 540, width: '100%', paddingRight:'20px' ,borderRadius: "15px" }}>
                  <AgGridReact
                    columnDefs={Employeecol}
                    rowData={rowData}
                    suppressLoadingOverlay={true}
                  />
                </div>
            </div>
          </div>
        </div>
      </div>

      
      {/* Modal for Preview */}
     {showModal && payslipData && (
     
  <div className="  modal fade show d-block payslip-preview-container " tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', marginTop:"50px" }}>
    <div className="payslip-wrapper ">
      <div className="payslip-card"  ref={printRef}>
        <h4 className="payslip-title text-center">PAYSLIP</h4>

        {/* Header Section */}
        <div className="header-section d-flex justify-content-between mb-4">
          <div className="company-info d-flex gap-3">
            <img src={logoSrc} alt="Company Logo" className="company-logo" />
            <div>
              <h5 className="company-name">{company_name}</h5>
              <p className="location"><strong>{Location_name}</strong></p>
              <p className="salary-month">
                Payslip for the month of <strong>{payslipData.SalaryMonth}</strong>
              </p>
            </div>
          </div>

          <div className="employee-info text-end">
            <p><strong>Associate Code:</strong> {payslipData.EmployeeId}</p>
            <p><strong>Associate Name:</strong> {payslipData.employeename}</p>
            <p><strong>PF No:</strong> {payslipData.PFNo}</p>
            <p><strong>Designation:</strong> {payslipData.designation_ID}</p>
            <p><strong>Location:</strong> {Location_name}</p>
            <p><strong>Total Working Days:</strong> {payslipData.total_working_days}</p>
          </div>
        </div>

        {/* Payslip Table */}
        <table className="payslip-table table table-bordered">
          <thead>
            <tr>
              <th colSpan={3}>Earnings</th>
              <th colSpan={3}>Deductions</th>
            </tr>
            <tr>
              <th>Title</th>
              <th>Monthly</th>
              <th>Yearly</th>
              <th>Title</th>
              <th>Monthly</th>
              <th>Yearly</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic</td>
              <td>{(+payslipData.Basic || 0).toFixed(2)}</td>
              <td>{((+payslipData.Basic || 0) * 12).toFixed(2)}</td>
              <td>PF both share</td>
              <td>{(+payslipData.PF_both_share || 0).toFixed(2)}</td>
              <td>{((+payslipData.PF_both_share || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>HRA</td>
              <td>{(+payslipData.HRA || 0).toFixed(2)}</td>
              <td>{((+payslipData.HRA || 0) * 12).toFixed(2)}</td>
              <td>TDS</td>
              <td>{(+payslipData.TDS || 0).toFixed(2)}</td>
              <td>{((+payslipData.TDS || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Conveyance</td>
              <td>{(+payslipData.Conveyance || 0).toFixed(2)}</td>
              <td>{((+payslipData.Conveyance || 0) * 12).toFixed(2)}</td>
              <td>Professional Tax</td>
              <td>{(+payslipData.ProfessionalTax || 0).toFixed(2)}</td>
              <td>{((+payslipData.ProfessionalTax || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Medical Allowance</td>
              <td>{(+payslipData.Medical || 0).toFixed(2)}</td>
              <td>{((+payslipData.Medical || 0) * 12).toFixed(2)}</td>
              <td>Salary Advance</td>
              <td>{(+payslipData.StaffLoan_SalaryAdvance || 0).toFixed(2)}</td>
              <td>{((+payslipData.StaffLoan_SalaryAdvance || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Special Allowance</td>
              <td>{(+payslipData.Special_Allowance || 0).toFixed(2)}</td>
              <td>{((+payslipData.Special_Allowance || 0) * 12).toFixed(2)}</td>
              <td>Other Deductions</td>
              <td>{(+payslipData.otherDeductions || 0).toFixed(2)}</td>
              <td>{((+payslipData.otherDeductions || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Company PF</td>
              <td>{(+payslipData.Company_Pf_Contribution || 0).toFixed(2)}</td>
              <td>{((+payslipData.Company_Pf_Contribution || 0) * 12).toFixed(2)}</td>
              <td>Leave Deduction</td>
              <td>{(+payslipData.LeaveDeduction || 0).toFixed(2)}</td>
              <td>{((+payslipData.LeaveDeduction || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Bonus / Arrears</td>
              <td>{(+payslipData.Bonus || 0).toFixed(2)}</td>
              <td>{((+payslipData.Bonus || 0) * 12).toFixed(2)}</td>
              <td>PF Employee Contribution</td>
              <td>{(+payslipData.PF_contribution_employee || 0).toFixed(2)}</td>
              <td>{((+payslipData.PF_contribution_employee || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Other Allowance</td>
              <td>{(+payslipData.Other_Allowance || 0).toFixed(2)}</td>
              <td>{((+payslipData.Other_Allowance || 0) * 12).toFixed(2)}</td>
              <td colSpan={3}></td>
            </tr>
            <tr className="summary-row fw-bold">
              <td>Total Earnings</td>
              <td>{(+payslipData.Total_Earnigs || 0).toFixed(2)}</td>
              <td>{((+payslipData.Total_Earnigs || 0) * 12).toFixed(2)}</td>
              <td>Total Deductions</td>
              <td>{(+payslipData.Gross_deductions || 0).toFixed(2)}</td>
              <td>{((+payslipData.Gross_deductions || 0) * 12).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Net Pay and Footer */}
        <div className="net-pay text-end mt-3">
          Net Pay: <span className="amount fw-bold">₹{(+payslipData.Net_Earnings || 0).toFixed(2)}</span>
        </div>

        <div className="mt-4 text-end">
          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Authorized By:</strong> HR Department</p>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="" style={{marginLeft:"300px"}}>
      <div className="d-flex justify-content-center bg-light shadow-lg rounded-3   p-3 gap-2 mt-3 mb-5">
        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
        <button className="btn btn-success" onClick={handleDownloadPdf}>Download PDF</button>
      </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboard;
