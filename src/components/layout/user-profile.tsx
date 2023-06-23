import { signOut, useSession } from "next-auth/react";
import UserAvatar from "../users/user-avatar";
import { AiOutlineEllipsis } from "react-icons/ai";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function UserProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <Menu>
      <MenuButton className="flex flex-row items-center justify-between gap-2 px-4 py-2 transition-all duration-300 rounded-lg text-system-grey-text hover:bg-system-blue-light">
        <div className="flex flex-row items-center justify-between gap-2">
          <UserAvatar isCurrentUser />
          <div className="flex items-center justify-start flex-1">
            {session?.user.name}
          </div>
          <AiOutlineEllipsis />
        </div>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => void signOut()}>Sign out</MenuItem>
        <MenuItem onClick={() => router.push("/invites")}>Invites</MenuItem>
        <MenuItem onClick={() => router.push("/settings")}>Settings</MenuItem>
      </MenuList>
    </Menu>
  );
}
