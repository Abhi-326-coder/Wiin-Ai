// components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { Clock, Eye, ImageIcon, MessageCircle, Settings } from "lucide-react";
import LogOutBtn from "./LogOutBtn";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-white text-black font-medium shadow-sm"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="flex h-screen w-64 flex-col justify-between border-r border-gray-800 bg-black text-white">
      <div className="p-4">
        <h2 className="mb-6 text-2xl font-semibold tracking-wide">
          Wiin<span className="text-gray-400">AI</span>
        </h2>

        <div className="space-y-2">
          <NavLink to="/dashboard/chat" end className={linkClass}>
            <MessageCircle className="size-4" />
            New Chat
          </NavLink>

          <NavLink to="/dashboard/history" className={linkClass}>
            <Clock className="size-4" />
            History
          </NavLink>

          <NavLink to="/dashboard/settings" className={linkClass}>
            <Settings className="size-4" />
            Settings
          </NavLink>

          <NavLink to="/dashboard/image" className={linkClass}>
            <ImageIcon className="size-4" />
            Generate Image
          </NavLink>

          <NavLink to="/dashboard/vision" className={linkClass}>
            <Eye className="size-4" />
            Vision Service
          </NavLink>
        </div>
      </div>

      <div className="border-t border-gray-800 p-4">
        <LogOutBtn />
      </div>
    </div>
  );
}
