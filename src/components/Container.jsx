import React from "react";
import { Outlet } from "react-router";
import TaskContainer from "./TaskContainer.jsx";
import Header from "./Header.jsx";
import NewTask from "./NewTask.jsx";
import useTaskStore from "../../store/taskStore.js";

const Container = () => {
  const isModalVisible = useTaskStore((state) => state.isModalVisible);
  return (
    <main className="flex justify-center overflow-x-hidden bg-gray-100 min-h-screen">
      <TaskContainer>
        <Header />
        {isModalVisible && <NewTask />}
        <Outlet />
      </TaskContainer>
    </main>
  );
};

export default Container;
