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
import { useRouter } from "next/router";
import { TbFlagFilled } from "react-icons/tb";
import DateRangeInput from "./date-range-input";

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
            <div className="relative">
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
              <div className="absolute top-0 bottom-0 pointer-events-none w-80">
                <div className="flex items-center justify-start w-full h-full px-2">
                  {newTask.status === "TODO" && (
                    <div
                      className={`px-2 w-min whitespace-nowrap font-bold text-sm py-1 rounded uppercase bg-todo-red text-todo-red-text`}
                    >
                      To Do
                    </div>
                  )}
                  {newTask.status === "INPROGRESS" && (
                    <div
                      className={`px-2 w-min whitespace-nowrap font-bold text-sm py-1 rounded uppercase bg-in-progress-blue text-in-progress-blue-text`}
                    >
                      In-Progress
                    </div>
                  )}
                  {newTask.status === "REVIEW" && (
                    <div
                      className={`px-2 w-min whitespace-nowrap font-bold text-sm py-1 rounded uppercase bg-review-amber text-review-amber-text`}
                    >
                      Review
                    </div>
                  )}
                  {newTask.status === "COMPLETED" && (
                    <div
                      className={`px-2 w-min whitespace-nowrap font-bold text-sm py-1 rounded uppercase bg-completed-green text-completed-green-text`}
                    >
                      Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FormControl>
          <FormControl>
            <FormLabel>Priority</FormLabel>
            <div className="relative">
              <Select
                name="priority"
                value={newTask.priority}
                onChange={handleChange}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </Select>
              <div className="absolute top-0 bottom-0 pointer-events-none w-80">
                <div className="flex items-center justify-start w-full h-full px-2">
                  {newTask.priority === "LOW" && (
                    <span
                      className="flex items-center justify-center gap-2 p-1 bg-white"
                      style={{
                        color: "green",
                      }}
                    >
                      <TbFlagFilled />
                      Low
                    </span>
                  )}
                  {newTask.priority === "MEDIUM" && (
                    <span
                      className="flex items-center justify-center gap-2 p-1 bg-white"
                      style={{
                        color: "goldenrod",
                      }}
                    >
                      <TbFlagFilled />
                      Medium
                    </span>
                  )}
                  {newTask.priority === "HIGH" && (
                    <span
                      className="flex items-center justify-center gap-2 p-1 bg-white"
                      style={{
                        color: "red",
                      }}
                    >
                      <TbFlagFilled />
                      High
                    </span>
                  )}
                </div>
              </div>
            </div>
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
            <DateRangeInput
              selectedDates={selectedDates}
              onDateChange={setSelectedDates}
            />
          </FormControl>
          <div className="flex items-center justify-end w-full">
            <Button type="submit" variant={"black"}>
              Create Task
            </Button>
          </div>
        </VStack>
      </form>
    </Box>
  );
}
