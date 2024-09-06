"use client";

import React, {useState} from "react";
// import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Mail} from 'lucide-react'
import Link from 'next/link'; 
import { motion, AnimatePresence } from 'framer-motion'
import { WavyBackground } from "@/components/ui/wavy-background"

export default function AuroraBackgroundDemo() {
  const [isLogin, setIsLogin] = useState(true)

  const toggleForm = () => setIsLogin(!isLogin)
  return (
      <WavyBackground className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800 rounded-xl shadow-2xl p-8 z-50">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            {isLogin ? "Log in to your account" : "Create a new account"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleForm} className="ml-1 font-medium text-blue-500 hover:text-blue-400">
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 space-y-6"
            action="#"
            method="POST"
          >
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <Label htmlFor="email-address" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              {!isLogin && (
                <div>
                  <Label htmlFor="mobile-number" className="sr-only">
                    Mobile number
                  </Label>
                  <Input
                    id="mobile-number"
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Mobile number"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              {!isLogin && (
                <div>
                  <Label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                  />
                </div>
              )}
            </div>

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLogin ? "Log in" : "Sign up"}
              </Button>
            </div>
          </motion.form>
        </AnimatePresence>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-700 hover:bg-gray-600"
            >
              <Github className="h-5 w-5 mr-2" />
              <span>GitHub</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-700 hover:bg-gray-600"
            >
              <Mail className="h-5 w-5 mr-2" />
              <span>Gmail</span>
            </Button>
          </div>
        </div>
        <div className="text-center">
            <Link href="./forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
              Forgot your password?
            </Link>
          </div>
      </div>
    </WavyBackground>
  );
}
