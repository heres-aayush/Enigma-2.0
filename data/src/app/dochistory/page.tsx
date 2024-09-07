'use client'

import React, { useState } from 'react'
import { WavyBackground } from '@/components/ui/wavy-background'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'
import Link from 'next/link'

interface Document {
  id: string
  name: string
  uploadDate: string
  description: string
}

const documents: Document[] = [
  {
    id: '1',
    name: 'Financial Report 2023.pdf',
    uploadDate: '2023-12-15',
    description: 'Annual financial report for the year 2023. Contains sensitive financial data and employee information.'
  },
  {
    id: '2',
    name: 'Employee Handbook.docx',
    uploadDate: '2023-11-20',
    description: 'Company employee handbook with policies, procedures, and contact information.'
  },
  {
    id: '3',
    name: 'Project Proposal.pptx',
    uploadDate: '2024-01-05',
    description: 'Proposal for new client project, including budget estimates and team member details.'
  },
  {
    id: '4',
    name: 'Customer Database.xlsx',
    uploadDate: '2024-02-10',
    description: 'Spreadsheet containing customer contact information and purchase history.'
  },
]

export default function DocumentHistory() {
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedDocs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <WavyBackground className="min-h-screen flex flex-col">
      <header className="py-6 bg-black bg-opacity-50 backdrop-blur-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* <Link href="/" className="text-white text-xl font-bold hover:text-gray-200 transition-colors">
            ← Back to Home
          </Link> */}
          <h1 className="text-3xl font-bold mx-auto text-white">Document History</h1>
          <div className="w-24"></div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:bg-opacity-20">
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleExpand(doc.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <h2 className="text-lg font-semibold text-white">{doc.name}</h2>
                  </div>
                  {expandedDocs.has(doc.id) ? (
                    <ChevronUp className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white" />
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-300">Uploaded on: {doc.uploadDate}</p>
              </div>
              {expandedDocs.has(doc.id) && (
                <div className="px-6 pb-6">
                  <p className="text-sm text-gray-300">{doc.description}</p>
                  <div className="mt-4 flex space-x-3">
                    <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors">
                      Download
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors">
                      Reprocess
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <footer className="py-4 bg-black bg-opacity-50 backdrop-blur-md text-center text-white text-sm">
        <p>&copy; 2024 ENIGMA 2.0. All rights reserved.</p>
      </footer>
    </WavyBackground>
  )
}