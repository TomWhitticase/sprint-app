import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const names = [
    "John Doe",
    "Jane Doe",
    "James Smith",
    "Maria Garcia",
    "Michael Johnson",
    "Linda Williams",
    "Robert Jones",
    "Patricia Brown",
    "David Davis",
    "Jennifer Miller",
    "Joseph Wilson",
    "Jessica Moore",
    "Thomas Taylor",
    "Emily Anderson",
    "Christopher Thomas",
    "Angela Martin",
    "Matthew Martinez",
    "Olivia Hernandez",
    "Anthony Thompson",
    "Sophia White",
  ];
  const users = [];
  //loop through names
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const password = await bcrypt.hash("password", 10); // hash the passwords
    users.push(
      prisma.user.create({
        data: {
          email: `${name.replace(/\s/g, "").toLowerCase()}@example.com`,
          password: password,
          name: `${name}`,
        },
      })
    );
  }
  await prisma.$transaction(users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
