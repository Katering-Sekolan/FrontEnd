// pages/index.js

import { useState, useEffect } from "react";
// import io from "socket.io-client";
// const { io } = require("socket.io-client");
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/config/theme";
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
} from "@mui/material";

// socket.on("disconnect", () => {
//   console.log("Disconnected from server");
// });
// socket.on("connect", () => {
//   console.log("Connected to server");
// });

export default function Home() {
  const [sessionId, setSessionId] = useState(null);
  // const [qrCode, setQrCode] = useState("");
  // console.log("woy", qrCode);
  // console.log("QR Code", qrCode);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    // Mengirim pesan
    fetch("http://localhost:8000/w/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, message }),
    });
    // socket.emit("sendMessage", { number, message });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            WhatsApp Gateway
          </Typography>
          {/* <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 16 }}
          onClick={logout}
        >
          Logout
        </Button> */}
          <form>
            {/* {qrCode ? (
            <img src={qrCode} alt="QR Code" style={{ marginBottom: 16 }} />
          ) : (
            <Typography variant="subtitle1" style={{ marginBottom: 16 }}>
              Menunggu koneksi...
            </Typography>
          )} */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Nomor Tujuan"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Pesan"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={sendMessage}
              style={{ marginTop: 16 }}
            >
              Kirim Pesan
            </Button>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
