import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
function ProtectedLayout({ children }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Home",
      icon: <i className="ri-home-3-line"></i>,
      path: "/",
    },
    {
      title: "Transactions",
      icon: <i className="ri-exchange-dollar-line"></i>,
      path: "/transactions",
    },
    {
      title: "Requests",
      icon: <i className="ri-hand-coin-line"></i>,
      path: "/requests",
    },
    {
      title: "Profile",
      icon: <i className="ri-user-3-line"></i>,
      path: "/profile",
    },
    {
      title: "Logout",
      icon: <i className="ri-logout-box-line"></i>,
      path: "/logout",
    },
  ];

  if (user?.isAdmin) {
    menuItems.splice(1, 0, {
      title: "Users",
      icon: <i className="ri-user-settings-line"></i>,
      path: "/users",
    });
  }

  const handleMenuClick = (path) => {
    if (path === "/logout") {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="layout">
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Logo Section */}
        <div className="logo-section">
          <h1 className="text-2xl font-bold text-center text-primary mb-8">
            E-Waves
          </h1>
        </div>

        {/* Menu Section */}
        <div className="menu-container">
          <div className="menu">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={index}
                  className={`menu-item ${isActive ? "active-menu-item" : ""}`}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <div className="menu-icon">{item.icon}</div>
                  {!collapsed && <h1 className="menu-title">{item.title}</h1>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Collapse Button */}
        <div className="collapse-button">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-icon"
          >
            <i
              className={`ri-arrow-${collapsed ? "right" : "left"}-s-line`}
            ></i>
          </button>
        </div>
      </div>

      <div className="body">
        <div className="header">
          <div className="header-left">
            <div className="network-selector">
              <span className="network-indicator"></span>
              <span className="network-name">Connected</span>
            </div>
          </div>

          <div className="header-center">
            <h1 className="wallet-title"></h1>
          </div>

          <div className="header-right">
            <div className="account-info">
              <span className="account-name">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>
        </div>

        <div className="content">{children}</div>
      </div>
    </div>
  );
}

const BaseButton = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

const PrimaryButton = ({ children, className = "", ...props }) => (
  <BaseButton
    className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
    {...props}
  >
    {children}
  </BaseButton>
);

const SuccessButton = ({ children, className = "", ...props }) => (
  <BaseButton
    className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    {...props}
  >
    {children}
  </BaseButton>
);

const DangerButton = ({ children, className = "", ...props }) => (
  <BaseButton
    className={`bg-red-600 hover:bg-red-700 text-white ${className}`}
    {...props}
  >
    {children}
  </BaseButton>
);

export { PrimaryButton, SuccessButton, DangerButton };

export default ProtectedLayout;
