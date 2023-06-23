import { useRouter } from "next/router";
import { useMemo } from "react";

const ProjectSubNavItem = ({
  name,
  link,
  icon,
  variant = "default",
}: {
  name: string;
  icon: JSX.Element;
  link: string;
  variant?: "default" | "black";
}) => {
  const router = useRouter();
  const selected = useMemo(() => {
    const path = router.pathname.replace("[id]", router.query.id as string);
    return path === link;
  }, [router.pathname, link]);

  if (variant === "default")
    return (
      <>
        <div
          onClick={() => {
            router.push(link);
          }}
          className={`flex rounded-lg px-4 py-2 duration-300 transition-all ease-in-out items-center justify-start gap-2 text-white cursor-pointer
        ${selected ? "bg-system-blue-veryLight" : "hover:bg-system-blue-light"}
              `}
        >
          {icon} {name}
        </div>
      </>
    );

  if (variant === "black")
    return (
      <>
        <div
          onClick={() => {
            router.push(link);
          }}
          className={`flex rounded-lg px-4 py-2 duration-300 transition-all ease-in-out items-center justify-start gap-2 text-black cursor-pointer
        ${selected ? "bg-system-blue-veryLight" : "hover:bg-slate-200"}
              `}
        >
          {icon} {name}
        </div>
      </>
    );

  return null;
};
export default ProjectSubNavItem;
