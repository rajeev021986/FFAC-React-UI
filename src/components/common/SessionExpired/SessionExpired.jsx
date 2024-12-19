import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router
import { setSessionExpiredmodule } from "../../../store/freatures/dashboardSlice";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import ApiManager from "../../../services/ApiManager";
import toast from "react-hot-toast";

const SessionExpired = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionExpired = useSelector((state) => state.dashboard.sessionExpiredmodule);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const handleLogin = async () => {
    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const res = await ApiManager.login({ userId: username, password });
      if (res && res.body && res.body.jwtToken) {
        localStorage.setItem("token", res.body.jwtToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            expiresIn: new Date().getTime() + 1000 * 60 * 60 * 6,
          })
        );
        setOpen(false)
        toast.success("login successFull");
        console.log("Logged in successfully with token:", res.body.jwtToken);
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", err);
    }
  };

  const handleClose = () => {
    dispatch(setSessionExpiredmodule(false));
    navigate("/");
  };


  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    const localToken = localStorage.getItem("token");
    if (localToken && localUser) {
      if (localUser.expiresIn < new Date().getTime()) {
        setOpen(true);
      }
    }
  }, [])

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Session Expired</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your session has expired. Please log in again to continue.
        </DialogContentText>
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        <form>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(""); // Clear error when typing
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Clear error when typing
            }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Log In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpired;
