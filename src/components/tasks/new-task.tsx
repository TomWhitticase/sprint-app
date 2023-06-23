import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { NewTaskInputs } from "@/hooks/use-tasks";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Project, User } from "@prisma/client";
import SelectUsers from "../users/select-users";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { useRouter } from "next/router";

interface NewTaskProps {
  createTask: UseMutateAsyncFunction<any, unknown, NewTaskInputs, unknown>;
  project: Project & { members: User[] };
}

export default function NewTask({ createTask, project }: NewTaskProps) {
  const [newTask, setNewTask] = useState<NewTaskInputs>({
    name: "",
    description: "",
    projectId: project.id,
    status: "TODO",
    priority: "LOW",
    startDate: new Date(),
    endDate: new Date(),
    assignees: [], // initialize assignees as an empty array
  });
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(),
    new Date(),
  ]);
  const router = useRouter();
  useEffect(() => {
    setNewTask((prev) => ({
      ...prev,
      startDate: selectedDates[0],
      endDate: selectedDates[1],
    }));
  }, [selectedDates]);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]); // initialize selectedUsers as an empty array
  const [users, setUsers] = useState<User[]>(project.members); // initialize users as an array of project.members
  useEffect(() => {
    setNewTask((prev) => ({
      ...prev,
      assignees: selectedUsers.map((user) => user.id),
    }));
  }, [users, selectedUsers]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createTask(newTask);
    //navigate to project tasks page
    router.push(`/projects/${project.id}/tasks`);
  };

  return (
    <Box className="flex">
      <form onSubmit={handleSubmit} className="w-full">
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Task Name</FormLabel>
            <Input name="name" value={newTask.name} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={newTask.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={newTask.status}
              onChange={handleChange}
            >
              <option value="TODO">To Do</option>
              <option value="INPROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">Done</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Priority</FormLabel>
            <Select
              name="priority"
              value={newTask.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Assigness</FormLabel>
            <SelectUsers
              users={project.members}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Start and End Date</FormLabel>
            <RangeDatepicker
              selectedDates={selectedDates}
              onDateChange={setSelectedDates}
            />
          </FormControl>

          <Button type="submit" variant={"black"}>
            Create Task
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
