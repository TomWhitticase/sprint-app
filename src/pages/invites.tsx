import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import { useInvites } from "@/hooks/use-invites";
import { Button } from "@chakra-ui/react";
import { Project, ProjectInvite } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import ReactLoading from "react-loading";

export default function InvitesPage() {
  const { invites, acceptInvite, deleteInvite, invitesIsLoading } =
    useInvites();
  const router = useRouter();

  const [accepting, setAccepting] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const handleAccept = async (inviteId: string) => {
    setAccepting(true);
    try {
      const project = await acceptInvite(inviteId);
      router.push("/projects/" + project.id);
    } catch (error) {
      console.error(error);
    }
    setAccepting(false);
  };

  const handleDelete = async (inviteId: string) => {
    setDeleting(true);
    try {
      await deleteInvite(inviteId);
    } catch (error) {
      console.error(error);
    }
    setDeleting(false);
  };

  if (invitesIsLoading) {
    return (
      <>
        <Head title="Loading..." />
        <main className="flex flex-col items-center justify-center flex-1 w-full h-full gap-2 p-4">
          <ReactLoading type="spin" color="#000" />
        </main>
      </>
    );
  }

  return (
    <>
      <Head title="Invites" />
      <ProjectLinkBar links={[]} current={"Invites"} />

      <main className="flex flex-col gap-2 p-4">
        <div className="flex flex-col gap-2">
          {invites?.map(
            (inv: ProjectInvite & { project: Project }, i: number) => (
              <div
                className="flex items-center justify-between gap-2 p-4 bg-white border-2 rounded-lg"
                key={i}
              >
                <div className="flex flex-col">
                  <h1>
                    You have been invited to{" "}
                    <span className="font-bold">{inv.project.name}</span>
                  </h1>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="black"
                    onClick={() => {
                      if (!accepting) handleAccept(inv.id);
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="white"
                    onClick={() => {
                      if (!deleting) handleDelete(inv.id);
                    }}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            )
          )}
          {invites && invites.length > 0 ? null : (
            <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white border-2 rounded-lg">
              <h1>You have no invites</h1>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
