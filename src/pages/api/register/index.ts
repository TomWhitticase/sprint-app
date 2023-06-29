import { apiHandler } from "@/lib/api-handler";
import isValidPassword from "@/lib/is-valid-password";
import prisma from "@/lib/prisma";
import sendEmail from "@/lib/send-email";
import { NextApiRequest, NextApiResponse } from "next";
import { send } from "process";
import bcrypt from "bcrypt";
import RandomString from "@/utils/random-string";

//POST /api/register - register a new user with the given email, name and password

const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, name, password } = req.body;
  console.log(email, name, password);

  //first cleanup the database of any expired registration records
  const expiredRegistrations = await prisma.registrationData.deleteMany({
    where: {
      createdAt: {
        lte: new Date(Date.now() - 1000 * 60 * 60 * 24), //delete any records older than 24 hours
      },
    },
  });
  console.log("expired registrations deleted: ", expiredRegistrations.count);

  //check that email is not already in use, if it is, return error
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  //check that password is strong enough, if not, return error
  if (!isValidPassword(password).isValid) {
    console.log("password not valid");
    return res.status(400).json({ message: isValidPassword(password).message });
  }

  //check if there is an existing registration record for this email, if there is, delete it
  const existingRegistration = await prisma.registrationData.findUnique({
    where: {
      email: email as string,
    },
  });
  if (existingRegistration) {
    //if there is an existing registration record, delete it, we will create a new one later
    await prisma.registrationData.delete({
      where: {
        email: email as string,
      },
    });
  }

  //generate a confirmation token
  const confirmationToken = RandomString(8);

  //create a record in the database for registering the user
  const registrationData = await prisma.registrationData.create({
    data: {
      email: email as string,
      name: name as string,
      password: await bcrypt.hash(password as string, 10),
      confirmationToken: confirmationToken as string,
    },
  });
  try {
    const sendMail = await sendEmail({
      recipientEmail: email as string,
      subject: "Sprint - Confirm your email",
      body: `Welcome to sprint! Please click this link to confirm your email address and activate your account ${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/register/activate?token=${confirmationToken}`,
    });
    return res.status(200).json({
      message: "Registration successful, confirmation email sent",
      sendMail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error sending email", error });
  }
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
