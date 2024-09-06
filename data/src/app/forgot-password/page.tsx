"use client";

import { useState } from "react"
import Link from "next/link"
import { WavyBackground } from "@/components/ui/wavy-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState("email")

  return (
    <WavyBackground className="h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="w-full max-w-md space-y-8 bg-white/80 p-8 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Forgot Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email or mobile number to receive a password reset OTP.
            </p>
          </div>
          <form className="mt-8 space-y-6">
            <RadioGroup value={method} onValueChange={setMethod} className="flex justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile" id="mobile" />
                <Label htmlFor="mobile">Mobile</Label>
              </div>
            </RadioGroup>

            <div>
              <Label htmlFor="contact" className="sr-only">
                {method === "email" ? "Email address" : "Mobile number"}
              </Label>
              <Input
                id="contact"
                name="contact"
                type={method === "email" ? "email" : "tel"}
                autoComplete={method === "email" ? "email" : "tel"}
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder={method === "email" ? "Email address" : "Mobile number"}
              />
            </div>

            <div>
              <Button type="submit" className="w-full">
                Send OTP
              </Button>
            </div>
          </form>
          <div className="text-center">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </WavyBackground>
  )
}