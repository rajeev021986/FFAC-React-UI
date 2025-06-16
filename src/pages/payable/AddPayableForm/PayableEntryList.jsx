import React from "react";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";

const PayableEntryList = ({ chargesData, PAYABLE_COLUMNS, disabled }) => {
  return (
    <React.Fragment>
      <ThemedGrid
        uniqueId="id"
        columns={PAYABLE_COLUMNS}
        count={chargesData.length}
        data={chargesData}
        disabled={disabled}
        storageKey="PayableEntryDataGrid"
      />
    </React.Fragment>
  );
};

export default PayableEntryList;
