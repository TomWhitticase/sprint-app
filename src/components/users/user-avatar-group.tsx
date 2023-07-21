import { AvatarGroup, Stack, Tooltip, Text, Avatar } from "@chakra-ui/react";
import { User } from "@prisma/client";
import React from "react";
import UserAvatar from "./user-avatar";

export interface UserAvatarGroupProps {
  users: User[];
  max?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function UserAvatarGroup({
  users,
  max = 2,
  size = "sm",
}: UserAvatarGroupProps) {
  return (
    <Tooltip
      label={
        <Stack>
          {users.map((user) => (
            <Text key={user.id}>{user.name}</Text>
          ))}
        </Stack>
      }
      aria-label="A tooltip"
    >
      <AvatarGroup size={size} max={max}>
        {users.map(
          (
            user // map over the users array
          ) => (
            <Avatar
              size={size}
              key={user.id}
              name={user.name}
              src={user.avatarUrl as string}
            /> // return an Avatar component for each user
          )
        )}
      </AvatarGroup>
    </Tooltip>
  );
}
