/*'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Upload, FileX, CheckCircle } from 'lucide-react'
import { WavyBackground } from "@/components/ui/wavy-background"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "../../../lib/firebase" // Import Firebase storage

export default function UploadPage() {
  const [files, setFiles] = useState([]) 
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles)
    setUploadStatus('idle')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

  const handleUpload = () => {
    if (files.length === 0) return;

    setUploadStatus('uploading')

    const file = files[0] // Assuming only one file is uploaded at a time
    const storageRef = ref(storage, `uploads/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Progress indication (optional)
      },
      (error) => {
        setUploadStatus('error')
        console.error('Error uploading file:', error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL)
          setUploadStatus('success')
        })
      }
    )
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
            Drag 'n' drop a file here, or click to select a file
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

        <div className="flex space-x-4">
          <Button
            onClick={handleUpload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
            disabled={files.length === 0 || uploadStatus === 'uploading' || uploadStatus === 'success'}
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
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
          {uploadStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center text-red-400 text-lg"
            >
              <FileX className="mr-2 h-6 w-6" />
              <span>Upload failed. Please try again.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </WavyBackground>
  )
}*/
'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Upload, FileX, CheckCircle } from 'lucide-react'
import { WavyBackground } from "@/components/ui/wavy-background"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

export default function UploadPage() {
  const [files, setFiles] = useState<File[0]>([null])
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles)
    setUploadStatus('idle')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleUpload = () => {
    setUploadStatus('uploading')

    const storage = getStorage()
    const file = files[0] // assuming only one file is uploaded at a time
    const storageRef = ref(storage, `uploads/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', 
      (snapshot) => {
        // You can add progress indication if needed
      },
      (error) => {
        setUploadStatus('error')
        console.error('Error uploading file:', error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL)
          setUploadStatus('success')
        })
      }
    )
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

        <div className="flex space-x-4">
          <Button
            onClick={handleUpload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
            disabled={files.length === 0 || uploadStatus === 'uploading' || uploadStatus === 'success'}
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
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
          {uploadStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center text-red-400 text-lg"
            >
              <FileX className="mr-2 h-6 w-6" />
              <span>Upload failed. Please try again.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </WavyBackground>
  )
}
