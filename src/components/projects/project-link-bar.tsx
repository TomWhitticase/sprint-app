import { useRouter } from "next/router";
import React from "react";
import { RxSlash } from "react-icons/rx";
import { Image } from "@chakra-ui/react";

interface ProjectLinkBarProps {
  links: { link: string; text: string }[];
  current: string;
}
export default function ProjectLinkBar({
  links,
  current,
}: ProjectLinkBarProps) {
  const router = useRouter();
  return (
    <div className="relative flex items-center justify-start gap-2 p-4 text-lg border-b-2 mobile-only:hidden bg-slate-100">
      <span className="flex items-center justify-start gap-2 text-slate-400">
        <button
          className="transition-all duration-300 ease-in-out hover:text-orange-500"
          onClick={() => router.push("/dashboard")}
        >
          <Image
            src="/images/logo-gray.png"
            alt={"sprint logo"}
            width={8}
            height={8}
          />
        </button>
        <span className="flex">
          <RxSlash />
        </span>
      </span>
      {links.map((link, i) => (
        <span
          key={i}
          className="flex items-center justify-start gap-2 text-slate-400"
        >
          <button
            className="transition-all duration-300 ease-in-out hover:text-system-blue-light"
            onClick={() => router.push(link.link)}
          >
            {link.text}
          </button>
          <span className="flex">
            <RxSlash />
          </span>
        </span>
      ))}
      <span className="font-semibold text-black">{current}</span>
    </div>
  );
}
