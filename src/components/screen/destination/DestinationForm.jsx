import React from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import InputBox from "../../common/InputBox";
import { useFormik } from "formik";
import AppDatePicker from "../../common/AppDatePicker";
import { OutlinedButton, ThemeButton } from "../../common/Button";
import { destinationValidation } from "./validation";
import {
  useAddDestinationMutation,
  useUpdateDestinationMutation,
} from "../../../store/api/destinationDataApi";
import toast from "react-hot-toast";
import ReusableRightDrawer from "../../common/CommonDrawer";
import { COMMON } from "../../../data/columns/audit";

export default function DestinationForm({ modal, setModal }) {
  const [addDestination, { isLoading: isAECLoading }] =
    useAddDestinationMutation();
  const [updateDestination, { isLoading: isUECLoading }] =
    useUpdateDestinationMutation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      owner: "SPR",
      code: modal.data.code || "",
      description: modal.data.description || "",
      location_type: modal.data.location_type || "",
      location_group: modal.data.location_group || "",
      address1: modal.data.address1 || "",
      address2: modal.data.address2 || "",
      city: modal.data.city || "",
      state: modal.data.state || "",
      postalcode: modal.data.postalcode || "",
      country: modal.data.country || "",
      lastmodifiedby: modal.data.lastmodifiedby || "",
      lastmodifieddate: modal.data.lastmodifieddate || new Date(),
    },
    validationSchema: destinationValidation,
    onSubmit: async (values) => {
      console.log(values);

      try {
        let response =
          modal.type === "edit"
            ? await updateDestination({
                id: modal.data.serial_id,
                ...values,
              }).unwrap()
            : await addDestination(values).unwrap();
        // handle errors and success with toast
        if (response.status === "success") {
          toast.success(response.message);
          setModal({ open: false, type: "", data: {} });
        }
      } catch (error) {
        toast.error(error.data.message);
      }
    },
  });
  const handleCloseModal = () => {
    setModal({ open: false, type: "", data: {} });
  };
  const handleAuditModal = () => {
    setDrawerOpen({ open: false, type: "", data: {} });
  };

  return (
    <Box sx={{ overflowY: "auto" }}>
      <Stack
        spacing={4}
        direction="column"
        useFlexGap
        flexWrap="wrap"
        p={2}
        width="100%"
        height="100%"
      >
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Owner"
            id="owner"
            value={formik.values.owner}
            error={formik.errors.owner}
            disabled={true}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Code"
            id="code"
            value={formik.values.code}
            error={formik.errors.code}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Description"
            id="description"
            value={formik.values.description}
            error={formik.errors.description}
            onChange={formik.handleChange}
            multiline
            rows={2}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Location Type"
            id="location_type"
            value={formik.values.location_type}
            error={formik.errors.location_type}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Location Group"
            id="location_group"
            value={formik.values.location_group}
            error={formik.errors.location_group}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Address1"
            id="address1"
            value={formik.values.address1}
            error={formik.errors.address1}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Address2"
            id="address2"
            value={formik.values.address2}
            error={formik.errors.address2}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <InputBox
            label="City"
            id="city"
            value={formik.values.city}
            error={formik.errors.city}
            onChange={formik.handleChange}
          />
          <InputBox
            label="State"
            id="state"
            value={formik.values.state}
            error={formik.errors.state}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Postal Code"
            id="postalcode"
            value={formik.values.postalcode}
            error={formik.errors.postalcode}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Country"
            id="country"
            value={formik.values.country}
            error={formik.errors.country}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Modified By"
            id="lastmodifiedby"
            value={formik.values.lastmodifiedby}
            error={formik.errors.lastmodifiedby}
            onChange={formik.handleChange}
          />
          <AppDatePicker
            label="Modified Date"
            id="lastmodifieddate"
            value={formik.values.lastmodifieddate}
            onChange={(value) =>
              formik.setFieldValue("lastmodifieddate", value)
            }
            disabled={true}
            sx={{ marginTop: "16px", marginButtom: "8px" }}
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          {modal.type === "edit" && (
            <ThemeButton
              sx={{ fontWeight: "500" }}
              onClick={handleAuditModal}
              size="small"
            >
              Audit
            </ThemeButton>
          )}
          <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
            <OutlinedButton
              sx={{ fontWeight: "500" }}
              onClick={handleCloseModal}
              size="small"
            >
              Cancel
            </OutlinedButton>
            <ThemeButton
              onClick={formik.handleSubmit}
              sx={{ fontWeight: "500" }}
              size="small"
            >
              {isAECLoading ||
                (isUECLoading && <CircularProgress size={20} color="white" />)}
              {modal.type === "edit" ? "Update" : "Save"}
            </ThemeButton>
          </Stack>
        </Stack>
      </Stack>
      {drawerOpen && (
        <ReusableRightDrawer
          open={drawerOpen}
          data={modal?.data?.serial_id}
          table={"DESTINATION"}
          column={COMMON}
          onClose={() => setDrawerOpen(false)}
          isFrontmost={true}
        />
      )}
    </Box>
  );
}
