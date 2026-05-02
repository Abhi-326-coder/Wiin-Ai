import { Outlet } from "react-router-dom";
import Sidebar from '../components/Sidebar'

const DashBoardLayout = () => {
  return (
    <div>
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default DashBoardLayout