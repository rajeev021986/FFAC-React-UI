import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { ThemeButton } from "../../components/common/Button";
import AddNoteModal from "./AddNoteModal";

const NotesTable = ({ formik }) => {
  const [notes, setNotes] = useState([]);

  const [toggleNotes, settoggleNotes] = useState(false);
  const handleToggleNote = () => {
    settoggleNotes((prev) => !prev);
  };

  const storedNotes = sessionStorage.getItem("jobNotes");
  useEffect(() => {
    setNotes(storedNotes ? JSON.parse(storedNotes) : []);
  }, [storedNotes]);

  return (
    <React.Fragment>
      <Paper
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "calc(100vh - 190px)",
          overflowY: "auto",
          padding: 2,
        }}
      >
        <TableContainer
          component={Box}
          sx={{ maxHeight: "500px", width: "100%", overflowY: "auto" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Subject</strong>
                </TableCell>
                <TableCell>
                  <strong>Note</strong>
                </TableCell>
                <TableCell>
                  <strong>Created Date</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.length > 0 ? (
                notes.map((note) => (
                  <TableRow key={note.id} hover>
                    <TableCell>{note.id}</TableCell>
                    <TableCell>{note.subjectType}</TableCell>
                    <TableCell>{note.note}</TableCell>
                    <TableCell>
                      {new Date(note.createdDate).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No notes available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
