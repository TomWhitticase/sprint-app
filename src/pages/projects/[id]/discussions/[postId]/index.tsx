import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import { usePost } from "@/hooks/use-post";
import { useProject } from "@/hooks/use-project";
import { Button, Input } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Comment from "@/components/posts/comment";

import React, { useState } from "react";
import UserAvatar from "@/components/users/user-avatar";
import { BiComment } from "react-icons/bi";
import CommentBadge from "@/components/posts/badges/comment-badge";

interface PostPageProps {
  id: string;
  postId: string;
}
export default function PostPage({ id, postId }: PostPageProps) {
  const { project, projectIsLoading } = useProject(id);
  const { post, postIsLoading, createPostComment, deletePostComment } =
    usePost(postId);

  const [commentContentInput, setCommentContentInput] = useState("");

  const [loadingCreating, setLoadingCreating] = useState(false);

  const handleCreatePostComment = async () => {
    setLoadingCreating(true);
    await createPostComment({ content: commentContentInput, postId });
    setLoadingCreating(false);
    setCommentContentInput("");
  };

  if (projectIsLoading || postIsLoading || project === undefined) return <></>;

  return (
    <>
      <Head title={project.name + " - Discussions"} />
      <ProjectLinkBar
        links={[
          { link: "/projects", text: "Projects" },
          { link: "/projects/" + id, text: project.name },
          { link: "/projects/" + id + "/discussions", text: "Discussions" },
        ]}
        current={post.title}
      />
      <main className="flex flex-col w-full h-full p-4 transition-all duration-300 ease-in-out">
        <div className="flex flex-col w-full ">
          <div className="flex flex-col items-start justify-start w-full gap-4 rounded-lg">
            <div className="flex flex-col w-full">
              <div className="flex flex-col w-full gap-4 p-4 bg-white border-2 rounded-lg">
                <div className="flex items-center justify-start w-full gap-4">
                  <UserAvatar user={post.author} />
                  <p className="font-bold">{post.author.name}</p>
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
                  {post.tags.split(",")?.map((tag: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 px-2 py-1 rounded bg-completed-green text-completed-green-text"
                    >
                      <p className="text-sm font-bold ">{tag}</p>
                    </div>
                  ))}
                </div>
                <p>{post.content}</p>
                <div className="flex items-center justify-start w-full gap-4">
                  <CommentBadge
                    count={post.postComments ? post.postComments.length : 0}
                  />
                </div>

                <div className="flex items-center justify-center w-full gap-2">
                  <Input
                    value={commentContentInput}
                    onChange={(e) => setCommentContentInput(e.target.value)}
                  />
                  <Button
                    isLoading={loadingCreating}
                    isDisabled={commentContentInput === "" || loadingCreating}
                    variant={"black"}
                    className=""
                    onClick={handleCreatePostComment}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {post?.postComments
          .filter((comment: any) => comment.parentCommentId === null)
          .map((comment: any) => (
            <Comment
              key={comment.id}
              allComments={post.postComments}
              createPostComment={createPostComment}
              deletePostComment={deletePostComment}
              author={comment.author}
              content={comment.content}
              createdAt={comment.createdAt}
              commentId={comment.id}
              parentCommentId={comment.parentCommentId}
              postId={postId}
              childrenComments={post.postComments?.filter(
                (c: any) => c.parentCommentId === comment.id
              )}
            />
          ))}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, postId } = context.params as any;
  return {
    props: { id, postId },
  };
};
