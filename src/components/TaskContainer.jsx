import React from "react";
const TaskContainer = ({ children }) => {
  return (
    <section className="md:max-w-xl md:w-2/1 sm:w-full mx-auto h-full bg-white p-5">
      {children}
    </section>
  );
};

export default TaskContainer;
