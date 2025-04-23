import React, { useEffect, useState } from "react";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";
import { useLocation } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton } from "@mui/material";
import AddEntry from "./AddEntry";

const PayableEntryList = ({ formik }) => {
  const disabled = formik?.values?.statusCode === -3;
  const [notes, setNotes] = useState([]);
  const [toggleNotes, setToggleNotes] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const handleEditClick = (note) => {
    setSelectedNote(note);
    setToggleNotes(true);
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    formik.setFieldValue("notes", updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleToggleNote = () => {
    setToggleNotes((prev) => !prev);
    if (toggleNotes) {
      setSelectedNote(null);
    }
  };

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

  const handleNoteAdded = (newNote) => {
    let updatedNotes;
    if (selectedNote) {
      updatedNotes = notes.map((note) =>
        note.id === selectedNote.id ? newNote : note
      );
    } else {
      updatedNotes = [...notes, newNote];
    }
    setNotes(updatedNotes);
    formik.setFieldValue("notes", updatedNotes);
    setSelectedNote(null);
  };

  const PAYABLE_COLUMNS = [
    {
      flex: 1,
      field: "jobNo",
      headerName: "Job No.",
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
      field: "chargeName",
      headerName: "Charge Name",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "unitType",
      headerName: "Unit Type",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "noOfUnits",
      headerName: "No Unit Units",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "unitRate",
      headerName: "Unit Rate",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "amount",
      headerName: "Amount",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "vatApplicable",
      headerName: "Vat Applicable",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "holdingTax",
      headerName: "Holding Tax",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "holdingAmount",
      headerName: "Holding Amount",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "totalAmount",
      headerName: "Total Amount",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "vatAmount",
      headerName: "Vat Amount",
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
          <EditIcon
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
              color: disabled ? "#ccc" : "#166ee0",
              opacity: disabled ? 0.5 : 1,
            }}
            onClick={() => {
              if (!disabled) handleEditClick(params.row);
            }}
          />
          <Delete
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
              color: disabled ? "#ccc" : "red",
              opacity: disabled ? 0.5 : 1,
            }}
            onClick={() => {
              if (!disabled) handleDeleteNote(params.row.id);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>
      <ThemedGrid
        uniqueId="id"
        columns={PAYABLE_COLUMNS}
        count={notes.length}
        data={notes}
      />

      <AddEntry
        toggleNotes={toggleNotes}
        handleToggleNote={handleToggleNote}
        formik={formik}
        onNoteAdded={handleNoteAdded}
        selectedNote={selectedNote}
      />
    </React.Fragment>
  );
};

export default PayableEntryList;
