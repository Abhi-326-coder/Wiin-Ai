import { LoginForm } from "@/components/login-form"
import Navbar from "@/components/Navbar"
const LoginPage = () => {
  return (
  <div className="min-h-screen bg-gray-100">
    <Navbar/>
    <div className="flex items-center justify-center mt-25">
        <LoginForm className="w-full max-w-sm" />
    </div>

  </div>
    
  )
}

export default LoginPage