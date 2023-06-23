import { Avatar } from "@chakra-ui/react";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";

export interface UserAvatarProps {
  isCurrentUser?: boolean;
  user?: User;
}
export default function UserAvatar(props: UserAvatarProps) {
  const { isCurrentUser = false, user } = props;
  const { data: session } = useSession();

  if (isCurrentUser) {
    return (
      <Avatar
        size="sm"
        name={session?.user?.name as string}
        src={session?.user?.image as string}
      />
    );
  }

  return (
    <Avatar
      size="sm"
      name={user?.name as string}
      src={user?.avatarUrl as string}
    />
  );
}
