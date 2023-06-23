import { CreateResourceInput } from "@/hooks/use-resources";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";

interface NewResourceProps {
  createResource: UseMutateAsyncFunction<
    any,
    unknown,
    CreateResourceInput,
    unknown
  >;
  onClose: () => void;
}

export default function NewResource({
  createResource,
  onClose,
}: NewResourceProps) {
  const [inputs, setInputs] = React.useState({
    name: "",
    description: "",
    icon: "https://cdn4.iconfinder.com/data/icons/basic-user-interface-elements/700/document-text-file-sheet-doc-64.png",
    url: "",
  });
  const [creating, setCreating] = useState(false);

  const icons = [
    {
      value:
        "https://cdn4.iconfinder.com/data/icons/basic-user-interface-elements/700/document-text-file-sheet-doc-64.png",
      label: "Document",
    },
    {
      value:
        "https://cdn3.iconfinder.com/data/icons/streamline-icon-set-free-pack/48/Streamline-67-64.png",
      label: "Link",
    },
    {
      value:
        "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-social-github-512.png",
      label: "Github",
    },
    {
      value:
        "https://cdn4.iconfinder.com/data/icons/logos-brands-in-colors/3000/figma-logo-64.png",
      label: "Figma",
    },
    {
      value:
        "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/381_Word_logo-512.png",
      label: "Word",
    },
    {
      value:
        "https://cdn3.iconfinder.com/data/icons/logos-brands-3/24/logo_brand_brands_logos_excel-64.png",
      label: "Excel",
    },
    {
      value:
        "https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/discord-512.png",
      label: "Discord",
    },

    {
      value:
        "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Slack_colored_svg-64.png",
      label: "Slack",
    },
    {
      value:
        "https://cdn1.iconfinder.com/data/icons/radix/15/notion-logo-64.png",
      label: "Notion",
    },
    {
      value:
        "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Stack_Overflow-64.png",
      label: "Stack Overflow",
    },

    {
      value:
        "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/84_Dev_logo_logos-64.png",
      label: "Dev Community",
    },
    {
      value:
        "https://cdn3.iconfinder.com/data/icons/logos-brands-3/24/logo_brand_brands_logos_docs_google-64.png",
      label: "Google Docs",
    },
    {
      value:
        "https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/jira-64.png",
      label: "Jira",
    },
    {
      value:
        "https://cdn3.iconfinder.com/data/icons/logos-brands-3/24/logo_brand_brands_logos_google_sheets-64.png",
      label: "Google Sheets",
    },
    {
      value:
        "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Trello-64.png",
      label: "Trello",
    },
    {
      value:
        "https://cdn0.iconfinder.com/data/icons/font-awesome-brands-vol-1/640/aws-64.png",
      label: "AWS",
    },
    {
      value:
        "https://cdn3.iconfinder.com/data/icons/logos-brands-3/24/logo_brand_brands_logos_google_drive-64.png",
      label: "Google Drive",
    },

    // Add more icons here
  ];

  const handleCreate = async () => {
    //input validation
    if (inputs.name === "") {
      alert("Please enter a name");
      return;
    }

    setCreating(true);
    try {
      await createResource(inputs);
      onClose();
    } catch (e) {
      console.log(e);
    }
    setCreating(false);
  };

  return (
    <div className="flex flex-col items-start justify-center gap-4">
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Resource Name</FormLabel>
          <Input
            value={inputs.name}
            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Icon</FormLabel>
          <div className="flex items-start justify-center gap-8">
            <div className="p-2">
              <Image src={inputs.icon} width={40} height={40} alt={"icon"} />
            </div>
            <div className="flex flex-wrap p-1 border-2 rounded-lg">
              {icons.map((icon, i) => (
                <Tooltip label={icon.label} key={i}>
                  <div
                    className="p-2 rounded cursor-pointer hover:bg-slate-200"
                    onClick={() => {
                      setInputs({ ...inputs, icon: icon.value });
                    }}
                  >
                    <Image
                      src={icon.value}
                      width={20}
                      height={20}
                      alt={icon.label}
                    />
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>

          <FormControl>
            <FormLabel>Link</FormLabel>
            <Input
              value={inputs.url}
              onChange={(e) => setInputs({ ...inputs, url: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={inputs.description}
              onChange={(e) =>
                setInputs({ ...inputs, description: e.target.value })
              }
            />
          </FormControl>
        </FormControl>

        <Button
          variant={"black"}
          onClick={() => {
            if (!creating) handleCreate();
          }}
        >
          {creating ? "Creating..." : "Create"}
        </Button>
      </VStack>
    </div>
  );
}
