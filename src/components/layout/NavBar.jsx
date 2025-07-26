import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function NavBar({ handleDrawerOpen }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ bgcolor: "#2586f7", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense" sx={{ bgcolor: "#0F00", color: "#fbfcfd" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="body2"
            color="inherit"
            component="div"
            sx={{ flexGrow: 1, backgroundColor: "#0F00" }}
          >
            Ray Tracer
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
