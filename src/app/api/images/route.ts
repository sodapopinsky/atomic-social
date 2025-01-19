import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  
  const image = await prisma.image.create({
    data: {
      publicId: body.publicId,
      url: body.url,
      firstName: body.firstName,
      lastName: body.lastName,
    },
  })
  
  return NextResponse.json(image)
}


export async function GET() {
    try {
      const images = await prisma.image.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          publicId: true,
          url: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          instagramUrl: true,
          postedAt: true
        }
      })
      
      return NextResponse.json({ images })
    } catch (error) {
      console.error('Error fetching images:', error)
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
    }
  }