import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import NavBar from "./components/layout/NavBar";
import Sidebar from "./components/layout/SideBar";
import Home from "./components/pages/Home";
import Samples from "./components/pages/Samples";
import Playground from "./components/pages/Playground";
import NoMatch from "./components/pages/NoMatch";

function App() {
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <NavBar handleDrawerOpen={handleDrawerOpen} />
        <Sidebar open={open} />
        <Box component="main" sx={{ width: "100%", mt: 10, ml: 5, mr: 5 }}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="gallery" element={<Samples />} />
            <Route path="playground" element={<Playground />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default App;
