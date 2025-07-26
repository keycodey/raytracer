import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ViewListIcon from "@mui/icons-material/ViewList";
import AppsIcon from "@mui/icons-material/Apps";

const drawerWidth = 200;

const openedMixin = (theme) => ({
  marginTop: 50,
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme) => ({
  marginTop: 50,

  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme)
  })
}));

export default function Sidebar({ open }) {
  const sxButton = {
    minHeight: 48,
    justifyContent: open ? "initial" : "center",
    px: 2.5
  };

  const sxIcon = {
    minWidth: 0,
    mr: open ? 3 : "auto",
    justifyContent: "center"
  };

  return (
    <Drawer variant="permanent" open={open}>
      <List>
        <ListItem key="home" disablePadding>
          <ListItemButton component={Link} to="/" sx={sxButton}>
            <ListItemIcon sx={sxIcon}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        <ListItem key="gallery" disablePadding>
          <ListItemButton component={Link} to="/gallery" sx={sxButton}>
            <ListItemIcon sx={sxIcon}>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Gallery" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        <ListItem key="playground" disablePadding>
          <ListItemButton component={Link} to="/playground" sx={sxButton}>
            <ListItemIcon sx={sxIcon}>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText primary="Playground" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
}
