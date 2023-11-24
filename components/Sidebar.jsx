import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { useRouter } from "next/router";
import SweatAlertTimer from "@/config/SweatAlert/timer";
import { MdExpandLess, MdOutlineExpandMore } from "react-icons/md";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import { AiOutlineDashboard } from "react-icons/ai";
import {
  FaRegCommentDots,
  FaPeopleGroup,
  FaPerson,
  FaTeamspeak,
  FaArrowRightFromBracket,
  FaForumbee,
  FaMoneyBill,
  FaClipboardList,
  FaMoneyBills,
  FaUsers,
  FaMoneyBillTransfer,
} from "react-icons/fa6";
import { BsClipboard2Plus } from "react-icons/bs";
import { LuClipboardEdit } from "react-icons/lu";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const router = useRouter();

  const [open, setOpen] = React.useState({
    tagihan: false,
    whatsapp: false,
    pembayaran: false,
  });

  const handleClick = (dropdown) => {
    setOpen((prevState) => ({
      ...prevState,
      [dropdown]: !prevState[dropdown],
    }));
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
    SweatAlertTimer("Logout Behasil", "success");
  };

  return (
    <>
      <ListItemButton>
        <ListItemIcon>
          <AiOutlineDashboard size={"25px"} />
        </ListItemIcon>
        <Link
          href="/admins/dashboard"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <ListItemText primary="Dashboard" />
        </Link>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <FaUsers size={"25px"} />
        </ListItemIcon>
        <Link
          href="/admins/pelanggan"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <ListItemText primary="Pelanggan" />
        </Link>
      </ListItemButton>
      <ListItemButton onClick={() => handleClick("tagihan")}>
        <ListItemIcon>
          <FaClipboardList size={"25px"} />
        </ListItemIcon>
        <ListItemText primary="Tagihan" />
        {open.tagihan ? <MdExpandLess /> : <MdOutlineExpandMore />}
      </ListItemButton>
      <Collapse in={open.tagihan} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <BsClipboard2Plus />
            </ListItemIcon>
            <Link
              href="/admins/tambahTagihan"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemText primary="Tambah Tagihan" />
            </Link>
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <LuClipboardEdit />
            </ListItemIcon>
            <Link
              href="/admins/ubahTagihan"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemText primary="Ubah Tagihan" />
            </Link>
          </ListItemButton>
        </List>
      </Collapse>
      <ListItemButton onClick={() => handleClick("pembayaran")}>
        <ListItemIcon>
          <FaMoneyBill size={"25px"} />
        </ListItemIcon>
        <ListItemText primary="Pembayaran" />
        {open.pembayaran ? <MdExpandLess /> : <MdOutlineExpandMore />}
      </ListItemButton>
      <Collapse in={open.pembayaran} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <FaMoneyBills />
            </ListItemIcon>
            <Link
              href="/admins/tagihanBulanan"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemText primary="Tagihan Bulanan" />
            </Link>
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <FaMoneyBillTransfer />
            </ListItemIcon>
            <Link
              href="/admins/riwayatPembayaran"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemText primary="Riwayat Pembayaran" />
            </Link>
          </ListItemButton>
        </List>
      </Collapse>
      <ListItemButton onClick={() => handleClick("whatsapp")}>
        <ListItemIcon>
          <FaRegCommentDots size={"25px"} />
        </ListItemIcon>
        <ListItemText primary="Whatsapp" />
        {open.whatsapp ? <MdExpandLess /> : <MdOutlineExpandMore />}
      </ListItemButton>
      <Collapse in={open.whatsapp} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <FaForumbee />
            </ListItemIcon>
            <Link
              href="/admins/WG/connection"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemText primary="Koneksi" />
            </Link>
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <FaPerson />
            </ListItemIcon>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemText primary="Send Private" />
            </Link>
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <FaPeopleGroup />
            </ListItemIcon>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemText primary="Send Group" />
            </Link>
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <FaTeamspeak />
            </ListItemIcon>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemText primary="Broadcast" />
            </Link>
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton>
        <ListItemIcon>
          <FaArrowRightFromBracket size={"25px"} />
        </ListItemIcon>
        <ListItemText primary="Logout" onClick={handleLogout} />
      </ListItemButton>
    </>
  );
}
