export function generatePattern({
  shipmentType = "GEN",
  resetNumber = "Never", // "Never", "Yearly", "Month", "Daily"
  voucherDigits = 4,     // 4 to 8
}) {
  const voucherToken = `#${voucherDigits}`;
  let datePart = "";

  switch (resetNumber) {
    case "Yearly":
      datePart = "$Y";
      break;
    case "Monthly":
      datePart = "$M-$Y";
      break;
    case "Daily":
      datePart = "$D-$M-$Y";
      break;
    case "Never":
    default:
      datePart = "";
  }

  const code = shipmentType
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();

  return `${code}-${voucherToken}${datePart ? `-${datePart}` : ""}`;
}
export function generatePatternPayable({
  invoiceType = "PAY",
  resetNumber = "Never", // "Never", "Yearly", "Month", "Daily"
  voucherDigits = 4,     // 4 to 8
}) {
  const voucherToken = `#${voucherDigits}`;
  let datePart = "";

  switch (resetNumber) {
    case "Yearly":
      datePart = "$Y";
      break;
    case "Monthly":
      datePart = "$M-$Y";
      break;
    case "Daily":
      datePart = "$D-$M-$Y";
      break;
    case "Never":
    default:
      datePart = "";
  }

  const code = invoiceType
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();

  return `${code}-${voucherToken}${datePart ? `-${datePart}` : ""}`;
}

export const reindexRows = (rows) => {
  return rows.map((row, index) => ({
    ...row,
    id: index + 1,
  }));
};

export const makeCapitalized = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const optionFormatter = (options, type = String, valueKey, labelKey) => {
  if (!options || options.length === 0) return [];
  if (type === String) {
    return options.map((option) => ({
      value: option,
      label: makeCapitalized(option),
    }));
  } else {
    // object with value, label
    return options.map((option) => ({
      value: option[valueKey],
      label: option[labelKey],
    }));
  }
};

export const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const formatIndianCurrency = (num) => {
  const x = num.toString().split(".");
  const lastThree = x[0].substring(x[0].length - 3);
  const otherNumbers = x[0].substring(0, x[0].length - 3);
  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
  return x.length > 1 ? formatted + "." + x[1] : formatted;
};
export const ExtractDate = (date) => {
    if (!date) {
      return "";
    }

    return date.split("T")[0];
  };

