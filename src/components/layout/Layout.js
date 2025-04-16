import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { services } from "../../apiClient/apiClient";

const Layout = ({ taskStatus, taskInfo, setTaskInfo }) => {
  const columns = [
    { title: "To Do", key: taskStatus.todoTask, color: "bg-red-500" },
    {
      title: "In Progress",
      key: taskStatus.progressTask,
      color: "bg-violet-500",
    },
    { title: "Done", key: taskStatus.doneTask, color: "bg-blue-500" },
  ];

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source?.droppableId === destination?.droppableId &&
      source?.index === destination?.index
    ) {
      return;
    }

    const updatedTasks = [...taskInfo];
    const taskIndex = updatedTasks.findIndex((t) => t.id === draggableId);
    if (taskIndex !== -1) {
      updatedTasks[taskIndex].status = destination.droppableId;
      setTaskInfo(updatedTasks);
    }

    // Update backend
    try {
      await services.patch(`/todos/${draggableId}`, {
        status: destination.droppableId,
      });
    } catch (error) {
      console.error("Failed to update task status in backend", error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="py-4 px-8 flex gap-4 flex-col md:flex-row lg-flex-row">
        {columns.map(({ title, key, color }) => (
          <Droppable droppableId={key} key={key}>
            {(provided) => (
              <section
                className="flex-1 space-y-4 border-2 border-[#e6e6e6] p-4"
                key={key}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <p className="flex-1">
                  <span className={`block p-2 ${color}`}>{title}</span>
                </p>
                {taskInfo
                  .filter((task) => task.status === key)
                  .map((task, index) => (
                    <Draggable
                      draggableId={task.id.toString()}
                      key={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="p-2 bg-blue-500"
                          key={task.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p>
                            <span className="mr-2">Title:</span>
                            {task.title}
                          </p>
                          <p>
                            <span className="mr-2">Description:</span>
                            {task.description}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </section>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Layout;
