import React, { useState } from "react";
import { Button } from "primereact/button";
import styles from "./Home.module.css";
import DataTables from "../DataTable/DataTables";
import AddTaskModal from "../AddTaskModal/AddTaskModal";

let pTasks = [
  {
    id: 1,
    summary: "Go to Store",
    desciption: "Get all necessary items before lockdown",
    dueDate: "2022-04-30",
    priority: "Low",
    currentState: "open",
    createdOn: "2021-04-24",
  },
  {
    id: 2,
    summary: "Buy Groceries",
    desciption: "Buy Groceries from Market",
    dueDate: "2022-04-30",
    priority: "Medium",
    currentState: "open",
    createdOn: "2021-04-24",
  },
  {
    id: 4,
    summary: "Prepare Presentation",
    desciption: "Prepare Presentation For Client",
    dueDate: "2022-04-24",
    priority: "High",
    currentState: "open",
    createdOn: "2021-04-24",
  },
  {
    id: 5,
    summary: "Exercise",
    desciption: "Perform yoga from 6-7 in the morning",
    dueDate: "2022-04-28",
    priority: "High",
    currentState: "open",
    createdOn: "2021-04-24",
  },
];

let cTasks = [
  {
    id: 3,
    summary: "Workout",
    desciption: "Go to gym",
    dueDate: "2021-04-24",
    priority: "None",
    currentState: "Done",
    createdOn: "2021-04-22",
  },
];

function Home() {
  const [pendingTasks, setPendingTasks] = useState(pTasks);
  const [completedTasks, setCompletedTasks] = useState(cTasks);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [id, setId] = useState(6);

  const toggleModal = () => {
    setShowTaskModal(!showTaskModal);
  };

  const onAddClick = () => {
    toggleModal();
    setModalType("Add");
  };

  const markDone = (id) => {
    pendingTasks.map((task) => {
      if (task.id === id) {
        task["currentState"] = "Done";
        setCompletedTasks((prevTask) => [...prevTask, task]);
      }
      return null;
    });
    setPendingTasks((prev) => prev.filter((data) => data.id !== id));
  };

  const reOpenTask = (id) => {
    completedTasks.map((task) => {
      if (task.id === id) {
        task["currentState"] = "Open";
        setPendingTasks((prevTask) => [...prevTask, task]);
      }
      return null;
    });
    setCompletedTasks((prev) => prev.filter((data) => data.id !== id));
  };

  const deleteTask = (id, status) => {
    if (status === "Done") {
      setCompletedTasks((prev) => prev.filter((data) => data.id !== id));
    } else {
      setPendingTasks((prev) => prev.filter((data) => data.id !== id));
    }
  };

  const saveTask = (taskDetail, type) => {
    if (type === "Add") {
      console.log(" inside Add");
      console.log("taskdetails", taskDetail);
      setPendingTasks((prevTasks) => [taskDetail, ...prevTasks]);
      setId((prevId) => prevId + 1);
    } else if (type === "Edit") {
      console.log(" inside Edit");
      if (taskDetail.currentState === "Done") {
        let compTask = completedTasks.map((task) => {
          if (task.id === taskDetail.id) {
            return taskDetail;
          } else {
            return task;
          }
        });
        setCompletedTasks(compTask);
      } else {
        let pTasks = pendingTasks.map((task) => {
          if (task.id === taskDetail.id) {
            return taskDetail;
          } else {
            return task;
          }
        });
        setPendingTasks(pTasks);
      }
    }
  };

  return (
    <>
      <section className={styles.header}>
        <h2>To Do App</h2>
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-info"
          tooltip="Add Task"
          onClick={onAddClick}
        />
      </section>

      <section>
        <DataTables
          pendingTasks={pendingTasks}
          completedTasks={completedTasks}
          markDone={markDone}
          reOpenTask={reOpenTask}
          deleteTask={deleteTask}
          saveTask={saveTask}
          // searchTask={searchTask}
        />
      </section>
      {showTaskModal && (
        <AddTaskModal
          visible={showTaskModal}
          toggle={toggleModal}
          modalType={modalType}
          id={id}
          saveTask={saveTask}
        />
      )}
    </>
  );
}

export default Home;
