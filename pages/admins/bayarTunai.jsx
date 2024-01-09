import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "@/components/Header";
import theme from "@/config/theme";
import RincianTagihan from "@/components/RincianTagihan";
import { Box, Typography, Chip, Paper } from "@mui/material";
import { FaPrint } from "react-icons/fa6";
import { TbFileInfo } from "react-icons/tb";
import SweatAlertTimer from "@/config/SweatAlert/timer";
import { PembayaranService } from "@/services/pembayaranService";
import { Edit } from "@mui/icons-material";
import { Container } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

export default function CashPayment() {
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [paymentDate, setPaymentDate] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [bayarTunai, setBayarTunai] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const columns = [
    { field: "id", headerName: "No", width: 70 },
    { field: "nama", headerName: "Nama", width: 250 },
    { field: "nomor_hp", headerName: "Nomor HP", width: 200 },
    { field: "bayar_tunai", headerName: "Bayar Tunai", width: 200 },
    {
      field: "status_pembayaran",
      headerName: "Status",
      width: 150,
      renderCell: (status_pembayaran) => (
        <Chip
          label={status_pembayaran.value}
          color={
            status_pembayaran.value === "LUNAS"
              ? "success"
              : status_pembayaran.value === "PENDING"
              ? "warning"
              : "error"
          }
        />
      ),
    },
    { field: "total_tagihan", headerName: "Total Tagihan", width: 150 },
    { field: "total_pembayaran", headerName: "Total Pembayaran", width: 150 },
    { field: "metode", headerName: "Metode", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<Edit />}
          sx={{ marginRight: 1 }}
          onClick={() => handleBayarTunaiClick(params.row)}
        >
          BAYAR TUNAI
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (paymentDate) {
      fetchMonthlyPayments();
    }
  }, [paymentDate]);

  useEffect(() => {
    search();
  }, [searchInput, monthlyPayments]);

  const fetchMonthlyPayments = async () => {
    try {
      const response = await PembayaranService.getByMonth(paymentDate);
      const data = response.data.map((payment) => ({
        id: payment.id,
        user_id: payment.tagihan_bulanan.user_id,
        nama: payment.tagihan_bulanan.user_tagihan_bulanan.nama,
        kelas: payment.tagihan_bulanan.user_tagihan_bulanan.kelas,
        nomor_hp: payment.tagihan_bulanan.user_tagihan_bulanan.nomor_hp,
        total_tagihan: `Rp. ${payment.tagihan_bulanan.total_tagihan}`,
        total_pembayaran: `Rp. ${payment.total_pembayaran}`,
        bayar_tunai: `Rp. ${payment.jumlah_pembayaran_cash}`,
        status_pembayaran: payment.status_pembayaran,
        tanggal_pembayaran: payment.tanggal_pembayaran,
        bulan: new Date(payment.tagihan_bulanan.bulan)
          .toLocaleDateString("en-US", { year: "numeric", month: "2-digit" })
          .replace(/\//g, "-")
          .split("-")
          .reverse()
          .join("-"),
      }));

      setMonthlyPayments(data);
      // setSearchResults(data);
    } catch (error) {
      console.error("Error fetching monthly payments:", error);
    }
  };

  const extractNumericValue = (stringValue) => {
    const numericValue = stringValue.replace(/[^\d]/g, "");
    return numericValue === "" ? 0 : parseFloat(numericValue);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleBayarTunaiClick = (row) => {
    setSelectedRow(row);
    setBayarTunai(extractNumericValue(row.bayar_tunai));
    handleOpenModal();
  };

  const handleSaveBayarTunai = async () => {
    try {
      let data = {
        jumlah_pembayaran_cash: bayarTunai,
      };
      const response = await PembayaranService.bayarTunai(selectedRow.id, data);
      handleCloseModal();
      fetchMonthlyPayments();
      SweatAlertTimer("Success!", response.data.message, "success");
    } catch (error) {
      setOpenModal(false);
      console.error("Error updating deposit:", error);
      SweatAlertTimer("Error!", error.response.data.message, "error");
    }
  };

  const search = () => {
    const filteredPayments = monthlyPayments.filter(
      (payment) =>
        payment.nama.toLowerCase().includes(searchInput.toLowerCase()) ||
        payment.nomor_hp.toString().includes(searchInput.toLowerCase()) ||
        payment.kelas.toLowerCase().includes(searchInput.toLowerCase())
    );
    setSearchResults(filteredPayments);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header navName="Tambah Tagihan Katering Qita" />
        <Box
          component="main"
          sx={{
            backgroundColor: "greyCool.main",
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            padding: 2,
          }}
        >
          <Toolbar />
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
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
                    style={{ marginRight: "8px" }}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="cari Nama, Nomor HP, atau Kelas"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    variant="outlined"
                    size="small"
                    style={{ width: "300px" }}
                  />
                </Grid>
              </Grid>
              <DataGrid rows={searchResults} columns={columns} pageSize={10} />
              <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "white",
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <h2>Bayar Tunai</h2>
                  <Container>
                    {selectedRow && (
                      <>
                        <TextField
                          label="Bayar Tunai"
                          type="number"
                          onChange={(e) =>
                            setBayarTunai(extractNumericValue(e.target.value))
                          }
                          fullWidth
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                Rp.{" "}
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleSaveBayarTunai}
                        >
                          TAMBAH PEMBAYARAN TUNAI
                        </Button>
                      </>
                    )}
                  </Container>
                </Box>
              </Modal>
            </Paper>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
