import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import { useProject } from "@/hooks/use-project";
import { useTask } from "@/hooks/use-task";
import { Button, Divider, Input, Select, Textarea } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { TaskPriority, TaskStatus } from "@prisma/client";
import SelectUsers from "@/components/users/select-users";
import TodoList from "@/components/tasks/todo-list";
import { useRouter } from "next/router";
import UserAvatar from "@/components/users/user-avatar";
import { FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { TbFlagFilled } from "react-icons/tb";

interface TaskPageProps {
  id: string;
  taskId: string;
}
export default function TaskPage({ id, taskId }: TaskPageProps) {
  const { project, projectIsLoading } = useProject(id);
  const {
    task,
    taskIsLoading,
    updateTask,
    deleteTask,
    createTaskComment,
    deleteTaskComment,
    deleteTaskCommentIsLoading,
    createTaskCommentIsLoading,
    deleteTaskIsLoading,
  } = useTask(taskId);

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
  const [commentInput, setCommentInput] = useState("");

  const { data: session } = useSession();

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
    if (deleteTaskIsLoading) return;
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask();
      router.push("/projects/" + id + "/tasks");
    }
  };

  const handleAddComment = async () => {
    if (commentInput.length < 1) return;
    if (createTaskCommentIsLoading) return;
    await createTaskComment(commentInput);
    setCommentInput("");
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await deleteTaskComment(commentId);
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
          <div className="flex flex-col w-full gap-2">
            <span className="flex items-center justify-start h-8 gap-4">
              <h1 className="text-lg font-bold">Task Name</h1>
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
              <h1 className="text-lg font-bold">Task Description</h1>
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
              <h1 className="text-lg font-bold">Start and End Dates</h1>
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
              <h1 className="text-lg font-bold">Task Status</h1>
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
            <div className="relative flex w-full gap-4">
              <Select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                className=""
              >
                <option value="TODO">
                  <div
                    className={`px-2 font-bold text-sm py-1 rounded uppercase bg-todo-red text-todo-red-text`}
                  >
                    To Do
                  </div>
                </option>
                <option value="INPROGRESS">
                  <div
                    className={`px-2 font-bold text-sm py-1 rounded uppercase bg-in-progress-blue text-in-progress-blue-text`}
                  >
                    In-Progress
                  </div>
                </option>
                <option value="REVIEW">
                  <div
                    className={`px-2 font-bold text-sm py-1 rounded uppercase bg-review-amber text-review-amber-text`}
                  >
                    Review
                  </div>
                </option>
                <option value="COMPLETED">
                  <div
                    className={`px-2 font-bold text-sm py-1 rounded uppercase bg-completed-green text-completed-green-text`}
                  >
                    Completed
                  </div>
                </option>
              </Select>
              <div className="absolute top-0 bottom-0 pointer-events-none w-80">
                <div className="flex items-center justify-start w-full h-full px-2">
                  {taskStatus === "TODO" && (
                    <div
                      className={`px-2 w-min whitespace-nowrap font-bold text-sm py-1 rounded uppercase bg-todo-red text-todo-red-text`}
                    >
                      To Do
                    </div>
                  )}
                  {taskStatus === "INPROGRESS" && (
                    <div
                      className={`px-2 w-min whitespace-nowrap font-bold text-sm py-1 rounded uppercase bg-in-progress-blue text-in-progress-blue-text`}
                    >
                      In-Progress
                    </div>
                  )}
                  {taskStatus === "REVIEW" && (
                    <div
                      className={`px-2 w-min whitespace-nowrap font-bold text-sm py-1 rounded uppercase bg-review-amber text-review-amber-text`}
                    >
                      Review
                    </div>
                  )}
                  {taskStatus === "COMPLETED" && (
                    <div
                      className={`px-2 w-min whitespace-nowrap font-bold text-sm py-1 rounded uppercase bg-completed-green text-completed-green-text`}
                    >
                      Completed
                    </div>
                  )}
                </div>
              </div>
            </div>

            <span className="flex items-center justify-start h-8 gap-4">
              <h1 className="text-lg font-bold">Task Priority</h1>
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

            <div className="relative flex w-full gap-4">
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
              <div className="absolute top-0 bottom-0 pointer-events-none w-80">
                <div className="flex items-center justify-start w-full h-full px-2">
                  {taskPriority === "LOW" && (
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
                  {taskPriority === "MEDIUM" && (
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
                  {taskPriority === "HIGH" && (
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
          </div>
          <div className="h-full mobile-only:hidden">
            <Divider orientation="vertical" />
          </div>
          <div className="flex flex-col w-full gap-2">
            <span className="flex items-center justify-start h-8 gap-4">
              <h1 className="text-lg font-bold">Task Assignees</h1>
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
              <h1 className="text-lg font-bold">Todo List</h1>

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
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-4 p-4 bg-white border-2 rounded-lg">
          <div className="flex items-center justify-center w-full gap-4">
            <Input
              variant={"flushed"}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment..."
              className="w-full"
            />
            <Button
              onClick={handleAddComment}
              variant="black"
              isDisabled={!commentInput}
              isLoading={createTaskCommentIsLoading}
            >
              Comment
            </Button>
          </div>

          <div className="flex flex-col w-full">
            {task?.comments.map((c) => (
              <div
                className="flex items-start justify-start w-full gap-2 p-2"
                key={c.id}
              >
                <div>
                  <UserAvatar user={c.user} />
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex items-center justify-start flex-1 gap-4">
                      <p className="font-bold">{c.user.name}</p>
                      <p className="text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </p>
                    </div>
                    {c.user.id === session?.user.id && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="flex items-center justify-center gap-2 px-2 py-1 text-sm font-bold transition-all duration-300 ease-in-out rounded bg-slate-200 hover:text-orange-500 text-slate-500"
                      >
                        <FaTrash /> Delete
                      </button>
                    )}
                  </div>

                  <div>{c.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Button
            variant={"black"}
            onClick={() => {
              if (confirm("Are you sure you want to delete this task?")) {
                deleteTask();
                router.push(`/projects/${id}/tasks`);
              }
            }}
          >
            Delete Task
          </Button>
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
