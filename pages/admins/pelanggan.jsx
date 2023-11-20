import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Header from "@/components/Header";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import theme from "@/config/theme";
import SweatAlertTimer from "@/config/SweatAlert/timer";

export default function Pelanggan() {
  const [pelanggan, setPelanggan] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newPelanggan, setNewPelanggan] = useState({ nohp: "", nama: "" });
  const [editingPelanggan, setEditingPelanggan] = useState(null);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nohp", headerName: "No HP", width: 250 },
    { field: "nama", headerName: "Nama", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditPelanggan(params.row.id)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeletePelanggan(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchPelanggan();
  }, []);

  const fetchPelanggan = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/u/get-all"
      );
      // Menambahkan properti 'id' ke setiap objek pelanggan
      const pelangganWithId = response.data.data.map((pelanggan) => ({
        ...pelanggan,
        id: pelanggan._id,
      }));
      setPelanggan(pelangganWithId);
    } catch (error) {
      console.error("Error fetching pelanggan:", error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setEditingPelanggan(null);
    setNewPelanggan({ nohp: "", nama: "" });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPelanggan({ ...newPelanggan, [name]: value });
  };

  const handleAddPelanggan = async () => {
    try {
      if (!newPelanggan.nama || !newPelanggan.nohp) {
        handleCloseModal();
        SweatAlertTimer("Error!", "Nama dan No HP tidak boleh kosong", "error");
        return;
      }

      if (isNaN(newPelanggan.nohp)) {
        handleCloseModal();
        SweatAlertTimer("Error!", "No HP harus berupa angka", "error");
        return;
      }

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/u/create",
        newPelanggan
      );

      fetchPelanggan();
      handleCloseModal();
      SweatAlertTimer("Success!", response.data.message, "success");
    } catch (error) {
      handleCloseModal();
      SweatAlertTimer("Error!", error.response.data.message, "error");
    }
  };

  const handleUpdatePelanggan = async () => {
    try {
      if (!newPelanggan.nama || !newPelanggan.nohp) {
        handleCloseModal();
        SweatAlertTimer("Error!", "Nama dan No HP tidak boleh kosong", "error");
        return;
      }

      if (isNaN(newPelanggan.nohp)) {
        handleCloseModal();
        SweatAlertTimer("Error!", "No HP harus berupa angka", "error");
        return;
      }

      const response = await axios.put(
        process.env.NEXT_PUBLIC_API_URL + `/u/update/${editingPelanggan}`,
        newPelanggan
      );

      fetchPelanggan();
      handleCloseModal();
      SweatAlertTimer("Success!", response.data.message, "success");
    } catch (error) {
      handleCloseModal();
      SweatAlertTimer("Error!", error.response.data.message, "error");
    }
  };

  const handleEditPelanggan = (pelangganId) => {
    const pelangganToEdit = pelanggan.find(
      (pelanggan) => pelanggan.id === pelangganId
    );
    setEditingPelanggan(pelangganId);
    setNewPelanggan({ ...pelangganToEdit });
    setOpenModal(true);
  };

  const handleDeletePelanggan = async (pelangganId) => {
    try {
      const response = await axios.delete(
        process.env.NEXT_PUBLIC_API_URL + `/u/delete/${pelangganId}`
      );

      fetchPelanggan();
      handleCloseModal();
      SweatAlertTimer("Pelanggan Dihapus!", response.data.message, "success");
    } catch (error) {
      handleCloseModal();
      SweatAlertTimer("Error!", error.data.message, "error");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header navName="Pelanggan Katering Qita" />
        <Box
          sx={{
            marginTop: 8,
            flexGrow: 1,
            padding: 2,
          }}
        >
          <Button variant="contained" onClick={handleOpenModal}>
            Tambah Pelanggan
          </Button>

          <DataGrid rows={pelanggan} columns={columns} pageSize={5} />

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
              <h2>
                {editingPelanggan ? "Edit Pelanggan" : "Tambah Pelanggan"}
              </h2>
              <div>
                <TextField
                  label="Nama"
                  name="nama"
                  value={newPelanggan.nama}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="No HP"
                  name="nohp"
                  value={newPelanggan.nohp}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <Button
                  variant="contained"
                  onClick={
                    editingPelanggan
                      ? handleUpdatePelanggan
                      : handleAddPelanggan
                  }
                  startIcon={<SaveIcon />}
                  fullWidth
                >
                  {editingPelanggan ? "Update" : "Simpan"}
                </Button>
              </div>
            </Box>
          </Modal>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
