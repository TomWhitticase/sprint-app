import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface ActivatePageProps {
  success: boolean;
}

export default function ActivatePage({ success }: ActivatePageProps) {
  const router = useRouter();
  if (success) {
    return (
      <section className="flex flex-col items-center justify-center w-full h-full gap-4 p-4">
        <h1 className="text-3xl font-bold text-orange-500">
          Account activated!
        </h1>
        <p>You can now login to your account.</p>
        <Button
          variant="black"
          onClick={() => {
            router.push("/login");
          }}
        >
          Sign in
        </Button>
      </section>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4">
        <h1 className="text-3xl font-bold text-orange-500">
          Account activation failed!
        </h1>
        <p>The link is either invalid, has expired or has already been used.</p>
        <Button
          variant="black"
          onClick={() => {
            router.push("/register");
          }}
        >
          Register
        </Button>
      </div>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.query;

  //First cleanup the database of any expired registration records
  const expiredRegistrations = await prisma.registrationData.deleteMany({
    where: {
      createdAt: {
        lte: new Date(Date.now() - 1000 * 60 * 60 * 24), //delete any records older than 24 hours
      },
    },
  });
  console.log("expired registrations deleted: ", expiredRegistrations.count);

  //check if there is an existing registration record for this token, if there is, delete it
  const existingRegistration = await prisma.registrationData.findUnique({
    where: {
      confirmationToken: token as string,
    },
  });

  if (existingRegistration) {
    //if there is an existing registration record, delete it
    await prisma.registrationData.delete({
      where: {
        confirmationToken: token as string,
      },
    });

    //create a new user record in the database
    const newUser = await prisma.user.create({
      data: {
        email: existingRegistration.email,
        name: existingRegistration.name,
        password: existingRegistration.password,
      },
    });

    return {
      props: {
        success: true,
      },
    };
  } else {
    //if there is no existing registration record, return error
    return {
      props: {
        success: false,
      },
    };
  }
};
