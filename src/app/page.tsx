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
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50">
        <div className="max-w-6xl mx-auto w-full px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-4xl font-bold">Atomic Social</h1>
            <UploadDialog />
          </div>
         
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 max-w-6xl mx-auto ">
      <div className="text-sm text-muted-foreground mt-3 mb-4 bg-gray-100 p-4 rounded-md">
            Photos selected for our Instagram will earn you $15, paid out with payroll (current employees only!). All photos should reflect Atomic Burger&apos;s high standards, clean environment, and welcoming atmosphere.
          </div>
        <div>
          <ImageGrid images={images} />
        </div>
      </main>
    </div>
  )
}