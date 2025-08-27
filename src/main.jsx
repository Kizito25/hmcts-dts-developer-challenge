import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.jsx";
import Task from "./pages/Task.jsx";
import Container from "./components/Container.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Container />}>
          <Route path="/" element={<App />} />
          <Route path="/tasks/:id" element={<Task />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
