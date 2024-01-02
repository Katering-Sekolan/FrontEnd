import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import { ThemeProvider } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "@/components/Header";
import theme from "@/config/theme";
import axios from "axios";
import SweatAlertTimer from "@/config/SweatAlert/timer";
import { PembayaranService } from "@/services/pembayaranService";

export default function MonthlyPayment() {
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [searchResults, setSearchResults] = useState([]); 
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [efektifSnack, setEfektifSnack] = useState("");
  const [efektifMakanSiang, setEfektifMakanSiang] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nama", headerName: "Nama", width: 250 },
    { field: "kelas", headerName: "Kelas", width: 150 },
    { field: "nomor_hp", headerName: "Nomor HP", width: 200 },
    { field: "total_tagihan", headerName: "Total Tagihan", width: 150 },
    { field: "total_pembayaran", headerName: "Total Pembayaran", width: 150 },
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
    {
      field: "tanggal_pembayaran",
      headerName: "Tanggal Pembayaran",
      width: 200,
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
        nama: payment.tagihan_bulanan.user_tagihan_bulanan.nama,
        kelas: payment.tagihan_bulanan.user_tagihan_bulanan.kelas,
        nomor_hp: payment.tagihan_bulanan.user_tagihan_bulanan.nomor_hp,
        total_tagihan: `Rp. ${payment.tagihan_bulanan.total_tagihan}`,
        total_pembayaran: `Rp. ${payment.total_pembayaran}`,
        status_pembayaran: payment.status_pembayaran,
        tanggal_pembayaran: payment.tanggal_pembayaran,
      }));

      setMonthlyPayments(data);
      // setSearchResults(data); 
    } catch (error) {
      console.error("Error fetching monthly payments:", error);
    }
  };

  const handleCheckboxChange = (paymentId) => {
    if (selectedPayments.includes(paymentId)) {
      setSelectedPayments(selectedPayments.filter((id) => id !== paymentId));
    } else {
      setSelectedPayments([...selectedPayments, paymentId]);
    }
  };

  const handleSelectAllCheckboxChange = (event) => {
    if (event.target.checked) {
      const allPaymentIds = searchResults.map((payment) => payment.id);
      setSelectedPayments(allPaymentIds);
    } else {
      setSelectedPayments([]);
    }
  };

  const handleOpenModal = () => {
    // Add validation logic if needed
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSavePayments = async () => {
    try {
      // Add logic to save payments
      handleCloseModal();
    } catch (error) {
      console.error("Error saving payments:", error);
      handleCloseModal();
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
        <Header navName="Fraktur Pembayaran Bulanan" />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            padding: 2,
          }}
        >
          <Toolbar />
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
              <Button variant="contained" onClick={handleOpenModal}>
                Ubah Pembayaran
              </Button>
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
              <h2>Update Pembayaran</h2>
              <Container>
                {paymentDate && (
                  <>
                    <TextField
                      label="Efektif Snack"
                      type="number"
                      value={efektifSnack}
                      onChange={(e) => setEfektifSnack(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Efektif Makan Siang"
                      type="number"
                      value={efektifMakanSiang}
                      onChange={(e) => setEfektifMakanSiang(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      onClick={handleSavePayments}
                      startIcon={<SaveIcon />}
                      fullWidth
                    >
                      Simpan Pembayaran
                    </Button>
                  </>
                )}
              </Container>
            </Box>
          </Modal>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
