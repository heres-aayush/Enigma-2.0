'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Upload, FileX, CheckCircle, Download } from 'lucide-react'
import { WavyBackground } from "@/components/ui/wavy-background"
import axios from 'axios'

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [processedData, setProcessedData] = useState<string | null>(null)
  const [dobRedact, setDobRedact] = useState(false) // Checkbox state for DOB redaction

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    setUploadStatus('idle')
    setProcessedData(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploadStatus('uploading')

    const formData = new FormData()
    formData.append('file', files[0]) // Assuming a single file upload
    formData.append('dob_redact', dobRedact ? 'yes' : 'no') // Pass the checkbox value

    try {
      const response = await axios.post('http://localhost:5000/redact_image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.status === 200) {
        setUploadStatus('success')
        setProcessedData(response.data.file) // Assuming response contains file URL
      } else {
        setUploadStatus('error')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploadStatus('error')
    }
  }

  const handleDownload = () => {
    if (!processedData) return;
    console.log('processedData', processedData)
    const downloadUrl = `http://localhost:5000/download/${processedData}`;
    window.open(downloadUrl, '_blank');
  };
  
  
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
          {/* Redact Date of Birth Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="dobRedact"
              checked={dobRedact}
              onChange={() => setDobRedact(!dobRedact)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="dobRedact" className="text-white">
              Redact Date of Birth
            </label>
          </div>

          <Button
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
            disabled={files.length === 0 || uploadStatus === 'uploading' || uploadStatus === 'success'}
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload & Redact'}
          </Button>

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
              <span>Upload and redaction successful!</span>
            </motion.div>
          )}
          {uploadStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center text-red-400 text-lg"
            >
              <FileX className="mr-2 h-6 w-6" />
              <span>Upload failed!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </WavyBackground>
  )
}
