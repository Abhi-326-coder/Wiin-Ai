import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"

export function SignUpForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const handleSignUp = async (e)=>{
    e.preventDefault();
    setError(null);

    try {
        await signup({ fullName, email, password });
        navigate("/dashboard");
    } catch (error) {
        const message = error?.message || "Unable to sign up";
        setError(message);
    }
  }
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to Create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">FullName</FieldLabel>
                    <Input id="fullName" type="text" placeholder="fullname" value={fullName} onChange={(e)=>setFullName(e.target.value)} required />
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                </Field>
                <Field>
                    <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                    </a>
                    </div>
                    <Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                    <p className="text-sm text-red-500">{error ? error : null}</p>
                </Field>
                <Field>
                    <Button type="submit" disabled={isSigningUp}>
                        {isSigningUp ? "Creating Account..." : "Create Account"}
                    </Button>
                    
                    <FieldDescription className="text-center">
                    Already have an Account? <a href="/login">Sign in</a>
                    </FieldDescription>
                </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
