import React from "react";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";

const DebitNoteListData = ({
  chargesData,
  DEBIT_INVOICE_COLUMNS,
  disabled,
  isViewDisabled,
}) => {
  //  const chargesData = formik.values.details || [];
  return (
    <React.Fragment>
      <ThemedGrid
        uniqueId="id"
        columns={DEBIT_INVOICE_COLUMNS}
        count={chargesData.length}
        data={chargesData}
        disabled={disabled || isViewDisabled}
        hideColumns={true}
        storageKey="DebitInvoiceDataGrid"
      />
    </React.Fragment>
  );
};

export default DebitNoteListData;
