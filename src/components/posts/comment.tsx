import { CreatePostCommentInput } from "@/hooks/use-post";
import { Button, Input } from "@chakra-ui/react";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { User } from "@prisma/client";
import React, { useState } from "react";
import UserAvatar from "../users/user-avatar";
import { FaChevronDown, FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";

export interface CommentProps {
  createPostComment: UseMutateAsyncFunction<
    any,
    unknown,
    CreatePostCommentInput,
    unknown
  >;
  content: string;
  postId: string;
  author: User;
  createdAt: string;
  commentId: string;
  parentCommentId: string;
  childrenComments: any[];
  allComments: any[];
  deletePostComment: UseMutateAsyncFunction<any, unknown, string, unknown>;
}
export default function Comment(props: CommentProps) {
  const [replyInput, setReplyInput] = useState("");
  const [loadingCreating, setLoadingCreating] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [deleteingComment, setDeleteingComment] = useState(false);
  const { data: session } = useSession();

  const handleCreatePostComment = async () => {
    setLoadingCreating(true);
    await props.createPostComment({
      content: replyInput,
      parentCommentId: props.commentId,
      postId: props.postId,
    });
    setLoadingCreating(false);
    setReplyInput("");
  };

  const toggleShowReplies = () => {
    setShowReplies(!showReplies);
  };

  const toggleReplyInput = () => {
    setShowReplyInput(!showReplyInput);
  };

  const handleDeleteComment = async () => {
    if (deleteingComment) return;
    setDeleteingComment(true);
    await props.deletePostComment(props.commentId);
    setDeleteingComment(false);
  };

  return (
    <div className="flex flex-col w-full pt-4">
      <div className="flex flex-col items-start justify-start w-full gap-4 rounded-lg">
        <div className="flex flex-wrap items-center justify-start w-full gap-4">
          <UserAvatar user={props.author} />
          <p className="font-bold">{props.author.name}</p>
          <p className="text-slate-400">
            {new Date(props.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
        </div>
        <div className="flex w-full ">
          <div
            onClick={toggleShowReplies}
            className="cursor-pointer mobile-only:px-2 desktop-only:px-4 group"
          >
            <div className="desktop-only:w-[4px] mobile-only:w-[2px] h-full bg-slate-200 group-hover:bg-orange-500"></div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-full transition-all duration-300 ease-in-out rounded-lg bg-whiteborder-2 ">
              <h1 className="pb-2">{props.content}</h1>
              <div className="flex items-center justify-start w-full gap-4">
                {props.childrenComments.length > 0 && (
                  <button
                    className="flex items-center justify-center gap-2 px-2 py-1 text-sm font-bold text-orange-500 transition-all duration-300 ease-in-out rounded cursor-pointer "
                    onClick={toggleShowReplies}
                  >
                    <FaChevronDown
                      className={`transform transition-all duration-300 ease-in-out ${
                        showReplies ? "rotate-180" : ""
                      }
                                            `}
                    />
                    {props.childrenComments?.length +
                      " repl" +
                      (props.childrenComments?.length === 1 ? "y" : "ies")}
                  </button>
                )}

                <button
                  onClick={toggleReplyInput}
                  className="px-2 py-1 text-sm font-bold transition-all duration-300 ease-in-out rounded bg-slate-200 hover:text-orange-500 text-slate-500"
                >
                  {showReplyInput ? "Cancel" : "Reply"}
                </button>
                {props.author.id === session?.user.id && (
                  <button
                    onClick={handleDeleteComment}
                    className="flex items-center justify-center gap-2 px-2 py-1 text-sm font-bold transition-all duration-300 ease-in-out rounded bg-slate-200 hover:text-orange-500 text-slate-500"
                  >
                    <FaTrash /> Delete
                  </button>
                )}
              </div>

              <div
                className={`duration-300 ease-in-out transition-all overflow-hidden flex items-center justify-center w-full gap-2 first-letter
                                            ${
                                              showReplyInput
                                                ? "max-h-14 pt-4"
                                                : "max-h-0"
                                            }
              `}
              >
                <Input
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                />
                <Button
                  variant={"black"}
                  className=""
                  onClick={handleCreatePostComment}
                >
                  Reply
                </Button>
              </div>
            </div>

            <div
              className={` overflow-hidden ${
                showReplies ? "max-h-full" : "max-h-0"
              }`}
            >
              {props.childrenComments?.map((comment) => (
                <Comment
                  deletePostComment={props.deletePostComment}
                  key={comment.id}
                  allComments={props.allComments}
                  createPostComment={props.createPostComment}
                  content={comment.content}
                  postId={props.postId}
                  author={comment.author}
                  createdAt={comment.createdAt}
                  commentId={comment.id}
                  childrenComments={props.allComments.filter(
                    (c) => c.parentCommentId === comment.id
                  )}
                  parentCommentId={comment.parentCommentId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
