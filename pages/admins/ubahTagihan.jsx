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
import { Grid } from "@mui/material";
import theme from "@/config/theme";
import SweatAlertTimer from "@/config/SweatAlert/timer";
import InputAdornment from "@mui/material/InputAdornment";

export default function UbahTagihan() {
  const [hargaTagihan, setHargaTagihan] = useState("");
  const [pelangganList, setPelangganList] = useState([]);
  const [tagihanDate, setTagihanDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    { field: "nama", headerName: "Nama", flex: 1 },
    { field: "no_whatsapp", headerName: "No. Whatsapp", flex: 1 },
    { field: "total_tagihan", headerName: "Total Tagihan", flex: 1 },
    { field: "tanggal_tagihan", headerName: "Tanggal Tagihan", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/t/get-by-date/${tagihanDate}`
      );

      const pelangganWithId = response.data.data.map((pelanggan, index) => ({
        id: index + 1,
        idTagihan: pelanggan.Id,
        nama: pelanggan.Nama,
        total_tagihan: `Rp. ${pelanggan["Total Tagihan"]}`,
        no_whatsapp: pelanggan["No WhatsApp"],
        tanggal_tagihan: new Date(
          pelanggan.Tanggal_Tagihan
        ).toLocaleDateString(),
      }));

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

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setHargaTagihan(row.total_tagihan);
    setOpenModal(true);
  };

  const handleDeleteClick = async (row) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/t/delete/${row}`);
      fetchData();
      SweatAlertTimer("Success!", "Tagihan berhasil dihapus", "success");
    } catch (error) {
      console.error("Error deleting tagihan:", error);
      SweatAlertTimer("Error!", "Gagal menghapus tagihan", "error");
    }
  };

  const handleSaveTagihan = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/t/update/${selectedRow.idTagihan}`,
        {
          total_tagihan: hargaTagihan,
        }
      );

      handleCloseModal();
      fetchData();
      SweatAlertTimer("Success!", response.data.message, "success");
    } catch (error) {
      setOpenModal(false);
      console.error("Error updating tagihan:", error);
      SweatAlertTimer("Error!", "Gagal mengubah tagihan", "error");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
              <h2>Edit Tagihan</h2>
              <div>
                {selectedRow && (
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
                          <InputAdornment position="start">Rp.</InputAdornment>
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
