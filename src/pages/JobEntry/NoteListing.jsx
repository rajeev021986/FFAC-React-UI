import React, { useEffect, useState } from "react";
import { ThemeButton } from "../../components/common/Button";
import AddNoteModal from "./AddNoteModal";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { useLocation } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton } from "@mui/material";

const NotesTable = ({ formik }) => {
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [toggleNotes, setToggleNotes] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
 // Open modal & set selected note for editing
 const handleEditClick = (note) => {
  setSelectedNote(note);
  setToggleNotes(true);
};
const handleDeleteNote = (id) => {
  // Remove note from state
  const updatedNotes = notes.filter((note) => note.id !== id);
  setNotes(updatedNotes);

  // Update Formik state
  formik.setFieldValue("notes", updatedNotes);

  // Update localStorage
  localStorage.setItem("notes", JSON.stringify(updatedNotes));
};
const handleToggleNote = () => {
  setToggleNotes((prev) => !prev); // Toggle modal state
  if (toggleNotes) {
    setSelectedNote(null); // Reset selected note when closing
  }
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

  // const handleNoteAdded = (newNote) => {
  //   const updatedNotes = [...notes, newNote];
  //   formik.setFieldValue("notes", updatedNotes);
  //   localStorage.setItem("notes", JSON.stringify(updatedNotes));
  //   setNotes(updatedNotes);
  // };
  const handleNoteAdded = (newNote) => {
    let updatedNotes;
    if (selectedNote) {
      // Update existing note
      updatedNotes = notes.map((note) =>
        note.id === selectedNote.id ? newNote : note
      );
    } else {
      // Add new note
      updatedNotes = [...notes, newNote];
    }

    setNotes(updatedNotes);
    formik.setFieldValue("notes", updatedNotes);
    // localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setSelectedNote(null); // Reset selection after update
  };

  const NOTE_COLUMNS = [
    {
      flex: 1,
      field: "createdBy",
      headerName: "User",
      // width: 110,
      headerAlign: "center",
      align: "center",
      editable: false,
      renderCell: (params) => {
        const createdBy = params.row?.new 
          ? localStorage.getItem("userId") || "Unknown User" 
          : params.row?.createdBy || "";
    
        return <span>{createdBy}</span>;
      },
    },
    
    {
      flex: 1,
      field: "subject",
      headerName: "Subject",
      // width: 110,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "createdDate",
      headerName: "Date",
      // width: 110,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      sortable: false, 
      headerAlign: "center",
        renderHeader: () => (
                  <IconButton color="white" onClick={handleToggleNote}>
                    <AddCircleIcon />
                  </IconButton>
                ),
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <EditIcon   style={{ cursor: "pointer", color: "#166ee0" }}
             onClick={() => handleEditClick(params.row)}/>
          <Delete
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => handleDeleteNote(params.row.id)}
          />
        </div>
      ),
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

      {/* <ThemeButton
        sx={{ fontWeight: "500", color: "white !important", marginTop: 2 }}
        onClick={handleToggleNote}
      >
        Add Note
      </ThemeButton> */}

      <AddNoteModal
        toggleNotes={toggleNotes}
        handleToggleNote={handleToggleNote}
        formik={formik}
        onNoteAdded={handleNoteAdded}
        selectedNote={selectedNote} // Pass selected note
      />
    </React.Fragment>
  );
};

export default NotesTable;
