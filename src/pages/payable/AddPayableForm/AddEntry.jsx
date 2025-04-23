import React, { useState, useEffect } from "react";
import { Typography, Modal, Box, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputBox from "../../../components/common/InputBox";
import { ThemeButton } from "../../../components/common/Button";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "35%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

export default function AddEntry({
  formik,
  disabled = formik?.values?.statusCode === -3,
  toggleNotes,
  handleToggleNote,
  onNoteAdded,
  selectedNote,
}) {
  const [noteData, setNoteData] = useState({
    id: null,
    subject: "",
    note: "",
    createdDate: new Date().toISOString(),
    createdBy: localStorage.getItem("userId") || "Unknown User",
    new: true,
  });

  useEffect(() => {
    if (selectedNote) {
      setNoteData(selectedNote);
    } else {
      setNoteData({
        id: Date.now(),
        subject: "",
        note: "",
        createdDate: new Date().toISOString(),
        createdBy: localStorage.getItem("userId") || "Unknown User",
      });
    }
  }, [selectedNote]);

  const handleChange = (field, value) => {
    setNoteData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!noteData.subject || !noteData.note) {
      alert("Please fill in all fields.");
      return;
    }
    const updatedNote = selectedNote
      ? noteData
      : { ...noteData, id: Date.now(), new: true };

    const updatedNotes = selectedNote
      ? formik.values.notes.map((note) =>
          note.id === noteData.id ? updatedNote : note
        )
      : [...formik.values.notes, updatedNote];
    formik.setFieldValue("notes", updatedNotes);
    onNoteAdded(updatedNote);
    setNoteData({
      id: Date.now(),
      subject: "",
      note: "",
      createdDate: new Date().toISOString(),
      new: true,
      createdBy: localStorage.getItem("userId") || "Unknown User",
    });
    handleToggleNote();
  };

  const handleClose = () => {
    setNoteData({
      id: Date.now(),
      subject: "",
      note: "",
      createdDate: new Date().toISOString(),
    });
    handleToggleNote();
  };

  return (
    <Modal
      keepMounted
      open={toggleNotes}
      onClose={handleToggleNote}
      aria-labelledby="add-note-modal-title"
      aria-describedby="add-note-modal-description"
    >
      <Box sx={{ ...modalStyle, position: "relative" }}>
        <IconButton
          onClick={handleClose} // Reset fields when clicking close
          sx={{ position: "absolute", top: 8, right: 8, color: "grey.600" }}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="add-note-modal-title" variant="h6">
          {selectedNote ? "Edit Payable Entry" : "Add Payable Entry"}
        </Typography>

        <Box sx={{ width: "100%", mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputBox
                label="Notes"
                id="note"
                value={noteData.note}
                onChange={(e) => handleChange("note", e.target.value)}
                disabled={disabled}
              />
            </Grid>
          </Grid>

          <Grid item sx={{ width: "100%", marginTop: 3 }} sm={12}>
            <InputBox
              label="Notes"
              id="note"
              multiline
              rows={5}
              value={noteData.note}
              onChange={(e) => handleChange("note", e.target.value)}
              disabled={disabled}
            />
          </Grid>

          <ThemeButton
            onClick={handleSubmit}
            disabled={disabled}
            sx={{
              marginTop: "10px",
              fontWeight: "500",
              color: "white !important",
            }}
          >
            {selectedNote ? "Update" : "Add"}
          </ThemeButton>
        </Box>
      </Box>
    </Modal>
  );
}
