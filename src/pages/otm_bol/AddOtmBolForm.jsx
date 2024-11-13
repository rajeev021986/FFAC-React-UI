import {
  Box,
  CircularProgress,

  Stack,

} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { ThemeButton } from "../../components/common/Button";
import AppDatePicker from "../../components/common/AppDatePicker";
import InputBox from "../../components/common/InputBox";
// import { DeleteOutline } from "@mui/icons-material";
import React from "react";
import VirtualGrid from "../../components/common/Grid/VirtualGrid";

const AddOtmBolForm = ({ payload, detailsPayload }) => {
  const handleFormSubmit = (value, { setSubmitting, setErrors }) => {
    console.log(value);
    setSubmitting(false);
  };

  console.log("values.details : ",payload?.details)

  // const columns = [
  //   {
  //     field: "pl_no",
  //     headerName: "PL No",
  //     minWidth: 150,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "po_no",
  //     headerName: "PO No",
  //     minWidth: 150,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "sku",
  //     headerName: "SKU",
  //     minWidth: 100,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "hts_code",
  //     headerName: "HTS Code (Primary)",
  //     minWidth: 150,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "hts_code_secondary",
  //     headerName: "HTS Code (Secondary)",
  //     minWidth: 150,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "container",
  //     headerName: "Container",
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "description",
  //     headerName: "Description",
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "qty",
  //     headerName: "Qty",
  //     minWidth: 80,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "qty_ctn",
  //     headerName: "Qty/Master Ctn",
  //     minWidth: 120,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "mcq",
  //     headerName: "Master Carton Qty",
  //     minWidth: 120,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "gross_weight",
  //     headerName: "Gross Weight",
  //     minWidth: 100,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "volume",
  //     headerName: "Volume",
  //     minWidth: 100,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "total_entered_value",
  //     headerName: "Total Entered Value",
  //     minWidth: 150,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "hmf",
  //     headerName: "HMF",
  //     minWidth: 80,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "mpf",
  //     headerName: "MPF",
  //     minWidth: 80,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "duty_amount",
  //     headerName: "Duty Amount",
  //     minWidth: 100,
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //   },
  //   {
  //     field: "action",
  //     headerName: "Action",
  //     flex: 1,
  //     align: "center",
  //     editable: true,
  //     sortable: false,
  //   },
  // ];


  // const columns = [
  //   {
  //     Header: 'PL No',
  //     accessor: 'pl_no',
  //   },
  //   {
  //     Header: 'PO No',
  //     accessor: 'po_no',
  //   },
  //   {
  //     Header: 'SKU',
  //     accessor: 'sku',
  //   },
  //   {
  //     Header: 'HTS Code (Primary)',
  //     accessor: 'hts_code',
  //   },
  //   {
  //     Header: 'HTS Code (Secondary)',
  //     accessor: 'hts_code_secondary',
  //   },
  //   {
  //     Header: 'Container',
  //     accessor: 'container',
  //   },
  //   {
  //     Header: 'Description',
  //     accessor: 'description',
  //   },
  //   {
  //     Header: 'Qty',
  //     accessor: 'qty',
  //   },
  //   {
  //     Header: 'Qty/Master Ctn',
  //     accessor: 'qty_ctn',
  //   },
  //   {
  //     Header: 'Master Carton Qty',
  //     accessor: 'mcq',
  //   },
  //   {
  //     Header: 'Gross Weight',
  //     accessor: 'gross_weight',
  //   },
  //   {
  //     Header: 'Volume',
  //     accessor: 'volume',
  //   },
  //   {
  //     Header: 'Total Entered Value',
  //     accessor: 'total_entered_value',
  //   },
  //   {
  //     Header: 'HMF',
  //     accessor: 'hmf',
  //   },
  //   {
  //     Header: 'MPF',
  //     accessor: 'mpf',
  //   },
  //   {
  //     Header: 'Duty Amount',
  //     accessor: 'duty_amount',
  //   },
  //   {
  //     Header: 'Action',
  //     accessor: 'action',
  //     disableSortBy: true, // Prevents sorting on this column
  //     Cell: ({ row }) => <button>Edit</button>, // Example action column with button
  //   },
  // ];


  const columns = [
    {
      id: 'pl_no',
      header: 'PL No',
      accessorKey: 'pl_no',
      size: 150, // Set width for this column
    },
    {
      id: 'po_no',
      header: 'PO No',
      accessorKey: 'po_no',
      size: 150,
    },
    {
      id: 'sku',
      header: 'SKU',
      accessorKey: 'sku',
      size: 100,
    },
    {
      id: 'hts_code',
      header: 'HTS Code (Primary)',
      accessorKey: 'hts_code',
      size: 150,
    },
    {
      id: 'hts_code_secondary',
      header: 'HTS Code (Secondary)',
      accessorKey: 'hts_code_secondary',
      size: 150,
      // cell: ({ row }) => {
      //   console.log("Row : ",row);
        
      //   return <button>Edit</button>
      // }
    },
    {
      id: 'container',
      header: 'Container',
      accessorKey: 'container',
      size: 120,
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
      size: 250,
    },
    {
      id: 'qty',
      header: 'Qty',
      accessorKey: 'qty',
      size: 80,
    },
    {
      id: 'qty_ctn',
      header: 'Qty/Master Ctn',
      accessorKey: 'qty_ctn',
      size: 120,
    },
    {
      id: 'mcq',
      header: 'Master Carton Qty',
      accessorKey: 'mcq',
      size: 150,
    },
    {
      id: 'gross_weight',
      header: 'Gross Weight',
      accessorKey: 'gross_weight',
      size: 100,
    },
    {
      id: 'volume',
      header: 'Volume',
      accessorKey: 'volume',
      size: 100,
    },
    {
      id: 'total_entered_value',
      header: 'Total Entered Value',
      accessorKey: 'total_entered_value',
      size: 150,
    },
    {
      id: 'hmf',
      header: 'HMF',
      accessorKey: 'hmf',
      size: 80,
    },
    {
      id: 'mpf',
      header: 'MPF',
      accessorKey: 'mpf',
      size: 80,
    },
    {
      id: 'duty_amount',
      header: 'Duty Amount',
      accessorKey: 'duty_amount',
      size: 100,
    },
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'action',
      size: 100,
      cell: ({ row }) => <button>Edit</button>, // Example action column with button
    },
  ];
  
  
  const detailsArray = {
    pl_no: "",
    po_no: "",
    hts_code: "",
    hts_code_secondary: "",
    container: "",
    description: "",
    qty: "",
    qty_ctn: "",
    mcq: "",
    gross_weight: "",
    volume: "",
    total_entered_value: "",
    hmf: "",
    mpf: "",
    duty_amount: "",
  };

  // const TableRow = ({ rowData }) => (
  //   <tr>
  //     <td>{rowData.pl_no}</td>
  //     <td>{rowData.po_no}</td>
  //     <td>{rowData.sku}</td>
  //     <td>{rowData.hts_code}</td>
  //     <td>{rowData.hts_code_secondary}</td>
  //     <td>{rowData.container}</td>
  //     <td>{rowData.description}</td>
  //     <td>{rowData.qty}</td>
  //     <td>{rowData.qty_ctn}</td>
  //     <td>{rowData.mcq}</td>
  //     <td>{rowData.gross_weight}</td>
  //     <td>{rowData.volume}</td>
  //     <td>{rowData.total_entered_value}</td>
  //     <td>{rowData.hmf}</td>
  //     <td>{rowData.mpf}</td>
  //     <td>{rowData.duty_amount}</td>
  //     <td>{rowData.action}</td>
  //   </tr>
  // );

  // const Row = React.memo(({index,handleBlur,handleChange,detail,errors,touched,remove}) => {
  //   return (
  //     <TableRow key={index}>
  //       <TableCell>
  //         <Field name={`details[${index}].pl_no`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.pl_no}
  //               error={touched.pl_no && Boolean(errors.pl_no)}
  //               helperText={touched.pl_no && errors.pl_no}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].po_no`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.po_no}
  //               error={touched.po_no && Boolean(errors.po_no)}
  //               helperText={touched.po_no && errors.po_no}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].sku`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.sku}
  //               error={touched.sku && Boolean(errors.sku)}
  //               helperText={touched.sku && errors.sku}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].hts_code`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.hts_code}
  //               error={touched.hts_code && Boolean(errors.hts_code)}
  //               helperText={touched.hts_code && errors.hts_code}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].hts_code_secondary`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.hts_code_secondary}
  //               error={
  //                 touched.hts_code_secondary &&
  //                 Boolean(errors.hts_code_secondary)
  //               }
  //               helperText={
  //                 touched.hts_code_secondary && errors.hts_code_secondary
  //               }
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].container`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.container}
  //               error={touched.container && Boolean(errors.container)}
  //               helperText={touched.container && errors.container}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].description`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.description}
  //               error={touched.description && Boolean(errors.description)}
  //               helperText={touched.description && errors.description}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].qty`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.qty}
  //               error={touched.qty && Boolean(errors.qty)}
  //               helperText={touched.qty && errors.qty}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].qty_ctn`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.qty_ctn}
  //               error={touched.qty_ctn && Boolean(errors.qty_ctn)}
  //               helperText={touched.qty_ctn && errors.qty_ctn}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].mcq`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.mcq}
  //               error={touched.mcq && Boolean(errors.mcq)}
  //               helperText={touched.mcq && errors.mcq}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].gross_weight`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.gross_weight}
  //               error={touched.gross_weight && Boolean(errors.gross_weight)}
  //               helperText={touched.gross_weight && errors.gross_weight}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].volume`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.volume}
  //               error={touched.volume && Boolean(errors.volume)}
  //               helperText={touched.volume && errors.volume}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].total_entered_value`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.total_entered_value}
  //               error={
  //                 touched.total_entered_value &&
  //                 Boolean(errors.total_entered_value)
  //               }
  //               helperText={
  //                 touched.total_entered_value && errors.total_entered_value
  //               }
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].hmf`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.hmf}
  //               error={touched.hmf && Boolean(errors.hmf)}
  //               helperText={touched.hmf && errors.hmf}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].mpf`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.mpf}
  //               error={touched.mpf && Boolean(errors.mpf)}
  //               helperText={touched.mpf && errors.mpf}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <Field name={`details[${index}].duty_amount`}>
  //           {({ field }) => (
  //             <InputBox
  //               {...field}
  //               type="text"
  //               onChange={handleChange}
  //               onBlur={handleBlur}
  //               value={detail.duty_amount}
  //               error={touched.duty_amount && Boolean(errors.duty_amount)}
  //               helperText={touched.duty_amount && errors.duty_amount}
  //             />
  //           )}
  //         </Field>
  //       </TableCell>
  //       <TableCell>
  //         <IconButton color="error.main" onClick={() => remove(index)}>
  //           <DeleteOutline />
  //         </IconButton>
  //       </TableCell>
  //     </TableRow>
  //   );
  // });

  return (
    <Box sx={{ p: 4 }}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          pol: "",
          pod: "",
          pol_date: "",
          pod_date: "",
          vessel: "",
          voyage: "",
          bol: "",
          supplier_name: "",
          qty: "",
          gross_weight: "",
          cbm: "",
          details: [],
          ...payload,
        }}
        onSubmit={handleFormSubmit}
      >
        {({
          isSubmitting,
          errors,
          touched,
          handleChange,
          handleBlur,
          values,
          setValues,
        }) => (
          <Form>
            <Stack direction={"row"} sx={{ my: 2 }} spacing={2}>
              <Field name="bol">
                {({ field }) => (
                  <InputBox
                    {...field}
                    type="text"
                    label="BOL No."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.bol}
                    error={touched.bol && Boolean(errors.bol)}
                    helperText={touched.bol && errors.bol}
                  />
                )}
              </Field>

              <Field name="supplier_name">
                {({ field }) => (
                  <InputBox
                    {...field}
                    type="text"
                    label="Supplier Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.supplier_name}
                    error={
                      touched.supplier_name && Boolean(errors.supplier_name)
                    }
                    helperText={touched.supplier_name && errors.supplier_name}
                  />
                )}
              </Field>
              <Field name="pol">
                {({ field }) => (
                  <InputBox
                    {...field}
                    type="text"
                    label="POL"
                    fullWidth
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.pol}
                    error={touched.pol && Boolean(errors.pol)}
                    helperText={touched.pol && errors.pol}
                  />
                )}
              </Field>

              <Field name="pol_date">
                {({ field }) => (
                  <AppDatePicker
                    {...field}
                    label="POL Date"
                    variant="outlined"
                    onChange={(value) =>
                      setValues((prev) => ({ ...prev, pol_date: value }))
                    }
                    value={values.pol_date}
                    error={touched.pol_date && Boolean(errors.pol_date)}
                    helperText={touched.pol_date && errors.pol_date}
                  />
                )}
              </Field>
            </Stack>
            <Stack direction={"row"} sx={{ my: 2 }} spacing={2}>
              <Field name="pod">
                {({ field }) => (
                  <InputBox
                    {...field}
                    type="text"
                    label="POD"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.pod}
                    error={touched.pod && Boolean(errors.pod)}
                    helperText={touched.pod && errors.pod}
                  />
                )}
              </Field>

              <Field name="pod_date">
                {({ field }) => (
                  <AppDatePicker
                    {...field}
                    type="text"
                    label="POD Date"
                    onChange={(value) =>
                      setValues((prev) => ({ ...prev, pod_date: value }))
                    }
                    value={values.pod_date}
                    error={touched.pod_date && Boolean(errors.pod_date)}
                    helperText={touched.pod_date && errors.pod_date}
                  />
                )}
              </Field>
              <Field name="vessel">
                {({ field }) => (
                  <InputBox
                    {...field}
                    type="text"
                    label="Vessel"
                    fullWidth
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.vessel}
                    error={touched.vessel && Boolean(errors.vessel)}
                    helperText={touched.vessel && errors.vessel}
                  />
                )}
              </Field>
              <Field name="voyage">
                {({ field }) => (
                  <InputBox
                    {...field}
                    type="text"
                    label="Voyage"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.voyage}
                    error={touched.voyage && Boolean(errors.voyage)}
                    helperText={touched.voyage && errors.voyage}
                  />
                )}
              </Field>
            </Stack>
            <Stack direction={"row"} sx={{ my: 2 }} spacing={2}>
              <Field name="qty">
                {({ field }) => (
                  <InputBox
                    {...field}
                    type="text"
                    label="Qty"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.qty}
                    error={touched.qty && Boolean(errors.qty)}
                    helperText={touched.qty && errors.qty}
                    sx={{ width: "24%" }}
                  />
                )}
              </Field>

              <Field name="gross_weight">
                {({ field }) => (
                  <InputBox
                    {...field}
                    type="text"
                    label="Gross Weight"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.gross_weight}
                    error={touched.gross_weight && Boolean(errors.gross_weight)}
                    helperText={touched.gross_weight && errors.gross_weight}
                    sx={{ width: "24%" }}
                  />
                )}
              </Field>

              <Field name="cbm">
                {({ field }) => (
                  <InputBox
                    {...field}
                    type="text"
                    label="CBM"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.cbm}
                    error={touched.cbm && Boolean(errors.cbm)}
                    helperText={touched.cbm && errors.cbm}
                    sx={{ width: "24%" }}
                  />
                )}
              </Field>
            </Stack>

            {/* <DataGrid
              columns={columns}
              rows={values.details}
              autoHeight
              // rowCount={values.details.length}
              getRowId={(row) => row["po_no"]}
              pagination={false}
              disableSelectionOnClick
            /> */}

            <VirtualGrid columns={columns} data={values.details} />

            

            <ThemeButton type="submit" disabled={isSubmitting} color="primary">
              {isSubmitting && <CircularProgress color="white" size={20} />}
              Register User
            </ThemeButton>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddOtmBolForm;
