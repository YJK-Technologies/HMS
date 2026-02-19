import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NewSideBar.css";
import logo from './main.png'

// Bootstrap Icons from react-icons
import {
  BsPeopleFill,
  BsWrenchAdjustable,
  BsPersonVcard,
  BsCalendarEvent,
  BsChevronDown,
} from "react-icons/bs";

const menuData = [
  {
    label: "Admin",
    icon: BsPeopleFill,
    isDropdown: true,
    subMenus: [
      { label: "Company", path: "/Company" },
      { label: "Company Mapping", path: "/CompanyMapping" },
      { label: "Location", path: "/Location" },
      { label: "Role", path: "/Role" },
      { label: "Role Mapping", path: "/UserRoleMapping" },
      { label: "Role Rights", path: "/UserRights" },
      { label: "User", path: "/User" },
    ],
  },
  {
    label: "Masters",
    icon: BsWrenchAdjustable,
    isDropdown: true,
    subMenus: [
      { label: "Attribute", path: "/Attribute" },
      { label: "Print Templates", path: "/TemplateDesign" },
      { label: "Bank Account", path: "/BankAccount" },
      { label: "Barcode Generator", path: "/BarcodeGenerator" },
      { label: "Barcode Scanner", path: "/BarcodeScanner" },
      { label: "Department", path: "/Department" },
      { label: "Designation Info", path: "/DesgiantionInfo" },
      { label: "Intermediary", path: "/Intermediary" },
      { label: "Number Series", path: "/NumberSeries" },
      { label: "Warehouse", path: "/Warehouse" },
      { label: "Financial Year Access", path: "/FinancialYearAccess" },
    ],
  },
  {
    label: "HCM",
    icon: BsPersonVcard,
    isDropdown: true,
    subMenus: [
      { label: "Admin Dashboard", path: "/ESSDashboard" },
      { label: "Employee Dashboard", path: "/EmployeeDashboard" },
      { label: "Employee Info", path: "/AddEmployeeInfo" },
      { label: "Payslip Master", path: "/PayslipSalaryDays" },
      {
        label: "Masters",
        isDropdown: true,
        subMenus: [
          { label: "Grade", path: "/EmployeeGrade" },
          { label: "Leave", path: "/EmpLeave" },
          { label: "Loan", path: "/EmployeeLoan" },
          { label: "Announcement", path: "/Announce" },
          { label: "Employee Holiday", path: "/HoliDays" },
          { label: "Setting Screen", path: "/WeekOff" },
        ],
      },
    ],
  },
  {
    label: "PMS",
    icon: BsCalendarEvent,
    isDropdown: true,
    subMenus: [
      {
        label: "Masters",
        isDropdown: true,
        subMenus: [
          { label: "Project", path: "/Project" },
          { label: "Project Mapping", path: "/ProjectMapping" },
          { label: "Task", path: "/Task" },
          { label: "Setting Screen", path: "/PMSsettings" },
        ],
      },
      {
        label: "Transactions",
        isDropdown: true,
        subMenus: [
          { label: "Open Tickets", path: "/OpenTickets" },
          { label: "Task Update", path: "/ProjectDetails" },
        ],
      },
      {
        label: "Reports",
        isDropdown: true,
        subMenus: [
          { label: "Task Hours & Time Tracking", path: "/TaskHours" },
          { label: "Project Progress", path: "/ProjectProgress" },
          { label: "Project Chart Report", path: "/ProjectChartReport" },
        ],
      },
    ],
  }
];

const secondaryMenuData = [
  { label: "YJK TECHNOLOGIES" },
  { label: "Version 1.0.0" },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const toggleDropdown = (key) => {
    setOpenMenus((prev) => {
      const newState = {};

      if (prev[key]) {
        return { ...prev, [key]: false };
      }

      Object.keys(prev).forEach((k) => {
        if (k.startsWith(key) || key.startsWith(k)) {
          newState[k] = prev[k];
        }
      });

      newState[key] = true;

      return newState;
    });
  };

  const renderMenuItem = (item, keyPrefix) => {
    const Icon = item.icon;
    const isOpen = openMenus[keyPrefix];
    const isActive = location.pathname === item.path;
    const isSubActive = item.subMenus?.some(s => s.path === location.pathname);

    return (
      <li
        key={keyPrefix}
        className={`nav-item ${isOpen ? "open" : ""} ${isActive || isSubActive ? "active" : ""}`}
      >
        {item.isDropdown ? (
          <div className="nav-link" onClick={() => toggleDropdown(keyPrefix)}>
            {Icon && <Icon className="menu-icon" size={18} />}
            <span className="nav-label">{item.label}</span>
            <BsChevronDown className={`dropdown-arrow ${isOpen ? "rotated" : ""}`} />
          </div>
        ) : (
          <Link to={item.path} className="nav-link">
            {Icon && <Icon className="menu-icon" size={18} />}
            <span className="nav-label">{item.label}</span>
          </Link>
        )}

        {item.subMenus && (
          <ul className={`dropdown-list ${isOpen ? "show" : ""}`}>
            {item.subMenus.map((sub, i) => {
              const subKey = `${keyPrefix}-${i}`;
              return sub.isDropdown
                ? renderMenuItem(sub, subKey)
                : (
                  <li key={subKey}>
                    <Link
                      to={sub.path}
                      className={`dropdown-item text-wrap ${location.pathname === sub.path ? "active" : ""}`}
                    >
                      {sub.label}
                    </Link>
                  </li>
                );
            })}
          </ul>
        )}
      </li>
    );
  };


  return (
    <>
      <button className={`mobile-menu-btn ${collapsed ? "show" : "hide"}`} onClick={() => setCollapsed(false)}>
        <i className="bi bi-list classic-icon" ></i>
      </button>

      <aside className={`sidebar ${collapsed ? "collapsed" : "open"} ${collapsed ? "" : "mobile-open"}`}>
        <header className="sidebar-header">
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "100%", 
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <button className="sidebar-toggler" onClick={() => setCollapsed(!collapsed)}>
            <i className={`bi bi-chevron-left classic-chevron ${collapsed ? "rotated" : ""}`}></i>
          </button>
        </header>

        <nav className="sidebar-nav">
          <ul className="nav-list primary-nav">{menuData.map((item, i) => renderMenuItem(item, String(i)))}</ul>
          <ul className="sidebar-footer">
            {secondaryMenuData.map((item, i) => (
              <li key={i} className="footer-item">
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;