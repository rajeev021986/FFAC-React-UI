import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Box,
    Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import ApiManager from '../../services/ApiManager';
import { useResetPasswordMutation } from '../../store/api/userDataApi';

function UserManagementModules({ modal, setModal, refetch }) {
    const [resetPassword] = useResetPasswordMutation();
    const handleOpen = (type, data = {}) => {
        setModal({ open: true, type, data });
    };
    const validationSchema = Yup.object({
        password: Yup.string()
            .min(5, 'Password must be at least 5 characters long')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
    });
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(`Password reset for:`, modal.data.userId, formik.values);
            let payload = {
                username: modal.data.userId,
                password: formik.values.password,
                confirmPassword: formik.values.confirmPassword,
            }
            const res = await resetPassword(payload).then((res) => {
                toast.success("Password reset successfully");
                handleClose();
                refetch()
            }).catch((err) => {
                toast.error("Something went wrong");
                handleClose();
            });
        },
    });
    const handleClose = () => {
        setModal({ open: false, type: "", data: {} });
    };

    const handleDelete = async () => {
        console.log(`User deleted`, modal.data);
        const res = await ApiManager.deleteUser(modal.data).then((res) => {
            toast.success("User deleted successfully");
            handleClose();
            refetch()
        }).catch((err) => {
            toast.error("Something went wrong");
            handleClose();
        });
    };

    const handleReset = async () => {
        formik.handleSubmit();
    };

    return (
        <div>
            <Dialog open={modal.open} onClose={handleClose}>
                {modal.type === "delete" && (
                    <>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete the user **{modal.data?.userName}**? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} color="error">
                                Delete
                            </Button>
                        </DialogActions>
                    </>
                )}
                {modal.type === "reset" && (
                    <>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogContent>
                            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="New Password"
                                    type="password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    autoComplete="new-password"
                                />
                                <TextField
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                    autoComplete="new-password"
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleReset} color="primary">
                                Reset
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}

export default UserManagementModules;
