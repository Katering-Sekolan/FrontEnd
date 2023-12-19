import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import axios from "axios";
import theme from "@/config/theme";
import SweatAlertTimer from "@/config/SweatAlert/timer";
import SweatAlertDelete from "@/config/SweatAlert/delete";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { PelangganService } from "@/services/pelangganService";
import { WhatsAppService } from "@/services/whatsappService";

export default function Pelanggan() {
  const [pelanggan, setPelanggan] = useState([]);
  // console.log(pelanggan);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [newPelanggan, setNewPelanggan] = useState({ nomor_hp: "", nama: "" });
  const [editingPelanggan, setEditingPelanggan] = useState(null);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [filteredPelanggan, setFilteredPelanggan] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  // const [whatsapp, setWhatsapp] = useState({ number: nomor_hp, message: "" });

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nama", headerName: "Nama", width: 250 },
    { field: "nomor_hp", headerName: "Nomor HP", width: 200 },
    { field: "kelas", headerName: "Kelas", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditPelanggan(params.row.id)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </Button>
          {/* <Button
            variant="contained"
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeletePelanggan(params.row.id)}
          >
            Delete
          </Button> */}
          <Button
            variant="contained"
            size="small"
            color="success"
            startIcon={<WhatsAppIcon />}
            sx={{ marginLeft: 1 }}
            onClick={() => handleWhatsappPelanggan(params.row.id)}
          >
            WA
          </Button>
        </>
      ),
    },
  ];

  //heheehheh
  const kelasOptions = [
    { label: "TK", value: "TK" },
    { label: "Kelas 1", value: "Kelas 1" },
    { label: "Kelas 2", value: "Kelas 2" },
    { label: "Kelas 3", value: "Kelas 3" },
    { label: "Kelas 4", value: "Kelas 4" },
    { label: "Kelas 5", value: "Kelas 5" },
    { label: "Kelas 6", value: "Kelas 6" },
    { label: "Kelas 7", value: "Kelas 7" },
    { label: "Kelas 8", value: "Kelas 8" },
    { label: "Kelas 9", value: "Kelas 9" },
  ];

  useEffect(() => {
    fetchPelanggan();
  }, []);
  useEffect(() => {
    search();
  }, [searchInput, pelanggan]);

  const fetchPelanggan = async () => {
    try {
      const response = await PelangganService.getAll();

      if (response.data.status === "success") {
        const pelangganWithId = response.data.data.map((pelanggan) => ({
          ...pelanggan,
          id: pelanggan.id,
        }));

        setPelanggan(pelangganWithId);
      } else {
        console.error("Error fetching pelanggan:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching pelanggan:", error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setEditingPelanggan(null);
    setNewPelanggan({ nomor_hp: "", nama: "" });
  };

  const handleOpenModal2 = () => {
    setOpenModal2(true);
    setWhatsapp({ number: "", message: "" });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenModal2(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPelanggan({ ...newPelanggan, [name]: value });
  };

  const handleMessage = (e) => {
    const message = e.target.value;
    setMessage(message);
  };

  const handleAddPelanggan = async () => {
    try {
      if (!newPelanggan.nama || !newPelanggan.nomor_hp || !newPelanggan.kelas) {
        handleCloseModal();
        SweatAlertTimer(
          "Error!",
          "Nama, No HP, dan Kelas tidak boleh kosong",
          "error"
        );
        return;
      }

      if (isNaN(newPelanggan.nomor_hp)) {
        handleCloseModal();
        SweatAlertTimer("Error!", "No HP harus berupa angka", "error");
        return;
      }

      const response = await PelangganService.create(newPelanggan);

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
      if (!newPelanggan.nama || !newPelanggan.nomor_hp || !newPelanggan.kelas) {
        handleCloseModal();
        SweatAlertTimer(
          "Error!",
          "Nama, No HP, dan Kelas tidak boleh kosong",
          "error"
        );
        return;
      }

      if (isNaN(newPelanggan.nomor_hp)) {
        handleCloseModal();
        SweatAlertTimer("Error!", "No HP harus berupa angka", "error");
        return;
      }

      const response = await PelangganService.update(
        editingPelanggan,
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

  const handleSendMessage = async () => {
    try {
      let data = {
        number: number,
        message: message,
      };

      const response = await WhatsAppService.sendMessages(data);

      console.log(response.data);
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
      const shouldDelete = await SweatAlertDelete(
        "Pelanggan Dihapus!",
        "Apakah Anda yakin ingin menghapus pelanggan ini?",
        "warning"
      );

      if (shouldDelete) {
        const response = await axios.delete(
          process.env.NEXT_PUBLIC_API_URL + `/user/delete/${pelangganId}`
        );

        fetchPelanggan();
        handleCloseModal();
        SweatAlertTimer("Deleted!", "Your file has been deleted.", "success");
      } else {
        // User canceled the delete action
        // You can handle it here if needed
      }
    } catch (error) {
      handleCloseModal();
      SweatAlertTimer("Error!", error.data.message, "error");
    }
  };

  const handleWhatsappPelanggan = async (pelangganId) => {
    setOpenModal2(true);
    try {
      const response = await PelangganService.getOne(pelangganId);

      setNumber(response.data.data.nomor_hp);
    } catch (error) {
      console.error("Error fetching pelanggan:", error);
    }
  };

  const search = () => {
    const filteredData = pelanggan.filter(
      (pelanggan) =>
        pelanggan.nama.toLowerCase().includes(searchInput.toLowerCase()) ||
        pelanggan.nomor_hp.toString().includes(searchInput.toLowerCase()) ||
        pelanggan.kelas.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredPelanggan(filteredData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header navName="Pelanggan Katering Qita" />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            padding: 2,
          }}
        >
          <Toolbar />
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="8px"
          >
            <Button variant="contained" onClick={handleOpenModal}>
              Tambah Pelanggan
            </Button>
            <TextField
              label="Cari Nama, Nomor HP, atau Kelas"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              variant="outlined"
              size="small"
              style={{ width: "300px" }}
            />
          </Grid>

          <DataGrid rows={filteredPelanggan} columns={columns} pageSize={10} />

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
              <Container>
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
                  name="nomor_hp"
                  value={newPelanggan.nomor_hp}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="kelas-label">Kelas</InputLabel>
                  <Select
                    labelId="kelas-label"
                    id="kelas"
                    name="kelas"
                    value={newPelanggan.kelas}
                    onChange={handleInputChange}
                    label="Kelas"
                  >
                    {kelasOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
              </Container>
            </Box>
          </Modal>

          <Modal open={openModal2} onClose={handleCloseModal}>
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
              <h2>Kirim pesan whatsapp</h2>
              <Container>
                <TextField
                  label="No Hp."
                  name="number"
                  value={number}
                  disabled
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Pesan"
                  name="message"
                  onChange={handleMessage}
                  fullWidth
                  margin="normal"
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  startIcon={<WhatsAppIcon />}
                  color="success"
                  fullWidth
                >
                  Kirim
                </Button>
              </Container>
            </Box>
          </Modal>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
