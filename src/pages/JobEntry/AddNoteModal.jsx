import React, { useState } from "react";
import { Typography, Modal, Box, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Components
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
  onNoteAdded, // ✅ Receive function to update notes
}) {
  const subjectType = [
    { name: "OUTSTANDING", value: "OUTSTANDING" },
    { name: "OTHER", value: "OTHER" },
    { name: "DELAY NOTIFICATION", value: "DELAY NOTIFICATION" },
  ];

  // Local state for new note input
  const [noteData, setNoteData] = useState({
    subjectType: "",
    note: "",
  });

  const handleChange = (field, value) => {
    setNoteData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNote = () => {
    if (!noteData.subjectType || !noteData.note) {
      alert("Please fill in all fields.");
      return;
    }

    const newNote = {
      id: Date.now(),
      subject: noteData.subjectType,
      note: noteData.note,
      createdDate: new Date().toISOString(),
    };

    onNoteAdded(newNote); // ✅ Call function to update the list
    setNoteData({ subjectType: "", note: "" }); // Reset form
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
          onClick={handleToggleNote}
          sx={{ position: "absolute", top: 8, right: 8, color: "grey.600" }}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="add-note-modal-title" variant="h6">
          Add Notes
        </Typography>

        <Box sx={{ width: "100%", mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <SelectBox
                label="Subject"
                id="subjectType"
                options={subjectType}
                value={noteData.subjectType}
                onChange={(e) => handleChange("subjectType", e.target.value)}
                disabled={disabled}
              />
            </Grid>
          </Grid>

          <Grid item sx={{ width: "100%", marginTop: 3 }} sm={12}>
            <InputBox
              label="Notes"
              id="note"
              value={noteData.note}
              onChange={(e) => handleChange("note", e.target.value)}
              disabled={disabled}
            />
          </Grid>

          <ThemeButton
            onClick={handleAddNote}
            sx={{
              marginTop: "10px",
              fontWeight: "500",
              color: "white !important",
            }}
          >
            Add
          </ThemeButton>
        </Box>
      </Box>
    </Modal>
  );
}
