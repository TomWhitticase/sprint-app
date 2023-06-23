import { CreatePostInput } from "@/hooks/use-posts";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

export const MAX_POST_TITLE = 500;
export const MAX_POST_CONTENT = 10000;

interface NewPostProps {
  createPost: UseMutateAsyncFunction<any, unknown, CreatePostInput, unknown>;
  projectId: string;
}
export default function NewPost({ createPost, projectId }: NewPostProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingCreating, setLoadingCreating] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [showError, setShowError] = useState(false);

  const handleCreate = async () => {
    //title must be between 1 and 500 characters
    //content must be between 1 and 10000 characters
    if (
      title.length < 1 ||
      title.length > MAX_POST_TITLE ||
      content.length < 1 ||
      content.length > MAX_POST_CONTENT
    ) {
      setShowError(true);
      return;
    }

    setLoadingCreating(true);
    await createPost({
      title,
      content,
      projectId,
      tags: tags.join(", "),
    });
    setTitle("");
    setContent("");
    setLoadingCreating(false);
    onClose();
  };

  return (
    <>
      <Button variant={"black"} onClick={onOpen}>
        Create a Post
      </Button>
      <Modal size={"6xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <div className="flex items-center justify-start w-full gap-4">
                <h1 className="font-bold ">Title</h1>
                {showError && title.length === 0 && (
                  <p className="text-red-500">
                    Title must be between 1 and {MAX_POST_TITLE} characters
                  </p>
                )}
              </div>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-start w-full gap-4">
                <h1 className="font-bold ">Tags</h1>
              </div>
              <div className="flex flex-wrap gap-2 p-2">
                {tags.length === 0 && (
                  <div className="flex items-center justify-between gap-4 px-2 py-1 rounded bg-slate-100 text-neutral-400">
                    <p className="text-sm ">None</p>
                  </div>
                )}
                {tags?.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 px-2 py-1 rounded bg-completed-green text-completed-green-text"
                  >
                    <p className="text-sm font-bold ">{tag}</p>
                    <button
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                    >
                      <FaTimes className="" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-start w-full gap-4">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => {
                    //if comma or space, add tag
                    if (
                      e.target.value.includes(",") ||
                      e.target.value.includes(" ")
                    ) {
                      if (newTag.length === 0) return;
                      if (tags.includes(newTag)) return;
                      setTags([...tags, newTag]);
                      setNewTag("");
                      return;
                    }

                    setNewTag(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (newTag.length === 0) return;
                      if (tags.includes(newTag)) return;
                      setTags([...tags, newTag]);
                      setNewTag("");
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newTag.length === 0) return;
                    if (tags.includes(newTag)) return;
                    setTags([...tags, newTag]);
                    setNewTag("");
                  }}
                >
                  Add Tag
                </Button>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-start w-full gap-4">
                <h1 className="font-bold ">Content</h1>
                {showError && content.length === 0 && (
                  <p className="text-red-500">
                    Content must be between 1 and {MAX_POST_CONTENT} characters
                  </p>
                )}
              </div>
              <Textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant={"white"} mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant={"black"} onClick={handleCreate}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
