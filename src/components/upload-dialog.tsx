'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import imageCompression from 'browser-image-compression'

export function UploadDialog() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const isFormValid = firstName.trim() && lastName.trim() && file
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isFormValid) return
  
    setIsUploading(true)
    try {
      const options = {
        maxSizeMB: 7, // Adjust max size (in MB) as needed
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }
      const compressedFile = await imageCompression(file!, options)
      
      const formData = new FormData()
      formData.append('file', compressedFile)
      formData.append('upload_preset', 'atomic_social')
  
      // Upload to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      
      if (!uploadResponse.ok) throw new Error('Failed to upload to Cloudinary')
      const uploadResult = await uploadResponse.json()
  
      // Save to our database
      const saveResponse = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          firstName,
          lastName,
        }),
      })
  
      if (saveResponse.ok) {
        setIsOpen(false)
        window.location.reload()
      } else {
        throw new Error('Failed to save to database')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was a problem uploading your photo. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Scroll into view when input is focused
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Upload Photo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share a Photo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onFocus={handleFocus}
            disabled={isUploading}
          />
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onFocus={handleFocus}
            disabled={isUploading}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
            disabled={isUploading}
          />
          <Button 
            type="submit" 
            className="w-full"
            disabled={!isFormValid || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}