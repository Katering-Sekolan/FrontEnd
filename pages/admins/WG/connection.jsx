import { useState, useEffect } from "react";
const { io } = require("socket.io-client");
import { useRouter } from "next/router";
import axios from "axios";
import SweatAlertTimer from "@/config/SweatAlert/timer";

import Header from "@/components/Header";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/config/theme";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box,
  Container,
  Paper,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
// import Button from "@mui/material/Button";

export default function connection() {
  const [qrCode, setQrCode] = useState("");
  const [status, setStatus] = useState("Disconnected");

  const router = useRouter();

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("qrCode", (receivedQrCode) => {
      setQrCode(receivedQrCode);
    });

    socket.on("message", (receivedStatus) => {
      setStatus(receivedStatus);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const logout = async () => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/w/logout"
      );
      if (res.data.status === true) {
        router.push("/admins/dashboard");
        SweatAlertTimer("Session berhasil logout", "success");
      }
    } catch (error) {
      SweatAlertTimer(error.res.data.message, "error");
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Header navName="Koneksi Whatsapp Gateway" />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) => theme.palette.grey[100],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">
                    Silahkan Scan QR Code Berikut dengan Whatsapp Anda
                  </Typography>
                  <Typography variant="subtitle1">{status}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    flexDirection: "column",
                    marginTop: 2,
                  }}
                >
                  {qrCode ? (
                    <img
                      src={qrCode}
                      alt="QR Code"
                      style={{ marginBottom: 16 }}
                    />
                  ) : (
                    <Typography variant="subtitle1">
                      Menunggu koneksi atau sudah terhubung...
                    </Typography>
                  )}
                  {status === "Connected" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  )}
                </Box>
              </Paper>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
