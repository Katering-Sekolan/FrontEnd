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
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/config/theme";
import { PembayaranService } from "@/services/pembayaranService";
import Script from "next/script";
import SnapMidtransContainer from "@/components/SnapMidtransContainer";
import Head from "next/head";
import HeaderPembayaran from "@/components/HeaderPembyaran";
import Footer from "@/components/Footer";
import RincianTagihan from "@/components/RincianTagihan";
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
    total_pembayaran,
    jumlah_pembayaran_cash,
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
  const formattedTotalPembayaran = formatCurrency(total_pembayaran);
  const formattedTotalPembayaranCash = formatCurrency(jumlah_pembayaran_cash);
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
        total_tagihann: total_pembayaran,
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

  const columns = ["Detail", "Jumlah", "Harga"];
  const rows = [
    {
      nama: "Makanan Siang",
      jumlah: jumlah_makanan,
      total: formattedTotalMakanan,
    },
    { nama: "Snack", jumlah: jumlah_snack, total: formattedTotalSnack },
    {nama: "Total Tagihan", jumlah: null, total: formattedTotalTagihan, bold: true},
    { nama: "Bayar Tunai", jumlah: null, total: formattedTotalPembayaranCash },
    {
      nama: "Total Pembayaran",
      jumlah: null,
      total: formattedTotalPembayaran,
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
          marginTop: 2,
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
        <PaymentStatusStepper activeStep={customActiveStep} steps={steps} />

        <RincianTagihan
          nama={nama}
          nomor_hp={nomor_hp}
          kelas={kelas}
          formattedBulanTagihan={formattedBulanTagihan}
          status_pembayaran={status_pembayaran}
          columns={columns}
          rows={rows}
        />
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
    <ThemeProvider theme={theme}>
      <HeaderPembayaran />
      <CssBaseline />
      <Box
        component="main"
        sx={{
          backgroundColor: "greyCool2.main",
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        {activeStep === 1
          ? renderSnapEmbed()
          : renderPaymentDetails(
              createTransactionAndShowSnap,
              paymentInitiated
            )}
      </Box>

      <Head>
        <title>
          Proses Pembayaran Tagihan Katering Qita bulan
          {formattedBulanTagihan}
        </title>
      </Head>
      <Script
        src={`https://app.sandbox.midtrans.com/snap/snap.js`}
        data-client-key={clientKey}
        type="text/javascript"
        onLoad={() => console.log("Snap script loaded")}
      />
      <Footer />
    </ThemeProvider>
  );
};

export default PembayaranTagihan;
