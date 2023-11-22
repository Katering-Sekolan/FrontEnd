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
} from "react-icons/fa6";
import { FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  // const [open2, setOpen2] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  // const handleClick2 = () => {
  //   setOpen2(!open2);
  // };

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
      <ListItemButton>
        <ListItemIcon>
          <FaMoneyBillWave size={"25px"} />
        </ListItemIcon>
        <Link
          href="/admins/tagihan"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <ListItemText primary="Tagihan" />
        </Link>
      </ListItemButton>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <FaRegCommentDots size={"25px"} />
        </ListItemIcon>
        <ListItemText primary="Whatsapp" />
        {open ? <MdExpandLess /> : <MdOutlineExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
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
