import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import { useProject } from "@/hooks/use-project";
import { useTask } from "@/hooks/use-task";
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { TaskPriority, TaskStatus } from "@prisma/client";
import SelectUsers from "@/components/users/select-users";
import TodoList from "@/components/tasks/todo-list";
import { useRouter } from "next/router";

interface TaskPageProps {
  id: string;
  taskId: string;
}
export default function TaskPage({ id, taskId }: TaskPageProps) {
  const { project, projectIsLoading } = useProject(id);
  const { task, taskIsLoading, updateTask, deleteTask } = useTask(taskId);

  const [taskName, setTaskName] = useState(task?.name);
  const [taskDescription, setTaskDescription] = useState(task?.description);
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    task?.startDate && task?.endDate
      ? [new Date(task?.startDate), new Date(task?.endDate)]
      : [new Date(), new Date()]
  );
  const [taskStatus, setTaskStatus] = useState(task?.status);
  const [taskPriority, setTaskPriority] = useState(task?.priority);
  const [taskAssignees, setTaskAssignees] = useState([
    ...(task?.assignees || []),
  ]);
  const [taskTodos, setTaskTodos] = useState(
    JSON.parse(JSON.stringify(task?.todos || []))
  );
  const router = useRouter();
  const [deleteingTask, setDeletingTask] = useState(false);

  useEffect(() => {
    setTaskName(task?.name || "");
    setTaskDescription(task?.description || "");
    setSelectedDates(
      task?.startDate && task?.endDate
        ? [new Date(task?.startDate), new Date(task?.endDate)]
        : [new Date(), new Date()]
    );
    setTaskStatus(task?.status || undefined);
    setTaskPriority(task?.priority || undefined);
    setTaskAssignees([...(task?.assignees || [])]);
    setTaskTodos(JSON.parse(JSON.stringify(task?.todos || [])));
  }, [task]);

  const handleDelete = async () => {
    if (deleteingTask) return;
    setDeletingTask(true);
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask();
      setDeletingTask(false);
      router.push("/projects/" + id + "/tasks");
    }
  };

  if (projectIsLoading || taskIsLoading)
    return (
      <>
        <Head title={"Loading... "} />
        <div>
          <ReactLoading
            type={"bubbles"}
            color={"#333"}
            height={50}
            width={50}
          />
        </div>
      </>
    );

  return (
    <>
      <Head title={project?.name + " - Tasks"} />
      <ProjectLinkBar
        links={[
          { link: "/projects", text: "Projects" },
          { link: "/projects/" + id, text: project.name },
          { link: "/projects/" + id + "/tasks", text: "Tasks" },
        ]}
        current={task?.name || "Task"}
      />
      <main className="flex flex-col w-full gap-2 p-4">
        <div className="flex items-start justify-center gap-8 p-4 bg-white border-2 rounded-lg mobile-only:flex-col desktop-only:flex-row">
          <div className="flex flex-col w-full gap-4">
            <span className="flex items-center justify-start h-8 gap-4">
              <h1 className="text-xl font-bold">Task Name</h1>
              {taskName !== task?.name && (
                <div className="flex items-center justify-start gap-4">
                  <Button
                    onClick={() => {
                      updateTask({
                        name: taskName,
                      });
                    }}
                    variant="black"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setTaskName(task?.name || "");
                    }}
                    variant="white"
                  >
                    Discard Changes
                  </Button>
                </div>
              )}
            </span>
            <div className="flex w-full gap-4">
              <Input
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full"
              />
            </div>
            <span className="flex items-center justify-start h-8 gap-4">
              <h1 className="text-xl font-bold">Task Description</h1>
              {taskDescription !== task?.description && (
                <div className="flex items-center justify-start gap-4">
                  <Button
                    onClick={() => {
                      updateTask({
                        description: taskDescription,
                      });
                    }}
                    variant="black"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setTaskDescription(task?.description || "");
                    }}
                    variant="white"
                  >
                    Discard Changes
                  </Button>
                </div>
              )}
            </span>
            <div className="flex w-full gap-4">
              <Textarea
                cols={3}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <span className="flex items-center justify-start h-8 gap-4">
              <h1 className="text-xl font-bold">Start and End Dates</h1>
              {task?.startDate &&
              task?.endDate &&
              areSameDay(selectedDates[0], new Date(task?.startDate)) &&
              areSameDay(
                selectedDates[1],
                new Date(task?.endDate)
              ) ? null : selectedDates[0] && selectedDates[1] ? (
                <div className="flex items-center justify-start gap-4">
                  <Button
                    onClick={() => {
                      updateTask({
                        startDate: selectedDates[0],
                        endDate: selectedDates[1],
                      });
                    }}
                    variant="black"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedDates([
                        new Date(task?.startDate || ""),
                        new Date(task?.endDate || ""),
                      ]);
                    }}
                    variant="white"
                  >
                    Discard Changes
                  </Button>
                </div>
              ) : (
                <span>Select a start and end date</span>
              )}
            </span>
            <div className="flex items-center justify-start w-full gap-4">
              <RangeDatepicker
                selectedDates={selectedDates}
                onDateChange={setSelectedDates}
              />
            </div>

            <span className="flex items-center justify-start h-8 gap-4">
              <h1 className="text-xl font-bold">Task Status</h1>
              {taskStatus !== task?.status && (
                <div className="flex items-center justify-start gap-4">
                  <Button
                    onClick={() => {
                      updateTask({
                        status: taskStatus,
                      });
                    }}
                    variant="black"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setTaskStatus(task?.status || undefined);
                    }}
                    variant="white"
                  >
                    Discard Changes
                  </Button>
                </div>
              )}
            </span>
            <div className="flex w-full gap-4">
              <Select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                className="w-full"
              >
                <option value="TODO">To Do</option>
                <option value="INPROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Done</option>
              </Select>
            </div>

            <span className="flex items-center justify-start h-8 gap-4">
              <h1 className="text-xl font-bold">Task Priority</h1>
              {taskPriority !== task?.priority && (
                <div className="flex items-center justify-start gap-4">
                  <Button
                    onClick={() => {
                      updateTask({
                        priority: taskPriority,
                      });
                    }}
                    variant="black"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setTaskPriority(task?.priority || undefined);
                    }}
                    variant="white"
                  >
                    Discard Changes
                  </Button>
                </div>
              )}
            </span>

            <div className="flex w-full gap-4">
              <Select
                value={taskPriority}
                onChange={(e) =>
                  setTaskPriority(e.target.value as TaskPriority)
                }
                className="w-full"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </Select>
            </div>
          </div>
          <div className="h-full mobile-only:hidden">
            <Divider orientation="vertical" />
          </div>
          <div className="flex flex-col w-full gap-4">
            <span className="flex items-center justify-start h-8 gap-4">
              <h1 className="text-xl font-bold">Task Assignees</h1>
              {task?.assignees
                .map((a) => a.id)
                .sort()
                .join(",")
                .toString() !==
                taskAssignees
                  .map((a) => a.id)
                  .sort()
                  .join(",")
                  .toString() && (
                <div className="flex items-center justify-start gap-4">
                  <Button
                    onClick={() => {
                      updateTask({
                        assigneeIds: taskAssignees.map((a) => a.id),
                      });
                    }}
                    variant="black"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setTaskAssignees(task?.assignees || []);
                    }}
                    variant="white"
                  >
                    Discard Changes
                  </Button>
                </div>
              )}
            </span>
            <div className="flex w-full gap-4">
              <SelectUsers
                users={project.members || []}
                selectedUsers={taskAssignees || []}
                setSelectedUsers={setTaskAssignees}
              />
            </div>
            <span className="flex items-center justify-start h-8 gap-4">
              <h1 className="text-xl font-bold">Todo List</h1>

              {JSON.stringify(taskTodos) !== JSON.stringify(task?.todos) && (
                <div className="flex items-center justify-start gap-4">
                  <Button
                    onClick={() => {
                      updateTask({
                        todos: taskTodos,
                      });
                    }}
                    variant="black"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setTaskTodos(
                        JSON.parse(JSON.stringify(task?.todos || []))
                      );
                    }}
                    variant="white"
                  >
                    Discard Changes
                  </Button>
                </div>
              )}
            </span>
            <div className="flex flex-col w-full gap-4">
              <TodoList todos={taskTodos} setTodos={setTaskTodos} />
            </div>
            <div className="flex items-end justify-end flex-1 h-full gap-4">
              <Button
                isLoading={deleteingTask}
                isDisabled={deleteingTask}
                onClick={handleDelete}
                variant="black"
              >
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, taskId } = context.params as any;
  return {
    props: { id, taskId },
  };
};

function areSameDay(date1: Date, date2: Date) {
  try {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  } catch (error) {
    return false;
  }
}
