import {
  badgeClasses,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import InputBox from "../../../common/InputBox";
import { Typography } from "@mui/material";
import VendorEditGrid from "./VendorEditGrid";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import { useNavigate } from "react-router-dom";
import ApiManager from "../../../../services/ApiManager";
import toast from "react-hot-toast";
import SelectBox from "../../../common/SelectBox";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useRef, useState } from "react";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import CustomToast from "../../../common/Toast/CustomToast";
import FormAutoComplete from "../../../common/AutoComplete/FormAutoComplete";
import getFirstError from "../../../common/FieldToastError";

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
  loading,
}) {
  const FieldRef = useRef(null);

  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);
  const nav = useNavigate();
  const { data: customerSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");
  const [dropdownData, setDropdownData] = useState({});
  const [loaderApprove, setLoaderApprove] = useState({
    approve: false,
    reject: false,
  });
  const handleApproveRequest = async () => {
    // if (formik.values.status == "Pending_Documents") {
    //   toast.custom(
    //     <CustomToast message="Document is Pending!" toast="warn" />,
    //     {
    //       closeButton: false,
    //     }
    //   );
    //   return;
    // }
    try {
      setLoaderApprove((prevState) => ({
        ...prevState,
        approve: true,
      }));
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
    setLoaderApprove((prevState) => ({
      ...prevState,
      approve: false,
    }));
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
      setLoaderApprove((prevState) => ({
        ...prevState,
        reject: true,
      }));
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
    setLoaderApprove((prevState) => ({
      ...prevState,
      reject: false,
    }));
  };

  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);
  const disable = type == "Approve";

  return (
    <>
      <Grid container sx={{ margin: 0, padding: 0, paddingRight: 1 }}>
        <Grid container sx={{ margin: 0 }}>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="Vendor Name *"
              id="vendorName"
              value={formik.values.vendorName}
              error={formik.errors.vendorName}
              onChange={formik.handleChange}
              inputRef={FieldRef}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="TIN No"
              id="tinNo"
              value={formik.values.tinNo}
              error={formik.errors.tinNo}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="VRN No"
              id="vrnNo"
              value={formik.values.vrnNo}
              error={formik.errors.vrnNo}
              onChange={formik.handleChange}
            />
          </Grid>
          {type == "copy" || type == "new" ? (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              paddingLeft={1}
              marginTop={2}
            >
              <InputBox
                label="Status"
                id="status"
                value={formik.values.status}
                error={formik.errors.status}
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
          ) : formik.values.statusCode == -2 ||
            formik.values.statusCode == 1 ? (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              sx={{ marginTop: 2 }}
              paddingLeft={1}
            >
              <SelectBox
                label="Status"
                id="status"
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
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              paddingLeft={1}
              marginTop={2}
            >
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

        <Grid container>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="Alias"
              id="alias"
              value={formik.values.alias}
              error={formik.errors.alias}
              onChange={formik.handleChange}
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
            paddingLeft={1}
          >
            <SelectBox
              label="Vendor Type *"
              id="type"
              options={vendorSettingsData?.body.vendorType}
              value={formik.values.type}
              error={formik.errors.type}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="Address 1 *"
              id="add1"
              value={formik.values.add1}
              error={formik.errors.add1}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="Address 2"
              id="add2"
              value={formik.values.add2}
              error={formik.errors.add2}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="Address 3"
              id="add3"
              value={formik.values.add3}
              error={formik.errors.add3}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="PO No"
              id="poNo"
              value={formik.values.poNo}
              error={formik.errors.poNo}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="City"
              id="city"
              value={formik.values.city}
              error={formik.errors.city}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="Province"
              id="province"
              value={formik.values.province}
              error={formik.errors.province}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <FormAutoComplete
              label="Country"
              id="countryId"
              suggestionName="country"
              value={{
                countryId: formik.values.countryId,
                countryName: formik.values.countryName,
              }}
              error={formik.errors.countryId}
              idKey="countryId"
              nameKey="countryName"
              // onChange={formik.setFieldValue}
              onChange={(selected) => {
                formik.setFieldValue("countryId", selected.countryId);
                formik.setFieldValue("countryName", selected.countryName);
              }}

              // onChange={formik.handleChange}
            ></FormAutoComplete>
          </Grid>
        </Grid>

        <Grid container>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="Contact Person"
              id="contactPerson"
              value={formik.values.contactPerson}
              error={formik.errors.contactPerson}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="Email Id"
              id="emailId"
              value={formik.values.emailId}
              error={formik.errors.emailId}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="Phone 1"
              id="telephone1"
              value={formik.values.telephone1}
              error={formik.errors.telephone1}
              onChange={formik.handleChange}
              type="number"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="Phone 2"
              id="telephone2"
              value={formik.values.telephone2}
              error={formik.errors.telephone2}
              onChange={formik.handleChange}
              type="number"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            <InputBox
              label="Fax"
              id="fax"
              type="number"
              value={formik.values.fax}
              error={formik.errors.fax}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            paddingLeft={1}
            marginTop={2}
          >
            {/* <InputBox
              label="Credit Days"
              id="creditDays"
              value={formik.values.creditDays}
              error={formik.errors.creditDays}
              onChange={formik.handleChange}
            /> */}

            <SelectBox
              label="Credit Days"
              id="creditDays"
              options={customerSettingsData?.body?.creditDays}
              value={
                formik.values.paymentType == "credit"
                  ? formik.values.creditDays
                  : formik.values.creditDays
              }
              error={formik.errors.creditDays}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        {/* {currentError && (
          <Grid item xs={12} style={{ color: "red" }}>
            {currentError}
          </Grid>
        )} */}

        <Grid item xs={12}>
          <VendorEditGrid
            formik={formik}
            vendorSettingsData={vendorSettingsData}
            dropdownData={dropdownData}
          />
        </Grid>

        {formik.values.statusCode === -1 || page == "vendorApproval" ? (
          <Grid item xs={12} sx={{ padding: "10px 3px", margin: "auto" }}>
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
          <Grid item xs={12} sx={{ padding: "10px 3px" }}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={2}>
                <OutlinedButton
                  sx={{ fontWeight: "500" }}
                  onClick={() => nav(-1)}
                >
                  Close
                </OutlinedButton>
                <ThemeButton
                  onClick={formik.handleSubmit}
                  sx={{ fontWeight: "500", color: "white !important" }}
                >
                  {loading && <CircularProgress size={20} color="white" />}{" "}
                  {type == "Edit" ? "Update" : "Add"}
                </ThemeButton>
              </Stack>
            </Stack>
          </Grid>
        ) : (
          <Grid item xs={12} sx={{ padding: "10px 3px" }}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={2}>
                <OutlinedButton
                  sx={{ fontWeight: "500" }}
                  onClick={() => nav(-1)}
                >
                  Close
                </OutlinedButton>
                <ThemeButton
                  onClick={formik.handleSubmit}
                  sx={{ fontWeight: "500", color: "white !important" }}
                >
                  {loading && <CircularProgress size={20} color="white" />}{" "}
                  Update
                </ThemeButton>
                <ThemeButton
                  sx={{
                    fontWeight: "500",
                    backgroundColor: "red",
                    color: "white !important",
                  }}
                  onClick={() => handleRejectRequest()}
                >
                  {loaderApprove.reject && (
                    <CircularProgress size={20} color="white" />
                  )}{" "}
                  Reject
                </ThemeButton>
                <ThemeButton
                  sx={{ fontWeight: "500", color: "white !important" }}
                  onClick={() => handleApproveRequest()}
                >
                  {loaderApprove.approve && (
                    <CircularProgress size={20} color="white" />
                  )}{" "}
                  Approve
                </ThemeButton>
              </Stack>
            </Stack>
          </Grid>
        )}
      </Grid>
    </>
  );
}
