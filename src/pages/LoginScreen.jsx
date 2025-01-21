// // React imports
import { useState } from "react";
// Third party imports
import {
  Box,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ThemeButton } from "../components/common/Button";
import Frame from "../assets/images/login-bg.png";
import { useNavigate } from "react-router-dom";
import ApiManager from "../services/ApiManager";
import toast from "react-hot-toast";
import { login } from "../store/freatures/authSlice";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

export default function LoginScreen() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [Loader, setLoader] = useState(false);
  const [user, setUser] = useState({
    userId: "",
    password: "",
  });

  const { loginWithRedirect } = useAuth0();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoader(true);

    try {
      const res = await ApiManager.login(user);

      if (res.code === "SUCCESS") {
        toast.success(res.message);

        await dispatch(
          login({
            token: res.body.jwtToken,
            user: res.user,
            authtype: "normal",
            userId: user.userId,
          })
        );

        nav("/app");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoader(false); // Ensures loader stops even if there's an error
    }
  };

  return (
    <>
      <Stack direction="row" sx={styles.container}>
        <Stack spacing={2} sx={styles.right_div}>
          <Box sx={styles.backgroundImage}></Box>
        </Stack>
        <Stack spacing={2} sx={styles.login_Page}>
          <Stack component={"form"} spacing={2} sx={styles.form}>
            <Typography
              variant="title"
              color="secondary.main"
              textAlign={"center"}
            >
              Login
            </Typography>
            <Typography
              variant="subtitle1"
              color="secondary.main"
              textAlign={"center"}
            >
              Please login to continue
            </Typography>
            <TextField
              id="userId"
              label="User Name"
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                style: {
                  borderRadius: "12px",
                  fontSize: "14px",
                },
              }}
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              onChange={handleChange}
              InputProps={{
                style: {
                  borderRadius: "12px",
                  fontSize: "14px",
                },
              }}
            />
            <ThemeButton
              color="primary"
              sx={{ width: "100%" }}
              onClick={handleSubmit}
            >
              {Loader && <CircularProgress color="white" size={20} />} Login
            </ThemeButton>
            {/* <ThemeButton type="button" onClick={() => loginWithRedirect()}>
            Log In (Auth0)
          </ThemeButton> */}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100vh",
  },
  left_div: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    p: 2,
  },
  login_form: {
    background: "rgba(255, 255, 255, 0.17)",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
  },
  login_Page: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  right_dixv: {
    // backgroundColor: 'secondary.main',
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    p: 4,
    overflow: "hidden", // Ensure no overflow from children
  },
  backgroundImage: {
    backgroundImage: `url(${Frame})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    // opacity: 0.2, // Control opacity here
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: "relative",
    zIndex: 2, // Ensure content is above the background image
  },
  form: {
    maxWidth: 450,
    width: "100%",
    p: 2,
    background: "rgba(255, 255, 255, 0.17)",
    borderRadius: "24px 16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
  },
};
