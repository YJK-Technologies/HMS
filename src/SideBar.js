import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import { User, Users, UserCircle, Stethoscope } from "lucide-react";
import { CardText, Book } from "react-bootstrap-icons";
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
        <div className=" mt-5">
          <Link to="/HMSDashboard" class="nav-link" title="Dashboard">
            <div class="menu-item">
              <i class="bi bi-speedometer2 me-2 fs-5" ></i>
              <span className={collapsed ? "hidden" : ""}> Dashboard</span>
            </div>
          </Link>
        </div>
        <div className="menu-item" onClick={toggleAdminCollapse} title="Admin">
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
                    Company
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
                    Company Mapping
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
                    Attribute
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("SearchDoctor") && (
              <Link to="/SearchDoctor" className="nav-link" title="Doctor">
                <div class="menu-item">
                  <Stethoscope size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""} class="ms-1">
                    Doctor
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("SearchClient") && (
              <Link to="/SearchClient" className="nav-link" title="Client">
                <div class="menu-item">
                  <User size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""} class="ms-1">
                    Client
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("SearchPatient") && (
              <Link to="/SearchPatient" className="nav-link" title="Patient">
                <div class="menu-item">
                  <UserCircle size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""} class="ms-1">
                    Patient
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("ServiceGrid") && (
              <Link to="/ServiceGrid" className="nav-link" title="Service">
                <div class="menu-item">
                  <Book size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""} class="ms-1">
                    Service
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
        <div className={`collapse ${accountCollapsed ? "show" : ""}`}>
          <div className="ms-3">
            {screenType.includes("BaseAccount") && (
              <Link to="/BaseAccount" className="nav-link" title="Base Account">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-file-text me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 4a.5.5 0 0 1 .5-.5h3A.5.5 0 0 1 10 4v1H6V4zM3 1h10a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 3v1h8V3H4zM5 6h6v1H5V6zM5 8h6v1H5V8zM5 10h6v1H5v-1z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""}>
                    Base Account
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("AccountName") && (
              <Link to="/AccountName" className="nav-link" title="Chart Of Accounts">
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
                  <span className={collapsed ? "hidden" : ""} class="ms-1">
                    Chart Of Accounts
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("BaseAccount") && (
              <Link to="/StandardAccount" className="nav-link" title="Standard Account">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-file-text me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 4a.5.5 0 0 1 .5-.5h3A.5.5 0 0 1 10 4v1H6V4zM3 1h10a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 3v1h8V3H4zM5 6h6v1H5V6zM5 8h6v1H5V8zM5 10h6v1H5v-1z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""}>
                    Standard Account
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("UserAccountGroup") && (
              <Link to="/UserAccountGroup" className="nav-link" title="User Account Group">
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
                    User Account Group
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
        <div className="menu-item" onClick={toggleTransactionsCollapse} title="Transactions">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-cash-stack me-2 Trans-font"
            viewBox="0 0 16 16"
          >
            <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
            <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
          </svg>
          <span className={collapsed ? "hidden" : ""}>Transactions</span>
          <div class="transaction-arrow">
            {TransactionsCollapsed ? <BsChevronDown /> : <BsChevronRight />}
          </div>
        </div>
        <div className={`collapse ${TransactionsCollapsed ? "show" : ""}`}>
          <div className="menu-item" onClick={toggleSalesCollapse} title="Sales">
            <span className={collapsed ? "hidden" : ""}>Billing</span>
            <div class="sales-arrow">
              {salesCollapsed ? <BsChevronDown /> : <BsChevronRight />}
            </div>
          </div>
          <div className={`collapse ${salesCollapsed ? "show" : ""}`}>
            <div className=" ms-3">
              {screenType.includes("Sales") && (
                <Link
                  to="/Sales"
                  className="nav-link"
                  title="Billing"
                  onClick={() => handleLinkClick("Sales")}
                >
                  <div class="menu-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                      class="bi bi-credit-card me-3" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4z" />
                      <path d="M0 7h16v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7zm3 2a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3z" />
                    </svg>
                    <span className={collapsed ? "hidden" : ""} class="ms-1">
                      Billing Entry
                    </span>
                  </div>
                </Link>
              )}
            </div>
            <div className="ms-3">
              {screenType.includes("MothersScan") && (
                <Link to="/MothersScan" className="nav-link" title="ANC Mothers Scan">
                  <div className="menu-item d-flex align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 64 64"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="me-2"
                    >
                      <circle cx="32" cy="16" r="8" />
                      <path d="M16 54c0-10 8-18 16-18s16 8 16 18H16z" />
                      <circle cx="32" cy="42" r="6" />
                      <path d="M29 42c0-2 2-4 3-4s3 2 3 4" />
                      <path d="M42 40c3 2 3 6 0 8" />
                      <path d="M46 38c5 4 5 10 0 14" />
                    </svg>

                    <span className={`ms-1 ${collapsed ? "hidden" : ""}`}>
                      ANC Mothers Scan
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
