import { prisma } from '@/lib/db'
import { UploadDialog } from '@/components/upload-dialog'
import { ImageGrid } from '@/components/image-grid'


export default async function Home() {
  const images = await prisma.image.findMany({
    orderBy: {
      createdAt: 'desc'
    },
  })

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold">Atomic Social</h1>
          <UploadDialog />
        </div>
        <div className=" text-sm text-muted-foreground bg-muted p-3 rounded-lg mb-6">
           Photos selected for our Instagram will earn you $15, paid out with payroll. All photos should reflect Atomic Burger's high standards, clean environment, and welcoming atmosphere.
        </div>
        
        
        <ImageGrid images={images} />
      </div>
    </main>
  )
}