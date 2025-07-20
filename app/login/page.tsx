import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { RedirectIfAuthenticated } from "@/lib/utils/redirect-if-authenticated"

export default function LoginPage() {
  return (
    <RedirectIfAuthenticated>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              TrueNumber
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <LoginForm />
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Gaming setup with numbers and technology"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </RedirectIfAuthenticated>
  )
}
