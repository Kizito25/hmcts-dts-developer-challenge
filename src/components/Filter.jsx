import React from "react";
import { IconFilter2 } from "@tabler/icons-react";
import useTaskStore from "../../store/taskStore.js";

const Filter = () => {
  const [status, setStatus] = React.useState("");
  const [overdueStatus, setOverdueStatus] = React.useState("");
  const filterByStatus = useTaskStore((state) => state.filterByStatus);
  const filterByOverdueStatus = useTaskStore(
    (state) => state.filterByOverdueStatus
  );

  return (
    <section className="w-full h-12 mt-4 flex items-center">
      <div className="flex items-center w-full justify-between">
        <IconFilter2 size={14} className="h-6 w-6 font-thin text-gray-400" />
        <div className="flex items-center justify-around w-full">
          <select
            className="border p-2 mr-2"
            onChange={(e) => {
              filterByStatus(e.target.value, overdueStatus);
              setStatus(e.target.value);
            }}
          >
            <option value="">Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <select
            className="border p-2 mr-2"
            onChange={(e) => {
              filterByOverdueStatus(e.target.value, status);
              setOverdueStatus(e.target.value);
            }}
          >
            <option value="">Is Overdue?</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default Filter;
