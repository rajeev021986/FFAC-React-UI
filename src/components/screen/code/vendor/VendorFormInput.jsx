import { Button, Grid, Stack, TextField } from "@mui/material";
import InputBox from "../../../common/InputBox";
import { Typography } from "@mui/material";
import VendorEditGrid from "./VendorEditGrid";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import { useNavigate } from "react-router-dom";
import ApiManager from "../../../../services/ApiManager";
import toast from "react-hot-toast";
import SelectBox from "../../../common/SelectBox";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useState } from "react";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import CustomToast from "../../../common/Toast/CustomToast";
const customToast = () => (
  <div
    style={{
      color: "black",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
    }}
  >
    <WarningIcon
      style={{ marginRight: "8px", color: "yellow", fontSize: "20px" }}
    />
    Document is pending
  </div>
);
export default function VendorFormInput({
  formik,
  type,
  optionsSettingsData,
  vendorSettingsData,
  page,
}) {
  const nav = useNavigate();
  const [dropdownData, setDropdownData] = useState({});
  const handleApproveRequest = async () => {
    if (formik.values.status == "Pending_Documents") {
      toast.custom(
        <CustomToast message="Document is Pending!" toast="warn" />,
        {
          closeButton: false,
        }
      );
      return;
    }
    try {
      const response = await ApiManager.approveCustomerApprove(
        formik.values.id,
        "Vendor"
      );
      const message = response.message;
      nav(-1);
      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
    } catch (error) {
      toast.custom(
        <CustomToast
          message="Error occurred while approve customer"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
    }
  };

  const { data: optionsSettings } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: vendorSettings } =
    useGetOptionsSettingsQuery("vendor_settings");

  useEffect(() => {
    if (optionsSettings?.body || vendorSettings?.body) {
      setDropdownData({
        ...optionsSettings?.body,
        ...vendorSettings?.body,
      });
    }
  }, [optionsSettings]);

  const handleRejectRequest = async () => {
    if (!formik.values.rejectRemarks) {
      toast.custom(
        <CustomToast message="Reject remarks to be filled!" toast="warn" />,
        {
          closeButton: false,
        }
      );
      return;
    }
    try {
      const response = await ApiManager.rejectCustomerApprove(
        formik.values.id,
        "Vendor",
        formik.values.rejectRemarks
      );
      const message = response.message;
      nav(-1);
      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
    } catch (error) {
      toast.custom(
        <CustomToast
          message="Error occurred while reject customer"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
    }
  };
  const getFirstError = (errors) => {
    for (const key in errors) {
      if (Array.isArray(errors[key])) {
        for (const item of errors[key]) {
          const nestedError = getFirstError(item);
          if (nestedError) return nestedError;
        }
      } else if (typeof errors[key] === "object") {
        const nestedError = getFirstError(errors[key]);
        if (nestedError) return nestedError;
      } else {
        return errors[key];
      }
    }
    return null;
  };
  const currentError = getFirstError(formik.errors);
  const disable = type == "Approve";
  return (
    <>
      <Grid container paddingBottom={2}>
        <Grid container paddingTop={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Vendor Name"
              id="vendorName"
              value={formik.values.vendorName}
              error={formik.errors.vendorName}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="TIN No"
              id="tinNo"
              value={formik.values.tinNo}
              error={formik.errors.tinNo}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="VRN No"
              id="vrnNo"
              value={formik.values.vrnNo}
              error={formik.errors.vrnNo}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          {type == "copy" || type == "new" ? (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
              <InputBox
                label="Status"
                id="status"
                value={formik.values.status}
                error={formik.errors.status}
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
          ) : formik.values.isApproved == -2 || formik.values.isApproved == 1 ? (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              sx={{ marginTop: 2 }}
              paddingLeft={2}
            >
              <SelectBox
                label="Status"
                id="status"
                disabled={disable}
                options={optionsSettingsData?.body.status}
                value={
                  formik.values.status == "ACTIVE" ||
                    formik.values.status == "Active"
                    ? "Active"
                    : formik.values.status
                }
                error={formik.errors.status}
                onChange={formik.handleChange}
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
              <InputBox
                label="Status"
                id="status"
                value={formik.values.status}
                error={formik.errors.status}
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
          )}
        </Grid>

        <Grid container paddingTop={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Alias"
              id="alias"
              value={formik.values.alias}
              error={formik.errors.alias}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            sx={{ marginTop: 2 }}
            paddingLeft={2}
          >
            <SelectBox
              label="Vendor Type"
              id="type"
              options={vendorSettingsData?.body.vendorType}
              value={formik.values.type}
              error={formik.errors.type}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Address 1"
              id="add1"
              value={formik.values.add1}
              error={formik.errors.add1}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Address 2"
              id="add2"
              value={formik.values.add2}
              error={formik.errors.add2}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
        </Grid>

        <Grid container xs={12} paddingTop={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Address 3"
              id="add3"
              value={formik.values.add3}
              error={formik.errors.add3}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="PO No"
              id="poNo"
              value={formik.values.poNo}
              error={formik.errors.poNo}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
        </Grid>
        <Grid container paddingTop={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="City"
              id="city"
              value={formik.values.city}
              error={formik.errors.city}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Province"
              id="province"
              value={formik.values.province}
              error={formik.errors.province}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Country"
              id="country"
              value={formik.values.country}
              error={formik.errors.country}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
        </Grid>

        <Grid container paddingTop={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Contact Person"
              id="contactPerson"
              value={formik.values.contactPerson}
              error={formik.errors.contactPerson}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Email Id"
              id="emailId"
              value={formik.values.emailId}
              error={formik.errors.emailId}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Phone 1"
              id="telephone1"
              value={formik.values.telephone1}
              error={formik.errors.telephone1}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Phone 2"
              id="telephone2"
              value={formik.values.telephone2}
              error={formik.errors.telephone2}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Fax"
              id="fax"
              value={formik.values.fax}
              error={formik.errors.fax}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
        </Grid>
        <Grid container paddingTop={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={2}>
            <InputBox
              label="Credit Days"
              id="creditDays"
              value={formik.values.creditDays}
              error={formik.errors.creditDays}
              onChange={formik.handleChange}
              disabled={disable}
            />
          </Grid>
        </Grid>
        {currentError && (
          <Grid item xs={12} style={{ color: "red" }}>
            {currentError}
          </Grid>
        )}
        <Grid item xs={12}>
          <VendorEditGrid
            formik={formik}
            disabled={disable}
            vendorSettingsData={vendorSettingsData}
            dropdownData={dropdownData}
          />
        </Grid>
        {formik.values.status.toLowerCase() === "rejected" ||
          page == "vendorApproval" ? (
          <Grid item xs={12}>
            <TextField
              label="Reject Remarks"
              name="rejectRemarks"
              value={formik.values.rejectRemarks}
              error={formik.errors.rejectRemarks}
              onChange={formik.handleChange}
              disabled={page != "vendorApproval"}
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
          </Grid>
        ) : (
          <></>
        )}
        {!disable ? (
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={2}>
                <OutlinedButton
                  sx={{ fontWeight: "500" }}
                  onClick={() => nav(-1)}
                >
                  Cancel
                </OutlinedButton>
                <ThemeButton
                  onClick={formik.handleSubmit}
                  sx={{ fontWeight: "500" }}
                >
                  {/* {isLoading && (
                                <CircularProgress size={20} color="white" />
                            )}{" "} */}
                  {type == "Edit" ? "Update" : "Add"}
                </ThemeButton>
              </Stack>
            </Stack>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={2}>
                <OutlinedButton
                  sx={{ fontWeight: "500" }}
                  onClick={() => nav(-1)}
                >
                  Cancel
                </OutlinedButton>
                <ThemeButton
                  sx={{ fontWeight: "500", backgroundColor: "red" }}
                  onClick={() => handleRejectRequest()}
                >
                  {/* {isLoading && (
                                <CircularProgress size={20} color="white" />
                            )}{" "} */}
                  Approve reject
                </ThemeButton>
                <ThemeButton
                  sx={{ fontWeight: "500" }}
                  onClick={() => handleApproveRequest()}
                >
                  {/* {isLoading && (
                                <CircularProgress size={20} color="white" />
                            )}{" "} */}
                  Approve request
                </ThemeButton>
              </Stack>
            </Stack>
          </Grid>
        )}
      </Grid>
    </>
  );
}
