import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from './Home.js';
import Login from "./Login.js";
import Signup from "./signup.js";
import { useState, useEffect } from "react";
import Input from "./Input.js";
import Grid from "./Grid.js";
import Topbar from "./Topbar2.js";
import SideBar from "./NewSidebar.js";
import UserGrid from "./user_Grid.js";
import UserInput from "./UserInput.js";
import WarehouseGrid from "./WarehouseGrid.js";
import WareHouseInput from "./WareHouseInput.js";
import RoleInfoGrid from "./RoleInfoGrid.js";
import Role_input from "./RoleInfo_Input.js";
import AttriDetGrid from "./AttriDetGrid.js";
import AttriHdrInput from "./AttriHdrInput.js";
import AttriDetInput from "./AttriDetInput.js";
import IntermediaryGrid from "./IntermediaryHeaderGrid.js";
import IntermediaryHdrInput from "./IntermediaryHeaderInput.js";
import IntermediaryDetailInput from "./IntermediaryDetailrInput.js";
import CompanyMappingGrid from "./CompanyMappingGrid.js";
import UserComMap_input from "./CompanyMappingInput.js";
import UserRoleMapGrid from "./UserRoleMapGrid.js";
import UserRoleInput from "./UserRoleMapInput.js";
import LocInfoGrid from "./LocationInfoGrid.js";
import LocInfoInput from "./LocationInput.js";
import VariantTab from './ItemDashboard/Variant.js';
import UnitTab from './ItemDashboard/Unit.js';
import Settings from './Settings.js';
import UnitChart from './ItemDashboard/Charts/UnitChart.js';
import ProChart from './ItemDashboard/Charts/ProChart.js';
import VarChart from './ItemDashboard/Charts/VarChart.js';
import AccountInformation from "./AccountInformation.js";
import UserScreenMapGrid from "./userscreenmapgrid.js";
import UserScreenInput from "./userscreeninput.js";
import NotFound from './NotFound.js'
import TStock from './TotalStockDashboard/TStockScreen.js'
import BankAccInput from "./BankAccount.js";
import BankAccGrid from "./BankAccountGrid.js";
import Cstock from "./CurrentStockScreen.js";
import Employee from "./Employeegrid.js";
import EmployeeInput from "./Employeeinput.js";
import BarcodeGenerator from "./Barcode/BarcodeGenerator.js";
import BarcodeScanner from "./Barcode/BarcodeScanner.js";
import DepartmentInput from "./DepartmentInput.js";
import Department from "./DepartmentGrid.js";
import Desgination from "./DesginationGrid.js";
import DesginationInput from "./DesginationInput.js";
import InvoiceSettings from "./InvoiceSetting.js";
import Validation from "./ValidationScreen.js";
import FinancialYearAccess from "./financialYearAccess.js"
import PrintTemplate from "./PrintTemplate.js";
import NumberSeriesGrid from "./NumberSeriesGrid.js";
import NumberSeriesInput from "./NumberSeriesInput.js";
import SaleTrans from './SalesAnalysis.js';
import PurchaseAnalysis from "./PurchaseAnalysis.js";
import Purdash from './PurchaseDashboard/PurchaseAnalysis.js';
import LeaveReq from './ESSDashboard/LeaveRequest.js'
import ESSDashboard from './ESSDashboard/Dashboard.js'
import EmployeeDashboard from './ESSDashboard/EmployeeDashboard.js'
import EmployeeLoan from './ESSComponents/AddEmployeeInfo.js'
import ESSDailyAtten from './ESSComponents/Payslip.js'
import PayslipReport from "./PayslipReport.js"
import Grade from './ESSComponents/Grade.js'
import EmpLeave from './ESSComponents/EmpLeave.js'
import EmpLoanType from './ESSComponents/EmployeeLoanType.js'
import ESSLoan from './ESSComponents/EmpLoan.js'
import EmpLoan from './ESSComponents/EmpLoan.js'
import Announce from './ESSComponents/Announcement.js'
import HoliDays from "./ESSComponents/Holiday.js";
import WeekOff from "./WeekOff.js";
import FinancialYear from "./ESSComponents/FinancialYear.js";
import EmpProject from './TaskMasters/EmpProject.js';
import EmployeeTask from './TaskMasters/TaskInspector.js';
import DailyTask from './TaskMasters/DailyTask.js';
import EmpProjectinput from './TaskMasters/EmpProjectinput.js';
import DailyTaskInput from './TaskMasters/DailyTaskInput.js';
import ProjectMapping from './TaskMasters/ProjectMapping.js';
import PMSsettings from "./SettingScreenPMS.js";
import OpenTickets from './TaskTransactions/OpeningTickets.js';
import Allocatedproject from './TaskTransactions/Projectscreen.js';
import Login_info from './Task_Reports/TaskHours.js';
import ProjectDetails from './Task_Reports/ProjectProgress.js';
import ProjectChartReport from "./Task_Reports/ProjectChartReport.js";
import CompanyDetails from './ESSComponents/CompanyDetails.js';
import FinanceDet from './ESSComponents/FinanceDet.js';
import BankAccDet from './ESSComponents/BankAccDet.js';
import IdentDoc from './ESSComponents/IdentDoc.js';
import AcademicDet from './ESSComponents/AcademicDet.js';
import Insur from './ESSComponents/Insurance.js';
import Documents from './ESSComponents/Document.js';
import EmployeeBonus from './ESSComponents/EmployeeBonus.js';
import EmpPFCompany from './ESSComponents/EmployeePFCompany.js'
import EmpProfessionalTax from './ESSComponents/EmpProfessionalTax.js'
import EmpTDS from './ESSComponents/EmpTDS.js'







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
    { path: "/", component: <Home /> },
    { path: "/Login", component: <Login /> },
    { path: "/signup", component: <Signup /> },
    { path: "/UnitDataChart", component: <UnitChart /> },
    { path: "/VarientDataChart", component: <VarChart /> },
    { path: "/ItemDataChart", component: <ProChart /> },
    { path: "/Settings", component: <Settings /> },
    { path: "/UnitData", component: <UnitTab /> },
    { path: "/VarientData", component: <VariantTab /> },
    { path: "/TemplateDesign", component: <PrintTemplate /> },
    { path: "/AddCompany", component: <Input /> },
    { path: "/Company", component: <Grid /> },
    { path: "/AddUser", component: <UserInput /> },
    { path: "/User", component: <UserGrid /> },
    { path: "/Warehouse", component: <WarehouseGrid /> },
    { path: "/AddWarehouse", component: <WareHouseInput /> },
    { path: "/Role", component: <RoleInfoGrid /> },
    { path: "/AddRole", component: <Role_input /> },
    { path: "/Attribute", component: <AttriDetGrid /> },
    { path: "/AddAttributeHeader", component: <AttriHdrInput /> },
    { path: "/AddAttributeDetail", component: <AttriDetInput /> },
    { path: "/Intermediary", component: <IntermediaryGrid /> },
    { path: "/AddIntermedHeader", component: <IntermediaryHdrInput /> },
    { path: "/AddIntermedDetails", component: <IntermediaryDetailInput /> },
    { path: "/CompanyMapping", component: <CompanyMappingGrid /> },
    { path: "/AddCompanyMapping", component: <UserComMap_input /> },
    { path: "/UserRoleMapping", component: <UserRoleMapGrid /> },
    { path: "/AddUserRoleMapping", component: <UserRoleInput /> },
    { path: "/Location", component: <LocInfoGrid /> },
    { path: "/AddLocation", component: <LocInfoInput /> },
    { path: "/UserRights", component: <UserScreenMapGrid /> },
    { path: "/AccountInformation", component: <AccountInformation /> },
    { path: "/AddUserRights", component: <UserScreenInput /> },
    { path: "/NotFound", component: <NotFound /> },
    { path: "/TotalStock", component: <TStock /> },
    { path: "/AddBankAccount", component: <BankAccInput /> },
    { path: "/BankAccount", component: <BankAccGrid /> },
    { path: "/CurrentStock", component: <Cstock /> },
    { path: "/EmployeeInfo", component: <Employee /> },
    { path: "/EmployeeInputInfo", component: <EmployeeInput /> },
    { path: "/BarcodeGenerator", component: <BarcodeGenerator /> },
    { path: "/BarcodeScanner", component: <BarcodeScanner /> },
    { path: "/AddDepartment", component: <DepartmentInput /> },
    { path: "/Department", component: <Department /> },
    { path: "/DesgiantionInfo", component: <Desgination /> },
    { path: "/AddDesgination", component: <DesginationInput /> },
    { path: "/InvoiceSettings", component: <InvoiceSettings /> },
    { path: "/Validation", component: <Validation /> },
    { path: "/FinancialYearAccess", component: <FinancialYearAccess /> },
    { path: "/NumberSeries", component: <NumberSeriesGrid /> },
    { path: "/AddNumberSeries", component: <NumberSeriesInput /> },
    { path: "/SalesAnalysis", component: <SaleTrans /> },
    { path: "/PurchaseAnalysis", component: <PurchaseAnalysis /> },
    { path: "/PurchaseAnalysis", component: <Purdash /> },
    { path: "/ESSDashboard", component: <ESSDashboard /> },
    { path: "/EmployeeDashboard", component: <EmployeeDashboard /> },
    { path: "/AddEmployeeInfo", component: <EmployeeLoan /> },
    { path: "/salarypath", component: <ESSDailyAtten mode="salarypath" /> },
    { path: "/PayslipReport", component: <PayslipReport /> },
    { path: "/EmployeeGrade", component: <Grade /> },
    { path: "/EmpLeave", component: <EmpLeave /> },
    { path: "/EmployeeLoan", component: <EmpLoan /> },
    { path: "/PayslipEmpLoanType", component: <EmpLoanType /> },
    { path: "/Announce", component: <Announce /> },
    { path: "/HoliDays", component: <HoliDays /> },
    { path: "/WeekOff", component: <WeekOff /> },
    { path: "/PayslipSalaryDays", component: <FinancialYear /> },
    { path: "/Project", component: <EmpProject /> },
    { path: "/ProjectMapping", component: <ProjectMapping /> },
    { path: "/Task", component: <DailyTask /> },
    { path: "/DailyTaskInput", component: <DailyTaskInput /> },
    { path: "/ESSLoan", component: <ESSLoan /> },
    { path: "/EmployeeTask", component: <EmployeeTask /> },
    { path: "/EmpProjectinput", component: <EmpProjectinput /> },
    { path: "/PMSsettings", component: <PMSsettings /> },
    { path: "/OpenTickets", component: <OpenTickets /> },
    { path: "/ProjectDetails", component: <Allocatedproject /> },
    { path: "/TaskHours", component: <Login_info /> },
    { path: "/ProjectProgress", component: < ProjectDetails /> },
    { path: "/ProjectChartReport", component: <ProjectChartReport /> },
    { path: "/CompanyDetails", component: <CompanyDetails /> },
    { path: "/FinanceDet", component: <FinanceDet /> },
    { path: "/BankAccDet", component: <BankAccDet /> },
    { path: "/IdentDoc", component: <IdentDoc /> },
    { path: "/AcademicDet", component: <AcademicDet /> },
    { path: "/Family", component: <Insur /> },
    { path: "/Documents", component: <Documents /> },
    { path: "/PayslipEmpBonus", component: <EmployeeBonus /> },
    { path: "/PFContribution", component: <EmpPFCompany /> },
    { path: "/PayslipEmpProTax", component: <EmpProfessionalTax /> },
    { path: "/PayslipEmpTDS", component: <EmpTDS /> },

  ];

  return (
    <Router>
      <PathLogger />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />

        <Route
          path="/AccountInformation"
          element={
            <div>
              <Topbar />
              <div className="layout-container">
                <SideBar className="sidebar" />
                <div className="content-area-main">
                  <AccountInformation />
                </div>
              </div>
            </div>
          }
        />

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
                      <div className="content-area-main">{component}</div>
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
                    <div className="content-area-main">
                      <NotFound />
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
