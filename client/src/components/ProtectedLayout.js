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
      <div className="sidebar">
        <div className="menu">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={index}
                className={`menu-item ${isActive ? "active-menu-item" : ""}`}
                onClick={() => handleMenuClick(item.path)}
              >
                {item.icon}
                {!collapsed && <h1 className=" text-s">{item.title}</h1>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="body">
        <div className="header flex justify-between items-center text-secondary ">
          <div className="">
            <i
              className={collapsed ? "ri-menu-line" : "ri-close-fill"}
              onClick={() => setCollapsed(!collapsed)}
            ></i>
          </div>
          <div>
            <h1 className="text-xl text-secondary">DIGITAL WALLET</h1>
          </div>
          <div>
            <h1 className="text-s underline ">
              {user?.firstName} {user?.lastName}
            </h1>
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default ProtectedLayout;
