import React, { useState, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { TabView, TabPanel } from "primereact/tabview";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import styles from "./DataTables.module.css";
import AddTaskModal from "../AddTaskModal/AddTaskModal";

function DataTables(props) {
  let dropDownItems = [
    { label: "None", value: "none" },
    { label: "Created On", value: "createdOn" },
    { label: "Pending On", value: "dueDate" },
    { label: "Priority", value: "priority" },
  ];
  const [groupBy, setGroupBy] = useState("none");
  const [searchText, setSearchText] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [deleteData, setDeleteData] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedData, setSelectedData] = useState("");
  const [modalType, setModalType] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  let sVal = useRef(null);

  const searchHandle = (e) => {
    setSearchText(e.target.value);
    sVal.filter(e.target.value, "summary", "startsWith");
  };

  const markAsDone = (e) => {
    if (activeIndex === 0) {
      return { taskDone: e.currentState === "Done" };
    }
  };

  const headerTemplate = (data) => {
    return <span className={styles.headerClass}>{data[groupBy]}</span>;
  };
  const footerTemplate = (data) => <></>;

  const toggleModal = () => {
    setShowTaskModal(!showTaskModal);
  };

  const toggleDelete = () => {
    setShowDelete(!showDelete);
  };

  const onClickDelete = (rowData) => {
    setDeleteData(rowData);
    toggleDelete();
  };

  const onClickDone = (id) => {
    props.markDone(id);
  };

  const onClickReopen = (id) => {
    props.reOpenTask(id);
  };

  const onClickEdit = (rowData) => {
    setSelectedData(rowData);
    setModalType("Edit");
    toggleModal();
  };

  const onRowClick = (data) => {
    setSelectedData(data);
    setModalType("View");
    toggleModal();
  };
  const saveTask = (taskDetail, type) => {
    props.saveTask(taskDetail, type);
  };

  const action = (rowData) => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          icon="pi pi-pencil"
          title="Edit Task"
          onClick={(e) => {
            e.stopPropagation();
            onClickEdit(rowData);
          }}
          className=" p-button-primary"
        />
        {rowData.currentState === "Done" ? (
          <Button
            label="Re-Open"
            onClick={(e) => {
              e.stopPropagation();
              onClickReopen(rowData.id);
            }}
            className=" p-button-info "
          />
        ) : (
          <Button
            label="Done"
            onClick={(e) => {
              e.stopPropagation();
              onClickDone(rowData.id);
            }}
            className=" p-button-success "
          />
        )}
        <Button
          icon="pi pi-trash"
          title="Delete Task"
          onClick={(e) => {
            e.stopPropagation();
            onClickDelete(rowData);
          }}
          className="p-button-danger"
        />
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="No"
          onClick={toggleDelete}
          className="p-button-primary"
        />
        <Button
          label="Yes"
          className="p-button-danger"
          autoFocus
          onClick={(e) => {
            props.deleteTask(deleteData.id, deleteData.currentState);
            toggleDelete();
          }}
        />
      </div>
    );
  };

  const commonDataTable = (data) => {
    console.log("groupBy", groupBy);
    return groupBy !== "none" ? (
      <DataTable
        className="p-datatable-gridlines"
        scrollable
        scrollHeight="390px"
        value={data}
        rowClassName={markAsDone}
        onRowClick={(e) => onRowClick(e.data)}
        rowGroupMode="subheader"
        groupField={groupBy}
        sortMode="single"
        sortField={groupBy}
        sortOrder={1}
        rowGroupHeaderTemplate={headerTemplate}
        rowGroupFooterTemplate={footerTemplate}
        ref={(e) => (sVal = e)}
      >
        <Column field="summary" header="Summary" />
        <Column field="priority" header="Priority" />
        <Column field="createdOn" header="Created On" />
        <Column field="dueDate" header="Due By" />
        <Column header="Actions" body={action} />
      </DataTable>
    ) : (
      <DataTable
        value={data}
        className="p-datatable-gridlines"
        rowClassName={markAsDone}
        onRowClick={(e) => onRowClick(e.data)}
        scrollable
        sortable
        scrollHeight="390px"
        ref={(e) => (sVal = e)}
      >
        <Column field="summary" header="Summary" sortable />
        <Column field="priority" header="Priority" sortable />
        <Column field="createdOn" header="Created On" sortable />
        <Column field="dueDate" header="Due By" sortable />
        <Column header="Action" body={action} />
      </DataTable>
    );
  };

  return (
    <>
      <Row>
        <Col md="3" sm="3">
          <label className="control-label">Group By</label>
          <Dropdown
            value={groupBy}
            options={dropDownItems}
            onChange={(e) => setGroupBy(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col md="9" sm="9">
          <label className="control-label ">Search</label>
          <InputText
            value={searchText}
            onChange={(e) => searchHandle(e)}
            style={{ width: "100%" }}
            placeholder="Search Tasks"
          />
        </Col>
      </Row>
      <br />
      <Row>
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel header="All">
            {commonDataTable(props.pendingTasks.concat(props.completedTasks))}
          </TabPanel>
          <TabPanel header="Pending">
            {commonDataTable(props.pendingTasks)}
          </TabPanel>
          <TabPanel header="Completed">
            {commonDataTable(props.completedTasks)}
          </TabPanel>
        </TabView>
      </Row>
      {showDelete && (
        <>
          <Dialog
            header="Confirmation"
            style={{ width: "40%" }}
            visible={showDelete}
            onHide={toggleDelete}
            footer={renderFooter}
          >
            <p>
              <h5>
                <em>Task Summary:</em> {deleteData.summary}
              </h5>
              <div>Do you want to delete this task ?</div>
            </p>
          </Dialog>
        </>
      )}
      {showTaskModal && (
        <AddTaskModal
          visible={showTaskModal}
          toggle={toggleModal}
          modalType={modalType}
          selectedData={selectedData}
          saveTask={saveTask}
        />
      )}
    </>
  );
}

export default DataTables;
