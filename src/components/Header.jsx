import React from "react";
import { IconPlus } from "@tabler/icons-react";
import useTaskStore from "../../store/taskStore.js";
import { Link } from "react-router";

const Header = () => {
  const taskStore = useTaskStore((state) => state.toggleModalVisibility);
  const tasksCount = useTaskStore((state) => state.tasks);

  return (
    <header className="flex items-center justify-between w-full">
      <h1 className="flex items-center justify-center text-2xl font-bold font-mono gap-2">
        <Link to="/">Task Manager</Link>
        <span className="flex items-center justify-center text-emerald-500 text-sm font-mono h-8 w-8 p-2 rounded-full border-2 border-pink-500">
          {tasksCount.length}
        </span>
      </h1>
      <div className="">
        <button
          className="border border-gray-300 p-2 text-gray-700 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
          onClick={() => taskStore()}
        >
          <IconPlus size={16} /> New Task
        </button>
      </div>
    </header>
  );
};

export default Header;
