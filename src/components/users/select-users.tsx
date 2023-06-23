import { Button, FormControl, FormLabel, Select } from "@chakra-ui/react";
import { User } from "@prisma/client";
import React from "react";
import UserAvatar from "./user-avatar";

export interface SelectUsersProps {
  users: User[];
  selectedUsers: User[];
  setSelectedUsers: (users: User[]) => void;
}

export default function SelectUsers(props: SelectUsersProps) {
  return (
    <FormControl className="">
      <div className="flex flex-col items-start justify-start gap-2 p-2">
        {props.selectedUsers.length === 0 && (
          <div className="text-slate-500">No users selected</div>
        )}
        {props.selectedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between w-full gap-1"
          >
            <span className="flex items-center justify-start flex-1 gap-2">
              <UserAvatar user={user} />
              {user.name}
            </span>
            <Button
              onClick={() =>
                props.setSelectedUsers(
                  props.selectedUsers.filter((u) => u.id !== user.id)
                )
              }
              size="sm"
              variant="black"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <Select
        placeholder="Select a user to add"
        name="assignees"
        onChange={(e) => {
          const { value } = e.target;
          console.log(value);
          const user = props.users.find((user) => user.id === value);

          if (user) {
            props.setSelectedUsers([...props.selectedUsers, user]);
          }
        }}
      >
        {props.users
          .filter((user) => !props.selectedUsers.find((u) => u.id === user.id))
          .map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
      </Select>
    </FormControl>
  );
}
