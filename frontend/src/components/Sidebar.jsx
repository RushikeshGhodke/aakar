import './Sidebar.css';
import { FiMenu, FiClipboard, FiBriefcase, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from "./LogoutButton.jsx";
import { BsTicket } from "react-icons/bs";
import { PiOfficeChair } from "react-icons/pi";
import { MdOutlineModelTraining } from "react-icons/md";
import { useState } from 'react';

// Utility to map icon strings to actual icon components
const iconMap = {
    FiClipboard: <FiClipboard size={22} color="white" />,
    FiBriefcase: <FiBriefcase size={22} color="white" />,
    FiUser: <FiUser size={22} color="white" />,
    BsTicket: <BsTicket size={22} color="white" />,
    PiOfficeChair: <PiOfficeChair size={22} color="white" />,
    MdOutlineModelTraining: <MdOutlineModelTraining size={22} color="white" />,
};

const Sidebar = () => {
    const navigate = useNavigate();
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection((prev) => (prev === section ? null : section));
    };

    const closeSubmenus = () => {
        setOpenSection(null);
    };


    const navItems = [
        {
            name: "HR Management",
            icon: "FiClipboard",
            children: [
                { name: "Employees", slug: "/employees", icon: "FiUser" },
                { name: "Departments", slug: "/departments", icon: "FiBriefcase" },
                { name: "Designations", slug: "/designations", icon: "PiOfficeChair" },
            ],
        },
        {
            name: "Ticket Tracking",
            icon: "BsTicket",
            children: [
                { name: "Create Ticket", slug: "/create-ticket", icon: "BsTicket" },
                { name: "View Tickets", slug: "/view-tickets", icon: "BsTicket" },
            ],
        },
        {
            name: "Training",
            icon: "MdOutlineModelTraining",
            children: [
                { name: "Upcoming", slug: "/upcoming", icon: "BsTicket" },
                { name: "Completed", slug: "/completed", icon: "BsTicket" },
            ],
        },
    ];

    return (
        <div className="sidebar" onMouseLeave={closeSubmenus}>
            <div>
                <FiMenu className="menu-icon" size={22} color="white" />
                <div className="menu">
                    {navItems.map((item) => (
                        <div key={item.name}>
                            <div
                                className="icon-container main-item"
                                onClick={() => item.children && toggleSection(item.name)}
                            >
                                <div className="main-item-content">
                                    {iconMap[item.icon]}
                                    <span className="menu-text">{item.name}</span>
                                </div>
                                {item.children && (
                                    <span className="chevron">
                                        {openSection === item.name ? (
                                            <FiChevronUp size={18} color="white" />
                                        ) : (
                                            <FiChevronDown size={18} color="white" />
                                        )}
                                    </span>
                                )}
                            </div>
                            {item.children && (
                                <div
                                    className={`submenu ${
                                        openSection === item.name ? "expanded" : ""
                                    }`}
                                >
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.name}
                                            to={child.slug}
                                            className="icon-container"
                                        >
                                            {iconMap[child.icon]}
                                            <span className="menu-text">{child.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <LogoutButton />
            </div>
        </div>
    );
};

export default Sidebar;
