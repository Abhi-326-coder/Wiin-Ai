// components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import LogOutBtn from "./LogOutBtn";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-white text-black font-medium shadow-sm"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="h-screen w-64 bg-black text-white flex flex-col justify-between border-r border-gray-800">
      
      {/* Top Section */}
      <div className="p-4">
        
        {/* Logo / Title */}
        <h2 className="text-2xl font-semibold mb-6 tracking-wide">
          Wiin<span className="text-gray-400">AI</span>
        </h2>

        {/* Navigation */}
        <div className="space-y-2">
          <NavLink to="/dashboard/chat" end className={linkClass}>
            💬 New Chat
          </NavLink>

          <NavLink to="/dashboard/history" className={linkClass}>
            🕘 History
          </NavLink>

          <NavLink to="/dashboard/settings" className={linkClass}>
            ⚙️ Settings
          </NavLink>
          <NavLink to="/dashboard/image" className={linkClass}>
            ⚙️ Generate Image
          </NavLink>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-800">
        <LogOutBtn />
      </div>
    </div>
  );
}