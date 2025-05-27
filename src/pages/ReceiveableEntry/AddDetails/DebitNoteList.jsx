import React from "react";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";

const DebitNoteListData = ({
  chargesData,
  DEBIT_INVOICE_COLUMNS,
  disabled,
}) => {
  return (
    <React.Fragment>
      <ThemedGrid
        uniqueId="id"
        columns={DEBIT_INVOICE_COLUMNS}
        count={chargesData.length}
        data={chargesData}
        disabled={disabled}
      />
    </React.Fragment>
  );
};

export default DebitNoteListData;
