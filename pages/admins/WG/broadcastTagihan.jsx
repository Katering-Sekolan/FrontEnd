import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Header from "@/components/Header";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import theme from "@/config/theme";
import SweatAlertTimer from "@/config/SweatAlert/timer";
import { TagihanService } from "@/services/tagihanService";
import { WhatsAppService } from "@/services/whatsappService";
const { io } = require("socket.io-client");

export default function BroadcastTagihan() {
  const [pelangganList, setPelangganList] = useState([]);
  const [tagihanDate, setTagihanDate] = useState(null);
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    if (tagihanDate) {
      fetchData();
    }

    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });
    socket.on("message", (receivedStatus) => {
      setStatus(receivedStatus);
    });
  }, [tagihanDate]);

  const fetchData = async () => {
    try {
      const response = await TagihanService.getByMonth(tagihanDate);

      const pelangganWithId = response.data.data.map((pelanggan, index) => ({
        id: index + 1,
        idTagihan: pelanggan.id,
        nama: pelanggan.user_tagihan_bulanan.nama,
        kelas: pelanggan.user_tagihan_bulanan.kelas,
        total_tagihan: `Rp. ${pelanggan.total_tagihan}`,
        noHP: pelanggan.user_tagihan_bulanan.nomor_hp,
        efektif_snack: pelanggan.jumlah_snack,
        efektif_makanSiang: pelanggan.jumlah_makanan,
      }));

      setPelangganList(pelangganWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBroadcast = async () => {
    try {
      const response = await WhatsAppService.broadcastMessages(tagihanDate);
      SweatAlertTimer("Success!", response.data.message, "success");
    } catch (error) {
      SweatAlertTimer("Error!", error.response.data.message, "error");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nama", headerName: "Nama", width: 250 },
    { field: "noHP", headerName: "Nomor HP", width: 200 },
    { field: "kelas", headerName: "Kelas", width: 150 },
    { field: "total_tagihan", headerName: "Total Tagihan", width: 250 },
  ];

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Header navName="Mengirim pesan tagihan pelanggan" />
          <Box
            component="main"
            sx={{
              backgroundColor: "greyCool.main",
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Toolbar />
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  marginBottom="8px"
                >
                  <Grid item>
                    <TextField
                      label="Tanggal Tagihan"
                      type="month"
                      onChange={(e) => setTagihanDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                    />
                  </Grid>
                  {tagihanDate && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={handleBroadcast}
                      >
                        Broadcast Pesan
                      </Button>
                      <Typography variant="subtitle1" color={"white"}>
                        {status}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                <DataGrid
                  rows={pelangganList}
                  columns={columns}
                  pageSize={10}
                  autoHeight
                />
              </Paper>
            </Grid>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
