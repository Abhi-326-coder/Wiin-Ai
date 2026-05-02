// components/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${
      isActive ? "bg-gray-700" : "hover:bg-gray-800"
    }`;

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">WiinAi</h2>

      <NavLink to="/dashboard" end className={linkClass}>
        New chat
      </NavLink>

      <NavLink to="/dashboard/history" className={linkClass}>
        History
      </NavLink>

      <NavLink to="/dashboard/settings" className={linkClass}>
        Settings
      </NavLink>
    </div>
  );
}