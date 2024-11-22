import { createTheme } from "@mui/material";

export const getTheme = ( primaryColor = "#026de0",mode) => {
  if (typeof primaryColor !== "string" || primaryColor.trim() === "") {
    primaryColor = "#026de0"; // Fallback to default color if invalid
  }

  // const isDarkMode = mode === "dark";
  const isDarkMode = mode;
  return createTheme({
    palette: {
      mode:isDarkMode?"dark":"light",
      primary: {
        main: primaryColor,
        light: isDarkMode ? "#263859" : "#e3f2fd",
      },
      secondary: {
        main: isDarkMode ? "#b3b3b3" : "#061023",
        light: isDarkMode ? "#aaaaaa" : "#061023a3",
      },
      success: {
        main: "#22c55e",
        light: "#bbf7d0",
        extlight: "#c7ffc9",
        dark: "#22c55e",
      },
      warning: {
        main: "#ff9800",
        light: "#ffb74d",
        extlight: "#ffedb8",
      },
      error: {
        main: "#f44336",
        light: "#e57373",
        extlight: "#ffcdcd",
      },
      info: {
        main: "#2196f3",
        light: "#64b5f6",
        extlight: "#90caf9",
      },
      background: {
        default: isDarkMode ? "#121212" : "#f5f5f5",
        dark: isDarkMode ? "#000000" : "#061023",
        light: isDarkMode ? "#333333" : "#e3f2fd",
        extlight: isDarkMode ? "#444444" : "#f5f9fc",
      },
      white: {
        main: isDarkMode?"#000000":"#ffffff",
        lightDark: isDarkMode?"#353131":"#f3f3f3",
      },
      text: {
        primary: isDarkMode ? "#ffffff" : "#041238",
        secondary: isDarkMode ? "#b3b3b3" : "#0000008a",
      },
      border: {
        main: isDarkMode ? "#ffffff1f" : "#0000001f",
        light: isDarkMode ? "#333333" : "#F2F2F2",
      },
      gray: {
        main: isDarkMode ? "#2b2b2b" : "#f7f7f7",
        dark: isDarkMode ? "#939393" : "#939393",
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          title: {
            fontSize: "1.3rem",
            fontWeight: 500,
          },
          subtitle1: {
            fontSize: "0.9rem",
            fontWeight: 300,
          },
          h1: {
            fontSize: "8rem",
            fontWeight: 700,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "5px",
            boxShadow: "none",
            border: isDarkMode ? "1px solid #353131" : "1px solid #0000001f",
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            borderBottom: isDarkMode ? "1px solid #ffffff1f" : "1px solid #0000001f",
            "& .MuiCardHeader-title": {
              fontSize: "1rem",
              fontWeight: 500,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            border: isDarkMode ? "1px solid #ffffff1f" : "1px solid #0000001f",
          },
        },
      },
    },
    typography: {
      fontFamily: 'Inter, "sans-serif"',
    },
  });
};
