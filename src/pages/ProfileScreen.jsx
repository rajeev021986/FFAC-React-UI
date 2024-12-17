import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Grid,
    Button,
    Typography,
    Avatar,
    Container,
    Paper,
    MenuItem,
    IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditIcon from '@mui/icons-material/Edit';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import ApiManager from "../services/ApiManager";
import { useUpdateProfileImageMutation } from "../store/api/common";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader/Loader";


const ProfileScreen = () => {
    const [profilePicture, setProfilePicture] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [imgurl, setImgurl] = useState("");
    const [file, setFile] = useState("");
    const [profilePictureError, setProfilePictureError] = useState("");
    const [updateProfileImage] = useUpdateProfileImageMutation();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            defaultLocation: '',
            userId: '',
            companyCode: '',
            status: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().required('Phone is required'),
            address: Yup.string().required('Address is required'),
            defaultLocation: Yup.string().required('Default Location is required'),
        }),
        onSubmit: async (values) => {
            console.log('Form submitted:', values);
            const res = await ApiManager.updateUserProfile({ ...values, locations: [values.defaultLocation] }).then((res) => {
                toast.success("Profile updated successfully");
            })
            if (file) {
                let formdata = new FormData();
                formdata.append("image", file);
                const resimg = await updateProfileImage({ id: values.id, file: file }).then((res) => {
                    toast.success("Profile updated successfully");
                }).catch((err) => {
                    toast.error("Profile Picture failed");
                })
            }
        },
    });
    useEffect(() => {
        const fetchUserData = async () => {
            const res = await ApiManager.getUserData(localStorage.getItem("userId")).then((res) => {
                formik.setValues(res.body);
                setImgurl(res.body.image);
                setIsLoading(false);
            }).catch((error) => { toast.error(error.msg); setIsLoading(false); })

        }
        fetchUserData();
    }, [])
    const handleProfilePictureChange = (event) => {
        const files = event.target.files || event.dataTransfer.files;
        if (files.length > 0) {
            setFile(files[0]);
            setProfilePicture(URL.createObjectURL(files[0]));
        }
    };
    console.log(isLoading, "asdf")

    return (
        <Box sx={{ py: 1 }}>
            {isLoading ? <Loader /> : <Container maxWidth="xl">
                <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                    <Box sx={{ borderBottom: '1px solid #e0e0e0', mb: 3, pb: 2 }}>
                        <Typography variant="h4" align="left">
                            Profile
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: 100, height: 100, borderRadius: '50%' }} mb={4} position="relative">
                        <Avatar
                            alt="Profile Picture"
                            src={profilePicture || imgurl}
                            sx={{ width: 100, height: 100 }}
                        />
                        <IconButton
                            color="primary"
                            component="label"
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                // transform: "translate(25%, 25%)",
                                width: 25,
                                height: 25,
                                padding: "1px",
                                zIndex: 1000,
                                backgroundColor: "darkgray",
                                '&:hover': {
                                    backgroundColor: "#f0f0f0",
                                },
                                borderRadius: "50%",
                            }}
                        >
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                            />
                            <ModeEditOutlinedIcon sx={{
                                fontSize: 13, '&:hover': {
                                    // backgroundColor: "red",
                                    borderRadius: "50%",
                                    color: "white",
                                },
                            }} />
                        </IconButton>
                    </Box>



                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} justifyContent="space-between">
                            <Grid item xs={5.5}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    size="small"
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                            </Grid>

                            <Grid item xs={5.5}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    size="small"
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                            </Grid>

                            <Grid item xs={5.5}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    size="small"
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>

                            <Grid item xs={5.5}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    size="small"
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                />
                            </Grid>

                            <Grid item xs={5.5}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    size="small"
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </Grid>

                            <Grid item xs={5.5}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Default Location"
                                    name="defaultLocation"
                                    value={formik.values.defaultLocation}
                                    onChange={formik.handleChange}
                                    size="small"
                                    error={formik.touched.defaultLocation && Boolean(formik.errors.defaultLocation)}
                                    helperText={formik.touched.defaultLocation && formik.errors.defaultLocation}
                                >
                                    <MenuItem value="Chennai">Chennai</MenuItem>
                                    <MenuItem value="Delhi">Delhi</MenuItem>
                                    <MenuItem value="Mumbai">Mumbai</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={5.5}>
                                <TextField
                                    fullWidth
                                    label="User ID"
                                    name="userId"
                                    value={formik.values.userId}
                                    disabled
                                    size="small"
                                />
                            </Grid>

                            <Grid item xs={5.5}>
                                <TextField
                                    fullWidth
                                    label="Company Code"
                                    name="companyCode"
                                    value={formik.values.companyCode}
                                    disabled
                                    size="small"
                                />
                            </Grid>

                            <Grid item xs={5.5}>
                                <TextField
                                    fullWidth
                                    label="Status"
                                    name="status"
                                    value={formik.values.status}
                                    disabled
                                    size="small"
                                />
                            </Grid>
                        </Grid>

                        <Box mt={4} display="flex" justifyContent="flex-end">
                            <Button type="submit" variant="contained" color="primary">
                                Save
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>}

        </Box>
    );
};

export default ProfileScreen;
