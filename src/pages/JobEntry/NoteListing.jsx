import React, { useEffect, useState } from "react";
import { ThemeButton } from "../../components/common/Button";
import AddNoteModal from "./AddNoteModal";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { useLocation } from "react-router-dom";

const NotesTable = ({ formik }) => {
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [toggleNotes, setToggleNotes] = useState(false);

  const handleToggleNote = () => {
    setToggleNotes((prev) => !prev);
  };

  // Load notes from formik and localStorage
  const loadNotes = () => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const apiNotes = formik?.values?.notes || [];

    const combinedNotes = [...apiNotes, ...storedNotes].reduce((acc, note) => {
      if (!acc.some((n) => n.id === note.id)) {
        acc.push(note);
      }
      return acc;
    }, []);

    setNotes(combinedNotes);
  };

  useEffect(() => {
    loadNotes();
  }, [formik?.values?.notes]);

  useEffect(() => {
    if (location.pathname !== "/app/documentation/job/entry/editJobEntry") {
      localStorage.removeItem("notes");
      setNotes([]);
    }
  }, [location.pathname]);

  const handleNoteAdded = (newNote) => {
    const updatedNotes = [...notes, newNote];
    formik.setFieldValue("notes", updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

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
      field: "subject",
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

  return (
    <React.Fragment>
      <ThemedGrid
        uniqueId="id"
        columns={NOTE_COLUMNS}
        count={notes.length}
        data={notes}
      />

      <ThemeButton
        sx={{ fontWeight: "500", color: "white !important", marginTop: 2 }}
        onClick={handleToggleNote}
      >
        Add Note
      </ThemeButton>

      <AddNoteModal
        toggleNotes={toggleNotes}
        handleToggleNote={handleToggleNote}
        formik={formik}
        onNoteAdded={handleNoteAdded}
      />
    </React.Fragment>
  );
};

export default NotesTable;
