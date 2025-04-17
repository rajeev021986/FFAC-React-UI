export function validatePattern(pattern) {
  const allowedTokens = [
    "#4",
    "#5",
    "#6",
    "#7",
    "#8",
    "$Z",
    "$N",
    "$M",
    "$D",
    "$Y",
  ];

  const tokenRegex = /#4|#5|#6|#7|#8|\$Z|\$N|\$M|\$D|\$Y/g;

  const matches = pattern.match(tokenRegex) || [];

  const remaining = pattern.replace(tokenRegex, "");

  const invalidTokens = remaining.match(/[#\$][A-Za-z0-9]+/g);
  if (invalidTokens && invalidTokens.length > 0) {
    return {
      valid: false,
      error: `Invalid token(s) used: ${invalidTokens.join(", ")}`,
    };
  }
  const allTokensValid = matches.every((token) =>
    allowedTokens.includes(token)
  );
  if (!allTokensValid) {
    const unknownTokens = matches.filter(
      (token) => !allowedTokens.includes(token)
    );
    return {
      valid: false,
      error: `Unknown token(s): ${unknownTokens.join(", ")}`,
    };
  }

  return {
    valid: true,
    error: null,
  };
}

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
    case "Month":
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
