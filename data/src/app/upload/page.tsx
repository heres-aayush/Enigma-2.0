'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Upload, FileX, CheckCircle, Download } from 'lucide-react'
import { WavyBackground } from "@/components/ui/wavy-background"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import RedactionOptions from '../redaction-option/page'

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [processedData, setProcessedData] = useState<string | null>(null)
  const [showPIIDialog, setShowPIIDialog] = useState(false)
  const [detectedPII, setDetectedPII] = useState<string>('')
  const [showRedactionOptions, setShowRedactionOptions] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
    )
    setFiles(imageFiles)
    setUploadStatus('idle')
    setProcessedData(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  })

  const handleUpload = () => {
    setUploadStatus('uploading')
    // Simulating upload process
    setTimeout(() => {
      setUploadStatus('success')
      // Simulating PII detection
      setDetectedPII("Date of Birth: 01/01/1990\nPhone: 123-456-7890\nEmail: user@example.com")
      setShowPIIDialog(true)
    }, 2000)
  }

  const handleRedact = () => {
    setShowRedactionOptions(true)
  }

  const handleDownload = () => {
    // Implement download logic here
    console.log('Downloading processed data:', processedData)
  }

  const handleRedactionComplete = (fields: string[], method: 'blank' | 'blur') => {
    console.log('Redacting fields:', fields, 'with method:', method)
    setShowRedactionOptions(false)
    // Simulating redaction process
    setProcessedData('Redacted data')
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
            Drag 'n' drop some image files here, or click to select files
          </p>
          <p className="mt-2 text-sm text-blue-300">
            (Only *.jpg, *.jpeg, and *.png files will be accepted)
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
              disabled={files.length === 0 || uploadStatus !== 'success'}
            >
              Redact
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

      <Dialog open={showPIIDialog} onOpenChange={setShowPIIDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detected PII</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-lg font-semibold mb-2">These are your PII detected:</p>
            <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">{detectedPII}</pre>
          </div>
        </DialogContent>
      </Dialog>

      {showRedactionOptions && (
        <RedactionOptions
          onClose={() => setShowRedactionOptions(false)}
          onRedact={handleRedactionComplete}
        />
      )}
    </WavyBackground>
  )
}