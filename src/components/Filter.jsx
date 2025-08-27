import React from "react";
import { IconFilter } from "@tabler/icons-react";
import useTaskStore from "../../store/taskStore.js";

const Filter = () => {
  const [status, setStatus] = React.useState("");
  const [overdueStatus, setOverdueStatus] = React.useState("");
  const filterByStatus = useTaskStore((state) => state.filterByStatus);
  const filterByOverdueStatus = useTaskStore(
    (state) => state.filterByOverdueStatus
  );

  return (
    <section className="h-12 border mt-4 border-dashed border-gray-300 flex items-center justify-center">
      <div className="flex items-center">
        <IconFilter size={16} className="mr-2" />
        <div className="flex items-center justify-between ml-4">
          <select
            className="border p-2 mr-2"
            onChange={(e) => {
              filterByStatus(e.target.value, overdueStatus);
              setStatus(e.target.value);
            }}
          >
            <option value="">Filter by Status</option>
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
            <option value="">Filter by Overdue Status</option>
            <option value="true">Overdue</option>
            <option value="false">Not Overdue</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default Filter;
