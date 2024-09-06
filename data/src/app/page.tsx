'use client'

import { useState } from 'react'
import Link from 'next/link' // Use Link from 'next/link' for client-side navigation
import Image from 'next/image'
import Footer from './footer'
import { FloatingDock } from '@/components/ui/floating-dock'
import { IconHome, IconFeather, IconUsers, IconLogin, IconUpload } from '@tabler/icons-react'
import ParticleBackground from '@/components/ui/particle-chain'

export default function Home() {
  const [showFAQs, setShowFAQs] = useState(false)

  const navItems = [
    { title: 'Home', icon: <IconHome className="h-25 w-25" />, href: '/' },
    { title: 'Features', icon: <IconFeather className="h-25 w-25" />, href: '#features' },
    { title: 'Upload', icon: <IconUpload className="h-25 w-25" />, href: '/upload' },
    { title: 'Login/Sign Up', icon: <IconLogin className="h-25 w-25" />, href: '/login' },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bod relative min-h-screen"> 
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>
      <FloatingDock 
        items={navItems} 
        desktopClassName="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        mobileClassName="fixed bottom-4 right-4 z-50"
      />
      {!showFAQs ? (
        <>
          <div className="relative z-[1] flex items-center justify-center before:absolute before:h-[400px] before:w-[400px] before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[400px] after:w-[400px] after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-3xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40">
            <div className="text-container">
              <h1 className="text-white text-5xl font-extrabold">ENIGMA 2.0</h1>
            </div>
          </div>

          <div className="relative mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left z-[1] ">
            <a
              href="/dochistory"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 mb-10"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                DocHistory{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">
                Get your previously uploaded documents, ready to share
              </p>
            </a>

            <a
              href="/how-to-use"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 mb-10"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                How to Use{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">
                A full image based flow-chart showing the working of the website
              </p>
            </a>

            <a
              href="/about.html"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 mb-10"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                About Enigma2{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">
                Discover our platform: Detect and Detach (D2 approach) PII
              </p>
            </a>

            {/* Use <Link> for client-side navigation */}
            <Link
              href="/faqs"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 mb-1 cursor-pointer"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                FAQs {" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
                Curious? We've Got Answers
              </p>
            </Link>
          </div>
        </>
      ) : null}
      <Footer />
    </main>
  )
}