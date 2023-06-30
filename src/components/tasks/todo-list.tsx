import { Button, Checkbox, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { TodoItem } from "./task-card";
import { FaTrash } from "react-icons/fa";

export interface TodoListProps {
  todos: TodoItem[];
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
}
export default function TodoList({ todos, setTodos }: TodoListProps) {
  const [newTodoInput, setNewTodoInput] = useState("");
  const handleAddTodo = () => {
    if (newTodoInput === "") return;
    setTodos([...todos, { name: newTodoInput, completed: false }]);

    setNewTodoInput("");
  };
  return (
    <>
      <div className="flex flex-col gap-2 p-2 overflow-auto h-60">
        {todos.map((todo, index) => (
          <div
            key={index}
            className="flex items-center justify-start gap-4 px-4 py-2 rounded bg-slate-100"
          >
            <Checkbox
              className="bg-white"
              isChecked={todo.completed ? true : false}
              onChange={(e) => {
                const newTodos = [...todos];
                newTodos[index].completed = e.target.checked;
                setTodos(newTodos);
              }}
            />
            <Input
              value={todo.name}
              variant={"unstyled"}
              onChange={(e) => {
                const newTodos = [...todos];
                newTodos[index].name = e.target.value;
                setTodos(newTodos);
              }}
            />

            <button
              className="text-slate-500"
              onClick={() => {
                const newTodos = [...todos];
                newTodos.splice(index, 1);
                setTodos(newTodos);
              }}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-start gap-4">
        <Input
          value={newTodoInput}
          onChange={(e) => setNewTodoInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newTodoInput !== "") {
              handleAddTodo();
            }
          }}
          variant={"flushed"}
          placeholder="Add a new todo..."
        />
        <Button
          onClick={handleAddTodo}
          variant="black"
          isDisabled={newTodoInput === ""}
        >
          Add
        </Button>
      </div>
    </>
  );
}
