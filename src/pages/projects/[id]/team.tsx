import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import InviteUsers from "@/components/users/invite-users";
import UserAvatar from "@/components/users/user-avatar";
import { useInvites } from "@/hooks/use-invites";
import { useProject } from "@/hooks/use-project";
import {
  Badge,
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { User } from "@prisma/client";
import { GetServerSideProps } from "next";
import React, { useState, useCallback } from "react";
import { AiOutlineEllipsis } from "react-icons/ai";
import { GiPistolGun, GiCancel } from "react-icons/gi";
import ReactLoading from "react-loading";

interface TeamPageProps {
  id: string;
}
export default function TeamPage({ id }: TeamPageProps) {
  const { project, projectIsLoading, removeUserFromProject } = useProject(id);
  const { projectInvites, deleteInvite } = useInvites(id);
  const [removing, setRemoving] = useState(false);
  const [deletingInvite, setDeletingInvite] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleRemoveUser = useCallback(
    async (userId: string) => {
      setRemoving(true);
      try {
        await removeUserFromProject({ projectId: id, userId });
        toast({
          title: "User removed.",
          description: "User has been successfully removed from the project.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setActivePopover(null); // Close the popover after removing the user
      } catch (error) {
        toast({
          title: "Error.",
          description: "There was an error removing the user from the project.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setRemoving(false);
    },
    [id, removeUserFromProject, toast]
  );

  const handleDeleteInvite = useCallback(
    async (inviteId: string) => {
      setDeletingInvite(true);
      try {
        await deleteInvite(inviteId);
        toast({
          title: "Invite deleted.",
          description: "Invite has been successfully deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setActivePopover(null); // Close the popover after deleting the invite
      } catch (error) {
        toast({
          title: "Error.",
          description: "There was an error deleting the invite.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setDeletingInvite(false);
    },
    [deleteInvite, toast]
  );

  if (projectIsLoading)
    return (
      <div>
        <ReactLoading type={"bubbles"} color={"#333"} height={50} width={50} />
      </div>
    );

  return (
    <>
      <Head title={project.name + " - Team"} />
      <ProjectLinkBar
        links={[
          { link: "/projects", text: "Projects" },
          { link: "/projects/" + id, text: project.name },
        ]}
        current={"Team"}
      />
      <main className="flex flex-col w-full h-full gap-2 p-4">
        <div className="flex flex-col items-start justify-start gap-2 p-4 bg-white border-2 rounded-lg ">
          <span className="flex items-center justify-between w-full">
            <h1 className="text-xl font-bold">Team Members</h1>

            <Button onClick={() => onOpen()} variant={"black"}>
              Invite
            </Button>
          </span>
          <div className="flex flex-col items-start justify-start w-full gap-2">
            <span className="flex items-center justify-start w-full gap-2 ">
              <UserAvatar user={project?.leader} />
              {project?.leader.name}
              <Badge colorScheme="green">Leader</Badge>
            </span>
            {project?.members
              .filter(({ id }) => id !== project.leader.id)
              .map((member: User, i: number) => (
                <span
                  key={i}
                  className="flex items-center justify-between w-full gap-2"
                >
                  <span className="flex items-center justify-start flex-1 w-full gap-2">
                    <UserAvatar user={member} />
                    {member.name}
                  </span>
                  {member.id !== project.leader.id && (
                    <Popover
                      isOpen={activePopover === member.id}
                      onClose={() => setActivePopover(null)}
                    >
                      <PopoverTrigger>
                        <Button
                          variant={"ghost"}
                          onClick={() => setActivePopover(member.id)}
                        >
                          <AiOutlineEllipsis />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent w={"min"}>
                        <PopoverBody w={"min"}>
                          <Button
                            isLoading={removing}
                            disabled={removing}
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to remove ${member.name} from the project?`
                                )
                              )
                                handleRemoveUser(member.id);
                            }}
                            variant={"ghost"}
                          >
                            <GiCancel className="mr-2" /> Remove User
                          </Button>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  )}
                </span>
              ))}
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-4 p-4 bg-white border-2 rounded-lg ">
          <h1 className="text-xl font-bold">Pending Invites</h1>
          {projectInvites?.map((invite: any, i: number) => (
            <span
              key={i}
              className="flex items-center justify-between w-full gap-2"
            >
              <span className="flex items-center gap-2 jsutify-start">
                <UserAvatar user={invite.user} />
                {invite.user.name}
                <p className="text-sm text-gray-400">
                  Sent on{" "}
                  {new Date(invite.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  })}
                </p>
              </span>

              <Popover
                isOpen={activePopover === invite.userId}
                onClose={() => setActivePopover(null)}
              >
                <PopoverTrigger>
                  <Button
                    variant={"ghost"}
                    onClick={() => setActivePopover(invite.userId)}
                  >
                    <AiOutlineEllipsis />
                  </Button>
                </PopoverTrigger>
                <PopoverContent w={"min"}>
                  <PopoverBody>
                    <Button
                      variant={"ghost"}
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to cancel ${invite.user.name}'s invitation?`
                          )
                        )
                          handleDeleteInvite(invite.id);
                      }}
                      isLoading={deletingInvite}
                      disabled={deletingInvite}
                    >
                      <GiCancel className="mr-2" /> Cancel Invite
                    </Button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </span>
          ))}
          {projectInvites?.length === 0 ? (
            <p className="text-gray-400">No pending invites</p>
          ) : null}
        </div>
        <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <InviteUsers projectId={id} onClose={onClose} />
          </ModalContent>
        </Modal>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as any;
  return {
    props: { id },
  };
};
