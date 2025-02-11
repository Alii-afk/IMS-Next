import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie"; // Import js-cookie
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  ChartPieIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { FaBatteryFull, FaWarehouse } from "react-icons/fa";
import {
  MdOutlineCancelScheduleSend,
  MdOutlineManageAccounts,
  MdOutlineWarehouse,
  MdPendingActions,
  MdWifiProtectedSetup,
} from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(null); // Add a state for role
  const [name, setName] = useState(null); // Add a state for name
  const router = useRouter();

  useEffect(() => {
    setRole(Cookies.get("role"));
    setName(Cookies.get("name"));
  }, []);

  const handleLogout = async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_MAP_KEY}/api/logout`;

    try {
      // Call the API to handle logout
      await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        }
      );
      Cookies.remove("authToken");
      Cookies.remove("role");
      Cookies.remove("name");

      setTimeout(() => {
        toast.success("Logout successful!");
      }, 3000); 
      // Redirect to the home page
      router.push("/");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          setTimeout(() => {
            toast.warn("Session expired. Redirecting to login...");
          }, 3000); 
          Cookies.remove("authToken");
          Cookies.remove("role");
          Cookies.remove("name");
          router.push("/");
        } else {
          setTimeout(() => {
            toast.error( `Error: ${data.message || "Unexpected error during logout."}`);
          }, 3000); 
        }
      } else {
        setTimeout(() => {
          toast.error("Network error. Please try again.");
        }, 3000); 
      }
    }
  };

  // Full navigation for admin
  const fullNavigation = [
    { name: "Home", href: "/sidebarpages/home", icon: HomeIcon, current: true },
    // {
    //   name: "Add Request Form",
    //   href: "/sidebarpages/add-request-form",
    //   icon: UsersIcon,
    //   current: false,
    // },
    {
      name: "Request Management",
      href: "/sidebarpages/request-management",
      icon: FolderIcon,
      current: false,
    },
    {
      name: "Pending Request",
      href: "/sidebarpages/pending-request",
      icon: MdPendingActions,
      current: false,
    },
    {
      name: "Approved",
      href: "/sidebarpages/approved",
      icon: DocumentDuplicateIcon,
      current: false,
    },
    {
      name: "Completed",
      href: "/sidebarpages/completed",
      icon: FaBatteryFull,
      current: false,
    },
    {
      name: "Rejected",
      href: "/sidebarpages/rejected-request",
      icon: MdOutlineCancelScheduleSend,
      current: false,
    },
    {
      name: "Stock Setup",
      href: "/sidebarpages/setting-page",
      icon: MdWifiProtectedSetup,
      current: false,
    },
    {
      name: "Add Warehouse Stock",
      href: "/sidebarpages/add-stock",
      icon: FaWarehouse,
      current: false,
    },
    {
      name: "Warehouse Stocks",
      href: "/sidebarpages/stock-management",
      icon: MdOutlineWarehouse,
      current: false,
    },
    {
      name: "Programming Stocks",
      href: "/sidebarpages/programming-stock",
      icon: MdOutlineWarehouse,
      current: false,
    },
    {
      name: "Admin Profile",
      href: "/sidebarpages/profile",
      icon: GrUserManager,
      current: false,
    },
    {
      name: "User Management",
      href: "/sidebarpages/user-management",
      icon: UsersIcon,
      current: false,
    },
  ];

  // Navigation for backoffice role
  const backofficeNavigation = [
    { name: "Home", href: "/sidebarpages/home", icon: HomeIcon, current: true },

    {
      name: "Approved",
      href: "/sidebarpages/approved",
      icon: DocumentDuplicateIcon,
      current: false,
    },
    {
      name: "Completed",
      href: "/sidebarpages/completed",
      icon: FaBatteryFull,
      current: false,
    },
    {
      name: "Add Warehouse Stock",
      href: "/sidebarpages/add-stock",
      icon: FaWarehouse,
      current: false,
    },
    {
      name: "Stock Management",
      href: "/sidebarpages/stock-management",
      icon: MdOutlineManageAccounts,
      current: false,
    },
    {
      name: "Profile",
      href: "/sidebarpages/profile",
      icon: GrUserManager,
      current: false,
    },
  ];

  const frontofficeNavigation = [
    { name: "Home", href: "/sidebarpages/home", icon: HomeIcon, current: true },

    {
      name: "Request Management",
      href: "/sidebarpages/request-management",
      icon: FolderIcon,
      current: false,
    },
    {
      name: "Add Request Form",
      href: "/sidebarpages/add-request-form",
      icon: UsersIcon,
      current: false,
    },
    {
      name: "Pending Request",
      href: "/sidebarpages/pending-request",
      icon: MdPendingActions,
      current: false,
    },
    {
      name: "Approved",
      href: "/sidebarpages/approved",
      icon: DocumentDuplicateIcon,
      current: false,
    },
    {
      name: "Completed",
      href: "/sidebarpages/completed",
      icon: FaBatteryFull,
      current: false,
    },
    {
      name: "Rejected",
      href: "/sidebarpages/rejected-request",
      icon: MdOutlineCancelScheduleSend,
      current: false,
    },
    {
      name: "Profile",
      href: "/sidebarpages/profile",
      icon: GrUserManager,
      current: false,
    },
    // {
    //   name: "Setting",
    //   href: "/sidebarpages/setting-page",
    //   icon: ChartPieIcon,
    //   current: false,
    // },
  ];

  // Select navigation based on the role
  let navigation;
  if (role === "admin") {
    navigation = fullNavigation;
  } else if (role === "backoffice") {
    navigation = backofficeNavigation;
  } else if (role === "frontoffice") {
    navigation = frontofficeNavigation;
  }

  // Close sidebar on outside click for mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest(".sidebar")) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  let logoSrc;

  if (role === "admin") {
    logoSrc = "/images/admin.jpg";
  } else if (role === "backoffice") {
    logoSrc = "/images/backoffice.jpg";
  } else if (role === "frontoffice") {
    logoSrc = "/images/frontoffice.jpg";
  }
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 md:left-4 right-4 z-40 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {sidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar 
      fixed 
      top-0 
      left-0 
      h-screen 
      bg-white 
      shadow-lg 
      transform 
      transition-transform 
      duration-300 
      ease-in-out
      ${sidebarOpen ? "translate-x-0 z-40" : "-translate-x-full"}
      lg:translate-x-0 
      flex 
      flex-col 
      w-72 
      overflow-y-auto
    `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-center">
          <img
            src={"/images/logo.jpg"}
            alt="Logo"
            className="w-32 h-auto object-contain"
          />
        </div>

        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={logoSrc}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
              <p className="text-base text-gray-500">
                {role === "admin" ? "Admin" : role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-grow overflow-y-auto hide-scrollbar">
          {navigation?.map((item) => {
            const isActive = router.pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                passHref
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <IconComponent
                  className={`h-6 w-6 flex-shrink-0 ${
                    isActive ? "text-indigo-600" : "text-gray-400"
                  }`}
                />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="w-full text-base text-gray-500 hover:text-gray-700 bg-gray-100 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
