import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import { Printer, Wrench, Activity, Users, UserSearch, TrendingUp, UserCog, Briefcase, ReceiptText } from "lucide-react"; // or from "react-feather"
import {
  BuildingFill,
  CardText,
  Book,
} from "react-bootstrap-icons";
import "./SideBar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [adminCollapsed, setAdminCollapsed] = useState(false);
  const [mastersCollapsed, setMastersCollapsed] = useState(false);
  const [accountCollapsed, setAccountCollapsed] = useState(false);
  const [TransactionsCollapsed, setTransactionsCollapsed] = useState(false);
  const [purchaseCollapsed, setPurchaseCollapsed] = useState(false);
  const [salesCollapsed, setSalesCollapsed] = useState(false);
  const [unplannedCollapsed, setUnplannedCollapsed] = useState(false);
  const [reportCollapsed, setReportCollapsed] = useState(false);
  const [ESSCollapsed, setESSCollapsed] = useState(false);
  const [MastersCollapsed, setmastersCollapsed] = useState(false);
  const [CRMCollapsed, setCRMCollapsed] = useState(false);
  const [PMSTransactions, setPMSTransactions] = useState(false);
  const [payslipCollapsed, setpayslipCollapsed] = useState(false);
  const [CRM, setCRM] = useState(false);



  const [selectedLink, setSelectedLink] = useState(false);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleESSCollapse = () => {
    setESSCollapsed(!ESSCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setCRMCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);

  };

  const togglePMSTransactions = () => {
    setPMSTransactions(!PMSTransactions);
    setmastersCollapsed(true);
    setESSCollapsed(false);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setCRMCollapsed(false);
  };

  const toggleMastertsCollapse = () => {
    setmastersCollapsed(!MastersCollapsed);
    setESSCollapsed(false);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(false);
  };

  const toggleAdminCollapse = () => {
    setESSCollapsed(false);
    setAdminCollapsed(!adminCollapsed);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(false);
  };

  const toggleMastersCollapse = () => {
    setESSCollapsed(false);
    setMastersCollapsed(!mastersCollapsed);
    setAdminCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(false);
  };

  const toggleAccountCollapse = () => {
    setESSCollapsed(false);
    setAccountCollapsed(!accountCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(false);
  };

  const toggleTransactionsCollapse = () => {
    setESSCollapsed(false);
    setTransactionsCollapsed(!TransactionsCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setPurchaseCollapsed(true);
    setSalesCollapsed(true);
    setUnplannedCollapsed(true);
    setReportCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(false);
  };

  const togglePurchaseCollapse = () => {
    setESSCollapsed(false);
    setPurchaseCollapsed(!purchaseCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(false);
  };

  const toggleSalesCollapse = () => {
    setESSCollapsed(false);
    setSalesCollapsed(!salesCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(false);
  };

  const toggleUnplannedCollapse = () => {
    setESSCollapsed(false);
    setUnplannedCollapsed(!unplannedCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(false);
  };

  const toggleReportCollapse = () => {
    setESSCollapsed(false);
    setReportCollapsed(!reportCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(false);
  };

  const togglePayslipCollapse = () => {
    // setESSCollapsed(false);
    setpayslipCollapsed(!payslipCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(false);
  };

  const toggleCRM = () => {
    setESSCollapsed(false);
    setpayslipCollapsed(false);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(!CRMCollapsed);
  };



  const handleLinkClick = (linkName) => {
    setSelectedLink(linkName);
    sessionStorage.setItem("selectedPage", linkName);
  };

  // Fetch permissions from session storage
  const permissionsJSON = sessionStorage.getItem("permissions");
  const permissions = permissionsJSON ? JSON.parse(permissionsJSON) : [];
  const screenType = Array.isArray(permissions)
    ? permissions.map((permission) =>
      permission.screen_type.replace(/\s+/g, "")
    )
    : [];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-menu mt-2" id="">
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          {collapsed ? <BsChevronDown /> : <BsChevronRight />}
        </div>

        <div className="menu-item mt-5" onClick={toggleAdminCollapse} title="Admin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-person-vcard me-2 Admin-font"
            viewBox="0 0 16 16"
          >
            <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
            <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96q.04-.245.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 1 1 12z" />
          </svg>
          <span className={collapsed ? "hidden" : ""}>Admin</span>
          <div class="admin-arrow" >
            {adminCollapsed ? <BsChevronDown /> : <BsChevronRight />}
          </div>
        </div>
        <div className={`collapse ${adminCollapsed ? "show" : "hide"}`} >
          <div className=" ms-3">
            {screenType.includes("Company") && (
              <Link to="/Company" className="nav-link"
                title="Company">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-buildings me-3"
                    viewBox="0 0 16 16"

                  >
                    <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
                    <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="" >
                    {" "}
                    Company{" "}
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("CompanyMapping") && (
              <Link to="/CompanyMapping" className="nav-link" title="Company Mapping">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-clipboard-pulse me-3"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1H3a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3.5a1 1 0 0 0-1-1h-1v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2m6.979 3.856a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.895-.133L4.232 10H3.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 .416-.223l1.41-2.115 1.195 3.982a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h1.5a.5.5 0 0 0 0-1h-1.128z"
                    />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="">
                    {" "}
                    Company Mapping{" "}
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className="ms-3">
            {screenType.includes("Location") && (
              <Link to="/Location" className="nav-link" title="Location">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-geo-alt me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="ms-1">
                    {" "}
                    Location
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("Role") && (
              <Link to="/Role" className="nav-link" title="Role">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-person-circle me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path
                      fill-rule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                    />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="">
                    {" "}
                    Role
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("UserRoleMapping") && (
              <Link to="/UserRoleMapping" className="nav-link" title="Role Mapping">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-person-fill-check me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""}>
                    {" "}
                    Role Mapping
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("UserRights") && (
              <Link to="/UserRights" className="nav-link" title="Role Rights">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-person-fill-gear me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""}>
                    {" "}
                    Role Rights
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("User") && (
              <Link to="/User" className="nav-link" title="User">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-people-fill me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="">
                    User
                  </span>
                </div>
              </Link>
            )}
          </div>
          {/* Add other admin links here */}
        </div>
        <div className="menu-item" onClick={toggleMastersCollapse} title="Masters">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-lightning-fill me-2 masters-font"
            viewBox="0 0 16 16"
          >
            <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641z" />
          </svg>
          <span className={collapsed ? "hidden" : ""}>Masters</span>
          <div class="master-arrow">
            {mastersCollapsed ? <BsChevronDown /> : <BsChevronRight />}
          </div>
        </div>
        <div className={`collapse ${mastersCollapsed ? "show" : ""}`}>
          <div className="ms-3">
            {screenType.includes("Attribute") && (
              <Link to="/Attribute" className="nav-link" title="Attribute">
                <div class="menu-item">
                  <CardText size={18} className="me-3 " />
                  <span className={collapsed ? "hidden" : ""} class="">
                    {" "}
                    Attribute
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className="ms-3">
            {screenType.includes("TemplateDesign") && (
              <Link to="/TemplateDesign" className="nav-link" title="PrintTemplate">
                <div className="menu-item">
                  <Printer size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""}>
                    {" "}
                    Print Templates
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("BankAccount") && (
              <Link to="/BankAccount" className="nav-link" title="Bank Account">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-person-rolodex me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 9.05a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                    <path d="M1 1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h.5a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h.5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6.707L6 1.293A1 1 0 0 0 5.293 1zm0 1h4.293L6 2.707A1 1 0 0 0 6.707 3H15v10h-.085a1.5 1.5 0 0 0-2.4-.63C11.885 11.223 10.554 10 8 10c-2.555 0-3.886 1.224-4.514 2.37a1.5 1.5 0 0 0-2.4.63H1z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""}>
                    {" "}
                    Bank Account
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("BarcodeGenerator") && (
              <Link
                to="/BarcodeGenerator"
                title="Barcode Generator"
                className="nav-link"
                onClick={() => handleLinkClick("BarcodeGenerator")}
              >
                {" "}
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="me-3"
                    id="barcode"
                  >
                    <polyline
                      fill="none"
                      stroke="#FFFFFF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="16"
                      points="184 48 224 48 224 88"
                    ></polyline>
                    <polyline
                      fill="none"
                      stroke="#FFFFFF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="16"
                      points="72 208 32 208 32 168"
                    ></polyline>
                    <polyline
                      fill="none"
                      stroke="#FFFFFF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="16"
                      points="224 168 224 208 184 208"
                    ></polyline>
                    <polyline
                      fill="none"
                      stroke="#FFFFFF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="16"
                      points="32 88 32 48 72 48"
                    ></polyline>
                    <line
                      x1="80"
                      x2="80"
                      y1="88"
                      y2="168"
                      fill="none"
                      stroke="#FFFFFF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="16"
                    ></line>
                    <line
                      x1="176"
                      x2="176"
                      y1="88"
                      y2="168"
                      fill="none"
                      stroke="#FFFFFF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="16"
                    ></line>
                    <line
                      x1="144"
                      x2="144"
                      y1="88"
                      y2="168"
                      fill="none"
                      stroke="#FFFFFF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="16"
                    ></line>
                    <line
                      x1="112"
                      x2="112"
                      y1="88"
                      y2="168"
                      fill="none"
                      stroke="#FFFFFF"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="16"
                    ></line>
                  </svg>

                  <span className={collapsed ? "hidden" : ""}>
                    {" "}
                    Barcode Generator
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("BarcodeScanner") && (
              <Link
                to="/BarcodeScanner"
                className="nav-link" title="Barcode Scanner"
                onClick={() => handleLinkClick("BarcodeScanner")}
              >
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="me-3"
                    id="barcode-scanner"
                  >
                    <path d="M60,3H58.051a4.842,4.842,0,0,0-3.908-2c-.121,0-.243,0-.344.013L24.63,2.729A5.019,5.019,0,0,0,20,7.715v11.57a5.023,5.023,0,0,0,4.646,4.987l2.921.172-1,2.556H21.934a8.028,8.028,0,0,0-5.715,2.367L14.586,31H2a1,1,0,0,0-1,1V53a1,1,0,0,0,1,1H13.586l1.284,1.284a9.2,9.2,0,0,0,5.342,2.628A2.961,2.961,0,0,0,20,59v1a3,3,0,0,0,3,3H40a3,3,0,0,0,3-3V59a2.977,2.977,0,0,0-.75-1.964,4.428,4.428,0,0,0,.761-6.316,4.471,4.471,0,0,0,1.722-7.337,4.437,4.437,0,0,0,1.278-6.663A4.482,4.482,0,0,0,47,28.762V25.587l6.79.4c.117.009.235.013.353.013a4.842,4.842,0,0,0,3.908-2H60a3,3,0,0,0,3-3V6A3,3,0,0,0,60,3ZM29.664,24.568l10.8.635L39.39,28H34.969A4.952,4.952,0,0,0,32,27H28.7ZM14.707,52.293A1,1,0,0,0,14,52H3V33H15a1,1,0,0,0,.707-.293l1.926-1.926A6.044,6.044,0,0,1,21.934,29H32a3,3,0,0,1,3,3v9a2,2,0,0,1-4,0V34a1,1,0,0,0-1-1H26a1,1,0,0,0-1,1,8.009,8.009,0,0,1-8,8H15v2h2a9.959,9.959,0,0,0,7-2.879V56H21.427a7.229,7.229,0,0,1-5.143-2.13ZM42,53.5A2.5,2.5,0,0,1,39.5,56h-7a2.5,2.5,0,0,1,0-5h7A2.5,2.5,0,0,1,42,53.5Zm-14,0a4.474,4.474,0,0,0,.762,2.5H26V39.033c0-.239,0-.479.012-.719A9.9,9.9,0,0,0,26.95,35H29v6a3.988,3.988,0,0,0,1.649,3.221,4.368,4.368,0,0,0,.34,5.059A4.492,4.492,0,0,0,28,53.5ZM40,58a1,1,0,0,1,1,1v1a1,1,0,0,1-1,1H23a1,1,0,0,1-1-1V59a1,1,0,0,1,1-1Zm1.5-9h-7a2.49,2.49,0,0,1-1.954-4.046A4.012,4.012,0,0,0,33,45a3.962,3.962,0,0,0,2.618-1H41.5a2.5,2.5,0,0,1,0,5Zm1-7H36.858A3.939,3.939,0,0,0,37,41V37h5.5a2.5,2.5,0,0,1,0,5Zm2-7H37V32a4.95,4.95,0,0,0-.424-2H44.5a2.5,2.5,0,0,1,0,5Zm.5-6.949A4.342,4.342,0,0,0,44.5,28H41.533l1.029-2.674L45,25.47Zm12-6.908a2.865,2.865,0,0,1-3.065,2.849h-.019L24.778,22.277A3.012,3.012,0,0,1,22,19.285V7.715a3.009,3.009,0,0,1,2.763-2.991L53.935,3.008C54,3,54.073,3,54.143,3A2.861,2.861,0,0,1,57,5.857ZM61,21a1,1,0,0,1-1,1H58.913A4.844,4.844,0,0,0,59,21.143V5.857A4.844,4.844,0,0,0,58.913,5H60a1,1,0,0,1,1,1Z"></path>
                    <path d="M51,7H28a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1H51a1,1,0,0,0,1-1V8A1,1,0,0,0,51,7Zm-1,4H29V9H50Z"></path>
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="ms-1">
                    Barcode Scanner
                  </span>
                </div>
              </Link>
            )}
          </div>

          <div className=" ms-3">
            {screenType.includes("Department") && (
              <Link
                to="/Department"
                className="nav-link"
                title="Department"
                onClick={() => handleLinkClick("Department")}
              >
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-clipboard-pulse me-3"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1H3a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3.5a1 1 0 0 0-1-1h-1v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2m6.979 3.856a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.895-.133L4.232 10H3.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 .416-.223l1.41-2.115 1.195 3.982a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h1.5a.5.5 0 0 0 0-1h-1.128z"
                    />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="ms-1">
                    Department
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("DesgiantionInfo") && (
              <Link
                to="/DesgiantionInfo"
                className="nav-link"
                title=" Designation Info"
                onClick={() => handleLinkClick("DesgiantionInfo")}
              >
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="me-3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zM12 14c3.87 0 7 1.28 7 3v1H5v-1c0-1.72 3.13-3 7-3z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""}>
                    {" "}
                    Designation Info
                  </span>
                </div>
              </Link>
            )}
          </div>

          <div className=" ms-3">
            {screenType.includes("Intermediary") && (
              <Link to="/Intermediary" className="nav-link" title="Intermediary">
                <div class="menu-item">
                  <Book size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""} class="ms-1">
                    Intermediary
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("NumberSeries") && (
              <Link to="/NumberSeries" className="nav-link" title="Number Series">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-123 me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""}>
                    {" "}
                    Number Series
                  </span>
                </div>
              </Link>
            )}
          </div>

          <div className=" ms-3">
            {screenType.includes("Warehouse") && (
              <Link to="/Warehouse" className="nav-link" title="Warehouse">
                <div class="menu-item">
                  <BuildingFill size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""}> Warehouse</span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("FinancialYearAccess") && (
              <Link to="/FinancialYearAccess" className="nav-link" title="Warehouse">
                <div class="menu-item">
                  <BuildingFill size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""}> Financial Year Access</span>
                </div>
              </Link>
            )}
          </div>

        </div>
         <div className="menu-item" onClick={toggleESSCollapse} title="ESS">
          <ReceiptText size={20} className="me-2 ESS-font" />
          <span className={collapsed ? "hidden" : ""}>HCM</span>
          <div class="ESS-arrow">
            {ESSCollapsed ? <BsChevronDown /> : <BsChevronRight />}
          </div>
        </div>
        <div className={`collapse ${ESSCollapsed ? "show" : ""}`}>
          <div className="ms-3">
            {screenType.includes("ESSDashboard") && (
              <Link to="/ESSDashboard" className="nav-link" title="Admin Dashboard">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    className="me-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class=" ">
                    Admin Dashboard
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className="ms-3">
            {screenType.includes("EmployeeDashboard") && (
              <Link to="/EmployeeDashboard" className="nav-link" title="Employee Dashboard">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="me-3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C17 14.17 12.33 13 10 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h4v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class=" ">
                    Employee Dashboard
                  </span>
                </div>
              </Link>
            )}
          </div>


          <div className="ms-3">
            {screenType.includes("AddEmployeeInfo") && (
              <Link to="/AddEmployeeInfo" className="nav-link" title="Employee Info">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-info-circle me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class=" ">
                    Employee Info
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className="ms-3">
            {screenType.includes("salarypath") && (
              <Link to="/salarypath" className="nav-link" title="Salary Process">
                <div class="menu-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cash-stack me-3" viewBox="0 0 16 16">
                    <path d="M3 5a2 2 0 0 0-2 2v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2H3zm11 1h-1a1 1 0 0 0 0 2h1v1h-1a1 1 0 0 0 0 2h1v1H2v-1h1a1 1 0 0 0 0-2H2v-1h1a1 1 0 0 0 0-2H2V7a1 1 0 0 1 1-1h11v1z" />
                    <path d="M5.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class=" ">
                    Salary Process
                  </span>
                </div>
              </Link>
            )}
          </div>
          {/* <div className="ms-3">
            {screenType.includes("PayslipGenerator") && (
              <Link to="/PayslipGenerator" className="nav-link" title="PaySlip Generator">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-receipt me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z" />
                    <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class=" ">
                    Payslip Generator
                  </span>
                </div>
              </Link>
            )}
          </div> */}
          <div className="menu-item" onClick={toggleESSCollapse} title="ESS Master">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-clipboard-data me-2 Report-font"
              viewBox="0 0 16 16"
            >
              <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z" />
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
            </svg>
            <span className={collapsed ? "hidden" : ""}>ESS Master</span>
            <div class="ESS-arrow">
              {ESSCollapsed ? <BsChevronDown /> : <BsChevronRight />}
            </div>
          </div>
          <div className={`collapse ${ESSCollapsed ? "show" : ""}`}>
            <div className="ms-3">
              {screenType.includes("EmployeeGrade") && (
                <Link to="/EmployeeGrade" className="nav-link" title="Grade">
                  <div class="menu-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-alphabet-uppercase me-3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1.226 10.88H0l2.056-6.26h1.42l2.047 6.26h-1.29l-.48-1.61H1.707l-.48 1.61ZM2.76 5.818h-.054l-.75 2.532H3.51zm3.217 5.062V4.62h2.56c1.09 0 1.808.582 1.808 1.54 0 .762-.444 1.22-1.05 1.372v.055c.736.074 1.365.587 1.365 1.528 0 1.119-.89 1.766-2.133 1.766zM7.18 5.55v1.675h.8c.812 0 1.171-.308 1.171-.853 0-.51-.328-.822-.898-.822zm0 2.537V9.95h.903c.951 0 1.342-.312 1.342-.909 0-.591-.382-.954-1.095-.954zm5.089-.711v.775c0 1.156.49 1.803 1.347 1.803.705 0 1.163-.454 1.212-1.096H16v.12C15.942 10.173 14.95 11 13.607 11c-1.648 0-2.573-1.073-2.573-2.849v-.78c0-1.775.934-2.871 2.573-2.871 1.347 0 2.34.849 2.393 2.087v.115h-1.172c-.05-.665-.516-1.156-1.212-1.156-.849 0-1.347.67-1.347 1.83" />
                    </svg>
                    <span className={collapsed ? "hidden" : ""} class="">
                      Grade
                    </span>
                  </div>
                </Link>
              )}
            </div>
            <div className="ms-3">
              {screenType.includes("EmpLeave") && (
                <Link to="/EmpLeave" className="nav-link" title="Leave">
                  <div class="menu-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-person-walking me-3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z" />
                      <path d="M6.25 11.745v-1.418l1.204 1.375.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843.006-.067 1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z" />
                    </svg>
                    <span className={collapsed ? "hidden" : ""} class="">
                      Leave
                    </span>
                  </div>
                </Link>
              )}
            </div>
            <div className="ms-3">
              {screenType.includes("EmployeeLoan") && (
                <Link to="/EmployeeLoan" className="nav-link" title="Loan">
                  <div class="menu-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-cash-coin me-3"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"
                      />
                      <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z" />
                      <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z" />
                      <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567" />
                    </svg>
                    <span className={collapsed ? "hidden" : ""} class="">
                      Loan
                    </span>
                  </div>
                </Link>
              )}
            </div>
            <div className="ms-3">
              {screenType.includes("Announce") && (
                <Link to="/Announce" className="nav-link" title="Announcement">
                  <div class="menu-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-megaphone-fill me-3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25 25 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009l.496.008a64 64 0 0 1 1.51.048m1.39 1.081q.428.032.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a66 66 0 0 1 1.692.064q.491.026.966.06" />
                    </svg>
                    <span className={collapsed ? "hidden" : ""} class="">
                      Announcement
                    </span>
                  </div>
                </Link>
              )}
            </div>
            <div className="ms-3">
              {screenType.includes("HoliDays") && (
                <Link to="/HoliDays" className="nav-link" title="HoliDays">
                  <div className="menu-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-calendar-check-fill me-3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 .5a.5.5 0 0 1 .5.5V2h6V1a.5.5 0 0 1 1 0v1h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2V1a.5.5 0 0 1 .5-.5zM2 6v8h12V6H2zm9.854 2.854a.5.5 0 0 0-.708-.708L8 11.293 6.854 10.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l4-4z" />
                    </svg>
                    <span className={collapsed ? "hidden" : ""}>Employee Holiday</span>
                  </div>
                </Link>
              )}
            </div>
            <div className="ms-3">
              {screenType.includes("WeekOff") && (
                <Link to="/WeekOff" className="nav-link" title="WeekOff">
                  <div className="menu-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-calendar-weekend-fill me-3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 .5a.5.5 0 0 1 .5.5V2h6V1a.5.5 0 0 1 1 0v1h2a1 1 0 0 1 1 1v2H1V3a1 1 0 0 1 1-1h2V1a.5.5 0 0 1 .5-.5zM1 6h14v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6zm3 1v5h2V7H4zm5 0v5h2V7H9z" />
                    </svg>

                    <span className={collapsed ? "hidden" : ""}>Setting Screen </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
          <div className="menu-item-container">
            <Link to="/PayslipSalaryDays" className="nav-link" title="Payslip Master">
              <div className="menu-item" onClick={togglePayslipCollapse}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-receipt-dollar me-2 Report-font"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-.5.5H2.5a.5.5 0 0 1-.5-.5V1.5zM3 2v12h10V2H3z" />
                  <path d="M5 3.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-9zM6 4v2h4V4H6zm0 3v1h4V7H6zm0 2v2h4v-2H6z" />
                  <path d="M8.5 12.5c.83 0 1.5-.672 1.5-1.5s-.67-1.5-1.5-1.5S7 10.17 7 11s.67 1.5 1.5 1.5z" />
                </svg>

                <span className={collapsed ? "hidden" : ""}>Payslip Master</span>
              </div>
            </Link>
          </div>
          <div className={`collapse ${payslipCollapsed ? "show" : ""}`}>


            {/* <div className="ms-3">
            {screenType.includes("FinancialYear") && (
              <Link to="/FinancialYear" className="nav-link" title="FinancialYear">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-receipt me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z" />
                    {/* <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" /> */}
            {/* </svg>
                  <span className={collapsed ? "hidden" : ""} class=" ">
                  Eligibility salary days
                  </span>
                </div>
              </Link>
            )}
          </div> */}
          </div>
        </div>

         <div className="menu-item" onClick={toggleMastertsCollapse} title="PMS">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-database-gear me-2 Report-font"
            viewBox="0 0 16 16"
          >
            <path d="M4 3c0-1.105 2.239-2 4-2s4 .895 4 2-2.239 2-4 2-4-.895-4-2z" />
            <path d="M2 3v2c0 1.105 2.239 2 4 2s4-.895 4-2V3H2z" />
            <path d="M2 7v2c0 1.105 2.239 2 4 2s4-.895 4-2V7H2z" />
            <path d="M2 11v2c0 1.105 2.239 2 4 2s4-.895 4-2v-2H2z" />
            <path d="M13.635 9.04a3 3 0 0 1 0 5.92M12.5 14h1.5m-1.5-1.5h1.5m-1.5-1.5h1.5" />
          </svg>

          <span className={collapsed ? "hidden" : ""}>PMS </span>
          <div class="PMS-arrow">
            {MastersCollapsed ? <BsChevronDown /> : <BsChevronRight />}
          </div>
        </div>

        <div className={`collapse ${MastersCollapsed ? "show" : ""}`}>
          <div className="menu-item" onClick={toggleMastertsCollapse} title="Maters">

            <span className={collapsed ? "hidden" : ""}>Masters</span>
            <div className="PmsMaster-arrow">
              {MastersCollapsed ? <BsChevronDown /> : <BsChevronRight />}
            </div>
          </div>

          <div className="ms-3">
            {screenType.includes("Project") && (
              <Link to="/Project" className="nav-link" title="Project">
                <div class="menu-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-3" >
                    <path d="M3 4H21V8H3V4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 10H21V20H3V10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 14H17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 18H12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className={collapsed ? "hidden" : ""} class="">
                    Project
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className="ms-3">
            {screenType.includes("ProjectMapping") && (
              <Link to="/ProjectMapping" className="nav-link" title="Project Mapping">
                <div class="menu-item">
                  <svg width="20" height="20" class="me-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="6" cy="6" r="2" fill="#fff" />
                    <circle cx="18" cy="12" r="2" fill="#fff" />
                    <circle cx="6" cy="18" r="2" fill="#fff" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="">
                    Project Mapping
                  </span>
                </div>
              </Link>
            )}
          </div>

          <div className="ms-3">
            {screenType.includes("Task") && (
              <Link to="/Task" className="nav-link" title="Task">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-card-checklist me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0L5.5 8.707a.5.5 0 0 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                    <path d="M4 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4zm0-1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
                    <path d="M8.5 10.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h3zm0-3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h3z" />
                  </svg>

                  <span className={collapsed ? "hidden" : ""} class="">
                    Task
                  </span>
                </div>
              </Link>
            )}
          </div>

          <div className="ms-3">
            {screenType.includes("PMSsettings") && (
              <Link to="/PMSsettings" className="nav-link" title="Task">
                <div class="menu-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="me-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94s-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32 c-0.11-0.2-0.36-0.28-0.57-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.61-0.94L14.5,2.5C14.47,2.22,14.23,2,13.94,2h-3.88 c-0.29,0-0.53,0.22-0.56,0.5L9.15,5.3c-0.58,0.24-1.12,0.56-1.61,0.94L5.15,5.28c-0.21-0.08-0.46,0.02-0.57,0.22L2.66,8.82 c-0.11,0.2-0.06,0.47,0.12,0.61l2.03,1.58C4.74,11.36,4.7,11.68,4.7,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.11,0.2,0.36,0.28,0.57,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.61,0.94l0.35,2.8 c0.03,0.28,0.27,0.5,0.56,0.5h3.88c0.29,0,0.53-0.22,0.56-0.5l0.35-2.8c0.58-0.24,1.12-0.56,1.61-0.94l2.39,0.96 c0.21,0.08,0.46-0.02,0.57-0.22l1.92-3.32c0.11-0.2,0.06-0.47-0.12-0.61L19.14,12.94z M12,15.5c-1.93,0-3.5-1.57-3.5-3.5 s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S13.93,15.5,12,15.5z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="">
                    Setting Screen
                  </span>
                </div>
              </Link>
            )}
          </div>



          <div className="menu-item" onClick={toggleMastertsCollapse} title="Transactions">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-database-gear me-2 Report-font"
              viewBox="0 0 16 16"
            >
              <path d="M4 3c0-1.105 2.239-2 4-2s4 .895 4 2-2.239 2-4 2-4-.895-4-2z" />
              <path d="M2 3v2c0 1.105 2.239 2 4 2s4-.895 4-2V3H2z" />
              <path d="M2 7v2c0 1.105 2.239 2 4 2s4-.895 4-2V7H2z" />
              <path d="M2 11v2c0 1.105 2.239 2 4 2s4-.895 4-2v-2H2z" />
              <path d="M13.635 9.04a3 3 0 0 1 0 5.92M12.5 14h1.5m-1.5-1.5h1.5m-1.5-1.5h1.5" />
            </svg> */}

            <span className={collapsed ? "hidden" : ""}>Transactions</span>
            <div class="PmsTransaction-arrow">
              {MastersCollapsed ? <BsChevronDown /> : <BsChevronRight />}
            </div>
          </div>
          <div className={`collapse ${MastersCollapsed ? "show" : ""}`}>

            {/* <div className="ms-3">
              {screenType.includes("Allocatedproject") && (
                <Link to="/Allocatedproject" className="nav-link" title="DailyTask">
                  <div class="menu-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-card-checklist me-3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0L5.5 8.707a.5.5 0 0 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                      <path d="M4 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4zm0-1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
                      <path d="M8.5 10.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h3zm0-3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h3z" />
                    </svg>

                    <span className={collapsed ? "hidden" : ""} class="">
                      Allocated Project
                    </span>
                  </div>
                </Link>
              )}
            </div> */}
            <div className="ms-3">
              {screenType.includes("OpenTickets") && (
                <Link to="/OpenTickets" className="nav-link" title="Open Tickets">
                  <div class="menu-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-3">
                      <path
                        d="M3 5H21C21.5523 5 22 5.44772 22 6V9C20.8954 9 20 9.89543 20 11C20 12.1046 20.8954 13 22 13V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V13C3.10457 13 4 12.1046 4 11C4 9.89543 3.10457 9 2 9V6C2 5.44772 2.44772 5 3 5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M7 16H17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className={collapsed ? "hidden" : ""} class="">
                      Open Tickets
                    </span>
                  </div>
                </Link>
              )}
            </div>
            <div className="ms-3">
              {screenType.includes("ProjectDetails") && (
                <Link to="/ProjectDetails" className="nav-link" title="Task Update">
                  <div class="menu-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-3">
                      <path d="M7 4H17C18.1 4 19 4.9 19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6C5 4.9 5.9 4 7 4Z"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 2H15C16.1 2 17 2.9 17 4H7C7 2.9 7.9 2 9 2Z"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 14L11 16L15 12"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 8H15"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 11H13"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>


                    <span className={collapsed ? "hidden" : ""} class="">
                      Task Update
                    </span>
                  </div>
                </Link>
              )}
            </div>

          </div>

          <div className="menu-item" onClick={toggleMastertsCollapse} title="Reports">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-database-gear me-2 Report-font"
              viewBox="0 0 16 16"
            >
              <path d="M4 3c0-1.105 2.239-2 4-2s4 .895 4 2-2.239 2-4 2-4-.895-4-2z" />
              <path d="M2 3v2c0 1.105 2.239 2 4 2s4-.895 4-2V3H2z" />
              <path d="M2 7v2c0 1.105 2.239 2 4 2s4-.895 4-2V7H2z" />
              <path d="M2 11v2c0 1.105 2.239 2 4 2s4-.895 4-2v-2H2z" />
              <path d="M13.635 9.04a3 3 0 0 1 0 5.92M12.5 14h1.5m-1.5-1.5h1.5m-1.5-1.5h1.5" />
            </svg> */}

            <span className={collapsed ? "hidden" : ""}>Reports</span>
            <div class="PmsReport-arrow">
              {MastersCollapsed ? <BsChevronDown /> : <BsChevronRight />}
            </div>
          </div>
          <div className={`collapse ${MastersCollapsed ? "show" : ""}`}>

            <div className="ms-3">
              {screenType.includes("TaskHours") && (
                <Link to="/TaskHours" className="nav-link" title="Task Hours & Time Tracking">
                  <div class="menu-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-card-checklist me-3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0L5.5 8.707a.5.5 0 0 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                      <path d="M4 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4zm0-1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
                      <path d="M8.5 10.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h3zm0-3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h3z" />
                    </svg>

                    <span className={collapsed ? "hidden" : ""} class="">
                      Task Hours & Time Tracking
                    </span>
                  </div>
                </Link>
              )}
            </div>

            <div className="ms-3">
              {screenType.includes("ProjectProgress") && (
                <Link to="/ProjectProgress" className="nav-link" title="Project Progress">
                  <div class="menu-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-card-checklist me-3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0L5.5 8.707a.5.5 0 0 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                      <path d="M4 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4zm0-1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
                      <path d="M8.5 10.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h3zm0-3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h3z" />
                    </svg>

                    <span className={collapsed ? "hidden" : ""} class="">
                      Project Progress
                    </span>
                  </div>
                </Link>
              )}
            </div>
            <div className="ms-3">
              {screenType.includes("ProjectChartReport") && (
                <Link to="/ProjectChartReport" className="nav-link" title="Project Chart">
                  <div class="menu-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-card-checklist me-3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0L5.5 8.707a.5.5 0 0 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                      <path d="M4 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4zm0-1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
                      <path d="M8.5 10.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h3zm0-3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h3z" />
                    </svg>

                    <span className={collapsed ? "hidden" : ""} class="">
                      Project Chart Report
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>


      </div>
      <div className="sidebar-footer position-fixed text-center bg-dark pt-2 fw-bold pb-1" style={{ paddingRight: "85px", paddingLeft: "70px" }}>
        <h3 className="">YJK Technologies</h3>
        <h3 className="">Version 1.0.0</h3>
      </div>
    </div>
  );
};

export default Sidebar;
