import { useState } from "react";

import AddNoteModal from "./AddNoteModal";
import { ThemeButton } from "../../components/common/Button";

const NoteListing = ({ formik }) => {
  const [toggleNotes, settoggleNotes] = useState(false);

  const handleToggleNote = () => {
    console.log("called");
    settoggleNotes((prev) => !prev);
  };

  return (
    <>
      <ThemeButton
        onClick={handleToggleNote}
        sx={{
          fontWeight: "500",
          color: "white !important",
        }}
      >
        Add Notes
      </ThemeButton>

      <AddNoteModal
        toggleNotes={toggleNotes}
        handleToggleNote={handleToggleNote}
        formik={formik}
      />
    </>
  );
};

export default NoteListing;
