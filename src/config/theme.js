import { createTheme } from "@mui/material";

export const getTheme = (primaryColor = "#026de0") => {
  if (typeof primaryColor !== 'string' || primaryColor.trim() === '') {
    primaryColor = "#026de0"; // Fallback to default color if invalid
  }
  return createTheme({
    palette: {
      mode: "light",
      primary: {
        main: primaryColor,
        light: "#e3f2fd",
      },
      secondary: {
        main: "#061023",
        light: "#061023a3",
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
        default: "#f5f5f5",
        dark: "#061023",
        light: "#e3f2fd",
        extlight: "#f5f9fc",
      },
      white: {
        main: "#ffffff",
      },
      text: {
        primary: "#041238",
        secondary: "#0000008a",
      },
      border: {
        main: "#0000001f",
        light: "#F2F2F2",
      },
      gray: {
        main: "#f7f7f7",
        dark: "#939393",
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
            border: "1px solid #0000001f",
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid #0000001f",
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
            border: "1px solid #0000001f",
          },
        },
      },
    },
    typography: {
      fontFamily: 'Inter, "sans-serif"',
    },
  });
};
