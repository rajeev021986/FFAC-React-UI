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
import Frame from "../assets/images/Frame.png";
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

       

        console.log(res.body.jwtToken)
        console.log("Successful login");
        nav("/app");
        
      } else {

        console.log("Login not successful");
        toast.error(res.message);
      }
    } catch (err) {
      console.error("Error during login:", err);
      toast.error("Something went wrong");
    } finally {
      setLoader(false); // Ensures loader stops even if there's an error
    }
  };

  return (
    <>
      <Stack direction="row" sx={styles.container}>
        {/* Left Section (Form) */}
        <Stack spacing={2} sx={styles.left_div}>
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
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              onChange={handleChange}
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

        {/* Right Section (Image) */}
        <Stack spacing={2} sx={styles.right_div}>
          <Box sx={styles.backgroundImage}></Box>
          {/* <Box sx={styles.content}>
            <Typography variant="h1" color="primary.main">A passionate team rooted in logistics</Typography>
            <Typography variant="title" color="white.main">Our people make the difference.</Typography>
          </Box> */}
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
    width: "70%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    p: 2,
  },
  right_div: {
    // backgroundColor: 'secondary.main',
    width: "70%",
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Place it below content
  },
  content: {
    position: "relative",
    zIndex: 2, // Ensure content is above the background image
  },
  form: {
    width: 350,
    p: 2,
  },
};
