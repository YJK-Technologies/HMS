 import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from './Home.js';
import Login from "./Login.js";
import Signup from "./signup.js";
import Dash from './Dashboard.js';
import { useState,useEffect } from "react";
import Input from "./Input.js";
import Grid from "./Grid.js";
import Topbar from "./Topbar2.js";
import SideBar from "./SideBar.js";
import UserGrid from "./user_Grid.js";
import UserInput from "./UserInput.js";
import RoleInfoGrid from "./RoleInfoGrid.js";
import Role_input from "./RoleInfo_Input.js";
import AttriDetGrid from "./AttriDetGrid.js";
import AttriHdrInput from "./AttriHdrInput.js";
import AttriDetInput from "./AttriDetInput.js";
import ItemBrandGrid from "./itembrandgrid.js";
import ItemInput from "./ItemInput.js";
import CompanyMappingGrid from "./CompanyMappingGrid.js";
import UserComMap_input from "./CompanyMappingInput.js";
import UserRoleMapGrid from "./UserRoleMapGrid.js";
import UserRoleInput from "./UserRoleMapInput.js";
import LocInfoGrid from "./LocationInfoGrid.js";
import LocInfoInput from "./LocationInput.js";
import Sales from "./Inventory.js";
import Template from "./Template.js";
// import NumberSeriesGrid from "./NumberSeriesGrid.js";
// import NumberSeriesInput from "./NumberSeriesInput.js";
import SaleTrans from './SalesAnalysis.js';
import SalesPrint from './SalesTemplate.js';
import Chart from './ItemDashboard/Charts/Charts.js';
import Settings from './Settings.js';
import AccountInformation from "./AccountInformation.js";
import UserScreenMapGrid from "./userscreenmapgrid.js";
import UserScreenInput from "./userscreeninput.js"; 
import CustomerDetGrid from "./Customerdetgrid.js";
import CustomerHdrInput from "./Customerhdrinput.js"; 
import CustomerDetInput from "./customerdetinput.js";
 import AddDoctorInfo from "./Hostpital_Masters_screens/Doctor/Add_Doctor_info.js";
 import AddPatientInfo from "./Hostpital_Masters_screens/Patient/Add_Patient_info.js";
 import AddClientinfo from "./Hostpital_Masters_screens/Client/Add_Client_info.js";
 import AddServiceinfo from "./Hostpital_Masters_screens/Services/Add_Service_info.js";
 import AddPaymentinfo from "./Hostpital_Masters_screens/PaymentMode/Add_Payment_mode.js";
 import SearchDoctor from "./Hostpital_Masters_screens/Doctor/Doctor_screen.js";
import SearchClient from "./Hostpital_Masters_screens/Client/Client.js";
import SearchPatient from "./Hostpital_Masters_screens/Patient/Patient.js";
import Salessettings from "./SalesSettings.js";
import SalesPrint1 from "./PrintScreens/BillPrint.js";
import Dashboard from "./Hostpital_Masters_screens/Dashboard/HMS_Dashboard.js"
import ServiceGrid from "./Hostpital_Masters_screens/Services/ServiceGrid.js";
import AddMothersScan from "./Transaction/AddMothersScan.js";
import MothersScan from "./Transaction/MothersScan.js";
import BillingReport from './Reports/BillingReport.js';
import GenderReport from './Reports/GenderReport.js';
import ServiceReport from './Reports/ServiceReport.js';
import { ToastContainer } from "react-toastify";



function Main() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [screenTypes, setScreenTypes] = useState(
    JSON.parse(sessionStorage.getItem("screenTypes")) || []
  );

  useEffect(() => {
    const loadPermissions = () => {
      const permissionsJSON = sessionStorage.getItem("permissions");
      if (permissionsJSON) {
        const permissions = JSON.parse(permissionsJSON);
        const screens = permissions.map((permission) =>
          permission.screen_type.replace(/\s+/g, "")
        );
        setScreenTypes(screens);
        sessionStorage.setItem("screenTypes", JSON.stringify(screens));
      }
    };

    loadPermissions();

    window.addEventListener("permissionsUpdated", loadPermissions);
    return () => window.removeEventListener("permissionsUpdated", loadPermissions);
  }, []);

