import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import NewResource from "@/components/resources/new-resource";
import ResourceCard from "@/components/resources/resource-card";
import { useProject } from "@/hooks/use-project";
import { useResources } from "@/hooks/use-resources";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Resource } from "@prisma/client";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import ReactLoading from "react-loading";

interface ResourcesPageProps {
  id: string;
}
export default function ResourcesPage({ id }: ResourcesPageProps) {
  const { project, projectIsLoading } = useProject(id);
  const { resources, createResource, deleteResource } = useResources(id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState("");

  if (projectIsLoading)
    return (
      <div>
        <ReactLoading type={"bubbles"} color={"#333"} height={50} width={50} />
      </div>
    );

  return (
    <>
      <Head title={project.name + " - Resources"} />
      <ProjectLinkBar
        links={[
          { link: "/projects", text: "Projects" },
          { link: "/projects/" + id, text: project.name },
        ]}
        current={"Resources"}
      />
      <main className="flex flex-col flex-1 w-full h-full gap-2 p-4">
        <div className="flex items-center justify-center gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={"white"}
            placeholder="Search Resources..."
          />
          <Button variant="black" onClick={onOpen}>
            New Resource
          </Button>

          <Modal size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Resource</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <NewResource
                  createResource={createResource}
                  onClose={onClose}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>

        {resources
          ?.filter(
            (resource: Resource) =>
              resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              resource.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              resource.url.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((resource: Resource, i: number) => (
            <ResourceCard
              resource={resource}
              key={i}
              deleteResource={deleteResource}
            />
          ))}
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
