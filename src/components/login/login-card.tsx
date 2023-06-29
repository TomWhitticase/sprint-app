import React, { useState } from "react";
import ReactLoading from "react-loading";
import { Button } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";

type LoginCardProps = {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  formSubmission: any;
  error: string;
};
const LoginCard = (props: LoginCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    await props.formSubmission(e);
    setIsLoading(false);
  };
  return (
    <section className="w-full h-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow bg-system-blue-light md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/images/logo.png"
                alt="logo"
                width={40}
                height={40}
                className=""
              />

              <span className="text-2xl font-bold text-white">Sprint</span>
            </div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl ">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              action="#"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-system-blue-veryLight text-white sm:text-sm rounded-lg block w-full p-2.5  border-gray-600 placeholder-neutral-400"
                  placeholder="Enter your email address"
                  required
                  value={props.email}
                  onChange={(e) => {
                    props.setEmail(e.target.value);
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className="bg-system-blue-veryLight text-white sm:text-sm rounded-lg block w-full p-2.5  border-gray-600 placeholder-neutral-400"
                  required
                  value={props.password}
                  onChange={(e) => {
                    props.setPassword(e.target.value);
                  }}
                />
              </div>
              <Button
                type="submit"
                colorScheme="orange"
                className="w-full"
                isLoading={isLoading}
              >
                {isLoading ? <ReactLoading width={8} height={8} /> : "Sign in"}
              </Button>
              <p className="text-red-500">{props.error}</p>
            </form>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-white">
                Don&apos;t have an account?
              </span>
              <button
                onClick={() => {
                  router.push("/register");
                }}
                className="text-sm font-bold text-white hover:underline"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginCard;
