import React from "react";
import { Outlet } from "react-router";
import TaskContainer from "./TaskContainer.jsx";
import Header from "./Header.jsx";
import NewTask from "./NewTask.jsx";
import useTaskStore from "../../store/taskStore.js";

const Container = () => {
  const isModalVisible = useTaskStore((state) => state.isModalVisible);
  return (
    <main className="min-w-xl min-h-screen mx-auto p-4 bg-gray-100 flex justify-center items-start">
      <TaskContainer>
        <Header />
        {isModalVisible && <NewTask />}
        <Outlet />
      </TaskContainer>
    </main>
  );
};

export default Container;
