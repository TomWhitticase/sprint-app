import { useUsers } from "@/hooks/use-users";
import { User } from "@prisma/client";
import React from "react";
import UserAvatar from "./user-avatar";
import { Button, Input, useToast } from "@chakra-ui/react";
import ReactLoading from "react-loading";
import { FaRegSquare } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { useInvites } from "@/hooks/use-invites";
import { promises } from "dns";
import { useProject } from "@/hooks/use-project";

export type InviteUsersProps = {
  projectId: string;
  onClose: () => void;
};
export default function InviteUsers({ projectId, onClose }: InviteUsersProps) {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { project, projectIsLoading } = useProject(projectId);
  const { users, usersIsLoading } = useUsers(
    page,
    limit,
    searchQuery,
    project?.members.map((m: User) => m.id) || []
  );

  const { invites, createInvite, projectInvites } = useInvites(projectId);
  const toast = useToast();

  const [inviting, setInviting] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);

  const handleInvite = async () => {
    setInviting(true);

    //do not allow invites if projectInvites contains the user
    const projectInvitesIds = projectInvites.map((i: any) => i.userId);
    if (selectedUsers.some((u) => projectInvitesIds.includes(u.id))) {
      toast({
        title: "Could not invite users!",
        description: "One or more users have already been invited.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setInviting(false);
      return;
    }

    try {
      //do all the invites
      await Promise.all(
        selectedUsers.map(async (user) => {
          await createInvite({ projectId, userId: user.id });
        })
      );
      setSelectedUsers([]);

      toast({
        title: "Invites Sent!",
        description: "The users have been successfully invited to the project.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: "Could not invite users to the project.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setInviting(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  if (usersIsLoading)
    return (
      <div className="relative flex flex-col items-center justify-center flex-1 w-full h-full gap-2 p-4 bg-white border-2 rounded-lg">
        <ReactLoading type="spin" color="#111" height={50} width={50} />
      </div>
    );

  return (
    <div className="relative flex flex-col gap-2 p-4 bg-white border-2 rounded-lg">
      <h1 className="text-xl font-bold ">Invite Users</h1>
      <Input
        type="text"
        placeholder="Search users"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <div className="flex flex-col gap-2 h-[275px]">
        {users && users.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {users.map((user: User) => (
              <li
                onClick={() => {
                  if (selectedUsers.includes(user)) {
                    setSelectedUsers(selectedUsers.filter((u) => u !== user));
                  } else {
                    setSelectedUsers([...selectedUsers, user]);
                  }
                }}
                key={user.id}
                className="flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center justify-start gap-2">
                  <UserAvatar user={user} />
                  <div className="flex flex-col items-start justify-center gap-0">
                    {user.name}
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button className="text-xl">
                    {selectedUsers.includes(user) ? (
                      <FaCheckSquare />
                    ) : (
                      <FaRegSquare />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center justify-center gap-2">
          <span className="p-2 font-bold">Page {page}</span>
          <Button
            variant={"white"}
            onClick={() => {
              if (page > 1) handlePageChange(page - 1);
            }}
            disabled={page < 2}
          >
            Previous
          </Button>

          <Button variant="white" onClick={() => handlePageChange(page + 1)}>
            Next
          </Button>
        </span>
        <span className="flex items-center justify-center gap-2">
          <Button variant="white" onClick={() => setSelectedUsers([])}>
            Clear
          </Button>
          <Button
            onClick={() => {
              if (!(selectedUsers.length < 1 || inviting)) handleInvite();
            }}
            variant={"black"}
            className={`w-40 ${
              selectedUsers.length < 1 || inviting ? "cursor-not-allowed " : ""
            }`}
            disabled={selectedUsers.length < 1 || inviting}
          >
            {inviting ? "Inviting..." : `Invite ${selectedUsers.length} users`}
          </Button>
        </span>
      </div>
    </div>
  );
}
