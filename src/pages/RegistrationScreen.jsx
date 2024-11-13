// React imports
import { useEffect, useState } from "react";
// Third party imports
import {
  Box,
  Card,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  //   CircularProgress,
} from "@mui/material";
import { ThemeButton } from "../components/common/Button";
import LoginBG from "../assets/images/login.jpg";
import { useAuth0 } from "@auth0/auth0-react";
import { Field, Form, Formik } from "formik";
import { useRegisterUserMutation } from "../store/api/userDataApi";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import checkImage from "../assets/images/check.png"
export default function RegistrationScreen() {
  const { state } = useLocation();
  const [register, { isSuccess, data }] = useRegisterUserMutation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastname: "",
    emailid: "",
  });
  const { user, isAuthenticated } = useAuth0();
  console.log("user : ",user);
  
  useEffect(() => {
    if (isAuthenticated) {
      setUserInfo({
        firstname: user.given_name,
        lastname: user.family_name,
        emailid: user.email,
      });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Your account registration request submited successfully.");
      navigate("/");
    }
  }, [isSuccess, data, navigate]);

  // const handleFormSubmit = async (values, { setSubmitting, setErrors }) => {
  //   try {
  //     await register(values).unwrap();
  //   } catch (error) {
  //     // let errors = {};
  //     // error.data.errors.forEach((item) => {
  //     //   errors[item.path] = item.message;
  //     // });

  //     // setErrors(errors);
  //     toast.error("Your account registration request already submited.");
  //     navigate("/");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  return (
    <>
      <Stack sx={styles.container}>
        <Stack  sx={{ height : "90%",width: "90%" }}>
          <Card sx={{height : "100%"}} elevation={3}>
            <Stack direction="row">
              <Stack  spacing={2} sx={styles.left_div} width={"40%"}>
                <Box sx={styles.backgroundImage}></Box>
                <Box spacing={2} sx={styles.content}>
                  <Typography
                    variant="h1"
                    sx={{ fontSize: "5.1rem" }}
                    color="primary.main"
                  >
                    A passionate team rooted in logistics
                  </Typography>
                  <Typography variant="title" color="white.main">
                    Our people make the difference.
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={2} sx={styles.right_div}>
                <img src={checkImage} width={200} height={200} alt="Success" />
                <Typography
                  component={"h1"}
                  variant="title"
                  color="secondary.main"
                  textAlign={"center"}
                >
                  
                  {state.message}
                </Typography>

                <Typography
                  component={"h3"}
                  color="secondary.main"
                 
                >
                  Your Name : {user?.name}
                </Typography>
                <Typography
                  component={"h3"}
                  color="secondary.main"
                  sx={{mt : 0}}
                >
                  Your Email :  {user?.email}
                </Typography>


                <Link to="/"><ThemeButton>Back to Login</ThemeButton></Link>
                {/* <Formik
              enableReinitialize={true}
              initialValues={{
                firstname: userInfo.firstname || "",
                lastname: userInfo.lastname || "",
                emailid: userInfo.emailid || "",
              }}
              onSubmit={handleFormSubmit}
            >
              {({
                isSubmitting,
                errors,
                touched,
                handleChange,
                handleBlur,
                values,
              }) => (
                <Form>
                  <Stack spacing={2}>
                    <div>
                      <Field name="firstname">
                        {({ field }) => (
                          <TextField
                            {...field}
                            type="text"
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.firstname}
                            error={
                              touched.firstname && Boolean(errors.firstname)
                            }
                            helperText={touched.firstname && errors.firstname}
                            style={{ width: "100%" }}
                            InputProps={{ readOnly: true }}
                          />
                        )}
                      </Field>
                    </div>

                    <div>
                      <Field name="lastname">
                        {({ field }) => (
                          <TextField
                            {...field}
                            type="text"
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.lastname}
                            error={touched.lastname && Boolean(errors.lastname)}
                            helperText={touched.lastname && errors.lastname}
                            style={{ width: "100%" }}
                            InputProps={{ readOnly: true }}
                          />
                        )}
                      </Field>
                    </div>
                    <div>
                      <Field name="emailid">
                        {({ field }) => (
                          <TextField
                            {...field}
                            type="email"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.emailid}
                            error={touched.emailid && Boolean(errors.emailid)}
                            helperText={touched.emailid && errors.emailid}
                            style={{ width: "100%" }}
                            InputProps={{ readOnly: true }}
                          />
                        )}
                      </Field>
                    </div>
                    <ThemeButton
                      type="submit"
                      disabled={isSubmitting}
                      color="primary"
                      sx={{ width: "100%" }}
                    >
                      {isSubmitting && (
                        <CircularProgress color="white" size={20} />
                      )}
                      Register User
                    </ThemeButton>
                  </Stack>
                </Form>
              )}
            </Formik> */}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display : "flex",
    alignItems : "center",
    justifyContent : "center"
  },
  left_div: {
    backgroundColor: "secondary.main",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Ensure no overflow from children
    p: 4,
  },
  backgroundImage: {
    backgroundImage: `url(${LoginBG})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.2, // Control opacity here
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
  right_div: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    padding : "0 1rem"
  },
  form: {
    width: 350,
    p: 2,
  },
};
