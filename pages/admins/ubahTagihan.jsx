import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Header from "@/components/Header";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { Grid, Paper } from "@mui/material";
import theme from "@/config/theme";
import SweatAlertTimer from "@/config/SweatAlert/timer";
import InputAdornment from "@mui/material/InputAdornment";
import { TagihanService } from "@/services/tagihanService";

export default function TagihanBulanan() {
  const [hargaTagihan, setHargaTagihan] = useState("");
  const [efektif_snack, setEfektifSnack] = useState("");
  const [efektif_makanSiang, setEfektifMakanSiang] = useState("");
  const [pelangganList, setPelangganList] = useState([]);
  const [tagihanDate, setTagihanDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filteredTagihan, setFilteredTagihan] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nama", headerName: "Nama", width: 250 },
    { field: "noHP", headerName: "Nomor HP", width: 200 },
    { field: "kelas", headerName: "Kelas", width: 150 },
    // { field: "efektif_snack", headerName: "Snack", width: 150 },
    // { field: "efektif_makanSiang", headerName: "Makan Siang", width: 150 },
    { field: "total_tagihan", headerName: "Total Tagihan", width: 250 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            size="small"
            startIcon={<EditIcon />}
            sx={{ marginRight: 1 }}
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(params.row.idTagihan)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await TagihanService.getByMonth(tagihanDate);

      const pelangganWithId = response.data.data.map((pelanggan, index) => ({
        id: index + 1,
        idTagihan: pelanggan.id,
        nama: pelanggan.user_tagihan_bulanan.nama,
        kelas: pelanggan.user_tagihan_bulanan.kelas,
        total_tagihan: `Rp. ${pelanggan.total_tagihan}`,
        noHP: pelanggan.user_tagihan_bulanan.nomor_hp,
        efektif_snack: pelanggan.jumlah_snack,
        efektif_makanSiang: pelanggan.jumlah_makanan,
      }));
      console.log("pelangganWithId", pelangganWithId);

      setPelangganList(pelangganWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (tagihanDate) {
      fetchData();
    }
  }, [tagihanDate]);

  useEffect(() => {
    search();
  }, [searchInput, pelangganList]);

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setHargaTagihan(row.total_tagihan);
    setEfektifSnack(row.efektif_snack);
    setEfektifMakanSiang(row.efektif_makanSiang);
    setOpenModal(true);
  };

  const handleDeleteClick = async (row) => {
    try {
      const response = await TagihanService.delete(row);

      fetchData();
      SweatAlertTimer("Success!", response.data.messange, "success");
    } catch (error) {
      console.error("Error deleting tagihan:", error);
      SweatAlertTimer("Error!", error.response.data.message, "error");
    }
  };

  const handleSaveTagihan = async () => {
    try {
      if (!efektif_snack || !efektif_makanSiang) {
        SweatAlertTimer("Error!", "Harap isi semua bidang", "error");
        return;
      }

      let data = {
        efektif_snack: efektif_snack,
        efektif_makanSiang: efektif_makanSiang,
      };

      const response = await TagihanService.update(selectedRow.idTagihan, data);

      handleCloseModal();
      fetchData();
      SweatAlertTimer("Success!", response.data.message, "success");
    } catch (error) {
      setOpenModal(false);
      console.error("Error updating tagihan:", error);
      SweatAlertTimer("Error!", error.response.data.message, "error");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const search = () => {
    const filteredData = pelangganList.filter(
      (pelanggan) =>
        pelanggan.nama.toLowerCase().includes(searchInput.toLowerCase()) ||
        pelanggan.noHP.toString().includes(searchInput) ||
        pelanggan.kelas.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredTagihan(filteredData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header navName="Ubah Tagihan Katering Qita" />
        <Box
          sx={{
            marginTop: 6,
            flexGrow: 1,
            padding: 2,
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <TextField
                label="Tanggal Tagihan"
                type="month"
                onChange={(e) => setTagihanDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
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
          <Paper style={{ width: "100%", overflowX: "auto" }}>
            <div style={{ width: "100%" }}>
              <DataGrid
                rows={filteredTagihan}
                columns={columns}
                pageSize={10}
                autoHeight
              />
            </div>
          </Paper>

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
              <h2>Edit Tagihan</h2>
              <div>
                {selectedRow && (
                  <>
                    <TextField
                      label="Jumlah Snack"
                      type="number"
                      value={efektif_snack}
                      onChange={(e) => setEfektifSnack(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Jumlah Makan Siang"
                      type="number"
                      value={efektif_makanSiang}
                      onChange={(e) => setEfektifMakanSiang(e.target.value)}
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
