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
const baseurl = process.env.NEXT_PUBLIC_API_URL;

export default function riwayatPembayaran() {
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);
  const [columns2, setColumns2] = useState(["Detail", "Jumlah", "Harga"]);
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "raw_id", headerName: "No", width: 70 },
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
    { field: "metode_pembayaran", headerName: "Metode Pembayaran", width: 150 },
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
          onClick={() => handleDetailClick(params.row)}
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const fetchMonthlyPayments = async () => {
    try {
      const response = await PembayaranService.getByMonth(paymentDate);
      const data = response.data.map((payment) => ({
        id: payment.id,
        raw_id: response.data.indexOf(payment) + 1,
        user_id: payment.tagihan_bulanan.user_id,
        nama: payment.tagihan_bulanan.user_tagihan_bulanan.nama,
        kelas: payment.tagihan_bulanan.user_tagihan_bulanan.kelas,
        nomor_hp: payment.tagihan_bulanan.user_tagihan_bulanan.nomor_hp,
        total_tagihan: formatCurrency(payment.tagihan_bulanan.total_tagihan),
        total_pembayaran: formatCurrency(payment.total_pembayaran),
        status_pembayaran: payment.status_pembayaran,
        metode_pembayaran: payment.metode_pembayaran,
        tanggal_pembayaran: payment.tanggal_pembayaran,
        jumlah_makanan: payment.tagihan_bulanan.jumlah_makanan,
        jumlah_snack: payment.tagihan_bulanan.jumlah_snack,
        total_makanan: formatCurrency(payment.tagihan_bulanan.total_makanan),
        total_snack: formatCurrency(payment.tagihan_bulanan.total_snack),
        jumlah_pembayaran_cash: formatCurrency(payment.jumlah_pembayaran_cash),
        tanggal_pembayaran: new Date(payment.tanggal_pembayaran),

        bulan: new Date(payment.tagihan_bulanan.bulan)
          .toLocaleDateString("en-US", { year: "numeric", month: "2-digit" })
          .replace(/\//g, "-")
          .split("-")
          .reverse()
          .join("-"),
      }));

      setMonthlyPayments(data);
    } catch (error) {
      console.error("Error fetching monthly payments:", error);
    }
  };

  const handleDetailClick = (selectedPaymentId) => {
    try {
      const id = selectedPaymentId.id;
      const jumlah_makanan = selectedPaymentId.jumlah_makanan;
      const jumlah_snack = selectedPaymentId.jumlah_snack;
      const total_makanan = selectedPaymentId.total_makanan;
      const total_snack = selectedPaymentId.total_snack;
      const total_tagihan = selectedPaymentId.total_tagihan;
      const jumlah_pembayaran_cash = selectedPaymentId.jumlah_pembayaran_cash;
      const status_pembayaran = selectedPaymentId.status_pembayaran;
      const bulan = selectedPaymentId.bulan;
      const nama = selectedPaymentId.nama;
      const kelas = selectedPaymentId.kelas;
      const nomor_hp = selectedPaymentId.nomor_hp;
      const total_pembayaran = selectedPaymentId.total_pembayaran;

      // const formattedTotalTagihan = formatCurrency(total_tagihan);
      // const formattedTotalPembayaran = formatCurrency(total_pembayaran);

      // const formattedTotalPembayaranCash = formatCurrency(
      //   jumlah_pembayaran_cash
      // );
      // const formattedTotalMakanan = formatCurrency(total_makanan);
      // const formattedTotalSnack = formatCurrency(total_snack);

      const bulanTagihan = new Date(bulan);
      const formattedBulanTagihan =
        bulanTagihan instanceof Date && !isNaN(bulanTagihan)
          ? new Intl.DateTimeFormat("id-ID", {
              month: "long",
              year: "numeric",
            }).format(bulanTagihan)
          : `Tidak ada data tagihan bulan ${selectedPaymentId.bulan}`;

      const updatedColumns = ["Detail", "Jumlah", "Harga"];

      const updatedRows = [
        {
          nama: "Makanan Siang",
          jumlah: jumlah_makanan,
          total: total_makanan,
        },
        { nama: "Snack", jumlah: jumlah_snack, total: total_snack },
        {
          nama: "Total Tagihan",
          jumlah: null,
          total: total_tagihan,
          bold: true,
        },
        {
          nama: "Bayar Tunai",
          jumlah: null,
          total: jumlah_pembayaran_cash,
        },
        {
          nama: "Total Pembayaran",
          jumlah: null,
          total: total_pembayaran,
          isBold: true,
        },
      ];

      setColumns2(updatedColumns);
      setRows(updatedRows);
      setSelectedPaymentDetails({
        id,
        jumlah_makanan,
        jumlah_snack,
        total_makanan,
        total_snack,
        total_tagihan,
        jumlah_pembayaran_cash,
        status_pembayaran,
        bulan,
        nama,
        kelas,
        nomor_hp,
        total_pembayaran,
        formattedBulanTagihan,
      });

      handleOpenModal();
    } catch (error) {
      console.error("Error handling payment details:", error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePrintInvoice = async () => {
    try {
      const response = await fetch(`${baseurl}/pdf/generatePdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId: selectedPaymentDetails.id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate PDF. Status: ${response.status}`);
      }

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      handleCloseModal();
      console.error("Error printing kwitansi:", error);
      SweatAlertTimer(
        "Kwitansi tidak dapat dicetak!",
        "Pembayaran harus melalui TRANSFER!",
        "error"
      );
    }
  };

  const search = () => {
    const filteredPayments = monthlyPayments.filter((payment) => {
      const lowercaseSearchInput = searchInput.toLowerCase();
      const lowercaseStatus = payment.status_pembayaran.toLowerCase();

      if (lowercaseSearchInput === "lunas" && lowercaseStatus === "lunas") {
        return true;
      } else if (
        lowercaseSearchInput === "belum lunas" &&
        lowercaseStatus.includes("belum lunas")
      ) {
        return true;
      } else {
        return (
          payment.nama.toLowerCase().includes(lowercaseSearchInput) ||
          payment.nomor_hp.toString().includes(lowercaseSearchInput) ||
          payment.kelas.toLowerCase().includes(lowercaseSearchInput) ||
          payment.metode_pembayaran.toLowerCase().includes(lowercaseSearchInput)
        );
      }
    });

    setSearchResults(filteredPayments);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header navName="Riwayat Pembayaran Katering Qita" />
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
                  {/* <Button
                    endIcon={<FaPrint />}
                    variant="contained"
                    onClick={handleOpenModal}
                  >
                    PRINT FAKTUR
                  </Button> */}
                </Grid>
                <Grid item>
                  <TextField
                    label="Cari Nama, Nomor HP, Kelas, Status, atau Metode"
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
                    bgcolor: "#E8E8E8",
                    boxShadow: 24,
                    p: 2,
                    width: "80%",
                    maxHeight: "80%",
                    overflowY: "auto",
                  }}
                >
                  <h2>Detail Pembayaran</h2>
                  {selectedPaymentDetails ? (
                    <div>
                      <RincianTagihan
                        nama={selectedPaymentDetails?.nama}
                        nomor_hp={selectedPaymentDetails?.nomor_hp}
                        kelas={selectedPaymentDetails?.kelas}
                        formattedBulanTagihan={
                          selectedPaymentDetails?.formattedBulanTagihan
                        }
                        status_pembayaran={
                          selectedPaymentDetails?.status_pembayaran
                        }
                        columns={columns2}
                        rows={rows}
                      />
                      <div
                        style={{
                          display:
                            selectedPaymentDetails?.status_pembayaran ===
                            "LUNAS"
                              ? "block"
                              : "none",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<FaPrint />}
                          color="primary"
                          onClick={handlePrintInvoice}
                          sx={{
                            width: "100%",
                            borderRadius: 4,
                            height: "60px",
                            marginTop: 2,
                          }}
                        >
                          Print Kwitansi
                        </Button>
                      </div>
                    </div>
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
