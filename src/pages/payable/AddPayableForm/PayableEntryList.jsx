import React from "react";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";

const PayableEntryList = ({ chargesData, PAYABLE_COLUMNS }) => {
  return (
    <React.Fragment>
      <ThemedGrid
        uniqueId="id"
        columns={PAYABLE_COLUMNS}
        count={chargesData.length}
        data={chargesData}
      />
    </React.Fragment>
  );
};

export default PayableEntryList;
