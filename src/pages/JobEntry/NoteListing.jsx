import React, { useEffect, useState } from "react";
import { ThemeButton } from "../../components/common/Button";
import AddNoteModal from "./AddNoteModal";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { useLocation } from "react-router-dom";

const NotesTable = ({ formik }) => {
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [toggleNotes, settoggleNotes] = useState(false);
  const handleToggleNote = () => {
    settoggleNotes((prev) => !prev);
  };

  const storedNotes = sessionStorage.getItem("notes");
  useEffect(() => {
    setNotes(storedNotes ? JSON.parse(storedNotes) : []);
  }, [storedNotes]);

  const NOTE_COLUMNS = [
    {
      flex: 1,
      field: "id",
      headerName: "ID",
      width: 110,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "subjectType",
      headerName: "Subject Type",
      width: 110,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "note",
      headerName: "Note",
      width: 110,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "createdDate",
      headerName: "Created Date",
      width: 110,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
  ];

  useEffect(() => {
    if (location.pathname !== "app/documentation/job/entry/newEntry") {
      sessionStorage.removeItem("notes");
      setNotes([]);
    }
  }, []);

  return (
    <React.Fragment>
      <ThemedGrid
        uniqueId="id"
        columns={NOTE_COLUMNS}
        count={notes || 0}
        data={notes}
      />

      <ThemeButton
        sx={{
          fontWeight: "500",
          color: "white !important",
          marginTop: 2,
        }}
        onClick={handleToggleNote}
      >
        Add Note
      </ThemeButton>
      <AddNoteModal
        toggleNotes={toggleNotes}
        handleToggleNote={handleToggleNote}
        formik={formik}
      />
    </React.Fragment>
  );
};

export default NotesTable;
