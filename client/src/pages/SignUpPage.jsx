import {SignUpForm} from '../components/signup-form'
import Navbar from '@/components/Navbar'
const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
    <Navbar/>
    <div className="flex items-center justify-center mt-25">
        <SignUpForm className="w-full max-w-sm" />
    </div>

  </div>
  )
}

export default SignUpPage