// console.log('Screen Types:', screenTypes);
  
  // const screenTypes = Object.keys(permissions);

  // create by pavun on 7 may 2024 use: To block the view page source  brgin
  // useEffect(()=>{
  //   document.addEventListener("contextmenu",handlecontextmenu)
  //   return()=>{
  //     document.removeEventListener("contextmenu",handlecontextmenu)
  //   }
  // },[])

  // const handlecontextmenu=(e)=>{
  //   e.preventDefault()
  //   // alert("right click is disable")
  // }
  // create by pavun on 7 may 2024 use: To block the view page source  End

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const routes = [
    { path: "/Dashboard", component: <Dash /> },
    { path: "/", component: <Home/>},
    { path: "/Login", component: <Login /> },
    { path: "/signup", component: <Signup /> },
    { path: "/PurchasePrint", component: <Template /> },
    { path: "/SalesPrint", component: <SalesPrint /> },
    { path: "/SalesChart", component: <Chart /> },
    { path: "/Settings", component: <Settings /> },
    { path: "/AddCompany", component: <Input /> },
    { path: "/SalesAnalysis", component: <SaleTrans /> },
    { path: "/Company", component: <Grid /> },
    { path: "/AddUser", component: <UserInput /> },
    { path: "/User", component: <UserGrid /> },
    { path: "/Role", component: <RoleInfoGrid /> },
    { path: "/AddRole", component: <Role_input /> },
    { path: "/Sales", component: <Sales /> },
    { path: "/Attribute", component: <AttriDetGrid /> },
    { path: "/AddAttributeHeader", component: <AttriHdrInput /> },
    { path: "/AddAttributeDetail", component: <AttriDetInput /> },
    { path: "/Item", component: <ItemBrandGrid /> },
    { path: "/AddItem", component: <ItemInput /> },
    { path: "/CompanyMapping", component: <CompanyMappingGrid /> },
    { path: "/AddCompanyMapping", component: <UserComMap_input /> },
    { path: "/UserRoleMapping", component: <UserRoleMapGrid /> },
    { path: "/AddUserRoleMapping", component: <UserRoleInput /> },
    { path: "/Location", component: <LocInfoGrid /> },
    { path: "/AddLocation", component: <LocInfoInput /> },
    { path: "/Sales", component: <Sales /> },
    // { path: "/NumberSeries", component: <NumberSeriesGrid /> },
    // { path: "/AddNumberSeries", component: <NumberSeriesInput /> },
    { path: "/UserRights", component: <UserScreenMapGrid /> },
    { path: "/AccountInformation", component: <AccountInformation /> },
    { path: "/AddUserRights", component: <UserScreenInput /> },
    { path: "/Customer", component: <CustomerDetGrid /> },
    { path: "/AddCustomerHeader", component: <CustomerHdrInput /> },
    { path: "/AddCustomerDetails", component: <CustomerDetInput /> },
    { path: "/Salessettings", component: <Salessettings/>},
    { path: "/AddDoctorInfo", component: <AddDoctorInfo /> },
    { path: "/AddPatientInfo", component: <AddPatientInfo /> },
    { path: "/AddClientinfo", component: <AddClientinfo /> },
    { path: "/AddServiceinfo", component: <AddServiceinfo /> },
    { path: "/AddPaymentMode", component: <AddPaymentinfo /> },
    { path: "/SearchDoctor", component: <SearchDoctor /> },
    { path: "/SearchClient", component: <SearchClient /> },
    { path: "/SearchPatient", component: <SearchPatient /> },
    { path: "/HMSDashboard", component: <Dashboard /> },
    { path: "/ServiceGrid", component: <ServiceGrid /> },
    { path: "/AddMothersScan", component: <AddMothersScan /> },
    { path: "/MothersScan", component: <MothersScan /> },
    { path: "/BillingReport", component: <BillingReport /> },
    { path: "/GenderReport", component: <GenderReport /> },
    { path: "/ServiceReport", component: <ServiceReport /> },
  ];
 
  return (
    <Router>
        <PathLogger />
        <ToastContainer />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/SalesPrint1" element={<SalesPrint1 />} />
      

    
      
      {routes.map(({ path, component }) =>
        screenTypes.includes(path.replace('/', '')) ? (
          path.includes('Print') ? (
            <Route
              key={path}
              path={path}
              element={
                <div className="px-4">{component}</div>
              }
            />
          ) : (
            <Route
              key={path}
              path={path}
              element={
                <div>
                  <Topbar />
                  <div className="layout-container">
                    <SideBar className="sidebar" />
                      <div className="container-fluid">{component}</div>
                  </div>
                </div>
              }
            />
          )
        ) : (
          <Route
            key={path}
            path={path}
            element={
              <div>
                <SideBar className="sidebar" />
                <Topbar />
                <div className="layout-container">
                  <div className="container-fluid ">
                    {/* <NotFound /> */}
                  </div>
                </div>
              </div>
            }
          />
        )
      )}
    </Routes>
  </Router>
  );
}

const PathLogger = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    sessionStorage.setItem('currentPath', currentPath);
  }, [location]); 

  return null; 
};

export default Main;
