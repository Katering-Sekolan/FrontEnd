import { useState, useEffect } from "react";
import { AdministratorService } from "@/services/administratorService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "@/config/theme";
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
import SweatAlertTimer from "@/config/SweatAlert/timer";
import SweatAlertDelete from "@/config/SweatAlert/delete";

export default function Administrator() {
  const [administrator, setAdministrator] = useState([]);
  const [filteredAdministrator, setFilteredAdministrator] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [newAdministrator, setNewAdministrator] = useState({
    username: "",
    password: "",
  });
  const [editingAdministrator, setEditingAdministrator] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    search();
  }, [searchInput, administrator]);

  const fetchData = async () => {
    try {
      const response = await AdministratorService.getAll();
      setAdministrator(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
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
            onClick={() => handleEditAdministrator(params.row.id)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </Button>
          {params.row.role !== "SUPERADMIN" && (
            <Button
              variant="contained"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ marginLeft: 1 }}
              onClick={() => handleDeleteadministrator(params.row.id)}
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];

  const search = () => {
    const filteredData = administrator.filter(
      (administrator) =>
        administrator.username
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        administrator.role.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredAdministrator(filteredData);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setEditingAdministrator(null);
    setNewAdministrator({ username: "", password: "" });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdministrator({ ...newAdministrator, [name]: value });
  };

  const handleAddAdministrator = async () => {
    try {
      if (!newAdministrator.username || !newAdministrator.password) {
        handleCloseModal();
        SweatAlertTimer(
          "Error!",
          "Username dan password tidak boleh kosong",
          "error"
        );
        return;
      }

      const response = await AdministratorService.create(newAdministrator);

      fetchData();
      handleCloseModal();
      SweatAlertTimer("Success!", response.data.message, "success");
    } catch (error) {
      handleCloseModal();
      SweatAlertTimer("Error!", error.response.data.message, "error");
    }
  };

  const handleUpdateAdministrator = async () => {
    try {
      const response = await AdministratorService.update(
        editingAdministrator,
        newAdministrator
      );

      fetchData();
      handleCloseModal();
      SweatAlertTimer("Success!", response.data.message, "success");
    } catch (error) {
      handleCloseModal();
      SweatAlertTimer("Error!", error.response.data.message, "error");
    }
  };

  const handleEditAdministrator = (administratorId) => {
    const administratorToEdit = administrator.find(
      (administrator) => administrator.id === administratorId
    );
    setEditingAdministrator(administratorId);
    setNewAdministrator({ ...administratorToEdit });
    setOpenModal(true);
  };

  const handleDeleteadministrator = async (administratorId) => {
    try {
      const shouldDelete = await SweatAlertDelete(
        "Admin Dihapus!",
        "Apakah Anda yakin ingin menghapus admin ini?",
        "warning"
      );

      if (shouldDelete) {
        await AdministratorService.delete(administratorId);

        fetchData();
        handleCloseModal();
        SweatAlertTimer("Deleted!", "Admin berhasil dihapus.", "success");
      } else {
        // User canceled the delete action
        // You can handle it here if needed
        handleCloseModal();
      }
    } catch (error) {
      handleCloseModal();
      SweatAlertTimer("Error!", error.data.message, "error");
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Header navName="Admin Katering Qita" />
          <Box
            component="main"
            sx={{
              backgroundColor: "greyCool.main",
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
              padding: 2,
            }}
          >
            <Toolbar />

            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                }}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  marginBottom="8px"
                >
                  <Button
                    variant="contained"
                    size={"small"}
                    onClick={handleOpenModal}
                  >
                    Tambah Admin
                  </Button>
                  <TextField
                    label="Cari Username"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    variant="outlined"
                    size="small"
                    style={{ width: "300px" }}
                  />
                </Grid>

                <DataGrid
                  rows={filteredAdministrator}
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
                    <h2>
                      {editingAdministrator
                        ? "Edit Administrator"
                        : "Tambah Administrator"}
                    </h2>
                    <Container>
                      <TextField
                        label="Username"
                        name="username"
                        value={newAdministrator.username}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                      />
                      {!editingAdministrator && (
                        <TextField
                          label="Password"
                          name="password"
                          value={newAdministrator.password}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          type="password"
                        />
                      )}

                      <Button
                        variant="contained"
                        onClick={
                          editingAdministrator
                            ? handleUpdateAdministrator
                            : handleAddAdministrator
                        }
                        startIcon={<SaveIcon />}
                        fullWidth
                      >
                        {editingAdministrator ? "Update" : "Simpan"}
                      </Button>
                    </Container>
                  </Box>
                </Modal>
              </Paper>
            </Grid>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
