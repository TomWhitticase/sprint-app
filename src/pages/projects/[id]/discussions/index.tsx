import Head from "@/components/Head";
import CommentBadge from "@/components/posts/badges/comment-badge";
import NewPost from "@/components/posts/new-post";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import UserAvatar from "@/components/users/user-avatar";
import { usePosts } from "@/hooks/use-posts";
import { useProject } from "@/hooks/use-project";
import { Input } from "@chakra-ui/react";
import { Post, PostComment, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import ReactLoading from "react-loading";

interface DiscussionsPageProps {
  id: string;
}
export default function DiscussionsPage({ id }: DiscussionsPageProps) {
  const { project, projectIsLoading } = useProject(id);
  const { posts, postsIsLoading, createPost } = usePosts(id);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const searchFunction = (post: Post) => {
    return (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (projectIsLoading)
    return (
      <div>
        <ReactLoading type={"bubbles"} color={"#333"} height={50} width={50} />
      </div>
    );

  return (
    <>
      <Head title={project.name + " - Discussions"} />
      <ProjectLinkBar
        links={[
          { link: "/projects", text: "Projects" },
          { link: "/projects/" + id, text: project.name },
        ]}
        current={"Discussions"}
      />
      <main className="flex flex-col w-full h-full gap-4 p-4">
        <div className="flex items-center justify-center w-full gap-4">
          <Input
            bg="white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Posts..."
          />

          <NewPost createPost={createPost} projectId={id} />
        </div>
        {posts?.filter(searchFunction).map(
          (
            post: Post & {
              postComments: any;
              author: User;
            }
          ) => (
            <div
              onClick={() => {
                router.push("/projects/" + id + "/discussions/" + post.id);
              }}
              className="flex flex-col gap-4 p-4 bg-white border-2 rounded-lg cursor-pointer"
              key={post.id}
            >
              <div className="flex items-center justify-start w-full gap-4">
                <UserAvatar user={post.author || ""} />
                <p className="font-bold">
                  {post.author ? post.author.name : ""}
                </p>
                <p className="text-slate-400">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
              <h1 className="text-2xl font-bold">{post.title}</h1>
              <div className="flex flex-wrap gap-2">
                {post.tags.split(",")?.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 px-2 py-1 rounded bg-completed-green text-completed-green-text"
                  >
                    <p className="text-sm font-bold ">{tag}</p>
                  </div>
                ))}
              </div>
              <p>
                {post.content.slice(0, 200) +
                  (post.content.length > 200 ? "..." : "")}
              </p>

              <div className="flex items-center justify-start w-full gap-4">
                <CommentBadge
                  count={post.postComments ? post.postComments.length : 0}
                />
              </div>
            </div>
          )
        )}
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
