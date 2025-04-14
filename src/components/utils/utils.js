export function isValidPattern(pattern) {
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

  const invalidTokens = pattern
    .replace(tokenRegex, "")
    .match(/[#\$][A-Z0-9]+/g);
  if (invalidTokens && invalidTokens.length) {
    return false;
  }

  const monthTokens = ["$Z", "$M", "$N"];
  const foundMonthTokens = matches.filter((token) =>
    monthTokens.includes(token)
  );
  if (foundMonthTokens.length > 1) {
    return false;
  }

  return matches.every((token) => allowedTokens.includes(token));
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
