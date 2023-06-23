import { AvatarGroup, Stack, Tooltip, Text, Avatar } from "@chakra-ui/react";
import { User } from "@prisma/client";
import React from "react";
import UserAvatar from "./user-avatar";

export interface UserAvatarGroupProps {
  users: User[];
  max?: number;
}

export default function UserAvatarGroup({
  users,
  max = 2,
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
      <AvatarGroup size="sm" max={max}>
        {users.map(
          (
            user // map over the users array
          ) => (
            <Avatar
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
