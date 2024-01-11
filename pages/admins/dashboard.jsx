import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Header from "@/components/Header";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import theme from "@/config/theme";
import { CountService } from "@/services/countService";
import { FaUser, FaMoneyBillWave } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [countUser, setCountUser] = useState(null);
  const [countAdmin, setCountAdmin] = useState(null);

  useEffect(() => {
    countUsers();
    countAdmins();
  }, []);

  const countUsers = async () => {
    try {
      const response = await CountService.getCountUsers();
      setCountUser(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const countAdmins = async () => {
    try {
      const response = await CountService.getCountAdmins();
      setCountAdmin(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header navName="Manajemen Katering Qita" />
        <Box
          component="main"
          sx={{
            backgroundColor: "greyCool.main",
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={10}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={4}>
                <Paper
                  sx={{
                    borderRadius: 5,
                    p: 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 240,
                    backgroundColor: "#ADE792",
                  }}
                >
                  <div>
                    <FaUser size={"90px"} color="white" />
                  </div>
                  <div>
                    <Typography variant="h5" color="white" gutterBottom>
                      Total Pelanggan
                    </Typography>
                    <Typography
                      variant="h1"
                      color="white"
                      gutterBottom
                      sx={{ marginTop: "auto", fontSize: "100px" }}
                    >
                      {countUser}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={8} lg={4}>
                <Paper
                  sx={{
                    borderRadius: 5,
                    p: 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 240,
                    backgroundColor: "#7978FF",
                  }}
                >
                  <div>
                    <MdAdminPanelSettings size={"90px"} color="white" />
                  </div>
                  <div>
                    <Typography variant="h5" color="white" gutterBottom>
                      Total Admin
                    </Typography>
                    <Typography
                      variant="h1"
                      color="white"
                      gutterBottom
                      sx={{ marginTop: "auto", fontSize: "100px" }}
                    >
                      {countAdmin}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} md={8} lg={4}>
                <Paper
                  sx={{
                    borderRadius: 5,
                    p: 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 240,
                    backgroundColor: "#FAAB78",
                  }}
                >
                  <div>
                    <FaMoneyBillWave size={"90px"} color="white" />
                  </div>
                  <div>
                    <Typography variant="h5" color="white" gutterBottom>
                      Tagihan Bulan Ini
                    </Typography>
                    <Typography
                      variant="h2"
                      color="white"
                      gutterBottom
                      sx={{ marginTop: "auto", fontSize: "50px" }}
                    >
                      {/* {countAdmin} */}
                      Rp 1.250.000
                    </Typography>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
