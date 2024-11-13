import React from "react";
import { Box, CircularProgress, Stack } from "@mui/material";
import InputBox from "../../common/InputBox";
import { useFormik } from "formik";
import AppDatePicker from "../../common/AppDatePicker";
import { OutlinedButton, ThemeButton } from "../../common/Button";
import { vendorValidation } from "./validation";
import {
  useAddVendorMutation,
  useUpdateVendorMutation,
} from "../../../store/api/vendorDataApi";
import toast from "react-hot-toast";
import { USER_STATUS_OPTIONS } from "../../../data/options";
import SelectBox from "../../common/SelectBox";
import ReusableRightDrawer from "../../common/CommonDrawer";
import { COMMON } from "../../../data/columns/audit";

export default function VendorForm({ modal, setModal }) {
  const [addVendor, { isLoading: isAVLoading }] = useAddVendorMutation();
  const [updateVendor, { isLoading: isUVLoading }] = useUpdateVendorMutation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      party_id: modal.data.party_id || "",
      spr_vendor_id: modal.data.spr_vendor_id || "",
      status: modal.data.status || "",
      name: modal.data.name || "",
      address1: modal.data.address1 || "",
      address2: modal.data.address2 || "",
      city: modal.data.city || "",
      state: modal.data.state || "",
      postalcode: modal.data.postalcode || "",
      country: modal.data.country || "",
      telephone: modal.data.telephone || "",
      fax: modal.data.fax || "",
      email: modal.data.email || "",
      contact_person: modal.data.contact_person || "",
      id_code: modal.data.id_code || "",
      lastmodifiedby: modal.data.lastmodifiedby || "",
      lastmodifieddate: modal.data.lastmodifieddate || new Date(),
    },
    validationSchema: vendorValidation,
    onSubmit: async (values) => {
      console.log(values);

      try {
        let response =
          modal.type === "edit"
            ? await updateVendor({
                id: modal.data.serial_id,
                ...values,
              }).unwrap()
            : await addVendor(values).unwrap();
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
            label="Party Id"
            id="party_id"
            value={formik.values.party_id}
            error={formik.errors.party_id}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Spr Vendor Id"
            id="spr_vendor_id"
            value={formik.values.spr_vendor_id}
            error={formik.errors.spr_vendor_id}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <SelectBox
            label="Status"
            id="status"
            options={USER_STATUS_OPTIONS}
            value={formik.values.status}
            error={formik.errors.status}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Name"
            id="name"
            value={formik.values.name}
            error={formik.errors.name}
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
            label="Telephone"
            id="telephone"
            value={formik.values.telephone}
            error={formik.errors.telephone}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Fax"
            id="fax"
            value={formik.values.fax}
            error={formik.errors.fax}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Email"
            id="email"
            value={formik.values.email}
            error={formik.errors.email}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Contact Person"
            id="contact_person"
            value={formik.values.contact_person}
            error={formik.errors.contact_person}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Id Code"
            id="id_code"
            value={formik.values.id_code}
            error={formik.errors.id_code}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Modified By"
            id="lastmodifiedby"
            value={formik.values.lastmodifiedby}
            error={formik.errors.lastmodifiedby}
            disabled={true}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <AppDatePicker
            label="Modified Date"
            id="lastmodifieddate"
            value={formik.values.lastmodifieddate}
            onChange={(value) =>
              formik.setFieldValue("lastmodifieddate", value)
            }
            disabled={true}
            sx={{ marginTop: "16px", marginButtom: "8px", width: "50%" }}
          />
          <Stack width="50%"></Stack>
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
              {isAVLoading ||
                (isUVLoading && <CircularProgress size={20} color="white" />)}
              {modal.type === "edit" ? "Update" : "Save"}
            </ThemeButton>
          </Stack>
        </Stack>
      </Stack>
      {drawerOpen && (
        <ReusableRightDrawer
          open={drawerOpen}
          data={modal?.data?.serial_id}
          table={"VENDOR"}
          column={COMMON}
          onClose={() => setDrawerOpen(false)}
          isFrontmost={true}
        />
      )}
    </Box>
  );
}
