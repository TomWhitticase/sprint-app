import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import { Button, Input } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();

  const [userName, setUserName] = useState(session?.user.name);
  const [userAvatarUrl, setUserAvatarUrl] = useState(session?.user.avatarUrl);

  return (
    <>
      <Head title="Settings" />
      <ProjectLinkBar links={[]} current={"Settings"} />

      <main className="flex flex-col gap-2 p-4">
        <div className="flex flex-col gap-2 p-4 bg-white border-2 rounded-lg">
          <span className="flex items-center justify-start h-8 gap-2">
            <h1 className="text-lg font-bold">Name</h1>
            {userName !== session?.user.name && userName.length >= 3 && (
              <div className="flex items-center justify-start gap-2">
                <Button onClick={() => {}} variant="black">
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setUserName(session?.user.name || "");
                  }}
                  variant="white"
                >
                  Discard Changes
                </Button>
              </div>
            )}
          </span>
          <Input
            type="text"
            placeholder="Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <span className="flex items-center justify-start h-8 gap-2">
            <h1 className="text-lg font-bold">Profile Image URL</h1>
            {(userAvatarUrl as string) !==
              (session?.user.avatarUrl as string) && (
              <div className="flex items-center justify-start gap-2">
                <Button onClick={() => {}} variant="black">
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setUserAvatarUrl(session?.user.avatarUrl);
                  }}
                  variant="white"
                >
                  Discard Changes
                </Button>
              </div>
            )}
          </span>
          <Input
            type="text"
            value={userAvatarUrl}
            defaultValue={session?.user?.avatarUrl}
            onChange={(e) => setUserAvatarUrl(e.target.value)}
          />
        </div>
      </main>
    </>
  );
}
