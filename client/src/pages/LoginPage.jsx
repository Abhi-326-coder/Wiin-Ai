import { LoginForm } from "@/components/login-form"
const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <LoginForm className="w-full max-w-sm" />
    </div>
  )
}

export default LoginPage