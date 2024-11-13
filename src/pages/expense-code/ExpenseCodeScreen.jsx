import { Box, Card, CardHeader, IconButton, Stack } from "@mui/material";
import React from "react";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { OutlinedButton } from "../../components/common/Button";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import { AddCircleOutlineOutlined, GridOnOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setExpenseCodePagination,
  updateExpenseCodeInput,
} from "../../store/freatures/expenseCodeSlice";
import { useFetchExpenseCodeQuery } from "../../store/api/expenseCodeDataApi";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { EXPENSE_CODE_COLUMNS } from "../../data/columns/expense-code";
import { getExpenseCodeGridActions } from "../../components/screen/expense-code/actions";
import GridActions from "../../components/common/Grid/GridActions";
import ThemedModal from "../../components/common/ThemedModal";
import ExpenseCodeForm from "../../components/screen/expense-code/ExpenseCodeForm";
import KeywordSearch from "../../components/common/KeywordSearch";
import ReusableRightDrawer from "../../components/common/CommonDrawer";
import { COMMON } from "../../data/columns/audit";

export default function ExpenseCodeScreen() {
  const expenseCodeSelector = useSelector((state) => state.expenseCode);
  // const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {
    data: ExpenseCodeData,
    isError,
    isLoading,
    error,
    isFetching,
  } = useFetchExpenseCodeQuery({
    page: expenseCodeSelector?.pagination?.page + 1,
    perPage: expenseCodeSelector?.pagination?.pageSize,
    ...expenseCodeSelector?.formData,
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setExpenseCodePagination({ page, pageSize }));
  };

  EXPENSE_CODE_COLUMNS[EXPENSE_CODE_COLUMNS.length - 1].renderCell =
    GridActions({
      actions: getExpenseCodeGridActions(setModal),
    });

  return (
    <Box>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <OutlinedButton
              startIcon={<AddCircleOutlineOutlined />}
              onClick={() => {
                setModal({ open: true, type: "add", data: {} });
              }}
              size="small"
            >
              Add New
            </OutlinedButton>
          </>
        }
      />
      <Card  sx={{borderWidth : 1,borderColor : "border.main"}}>
        <CardHeader
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <KeywordSearch
                  keyword={expenseCodeSelector.formData.keyword}
                  setKeyword={(keyword) =>
                    dispatch(updateExpenseCodeInput({ keyword }))
                  }
                />
              </Box>
              <Box>
                <IconButton>
                  <GridOnOutlined color={"primary"} />
                </IconButton>
              </Box>
            </Stack>
          }
        />

        <ThemedGrid
          columns={EXPENSE_CODE_COLUMNS}
          uniqueId="serial_id"
          data={ExpenseCodeData?.data}
          count={ExpenseCodeData?.totalRecords}
          handlePage={handlePage}
          columnVisibility={{}}
          columnVisibilityHandler={() => {}}
          paginationModel={expenseCodeSelector.pagination}
          loading={isLoading || isFetching}
          disableColumnMenu
          disableColumnSorting
        />
      </Card>

      {modal.type !== "audit" && (
        <ThemedModal
          open={modal.open}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          modalTitle={
            modal.type === "add"
              ? "Add Expense Code Details"
              : "Edit Expense Code Details"
          }
        >
          <ExpenseCodeForm setModal={setModal} modal={modal} />
        </ThemedModal>
      )}
      {modal.type === "audit" && (
        <ReusableRightDrawer
          open={modal?.open}
          data={modal?.data?.serial_id}
          table={"EXPANSE_CODE"}
          column={COMMON}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          sx={{ zIndex: 2, position: "absolute" }} // Higher zIndex for the drawer
        />
      )}
    </Box>
  );
}
