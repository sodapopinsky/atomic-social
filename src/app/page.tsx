import { prisma } from '@/lib/db'
import { CloudinaryImage } from '@/components/cloudinary-image';

export default async function Home() {
  const users = await prisma.user.findMany({
    select: {
      email: true
    }
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Hello
        </h1>
        <CloudinaryImage />
        <div className="space-y-2">
          {users.map((user) => (
            <p key={user.email} className="text-muted-foreground">
              {user.email}
            </p>
          ))}
        </div>
      </div>
    </main>
  )
}