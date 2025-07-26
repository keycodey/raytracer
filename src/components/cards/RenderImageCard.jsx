import { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import { Camera, ray_for_pixel } from "../../features/camera";
import { color_at, World } from "../../features/world";
import { Pointlight } from "../../features/lights";
import { color, point } from "../../features/tuples";
import { view_transform } from "../../features/transformations";

export default function RenderImageCard({ scene }) {
  const [isRendering, setIsRendering] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [anchorEl, setAncholEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const open = Boolean(anchorEl);
  const frameIDRef = useRef(null);
  const yRef = useRef(0);

  let canvas;
  let ctx;

  useEffect(() => {
    canvas = document.getElementById(scene.title);
    ctx = canvas.getContext("2d");
  });

  const canvas_width = 320;
  const canvas_height = 170;
  const field_of_view = Math.PI / 3;

  const world = new World();
  world.light = new Pointlight(point(-10, 10, -10), color(1, 1, 1));
  world.objects = scene.objects;

  const camera = new Camera(canvas_width, canvas_height, field_of_view);
  camera.transform = view_transform(
    point(-2, 1.7, -6),
    point(3, 1, 0),
    point(0, 1, 0)
  );

  const render = () => {
    for (let x = 0; x < camera.hsize; x += 1) {
      const ray = ray_for_pixel(camera, x, yRef.current);
      const color = color_at(world, ray, 4);

      const red = Math.floor(255 * color[0]);
      const green = Math.floor(255 * color[1]);
      const blue = Math.floor(255 * color[2]);
      ctx.fillStyle = `rgb(${red} ${green} ${blue})`;
      ctx.fillRect(x, yRef.current, 1, 1);
    }
    if (yRef.current < canvas_height - 1) {
      yRef.current = yRef.current + 1;
      frameIDRef.current = requestAnimationFrame(render);
    } else {
      setIsReady(true);
      setIsRendering(false);
    }
  };

  const handleRenderClick = () => {
    setShowPlaceholder(false);
    setIsRendering(true);
    frameIDRef.current = requestAnimationFrame(render);
  };

  const handlePauseClicked = () => {
    cancelAnimationFrame(frameIDRef.current);
    setIsRendering(false);
  };

  const handleReset = () => {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    yRef.current = 0;
    setShowPlaceholder(true);
    setIsReady(false);
    setAncholEl(null);
  };

  const handleCopyToClipboard = () => {
    canvas.toBlob(function (blob) {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
    });
    setAncholEl(null);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleMenuClick = (event) => {
    setAncholEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAncholEl(null);
  };

  return (
    <Paper variant="outlined" sx={{ mr: 3, mb: 3, width: "320px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#eee",
          height: "169px"
        }}
      >
        <canvas
          id={scene.title}
          width={canvas_width}
          height={canvas_height}
          style={{
            border: "0px solid #F00",
            opacity: !showPlaceholder ? 1 : 0,
            marginTop: "-2px"
          }}
        ></canvas>
        {showPlaceholder && (
          <CameraAltIcon
            sx={{
              position: "absolute",
              fontSize: 60,
              color: "#999"
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 0,
          bgcolor: "#77F"
        }}
      ></Box>
      <Box sx={{ ml: 2, mr: 1, mb: 1, mt: 2 }}>
        <Typography variant="h6">{scene.title}</Typography>
        <Typography variant="body2">{scene.description}</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {!isRendering ? (
            <IconButton
              color="primary"
              disabled={isReady}
              sx={{ mt: 0.5, ml: -1.2 }}
              onClick={handleRenderClick}
            >
              <PlayCircleIcon />
            </IconButton>
          ) : (
            isRendering && (
              <IconButton
                color="primary"
                sx={{ mt: 0.5, ml: -1.2 }}
                onClick={handlePauseClicked}
              >
                <PauseCircleIcon />
              </IconButton>
            )
          )}
          <IconButton
            sx={{ mt: 0.5, mr: -0.5 }}
            disabled={showPlaceholder || isRendering}
            onClick={handleMenuClick}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleReset}>Reset</MenuItem>
            <MenuItem onClick={handleCopyToClipboard}>
              Copy to clipboard
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent message="Image copied to clipboard." />
      </Snackbar>
    </Paper>
  );
}
