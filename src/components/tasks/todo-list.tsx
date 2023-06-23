import { Button, Checkbox, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { TodoItem } from "./task-card";

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
      {todos.map((todo, index) => (
        <div key={index} className="flex items-center justify-start gap-4">
          <Checkbox
            isChecked={todo.completed ? true : false}
            onChange={(e) => {
              const newTodos = [...todos];
              newTodos[index].completed = e.target.checked;
              setTodos(newTodos);
            }}
          />
          <Input
            value={todo.name}
            onChange={(e) => {
              const newTodos = [...todos];
              newTodos[index].name = e.target.value;
              setTodos(newTodos);
            }}
          />

          <Button
            variant="white"
            onClick={() => {
              const newTodos = [...todos];
              newTodos.splice(index, 1);
              setTodos(newTodos);
            }}
          >
            Delete
          </Button>
        </div>
      ))}
      <div className="flex items-center justify-start gap-4">
        <Input
          value={newTodoInput}
          onChange={(e) => setNewTodoInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTodo();
            }
          }}
          variant={"flushed"}
          placeholder="Add a new todo..."
        />
        <Button onClick={handleAddTodo} variant="white">
          Add
        </Button>
      </div>
    </>
  );
}
