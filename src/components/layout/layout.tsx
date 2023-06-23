import React from "react";
import Sidebar from "./sidebar";
import { useRouter } from "next/router";
import ReactLoading from "react-loading";
import { useSession } from "next-auth/react";
import { IconButton } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { CgClose } from "react-icons/cg";

const pagesWithoutSidebar = ["/login"];

export interface layoutProps {
  children: React.ReactNode;
}
export default function Layout(props: layoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showSidebar, setShowSidebar] = React.useState(true);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <ReactLoading type="spin" color="#000" />
      </div>
    );
  }

  if (status === "unauthenticated" && router.pathname !== "/login") {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col h-screen ">
      <div className="relative flex w-full h-full">
        {pagesWithoutSidebar.includes(router.pathname) ? null : (
          <div className="z-[10] flex h-full mobile-only:absolute pointer-events-none">
            <div
              className={`w-full pointer-events-auto h-full flex flex-col transition-transform duration-300 ease-in-out ${
                showSidebar ? `` : `-translate-x-full`
              }`}
            >
              <Sidebar />
              <div className="absolute hidden text-white top-2 -right-12 mobile-only:flex">
                <IconButton
                  colorScheme={"blue"}
                  aria-label={"toggle side nav"}
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  {showSidebar ? <CgClose /> : <FaBars />}
                </IconButton>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col flex-1 overflow-y-auto bg-slate-100">
          {props.children}
        </div>
      </div>
    </div>
  );
}
