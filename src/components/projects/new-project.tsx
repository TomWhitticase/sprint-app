import { CreateProjectInput } from "@/hooks/use-projects";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useRouter } from "next/router";

interface NewProjectProps {
  createProject: UseMutateAsyncFunction<
    any,
    unknown,
    CreateProjectInput,
    unknown
  >;
}

export default function NewProject({ createProject }: NewProjectProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    setCreating(true);
    try {
      const newProject = await createProject({ name, description });
      router.push("/projects/" + newProject.id);
    } catch (error) {
      alert("something went wrong");
    }
    //clear inputs
    setName("");
    setDescription("");
    setCreating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-col w-full gap-4 p-4 bg-white border-2 rounded-lg">
        <FormControl id="project-name" className="">
          <FormLabel>Project name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>

        <FormControl id="project-description">
          <FormLabel>Description</FormLabel>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <div className="flex items-center justify-end w-full gap-2">
          <Button variant="black" onClick={handleCreate} disabled={creating}>
            {creating ? <Spinner /> : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
