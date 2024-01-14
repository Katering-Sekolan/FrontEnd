import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Link,
  Avatar,
} from "@mui/material";
import SweatAlertTimer from "@/config/SweatAlert/timer";

function AdminLoginForm({ onAdminLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formClicked, setFormClicked] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormClicked(true);

    // Validasi
    if (!username || !password) {
      return SweatAlertTimer(
        "Gagal!",
        "Username dan password harus diisi",
        "error"
      );
    }
    onAdminLogin({ username, password });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          p: 3,
          border: "1px solid grey",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <img src="/logo.png" alt="Logo" height="50" />
        </Avatar>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="h1">
            Login
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                margin="normal"
                fullWidth
                error={formClicked && !username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                margin="normal"
                fullWidth
                error={formClicked && !password}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                fullWidth
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}

export default AdminLoginForm;
