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
import Script from "next/script";
import SnapMidtransContainer from "@/components/SnapMidtransContainer";

const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

const steps = ["MENUNGGU PEMBAYARAN", "PROSES PEMBAYRAN", "PEMBAYARAN SELESAI"];

const PembayaranTagihan = () => {
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();
  const { userId, month } = router.query;

  const fetchData = async (u) => {
    try {
      if (userId && month) {
        const response = await PembayaranService.getByUserId(userId, month);
        console.log("API Response:", response);

        if (response && response.data) {
          setBillData(response.data);
        } else {
          console.error("Invalid response structure:", response);
          setBillData(null);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setBillData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && month) {
      fetchData();
    }
  }, [userId, month]);

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

  const handlePaymentSuccess = () => {
    alert("Transaksi berhasil!");
    setActiveStep(2);
  };

  const {
    id,
    status_pembayaran,
    tagihan_bulanan: {
      user_tagihan_bulanan: { nama, kelas, nomor_hp } = {},
      jumlah_snack,
      jumlah_makanan,
      total_snack,
      total_makanan,
      total_tagihan,
      bulan,
    } = {},
  } = billData[0] || {}; // ambil data pertama

  const formattedTotalTagihan = formatCurrency(total_tagihan);
  const formattedTotalMakanan = formatCurrency(total_makanan);
  const formattedTotalSnack = formatCurrency(total_snack);
  const bulanTagihan = new Date(bulan);
  const formattedBulanTagihan =
    bulanTagihan instanceof Date && !isNaN(bulanTagihan)
      ? new Intl.DateTimeFormat("id-ID", {
          month: "long",
          year: "numeric",
        }).format(bulanTagihan)
      : `Tidak ada data tagihan bulan ${bulan}`;

  const createTransactionAndShowSnap = async () => {
    try {
      if (paymentInitiated) {
        return;
      }

      setActiveStep(1);

      const parameter = {
        id_pembayaran: id,
        total_tagihann: total_tagihan,
        jumlah_makanan: jumlah_makanan,
        jumlah_snack: jumlah_snack,
        total_makanan: total_makanan,
        total_snack: total_snack,
        nama: nama,
        nomor_hp: nomor_hp,
        kelas: kelas,
      };

      // console.log("Transaction Details:", parameter);

      const response = await PembayaranService.createTransaksi(parameter);
      const transactionToken = response.data.token;
      console.log("Transaction Token:", transactionToken);

      if (window.snap && window.snap.embed) {
        window.snap.embed(transactionToken, {
          embedId: "snap-container",
          onSuccess: function (result) {
            alert("Transaksi berhasil!");
            console.log("success", result);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          },
          onPending: function (result) {
            alert("Transaksi sedang diproses!");
            console.log("pending", result);
          },
          onError: function (result) {
            alert("Transaksi gagal!");
            console.log("error", result);
          },
          onClose: function () {
            alert("Anda menutup popup tanpa menyelesaikan pembayaran!");
          },
        });
      } else {
        console.error("Snap object or embed method not available.");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Terjadi kesalahan saat membuat transaksi!");
    } finally {
      setPaymentInitiated(false);
    }
  };

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

  const PaymentStatusStepper = ({ activeStep, steps }) => {
    return (
      <Box
        sx={{
          marginBottom: 2,
          backgroundColor: "white",
          padding: 2,
          borderRadius: 4,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6">Status Proses Pembayaran</Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  };

  const renderPaymentDetails = (handlePaymentClick, isPaymentInitiated) => {
    const customActiveStep = status_pembayaran === "BELUM LUNAS" ? 0 : 2;
    return (
      <Container>
        <Typography variant="h5" gutterBottom>
          Pembayaran Tagihan
        </Typography>

        <PaymentStatusStepper activeStep={customActiveStep} steps={steps} />

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
                borderRadius: 2,
                justifyContent: "space-between",
                display: "flex",
              }}
            >
              <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
                Tagihan Bulan:
              </Typography>
              <Typography fontWeight="bold" color="#ff9a3c" variant="subtitle1">
                {formattedBulanTagihan}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                padding: 1,
                marginBottom: 1,
                borderRadius: 2,
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
        {status_pembayaran === "BELUM LUNAS" && (
          <Box
            sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
          >
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handlePaymentClick}
              disabled={isPaymentInitiated}
              sx={{ width: "100%", borderRadius: 4, height: "60px" }}
            >
              Bayar Sekarang
            </Button>
          </Box>
        )}
      </Container>
    );
  };

  const renderSnapEmbed = () => (
    <Container>
      <PaymentStatusStepper activeStep={activeStep} steps={steps} />
      <div
        sx={{
          backgroundColor: "white",
          padding: 2,
          borderRadius: 4,
          boxShadow: 1,
        }}
      >
        <SnapMidtransContainer />
      </div>
    </Container>
  );

  return (
    <>
      <Script
        src={`https://app.sandbox.midtrans.com/snap/snap.js`}
        // strategy="beforeInteractive"
        data-client-key={clientKey}
        type="text/javascript"
        onLoad={() => console.log("Snap script loaded")}
      />
      {activeStep === 1
        ? renderSnapEmbed()
        : renderPaymentDetails(createTransactionAndShowSnap, paymentInitiated)}
    </>
  );
};

export default PembayaranTagihan;
