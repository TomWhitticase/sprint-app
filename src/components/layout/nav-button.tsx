import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export interface navButtonProps {
  link: string;
  text: string;
  icon: JSX.Element;
  notifications?: number;
}
export default function NavButton(props: navButtonProps) {
  const { link, text, icon, notifications = 0 } = props;
  const router = useRouter();

  return (
    <Link
      href={link}
      className={`${
        !(router.pathname === link)
          ? `bg-system-blue hover:bg-system-blue-light`
          : `bg-system-blue-veryLight`
      } rounded-lg px-3 py-2 text-system-grey-text transition-all duration-300 flex items-center justify-start gap-2`}
    >
      {icon} {text}{" "}
      {notifications > 0 && (
        <span
          className={`rounded-full bg-red-500 text-white text-xs flex items-center justify-center w-5 h-5 font-bold`}
        >
          {notifications}
        </span>
      )}
    </Link>
  );
}
