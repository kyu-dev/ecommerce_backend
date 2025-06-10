import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

    await prisma.user.create({
        data: {
          name: 'Alice',
          email: 'alice@prisma.io',
          password: "razerazer"
        },
      })
    
      const allUsers = await prisma.user.findMany({
      })
    console.log(allUsers)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })