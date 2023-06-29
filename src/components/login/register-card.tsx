import React, { useState } from "react";
import ReactLoading from "react-loading";
import { Button } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);

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
                  placeholder="name@company.com"
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
                  type="name"
                  name="name"
                  id="name"
                  className="bg-system-blue-veryLight text-white sm:text-sm rounded-lg block w-full p-2.5  border-gray-600 placeholder-neutral-400"
                  placeholder="John Doe"
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
                  placeholder="••••••••"
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
              </div>
              <div>
                <label
                  htmlFor="confirmpassword"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Confirm your Password
                </label>
                <input
                  type="password"
                  name="confirmpassword"
                  id="confirmpassword"
                  placeholder="••••••••"
                  className="bg-system-blue-veryLight text-white sm:text-sm rounded-lg block w-full p-2.5  border-gray-600 placeholder-neutral-400"
                  required
                  value={formValues.password}
                  onChange={(e) => {
                    setFormValues({
                      ...formValues,
                      confirmPassword: e.target.value,
                    });
                  }}
                />
              </div>
              <Button
                type="submit"
                colorScheme="orange"
                className="w-full"
                isLoading={isLoading}
              >
                {isLoading ? <ReactLoading width={8} height={8} /> : "Register"}
              </Button>
              <p className="text-red-500">{error}</p>
            </form>
            <div className="flex items-center gap-2 justify-center">
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
