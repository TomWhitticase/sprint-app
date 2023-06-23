import { Resource } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@chakra-ui/react";
import { AiOutlineEllipsis } from "react-icons/ai";

interface ResourceCardProps {
  resource: Resource;
  deleteResource: (id: string) => Promise<void>;
}
export default function RecourceCard({
  resource,
  deleteResource,
}: ResourceCardProps) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteResource(id);
    } catch (e) {
      console.log(e);
    }
    setDeleting(false);
  };

  return (
    <div className="flex items-start justify-start gap-4 p-4 bg-white border-2 rounded-lg">
      <Image src={resource.icon} width={40} height={40} alt="resource icon" />
      <div className="flex flex-col flex-1 gap-2">
        <h1 className="text-xl font-semibold">{resource.name}</h1>
        <p className="text-lg">{resource.description}</p>
        <Link className="w-min whitespace-nowrap" href={resource.url}>
          <p className="text-lg text-blue-500">{resource.url}</p>
        </Link>
      </div>
      <div>
        <Popover>
          <PopoverTrigger>
            <button>
              <AiOutlineEllipsis className="text-2xl" />
            </button>
          </PopoverTrigger>
          <PopoverContent width={""}>
            <PopoverBody>
              <div className="flex flex-col items-center justify-center gap-2 p-2">
                <Button className="w-20" variant="white">
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    if (!deleting) handleDelete(resource.id);
                  }}
                  className="w-20"
                  variant="black"
                >
                  {deleting ? <Spinner /> : "Delete"}
                </Button>
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
