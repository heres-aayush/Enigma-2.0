'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Upload, FileX, CheckCircle, Download } from 'lucide-react'
import { WavyBackground } from "@/components/ui/wavy-background"

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [processedData, setProcessedData] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    setUploadStatus('idle')
    setProcessedData(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleUpload = () => {
    setUploadStatus('uploading')
    // Simulating upload process
    setTimeout(() => {
      setUploadStatus('success')
      // Simulating data retrieval from backend
      setTimeout(() => {
        setProcessedData('Processed data from backend')
      }, 1000)
    }, 2000)
  }

  const handleRedact = () => {
    // Implement redaction logic here
    console.log('Redacting files:', files)
  }

  const handleMask = () => {
    // Implement masking logic here
    console.log('Masking files:', files)
  }

  const handleDownload = () => {
    // Implement download logic here
    console.log('Downloading processed data:', processedData)
  }

  return (
    <WavyBackground className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl space-y-8 bg-gray-900 bg-opacity-90 rounded-xl shadow-2xl p-8"
      >
        <h1 className="text-4xl font-bold text-center text-white">File Upload</h1>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-300 ${
            isDragActive ? 'border-blue-500 bg-blue-900 bg-opacity-50' : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-20 w-20 text-blue-400" />
          <p className="mt-4 text-xl text-blue-200">
            Drag 'n' drop some files here, or click to select files
          </p>
        </div>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {files.map((file) => (
                <div key={file.name} className="text-sm text-blue-300">
                  {file.name} - {file.size} bytes
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col space-y-4">
          <Button
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
            disabled={files.length === 0 || uploadStatus === 'uploading' || uploadStatus === 'success'}
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
          </Button>
          
          <div className="flex space-x-4">
            <Button
              onClick={handleRedact}
              className="flex-1 bg-red-700 hover:bg-red-800 text-white text-lg py-3"
              disabled={files.length === 0 || uploadStatus === 'uploading'}
            >
              Redact
            </Button>
            <Button
              onClick={handleMask}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-lg py-3"
              disabled={files.length === 0 || uploadStatus === 'uploading'}
            >
              Blur
            </Button>
          </div>
          
          <Button
            onClick={handleDownload}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
            disabled={!processedData}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Processed Data
          </Button>
        </div>

        <AnimatePresence>
          {uploadStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center text-green-400 text-lg"
            >
              <CheckCircle className="mr-2 h-6 w-6" />
              <span>Upload successful!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </WavyBackground>
  )
}