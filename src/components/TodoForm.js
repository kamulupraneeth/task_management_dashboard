import Modal from "react-modal";
import { services } from "../apiClient/apiClient";
import { useState } from "react";
const TodoForm = ({ modalIsOpen, setModalIsOpen, setTaskInfo }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
  });

  const [error, setError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationsErrors = {};
    if (!formData.title) {
      validationsErrors.title = "Title is required!";
    }
    if (!formData.status) {
      validationsErrors.status = "Status is required!";
    }
    setError(validationsErrors);
    if (Object.keys(validationsErrors).length > 0) {
      return;
    }
    try {
      const response = await services.post("/todos", formData);
      if (response.status === 201) {
        setTaskInfo((prev) => [
          ...prev.filter(
            (task) =>
              !(
                task.title === response.data.title &&
                task.description === response.data.description
              )
          ),
          response.data,
        ]);
        setModalIsOpen(false);
        setFormData({ title: "", description: "", status: "" });
        setError({});
      }
    } catch (error) {
      console.error("Error sending data to server", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Example Modal"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
        },
        overlay: {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <div className="mr-6">
            <label htmlFor="" className="block">
              Title:
            </label>
            <input
              type="text"
              className="border-2 border-black py-0.5 pl-1"
              value={formData.title}
              onChange={handleChange}
              name="title"
            />
            {error.title && (
              <span className="text-red-500 block">{error.title}</span>
            )}
          </div>
          <div className="mb-3 mt-2">
            <label htmlFor="" className="block">
              Description(Optional):
            </label>
            <input
              type="text"
              className="border-2 border-black py-0.5 pl-1"
              value={formData.description}
              onChange={handleChange}
              name="description"
            />
          </div>
          <div>
            <select
              value={formData.status}
              onChange={handleChange}
              name="status"
              className="border-2 border-black mt-2"
            >
              <option value="">Select Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            {error.status && (
              <span className="text-red-500 block">{error.status}</span>
            )}
          </div>
        </div>

        <button className="mt-6 border-2 border-black py-[3px] px-[15px]">
          Save
        </button>
      </form>
    </Modal>
  );
};

export default TodoForm;
