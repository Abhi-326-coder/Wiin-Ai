import { Button } from "./ui/button"
// import logo from "@/assets/logo.png"
const Navbar = () => {
  return (
    <div>
        <nav className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold flex  items-center">
                <p>WiinAi</p>
            </h1>
            <Button variant="outline">Sign Up</Button>
        </nav>
    </div>
  )
}

export default Navbar