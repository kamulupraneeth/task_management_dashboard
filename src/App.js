import "./App.css";
import Layout from "./components/layout/Layout";
import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import { services } from "./apiClient/apiClient";

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [taskInfo, setTaskInfo] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const handleCreateTask = () => {
    setModalIsOpen(true);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await services.get("/todos");
        setTaskInfo(response.data);
      } catch (error) {
        if (error?.message) {
          setErrorMessage(true);
        }
      }
    };
    fetchTasks();
  }, []);

  const taskStatus = {
    todoTask: "todo",
    progressTask: "in-progress",
    doneTask: "done",
  };

  return (
    <>
      {errorMessage ? (
        <p className="text-red-500 text-2xl flex justify-center items-center h-screen">
          Could not fetch tasks. Is your mock api running?
        </p>
      ) : (
        <>
          <div className="text-center">
            <button
              onClick={handleCreateTask}
              className="border border-black md-rounded mt-8 md:m-4 lg:m-4 py-2 px-4 text-white bg-black mt"
            >
              Add new task
            </button>
          </div>
          <Layout
            taskStatus={taskStatus}
            taskInfo={taskInfo}
            setTaskInfo={setTaskInfo}
          />
          <TodoForm
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
            setTaskInfo={setTaskInfo}
          />
        </>
      )}
    </>
  );
}

export default App;
