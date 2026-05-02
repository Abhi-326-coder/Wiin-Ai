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
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export function SignUpForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e)=>{
    e.preventDefault();

    try {
        setIsLoading(true);
        
        const response = await fetch("/api/auth/signup",{
            method:"POST",
            headers:{
                "Content-Type" : "application/json"
            },
            credentials:"include",
            body:JSON.stringify({fullName, email, password})
        });
        let data = null;
        try{
            data = await response.json();
        }catch{
            data = null;
        }
        if(!response.ok){
            setError(data?.messsage || data?.error)
            throw new Error(data?.messsage || data?.error || "Sign up failed")
        }
        toast.success("Account Created Successfully")
        navigate("/")
    } catch (error) {
        const message = error?.message || "Unable to login";
        console.log(message);
        toast.error(message);
    }finally{
        setIsLoading(false);
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
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
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
