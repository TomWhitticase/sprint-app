import React, { useState } from "react";
import ReactLoading from "react-loading";
import {
  Box,
  Text,
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import isValidPassword from "@/lib/is-valid-password";
import { set } from "nprogress";

const RegisterCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [successfulRegistration, setSuccessfulRegistration] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (formValues.password !== formValues.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/register", {
        email: formValues.email,
        name: formValues.name,
        password: formValues.password,
      });
      setSuccessfulRegistration(true);
      setIsLoading(false);
    } catch (err: any) {
      console.log(err.response.data.message);
      setError(err.response.data.message);
      setIsLoading(false);
    }
  };

  if (successfulRegistration) {
    return (
      <section className="flex flex-col items-center justify-center w-full h-full gap-4 p-4">
        <h1 className="text-3xl font-bold text-orange-500">
          Registration successful!
        </h1>

        <p className="max-w-lg p-2">
          An activation link has been sent to your email address. Please check
          your inbox. You will not be able to login until you have clicked the
          activation link and activated your account.
        </p>
        <Button variant="black" onClick={() => router.push("/login")}>
          Login
        </Button>
      </section>
    );
  }

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
              Create your account
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
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-system-blue-veryLight text-white sm:text-sm rounded-lg block w-full p-2.5  border-gray-600 placeholder-neutral-400"
                  placeholder="Enter your email address"
                  required
                  value={formValues.email}
                  onChange={(e) => {
                    setFormValues({
                      ...formValues,
                      email: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Display name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-system-blue-veryLight text-white sm:text-sm rounded-lg block w-full p-2.5  border-gray-600 placeholder-neutral-400"
                  placeholder="Enter your name"
                  required
                  value={formValues.name}
                  onChange={(e) => {
                    setFormValues({
                      ...formValues,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Password
                  </label>
                  <Popover
                    placement="right"
                    isOpen={formValues.password.length > 0}
                  >
                    <PopoverTrigger>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        className="bg-system-blue-veryLight text-white sm:text-sm rounded-lg block w-full p-2.5  border-gray-600 placeholder-neutral-400"
                        required
                        value={formValues.password}
                        onChange={(e) => {
                          setFormValues({
                            ...formValues,
                            password: e.target.value,
                          });
                        }}
                      />
                    </PopoverTrigger>
                    <PopoverContent w="auto" bg="white">
                      <PopoverBody p={2}>
                        {isValidPassword(formValues.password).conditions.map(
                          (condition, index) => (
                            <Box
                              key={index}
                              color={
                                condition.condition ? "green.500" : "red.500"
                              }
                            >
                              <Text>{condition.message}</Text>
                            </Box>
                          )
                        )}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <input
                    type="password"
                    name="confirmpassword"
                    id="confirmpassword"
                    placeholder="Confirm your password"
                    className="bg-system-blue-veryLight text-white sm:text-sm rounded-lg block w-full p-2.5  border-gray-600 placeholder-neutral-400"
                    required
                    value={formValues.confirmPassword}
                    onChange={(e) => {
                      setFormValues({
                        ...formValues,
                        confirmPassword: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  type="submit"
                  colorScheme="orange"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {isLoading ? (
                    <ReactLoading width={8} height={8} />
                  ) : (
                    "Register"
                  )}
                </Button>
                <p className="text-red-500">{error}</p>
              </div>
            </form>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-white">
                Already have an account?
              </span>
              <button
                onClick={() => {
                  router.push("/login");
                }}
                className="text-sm font-bold text-white hover:underline"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterCard;
