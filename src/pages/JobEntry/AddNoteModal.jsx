import React, { useState, useEffect } from "react";
import { Typography, Modal, Box, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputBox from "../../components/common/InputBox";
import SelectBox from "../../components/common/SelectBox";
import { ThemeButton } from "../../components/common/Button";

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

export default function AddNoteModal({
  formik,
  disabled = false,
  toggleNotes,
  handleToggleNote,
  onNoteAdded,
  selectedNote,
}) {
  const subjectType = [
    { name: "OUTSTANDING", value: "OUTSTANDING" },
    { name: "OTHER", value: "OTHER" },
    { name: "DELAY NOTIFICATION", value: "DELAY NOTIFICATION" },
  ];

  // Local state for note inputs
  const [noteData, setNoteData] = useState({
    id: null,
    subject: "",
    note: "",
    createdDate: new Date().toISOString(),
    createdBy: localStorage.getItem("userId") || "Unknown User",
    new:true
  });

  // Sync selectedNote into local state when editing
  useEffect(() => {
    if (selectedNote) {
      setNoteData(selectedNote);
    }
     else {
      setNoteData({
        id: Date.now(),
        subject: "",
        note: "",
        createdDate: new Date().toISOString(),
        createdBy: localStorage.getItem("userId") || "Unknown User",
      });
    }
  }, [selectedNote]);

  // Handle input changes
  const handleChange = (field, value) => {
    setNoteData((prev) => ({ ...prev, [field]: value }));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!noteData.subject || !noteData.note) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Ensure new notes have `new: true`
    const updatedNote = selectedNote
      ? noteData // If editing, keep the existing noteData
      : { ...noteData, id: Date.now(), new: true }; // If new, mark `new: true`
  
    // Update Formik notes field
    const updatedNotes = selectedNote
      ? formik.values.notes.map((note) =>
          note.id === noteData.id ? updatedNote : note
        )
      : [...formik.values.notes, updatedNote];
  
    formik.setFieldValue("notes", updatedNotes);
    onNoteAdded(updatedNote); // Update parent state
  
    // Reset noteData
    setNoteData({
      id: Date.now(),
      subject: "",
      note: "",
      createdDate: new Date().toISOString(),
      new: true, // Ensure it's set for new notes
      createdBy: localStorage.getItem("userId") || "Unknown User", 
    });
  
    handleToggleNote(); // Close modal
  };
  
// Reset fields when closing the modal manually
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
          {selectedNote ? "Edit Note" : "Add Note"}
        </Typography>

        <Box sx={{ width: "100%", mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <SelectBox
                label="Subject"
                id="subjectType"
                options={subjectType}
                value={noteData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
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
