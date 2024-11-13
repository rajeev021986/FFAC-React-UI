import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  CircularProgress,
  TablePagination,
  TableSortLabel,
} from "@mui/material";

const LoaderOverlay = ({ loading }) =>
  loading ? (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
      }}
    >
      <CircularProgress />
    </Box>
  ) : null;

// Reusable Row component
function Row({ row, columns, getCollapsibleContent }) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {columns.map((col, index) => (
          <TableCell
            key={index}
            style={{ minWidth: col.width, textAlign: "center" }}
            // align={"center"}
          >
            {col.renderCell ? col.renderCell(row[col.field]) : row[col.field]}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={columns.length + 1}
        >
          <Collapse in={open} timeout="auto">
            <Box sx={{ margin: 1 }}>
              {getCollapsibleContent && getCollapsibleContent(row)}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  getCollapsibleContent: PropTypes.func,
};

// Reusable CollapsibleTable component
export default function CollapsibleTable({
  columns,
  rows,
  count,
  getCollapsibleContent,
  pagination,
  loading = false,
  onSortChange,
}) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(property);
    onSortChange(property, newOrder); // Notify the parent about the sort change for server-side processing
  };

  return (
    <Box sx={{ position: "relative", height: { md: "62vh", xl : "80vh" } }}>
      <TableContainer component={Paper} sx={{ height: { md: "56vh",xl : "74vh" } }}>
        <Table stickyHeader dense size="small" aria-label="collapsible table">
          <TableHead >
            <TableRow>
              <TableCell sx={{backgroundColor: "background.light"}} />
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  sx={{ minWidth: col.width, textAlign: "center",backgroundColor: "background.light" }}
                >
                  <TableSortLabel
                    active={orderBy === col.field}
                    direction={orderBy === col.field ? order : "asc"}
                    hideSortIcon={!(orderBy === col.field)}
                    onClick={() => handleRequestSort(col.field)}
                    
                  >
                    {col.headerName}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => (
              <Row
                key={row.name}
                row={row}
                columns={columns}
                getCollapsibleContent={getCollapsibleContent}
              />
            ))}
          </TableBody>
        </Table>
        <LoaderOverlay loading={loading} />
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={count}
        rowsPerPage={pagination.perPage}
        page={pagination.page}
        onPageChange={pagination.onPageChange}
        onRowsPerPageChange={pagination.onRowPerPageChange}
      />
    </Box>
  );
}

CollapsibleTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      width: PropTypes.number,
      align: PropTypes.string,
      headerAlign: PropTypes.string,
      renderCell: PropTypes.func,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  getCollapsibleContent: PropTypes.func,
  count: PropTypes.number.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    onRowPerPageChange: PropTypes.func,
    onPageChange: PropTypes.func,
  }),
};
