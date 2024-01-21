import { useState, useEffect } from "react";
const { io } = require("socket.io-client");
import SweatAlertTimer from "@/config/SweatAlert/timer";
import Header from "@/components/Header";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/config/theme";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { WhatsAppService } from "@/services/whatsappService";

export default function Connection() {
  const [qrCode, setQrCode] = useState("");
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });

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

  const handleLogout = async () => {
    try {
      const response = await WhatsAppService.logout();
      SweatAlertTimer("Success!", response.data.message, "success");
      // setUpdate(!update);
    } catch (error) {
      SweatAlertTimer("Error!", error.response.data.message, "error");
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
              backgroundColor: "greyCool.main",
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Box>
              </Paper>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
