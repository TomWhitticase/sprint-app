import { apiHandler } from "@/lib/api-handler";
import isValidPassword from "@/lib/is-valid-password";
import prisma from "@/lib/prisma";
import sendEmail from "@/lib/send-email";
import { NextApiRequest, NextApiResponse } from "next";
import { send } from "process";

const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, name, password } = req.body;

  //check that email is not already in use, if it is, return error
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }
  //check that there is not already a registration record for this email
  const existingRegistration = await prisma.registrationData.findUnique({
    where: {
      email: email as string,
    },
  });
  //check that password is strong enough, if not, return error
  if (!isValidPassword(password).isValid) {
    return res.status(400).json({ message: isValidPassword(password).message });
  }

  if (existingRegistration) {
    //if there is an existing registration record, delete it, we will create a new one later
    await prisma.registrationData.delete({
      where: {
        email: email as string,
      },
    });
  }

  //generate a confirmation token
  const confirmationToken = "token";

  //create a record in the database for registering the user
  const registrationData = await prisma.registrationData.create({
    data: {
      email: email as string,
      name: name as string,
      password: password as string,
      confirmationToken: confirmationToken as string,
    },
  });

  sendEmail({
    recipientEmail: email as string,
    subject: "Sprint - Confirm your email",
    body: `Please click this link to confirm your email to complete your registration
    : http://localhost:3000/api/confirm-email?token=${confirmationToken}`,
  });
};

export default apiHandler({
  POST: { handler: registerUser, requireAuth: false },
});

//for reference
// model registrationData {
//   id        String   @id @unique @default(cuid())
//   email     String
//   password  String
//   name      String
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt @default(now())
//   confirmationToken String
// }
// model User {
//   id            String      @id @unique @default(cuid())
//   email         String      @unique
//   password      String
//   name          String
//   avatarUrl     String?
//   createdAt     DateTime    @default(now())
//   updatedAt     DateTime    @updatedAt @default(now())
//   projects      Project[]
//   leadProjects  Project[] @relation("ProjectLeader")
//   invites       ProjectInvite[]
//   tasks         Task[]
//   taskComments  TaskComment[]
//   posts         Post[]
//   postComments  PostComment[]
// }
