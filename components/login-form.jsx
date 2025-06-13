"use client"
import { GalleryVerticalEnd, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signinAction } from "@/scripts/auth-action"
import { useActionState } from "react"
import Image from "next/image"

export function LoginForm({
  className,
  ...props
}) {

  const handleLogin = async (prevState, formData) => {
    try {
      await signinAction({ email: formData.get("email") })
    } catch (error) {

    }
  }

  const [state, formAction, isPending] = useActionState(handleLogin, { error: "", status: "INITIAL" })
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={formAction} >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="w-[4rem] aspect-square rounded-2xl bg-white flex justify-center items-center" >
                <div className="w-[90%] h-[90%] relative" >
                  <Image src="/black_logo.png" alt="logo" fill className="h-full w-full object-cover" />
                </div>
              </div>
              <span className="sr-only">Panthar InfoHub Pvt. Ltd.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Panthar InfoHub</h1>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="m@example.com" required />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </div>

        </div>
      </form>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
