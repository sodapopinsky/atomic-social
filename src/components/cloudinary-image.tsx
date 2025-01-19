'use client'

import { CldImage } from 'next-cloudinary'

export function CloudinaryImage() {
  return (
    <CldImage
      width="400"
      height="300"
      src="https://res.cloudinary.com/dtjdtp135/image/upload/v1706531893/1_ixo9cg.png"
      alt="A sample landscape"
    />
  )
}