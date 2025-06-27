// mui components
import { Paper, Pagination, Box } from "@mui/material";
import { StyledDataGrid } from "./styles";
import { GridToolbarColumnsButton, useGridApiRef } from "@mui/x-data-grid";
import { StatusChip } from "../../utils/statusChip";
import { useEffect, useImperativeHandle, useMemo, useState } from "react";
const ThemedGrid = (props) => {
  const {
    columns,
    count,
    handlePage,
    data,
    columnVisibility,
    columnVisibilityHandler,
    sortModel,
    onSortModelChange,
    paginationModel,
    loading,
    uniqueId,
    hideColumns,
    storageKey,
    receiptsData,
    setEditedRows,
    ...rest
  } = props;
  const LOCAL_STORAGE_KEY = `themedGrid_${storageKey || "default"}`;
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setColumnVisibilityModel(JSON.parse(saved));
      } catch {
        setColumnVisibilityModel({});
      }
    }
  }, []);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });
  const [editingRowId, setEditingRowId] = useState(null);
  const apiRef = useGridApiRef();
  const handleColumnVisibilityChange = (newModel) => {
    setColumnVisibilityModel(newModel);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newModel));
  };

  const handleDate = (date) => {
    return date.split("T")[0];
  };
  // new changes

  const gridData = useMemo(() => {
    return data?.map((row) => {
      const edits = rest.editedRows?.[row[uniqueId]] || {};
      return {
        ...row,
        ...edits,
      };
    });
  }, [data, rest.editedRows, uniqueId]);

  console.log(gridData, "gridData");

  let modifiedColumns = columns.map((a) => {
    if (a.field === "status") {
      return {
        field: "status",
        headerName: "Status",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          return StatusChip(params?.row?.status?.toLowerCase(), "status");
        },
      };
    } else if (a.field === "isDoc") {
      return {
        field: "isDoc",
        headerName: "Document",
        width: 150,

        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          return StatusChip(params.row.isDoc, "document");
        },
      };
    } else {
      const smallFields = [
        "jobNo",
        "customerName",
        "supplierName",
        "shipmentType",
        "dateOfReceipt",
        "customerRefNo",
        "consigneeName",
        "portOfLoading",
        "placeOfDelivery",
      ];
      return {
        ...a,
        // flex: smallFields.includes(a.field) ? 3 : 1,
        minWidth: smallFields.includes(a.field) ? 190 : 60,
        // align: "center",
        headerAlign: "center",
      };
    }
  });

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        overflow: "hidden",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        overflowY: "auto",
        paddingBottom: "0px",
        marginBottom: "0px",
      }}
    >
      <StyledDataGrid
       
        editMode="cell"
        apiRef={apiRef}
        experimentalFeatures={{ newEditingApi: true }}
        processRowUpdate={(newRow) => {
          setEditedRows((prev) => ({
            ...prev,
            [newRow.uiId]: {
              ...(prev[newRow.uiId] || {}),
              ...newRow,
            },
          }));
          return newRow;
        }}
        onRowEditStop={(params, event) => {
          if (event.reason === "rowFocusOut") {
            event.defaultMuiPrevented = true;
          }
        }}
        onCellEditStart={(params) => {
          if (
            editingCell.id !== null &&
            (editingCell.id !== params.id || editingCell.field !== params.field)
          ) {
            // ✅ stop previous cell edit safely
            apiRef.current.stopCellEditMode({
              id: editingCell.id,
              field: editingCell.field,
            });
          }
          setEditingCell({ id: params.id, field: params.field });
        }}
        onCellEditStop={() => {
          setEditingCell({ id: null, field: null });
        }}
        onProcessRowUpdateError={(error) => {
          console.error("❌ Row update error:", error);
        }}
        pagination={!!paginationModel}
        paginationMode={paginationModel ? "server" : null}
        // sortingMode="server"
        loading={loading}
        columns={modifiedColumns}
        rows={gridData}
        columnHeaderHeight={42}
        rowCount={paginationModel ? count : gridData?.length}
        pageSizeOptions={paginationModel ? [10, 20, 50, 100] : undefined}
        paginationModel={paginationModel || undefined}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={handleColumnVisibilityChange}
        onPaginationModelChange={paginationModel ? handlePage : undefined}
        getRowId={(row) => row[uniqueId]}
        disableColumnFilter
        slots={{
          toolbar: () => (
            <Box
              sx={{
                display: hideColumns ? "none" : "flex",
                justifyContent: "flex-start",
                p: 0,
              }}
            >
              <GridToolbarColumnsButton />
            </Box>
          ),
        }}
        {...rest}
      />
    </Paper>
  );
};

export default ThemedGrid;
