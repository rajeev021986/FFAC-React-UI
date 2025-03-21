import React, { useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Components
import AccordianForm from "./AccordianForm";

export default function ContainerDetails({ formik }) {
  let disabled = null;
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleAccordionChange("panel1")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            color="primary.main"
            gutterBottom
            style={{
              width: "100%",
              margin: "0px ! important",
              paddingLeft: "10px",
              fontSize: "18px",
            }}
          >
            Container No. MRSU5774984 Size Type 40DV Seal No. ML-EG0368000
            Truck/Trailer No. KBS042L/ZD9486
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <AccordianForm />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleAccordionChange("panel2")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            color="primary.main"
            gutterBottom
            style={{
              width: "100%",
              margin: "0px ! important",
              paddingLeft: "10px",
              fontSize: "18px",
            }}
          >
            Container No. MRSU5774984 Size Type 40DV Seal No. ML-EG0368000
            Truck/Trailer No. KBS042L/ZD9486
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AccordianForm />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

// import React, { useState } from "react";
// import {
//   Typography,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// // Components
// import AccordianForm from "./AccordianForm";

// export default function ContainerDetails({ formik }) {
//   const [expanded, setExpanded] = useState(false);

//   const handleAccordionChange = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   return (
//     <div>
//       {formik.values.containerDetails.map((container, index) => (
//         <Accordion
//           key={index}
//           expanded={expanded === `panel${index}`}
//           onChange={handleAccordionChange(`panel${index}`)}
//         >
//           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//             <Typography
//               variant="h6"
//               color="primary.main"
//               gutterBottom
//               style={{
//                 width: "100%",
//                 margin: "0px !important",
//                 paddingLeft: "10px",
//                 fontSize: "18px",
//               }}
//             >
//               {`Container No: ${container.containerNo || "N/A"} | Size Type: ${container.sizeType || "N/A"} | Seal No: ${container.sealNo || "N/A"} | Truck/Trailer No: ${container.truckTrailerNo || "N/A"}`}
//             </Typography>
//           </AccordionSummary>

//           <AccordionDetails>
//             <AccordianForm formik={formik} index={index} />
//           </AccordionDetails>
//         </Accordion>
//       ))}
//     </div>
//   );
// }
