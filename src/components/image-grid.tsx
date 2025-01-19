'use client'

import { CldImage } from 'next-cloudinary'
import { FaInstagram } from 'react-icons/fa'
import { BsCheckLg } from 'react-icons/bs'
import {  format } from 'date-fns'

type Image = {
  id: number
  publicId: string
  url: string
  firstName: string
  lastName: string
  createdAt: Date
  instagramUrl: string | null
  postedAt: Date | null
}

export function ImageGrid({ images }: { images: Image[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div key={image.id} className="bg-card rounded-lg overflow-hidden">
          <div className={`relative ${image.instagramUrl ? 'ring-4 ring-green-500' : ''}`}>
            <CldImage
              width="600"
              height="600"
              src={image.publicId}
              alt={`Photo by ${image.firstName} ${image.lastName}`}
              className="object-cover w-full aspect-square"
            />
            {image.instagramUrl && (
              <a 
                href={image.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            )}
          </div>
          <div className="p-3 space-y-2">
            {/* First row: Name and Posted status */}
            <div className="flex justify-between items-center">
              <p className="font-medium">
                {image.firstName} {image.lastName}
              </p>
              {image.instagramUrl && (
                <span className="text-green-500 flex items-center gap-1 text-sm">
                  <BsCheckLg className="w-4 h-4" />
                  Posted
                </span>
              )}
            </div>
            
            {/* Second row: Upload date and Post date */}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Uploaded {format(new Date(image.createdAt), 'MMM d, yyyy')}</span>
              {image.postedAt && (
                <span>Posted {format(new Date(image.postedAt), 'MMM d, yyyy')}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}