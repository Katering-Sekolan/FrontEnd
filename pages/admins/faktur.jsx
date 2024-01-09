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
import {
  Box,
  Typography,
  Chip,
  Paper,
} from "@mui/material";
import { FaPrint } from "react-icons/fa6";
import { TbFileInfo } from "react-icons/tb";
import { PembayaranService } from "@/services/pembayaranService";

export default function Faktur() {
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [efektifSnack, setEfektifSnack] = useState("");
  const [efektifMakanSiang, setEfektifMakanSiang] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);

  const columns = [
    { field: "user_id", headerName: "No", width: 70 },
    { field: "nama", headerName: "Nama", width: 250 },
    { field: "nomor_hp", headerName: "Nomor HP", width: 200 },
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
    {field: "metode_pembayaran", headerName: "Metode Pembayaran", width: 150},
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<TbFileInfo />}
          sx={{ marginRight: 1 }}
          onClick={() => handleEditClick(params.row)}
        >
          Detail
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
        status_pembayaran: payment.status_pembayaran,
        metode_pembayaran: payment.metode_pembayaran,
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

  const handleEditClick = async (selectedPaymentId) => {
    try {
      const userId = selectedPaymentId.user_id;
      const bulan = selectedPaymentId.bulan;

      const response = await PembayaranService.getByUserId(userId, bulan);
      const paymentDetails = response.data;
      setSelectedPaymentDetails(paymentDetails);
      handleOpenModal();
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };

  const handleOpenModal = () => {
    // Add validation logic if needed
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
                  <Button
                    endIcon={<FaPrint />}
                    variant="contained"
                    onClick={handleOpenModal}
                  >
                    PRINT FAKTUR
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
                  <h2>Detail Pembayaran</h2>
                  {selectedPaymentDetails ? (
                    <RincianTagihan
                      nama={
                        selectedPaymentDetails.tagihan_bulanan
                          .user_tagihan_bulanan.nama
                      }
                      nomor_hp={
                        selectedPaymentDetails.tagihan_bulanan
                          .user_tagihan_bulanan.nomor_hp
                      }
                      kelas={
                        selectedPaymentDetails.tagihan_bulanan
                          .user_tagihan_bulanan.kelas
                      }
                      formattedBulanTagihan={
                        selectedPaymentDetails.formattedBulanTagihan
                      }
                      status_pembayaran={
                        selectedPaymentDetails.status_pembayaran
                      }
                      columns={selectedPaymentDetails.columns || []}
                      rows={selectedPaymentDetails.rows || []}
                    />
                  ) : (
                    <Typography>
                      Error: Payment details not available.
                    </Typography>
                  )}
                </Box>
              </Modal>
            </Paper>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
