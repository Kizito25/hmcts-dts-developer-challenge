import React from "react";
const TaskContainer = ({ children }) => {
  return (
    <section className="w-full max-w-2xl p-4 bg-white rounded shadow h-full">
      {children}
    </section>
  );
};

export default TaskContainer;
