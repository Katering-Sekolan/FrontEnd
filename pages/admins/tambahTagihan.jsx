import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Header from "@/components/Header";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { Grid } from "@mui/material";
import theme from "@/config/theme";
import InputAdornment from "@mui/material/InputAdornment";
import SweatAlertTimer from "@/config/SweatAlert/timer";

export default function tambahTagihan() {
  const [hargaTagihan, setHargaTagihan] = useState("");
  const [selectedPelanggan, setSelectedPelanggan] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [tagihanDate, setTagihanDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nohp", headerName: "No HP", width: 200 },
    { field: "nama", headerName: "Nama", width: 250 },
    {
      field: "checklist",
      headerName: "Pesan",
      width: 100,
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedPelanggan.includes(params.row.id)}
              onChange={() => handleCheckboxChange(params.row.id)}
            />
          }
        />
      ),
    },
  ];

  useEffect(() => {
    fetchPelangganList();
  }, []);

  const fetchPelangganList = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/u/get-all"
      );

      const pelangganWithId = response.data.data.map((pelanggan) => ({
        ...pelanggan,
        id: pelanggan._id,
      }));
      setPelangganList(pelangganWithId);
    } catch (error) {
      console.error("Error fetching pelanggan:", error);
    }
  };

  const handleCheckboxChange = (pelangganId) => {
    if (selectedPelanggan.includes(pelangganId)) {
      setSelectedPelanggan(
        selectedPelanggan.filter((id) => id !== pelangganId)
      );
    } else {
      setSelectedPelanggan([...selectedPelanggan, pelangganId]);
    }
  };

  const handleOpenModal = () => {
    if (!tagihanDate || selectedPelanggan.length === 0) {
      SweatAlertTimer(
        "Error!",
        "Harap pilih tanggal dan pilih pelanggan terlebih dahulu!",
        "error"
      );
      return;
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSaveTagihan = async () => {
    try {
      handleCloseModal();
      if (!hargaTagihan || selectedPelanggan.length === 0) {
        SweatAlertTimer("Error!", "Harap isi semua bidang", "error");
        return;
      }

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/t/create",
        {
          user_id: selectedPelanggan,
          jumlah_pesan: selectedPelanggan.length,
          tanggal_tagihan: tagihanDate,
          total_tagihan: parseInt(hargaTagihan), 
        }
      );

      
      const paymentResponse = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/p/create",
        {
          user_id: selectedPelanggan, 
          tanggal_pembayaran: tagihanDate, 
          status_pembayaran: "Belum Lunas", 
          jumlah_pembayaran: parseInt(hargaTagihan), 
        }
      );

      handleCloseModal();
      SweatAlertTimer("Success!", response.data.message, "success");
    } catch (error) {
      handleCloseModal();
      SweatAlertTimer("Error!", error.response.data.message, "error");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header navName="Tagihan Katering Qita" />
        <Box
          sx={{
            marginTop: 8,
            flexGrow: 1,
            padding: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <TextField
                label="Tanggal Tagihan"
                type="date"
                onChange={(e) => setTagihanDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleOpenModal}>
                Tambah Tagihan
              </Button>
            </Grid>
          </Grid>
          <DataGrid rows={pelangganList} columns={columns} pageSize={10} />

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
              <h2>Tambah Tagihan</h2>
              <div>
                {tagihanDate && (
                  <>
                    <TextField
                      label="Harga Tagihan"
                      type="number"
                      value={hargaTagihan}
                      onChange={(e) => setHargaTagihan(e.target.value)}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">Rp. </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSaveTagihan}
                      startIcon={<SaveIcon />}
                      fullWidth
                    >
                      Simpan Tagihan
                    </Button>
                  </>
                )}
              </div>
            </Box>
          </Modal>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
