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

export function UploadDialog() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image under 10MB",
        })
        e.target.value = '' // Reset input
        setFile(null)
        return
      }
      setFile(selectedFile)
    }
  }

  const isFormValid = firstName.trim() && lastName.trim() && file

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'atomic_social')

      // Upload to Cloudinary with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          signal: controller.signal
        }
      )

      clearTimeout(timeoutId)

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.message || 'Failed to upload to Cloudinary')
      }

      const uploadResult = await uploadResponse.json()

      // Save to our database
      const saveResponse = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          firstName,
          lastName,
        }),
      })

      if (saveResponse.ok) {
        setIsOpen(false)  // Close dialog on success
        window.location.reload()
      } else {
        throw new Error('Failed to save to database')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      let errorMessage = "There was a problem uploading your photo."
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Upload timed out. Please try with a smaller image."
        } else {
          errorMessage = error.message
        }
      }

      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      })
    } finally {
      setIsUploading(false)
    }
  }

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
          <div className="space-y-1">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              Maximum file size: 10MB
            </p>
          </div>
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