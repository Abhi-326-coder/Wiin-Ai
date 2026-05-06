import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
// import logo from "@/assets/logo.png"
const Navbar = () => {
  const navigate = useNavigate();
  const handleSignup = ()=>{
    navigate('/signup')
  }
  const handleLogin = ()=> {
    navigate('/login')
  }
  return (
    <div>
        <nav className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold flex  items-center">
                <p>WiinAi</p>
            </h1>
            <div >
              <Button variant="outline" onClick={handleLogin}>Login</Button>
              <Button variant="outline" onClick={handleSignup}>Sign up</Button>
            </div>
        </nav>
    </div>
  )
}

export default Navbar