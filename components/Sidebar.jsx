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
  FaMoneyCheck,
} from "react-icons/fa6";
import { RiAdminFill } from "react-icons/ri";
import { LuClipboardEdit } from "react-icons/lu";
import { BsClipboard2Plus } from "react-icons/bs";
import { GiPriceTag } from "react-icons/gi";
import { signOut } from "next-auth/react";
import Divider from "@mui/material/Divider";

const menuItems = [
  {
    icon: <AiOutlineDashboard size={"25px"} />,
    text: "Dashboard",
    link: "/admins/dashboard",
  },
  {
    icon: <FaUsers size={"25px"} />,
    text: "Pelanggan",
    link: "/admins/pelanggan",
  },
  {
    icon: <GiPriceTag size={"25px"} />,
    text: "Menu Harga",
    link: "/admins/harga",
  },
  {
    icon: <FaClipboardList size={"25px"} />,
    text: "Tagihan",
    link: "/admins/tagihan",
    dropdown: true,
    submenu: [
      {
        icon: <BsClipboard2Plus />,
        text: "Tambah Tagihan",
        link: "/admins/tambahTagihan",
      },
      {
        icon: <LuClipboardEdit />,
        text: "Daftar Tagihan",
        link: "/admins/ubahTagihan",
      },
      { icon: <FaMoneyCheck />, text: "Deposit", link: "/admins/aturDeposit" },
    ],
  },
  {
    icon: <FaMoneyBill size={"25px"} />,
    text: "Pembayaran",
    link: "/admins/pembayaran",
    dropdown: true,
    submenu: [
      { icon: <FaMoneyBills />, text: "Faktur", link: "/admins/fraktur" },
      {
        icon: <FaMoneyBillTransfer />,
        text: "Riwayat Pembayaran",
        link: "/admins/riwayatPembayaran",
      },
    ],
  },
  {
    icon: <FaRegCommentDots size={"25px"} />,
    text: "Whatsapp",
    link: "/admins/whatsapp",
    dropdown: true,
    submenu: [
      { icon: <FaForumbee />, text: "Koneksi", link: "/admins/WG/connection" },
      // { icon: <FaPerson />, text: "Send Private", link: "/" },
      // { icon: <FaPeopleGroup />, text: "Send Group", link: "/" },
      {
        icon: <FaTeamspeak />,
        text: "Broadcast tagihan",
        link: "/admins/WG/broadcastTagihan",
      },
    ],
  },
  {
    icon: <RiAdminFill size={"25px"} />,
    text: "Administrator",
    link: "/admins/administrator",
  },
];

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
      {menuItems.map((item) => (
        <React.Fragment key={item.text}>
          {item.dropdown ? (
            <ListItemButton
              onClick={() => handleClick(item.text.toLowerCase())}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
              {open[item.text.toLowerCase()] ? (
                <MdExpandLess />
              ) : (
                <MdOutlineExpandMore />
              )}
            </ListItemButton>
          ) : (
            <ListItemButton selected={router.pathname === item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Link
                href={item.link}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemText primary={item.text} />
              </Link>
            </ListItemButton>
          )}
          {item.dropdown && item.submenu && (
            <Collapse
              in={open[item.text.toLowerCase()]}
              timeout="auto"
              unmountOnExit
              key={`collapse-${item.text}`}
            >
              <List component="div" disablePadding>
                {item.submenu.map((subItem) => (
                  <ListItemButton sx={{ pl: 4 }} key={subItem.text}>
                    <ListItemIcon>{subItem.icon}</ListItemIcon>
                    <Link
                      href={subItem.link}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <ListItemText primary={subItem.text} />
                    </Link>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ))}
      <Divider />
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <FaArrowRightFromBracket size={"25px"} />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </>
  );
}
