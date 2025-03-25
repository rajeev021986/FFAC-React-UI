import React from "react";
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
}) {
  const subjectType = [
    { name: "OUTSTANDING", value: "OUTSTANDING" },
    { name: "OTHER", value: "OTHER" },
    { name: "DELAY NOTIFICATION", value: "DELAY NOTIFICATION" },
  ];

  const handleNoteChange = (field, value) => {
    let updatedNotes = [...formik.values.notes];
    updatedNotes[0] = { ...updatedNotes[0], [field]: value };
    formik.setFieldValue("notes", updatedNotes);
  };

  const handleAddNote = () => {
    const newNote = {
      noteId: Date.now(),
      subject: formik.values.notes[0]?.subjectType || "", // ✅ Renamed to "subject"
      note: formik.values.notes[0]?.note || "",
      createdDate: new Date().toISOString(),
    };

    const storedNotes = JSON.parse(sessionStorage.getItem("notes")) || [];
    const updatedNotes = [...storedNotes, newNote];

    sessionStorage.setItem("notes", JSON.stringify(updatedNotes));
    formik.setFieldValue("notes", updatedNotes);
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
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <SelectBox
                  label="Subject"
                  id="subjectType"
                  options={subjectType}
                  value={formik.values.notes[0]?.subjectType || ""}
                  onChange={(e) =>
                    handleNoteChange("subjectType", e.target.value)
                  }
                  disabled={disabled}
                />
              </Grid>
            </Grid>

            <Grid item sx={{ width: "100%", marginTop: 3 }} sm={12}>
              <InputBox
                label="Notes"
                id="note"
                value={formik.values.notes[0]?.note || ""}
                onChange={(e) => handleNoteChange("note", e.target.value)}
                disabled={disabled}
              />
            </Grid>
          </Box>

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
