import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Chip,
} from "@mui/material";
import { PembayaranService } from "@/services/pembayaranService";

const steps = ["BELUM LUNAS", "PENDING", "DIBAYAR"];

const PembayaranTagihan = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await PembayaranService.getByUserId(userId);
          console.log("API Response:", response);

          if (response && response.data) {
            setBillData(response.data);
          } else {
            console.error("Invalid response structure:", response);
            setBillData(null); // Set billData to null to indicate an issue
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setBillData(null); // Set billData to null to indicate an issue
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!billData) {
    return <div>Mengambil data tagihan....</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const {
    status_pembayaran,
    tagihan_bulanan: {
      user_tagihan_bulanan: { nama, kelas, nomor_hp } = {},
      jumlah_snack,
      jumlah_makanan,
      total_snack,
      total_makanan,
      total_tagihan,
    } = {},
  } = billData[0] || {}; // ambildata pertams

  const formattedTotalTagihan = formatCurrency(total_tagihan);
  const formattedTotalMakanan = formatCurrency(total_makanan);
  const formattedTotalSnack = formatCurrency(total_snack);

  const columns = ["Detail", "Jumlah", "Total Tagihan"];
  const rows = [
    {
      nama: "Makanan Siang",
      jumlah: jumlah_makanan,
      total: formattedTotalMakanan,
    },
    { nama: "Snack", jumlah: jumlah_snack, total: formattedTotalSnack },
    {
      nama: "Total Tagihan",
      jumlah: null,
      total: formattedTotalTagihan,
      isBold: true,
    },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Pembayaran Tagihan
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Status Pembayaran</Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: 2,
            borderRadius: 4,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6">Detail Pengguna</Typography>
          <Typography>Nama: {nama}</Typography>
          <Typography>No HP: {nomor_hp}</Typography>
          <Typography>Kelas: {kelas}</Typography>
        </Box>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: 2,
            borderRadius: 4,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6">Detail Tagihan</Typography>
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              padding: 1,
              marginBottom: 1,
              borderRadius: 4,
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
              Status Pembayaran:
            </Typography>
            <Chip
              label={status_pembayaran}
              color={
                status_pembayaran === "LUNAS"
                  ? "success"
                  : status_pembayaran === "PENDING"
                  ? "warning"
                  : "error"
              }
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column}
                      sx={{
                        backgroundColor: "#f5f5f5",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        fontWeight: row.isBold ? "bold" : "normal",
                      }}
                    >
                      {row.nama}
                    </TableCell>
                    <TableCell>{row.jumlah}</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: row.isBold ? "bold" : "normal",
                        color: row.isBold ? "#ff9a3c" : "#000",
                      }}
                    >
                      {row.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={handleNext}
          sx={{ width: "100%", borderRadius: 4, height: "60px" }}
        >
          Bayar Sekarang
        </Button>
      </Box>
    </Container>
  );
};

export default PembayaranTagihan;
