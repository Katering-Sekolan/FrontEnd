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
  const [efektif_snack, setefektif_snack] = useState("");
  const [efektif_makanSiang, setefektif_maanSiang] = useState("");
  const [selectedPelanggan, setSelectedPelanggan] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [tagihanDate, setTagihanDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [filteredTagihan, setFilteredTagihan] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const columns = [
    {
      field: "select",
      headerName: "Select",
      width: 100,
      renderHeader: (params) => (
        <Checkbox
          indeterminate={
            selectedPelanggan.length > 0 &&
            selectedPelanggan.length < pelangganList.length
          }
          checked={selectedPelanggan.length === pelangganList.length}
          onChange={handleSelectAllCheckboxChange}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          checked={selectedPelanggan.includes(params.row.id)}
          onChange={() => handleCheckboxChange(params.row.id)}
        />
      ),
    },
    { field: "index", headerName: "ID", width: 100 },
    { field: "nama", headerName: "Nama", width: 250 },
    { field: "nomor_hp", headerName: "Nomor HP", width: 200 },
    { field: "kelas", headerName: "Kelas", width: 250 },
  ];

  useEffect(() => {
    fetchPelangganList();
  }, []);

  useEffect(() => {
    search();
  }, [searchInput, pelangganList]);

  const fetchPelangganList = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/user"
      );

      const pelangganWithId = response.data.data.map((pelanggan, index) => ({
        ...pelanggan,
        id: pelanggan.id,
        index: index + 1,
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

  const handleSelectAllCheckboxChange = (event) => {
    if (event.target.checked) {
      const allPelangganIds = pelangganList.map((pelanggan) => pelanggan.id);
      setSelectedPelanggan(allPelangganIds);
    } else {
      setSelectedPelanggan([]);
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
      if (!efektif_snack || selectedPelanggan.length === 0) {
        SweatAlertTimer("Error!", "Harap isi semua bidang", "error");
        return;
      }

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/tagihanBulanan/create",
        {
          user_id: selectedPelanggan,
          tanggal_tagihan: tagihanDate,
          efektif_snack: parseInt(efektif_snack),
          efektif_makanSiang: parseInt(efektif_makanSiang),
        }
      );
      SweatAlertTimer("Success!", response.data.message, "success");
    } catch (error) {
      handleCloseModal();
      SweatAlertTimer("Error!", error.response.data.message, "error");
    }
  };

  const search = () => {
    const filteredData = pelangganList.filter(
      (pelanggan) =>
        pelanggan.nama.toLowerCase().includes(searchInput.toLowerCase()) ||
        pelanggan.kelas.toLowerCase().includes(searchInput.toLowerCase()) ||
        pelanggan.nomor_hp.toString().includes(searchInput.toLowerCase())
    );

    setFilteredTagihan(filteredData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header navName="Tambah Tagihan Katering Qita" />
        <Box
          sx={{
            marginTop: 8,
            flexGrow: 1,
            padding: 2,
          }}
        >
          <Grid
            container
            marginBottom="8px"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <div item>
              <TextField
                label="Tanggal Tagihan"
                type="month"
                style={{ marginRight: "8px" }}
                onChange={(e) => setTagihanDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                size="small"
              />
              <Button variant="contained" onClick={handleOpenModal}>
                Tambah Tagihan
              </Button>
            </div>
            <Grid item>
              <TextField
                label="cari"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                variant="outlined"
                size="small"
                style={{ width: "300px" }}
              />
            </Grid>
          </Grid>
          <DataGrid
            rows={filteredTagihan.length > 0 ? filteredTagihan : pelangganList}
            columns={columns}
            pageSize={10}
          />

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
                      label="Jumalah Snack"
                      type="number"
                      value={efektif_snack}
                      onChange={(e) => setefektif_snack(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Jumalah Makan Siang"
                      type="number"
                      value={efektif_makanSiang}
                      onChange={(e) => setefektif_maanSiang(e.target.value)}
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
