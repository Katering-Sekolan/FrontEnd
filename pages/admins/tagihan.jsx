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
import theme from "@/config/theme";
import SweatAlertTimer from "@/config/SweatAlert/timer";

export default function Tagihan() {
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
          tanggal_tagihan: new Date(tagihanDate),
          total_tagihan: parseFloat(hargaTagihan) * selectedPelanggan.length,
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
          <div>
            <Button variant="contained" onClick={handleOpenModal}>
              Tambah Tagihan
            </Button>
            <TextField
              label="Tanggal Tagihan"
              type="date"
              onChange={(e) => setTagihanDate(e.target.value)}
              fullWidth
              margin="normal"
            />
          </div>

          <DataGrid rows={pelangganList} columns={columns} pageSize={5} />

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
