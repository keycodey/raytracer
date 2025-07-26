import { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ObjectSettings from "../forms/ObjectSettings";
import MaterialSettings from "../forms/MaterialSettings";
import ViewTransformSettings from "../forms/ViewTransformSettings";
import { useCubeStore } from "../../stores/cubeStore";
import { useSphereStore } from "../../stores/sphereStore";
import { useCubeMaterialStore } from "../../stores/cubeMaterialStore";
import { useSphereMaterialStore } from "../../stores/sphereMaterialStore";
import { useViewTransformStore } from "../../stores/viewTransformStore";
import { color_at, World } from "../../features/world";
import { Pointlight } from "../../features/lights";
import { color, point } from "../../features/tuples";
import { view_transform } from "../../features/transformations";
import { updateScene } from "../../utilities/custom_scene_data";
import { Camera, ray_for_pixel } from "../../features/camera";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0
  },
  "&::before": {
    display: "none"
  }
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)"
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1)
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)"
  })
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)"
}));

export default function Playground() {
  const [isRendering, setIsRendering] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showRenderLabel, setShowRenderLabel] = useState(true);
  const [res, setRes] = useState("high");
  const [anchorEl, setAncholEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const open = Boolean(anchorEl);
  const frameIDRef = useRef(null);
  const yRef = useRef(0);
  const strideRef = useRef(1);

  let canvas;
  let ctx;

  useEffect(() => {
    canvas = document.getElementById("customView");
    ctx = canvas.getContext("2d");
  });

  const canvas_width = 600;
  const canvas_height = 250;
  const field_of_view = Math.PI / 3;

  const cube = {};
  cube.transforms = useCubeStore();
  cube.material = useCubeMaterialStore();

  const sphere = {};
  sphere.transforms = useSphereStore();
  sphere.material = useSphereMaterialStore();

  const viewTransform = {};
  viewTransform.state = useViewTransformStore();

  const world = new World();
  world.light = new Pointlight(point(-10, 10, -10), color(1, 1, 1));
  world.objects = [];

  const camera = new Camera(canvas_width, canvas_height, field_of_view);
  camera.transform = view_transform(
    point(0, 2, -5.5),
    point(0, 1, 0),
    point(0, 1, 0)
  );

  const render = () => {
    for (let x = 0; x < camera.hsize; x += strideRef.current) {
      const ray = ray_for_pixel(camera, x, yRef.current);
      const color = color_at(world, ray, 4);

      const red = Math.floor(255 * color[0]);
      const green = Math.floor(255 * color[1]);
      const blue = Math.floor(255 * color[2]);
      ctx.fillStyle = `rgb(${red} ${green} ${blue})`;
      ctx.fillRect(x, yRef.current, 1, 1);
    }
    if (yRef.current < canvas_height - 1) {
      yRef.current = yRef.current + strideRef.current;
      frameIDRef.current = requestAnimationFrame(render);
    } else {
      setIsReady(true);
      setIsRendering(false);
      setShowRenderLabel(true);
    }
  };

  const handleRenderClick = () => {
    setIsRendering(true);
    setShowRenderLabel(false);
    updateScene(world, camera, cube, sphere, viewTransform);
    frameIDRef.current = requestAnimationFrame(render);
  };

  const handlePauseRender = () => {
    setIsRendering(false);
    setShowRenderLabel(false);
    cancelAnimationFrame(frameIDRef.current);
  };

  const handleResetMenuClick = (event) => {
    setAncholEl(event.currentTarget);
  };

  const handleResetMenuClose = () => {
    setAncholEl(null);
  };

  const handleCopyToClipboard = () => {
    canvas.toBlob(function (blob) {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
    });
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleClearClick = () => {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    yRef.current = 0;
    yRef.current = 0;
    setIsRendering(false);
    setIsReady(false);
    setShowRenderLabel(true);
  };

  const handleToggleChange = (event, newValue) => {
    strideRef.current = newValue == "low" ? 2 : 1;
    setRes(newValue);
  };

  return (
    <Box
      sx={{
        minWidth: `${canvas_width + 2}px`,
        width: `${canvas_width + 2}px`
      }}
    >
      <Box display="flex">
        <Button
          variant="outlined"
          disabled={isReady}
          sx={{ width: "7.7em", mr: 1 }}
          onClick={isRendering ? handlePauseRender : handleRenderClick}
        >
          {isRendering ? "Pause" : ""}{" "}
          {showRenderLabel ? "Render" : !isRendering ? "Continue" : ""}
        </Button>
        <Button
          variant="outlined"
          disabled={isRendering}
          onClick={handleClearClick}
          sx={{ mr: 1 }}
        >
          Clear
        </Button>
        <Box flexGrow="1" />
        <ToggleButtonGroup
          color="primary"
          value={res}
          disabled={isRendering}
          exclusive
          size="small"
          sx={{ mr: 1 }}
          onChange={handleToggleChange}
        >
          <ToggleButton value="high" sx={{ pr: 1.8, pl: 1.8 }}>
            High
          </ToggleButton>
          <ToggleButton value="low" sx={{ pr: 1.8, pl: 1.8 }}>
            Low
          </ToggleButton>
        </ToggleButtonGroup>
        <Button
          variant="outlined"
          disabled={isRendering}
          onClick={handleCopyToClipboard}
          sx={{ mr: 1 }}
        >
          Copy
        </Button>
        <Button
          sx={{ width: "7em" }}
          variant="outlined"
          disabled={isRendering}
          endIcon={<KeyboardArrowDownIcon />}
          onClick={handleResetMenuClick}
        >
          Reset
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          sx={{ mt: 0.5 }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={handleResetMenuClose}
        >
          <MenuItem onClick={cube.transforms.reset}>Cube</MenuItem>
          <MenuItem onClick={cube.material.reset}>Cube Material</MenuItem>
          <MenuItem onClick={sphere.transforms.reset}>Sphere</MenuItem>
          <MenuItem onClick={sphere.material.reset}>Sphere Material</MenuItem>
          <MenuItem onClick={viewTransform.state.reset}>
            View Transform
          </MenuItem>
        </Menu>
      </Box>
      <canvas
        id="customView"
        width={canvas_width}
        height={canvas_height}
        style={{
          border: "1px solid #d4d4d4",
          opacity: 1,
          marginTop: "1em",
          marginBottom: "0.6em"
        }}
      ></canvas>

      <Box sx={{ width: "100%", mb: 3 }}>
        <Accordion>
          <AccordionSummary id="acc-1">
            <Typography component="span" variant="button">
              Cube
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ObjectSettings
              storedTranslation={cube.transforms.translation}
              storedScaling={cube.transforms.scaling}
              storedRotation={cube.transforms.rotation}
              updateTranslation={cube.transforms.updateTranslation}
              updateScaling={cube.transforms.updateScaling}
              updateRotation={cube.transforms.updateRotation}
              disabled={isRendering}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary id="acc-2">
            <Typography component="span" variant="button">
              Sphere
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ObjectSettings
              storedTranslation={sphere.transforms.translation}
              storedScaling={sphere.transforms.scaling}
              storedRotation={sphere.transforms.rotation}
              updateTranslation={sphere.transforms.updateTranslation}
              updateScaling={sphere.transforms.updateScaling}
              updateRotation={sphere.transforms.updateRotation}
              disabled={isRendering}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary id="acc-3">
            <Typography component="span" variant="button">
              Material for Cube
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MaterialSettings
              storedMaterial={cube.material.material}
              updateMaterial={cube.material.updateMaterial}
              isBusy={isRendering}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary id="acc-4">
            <Typography component="span" variant="button">
              Material for Sphere
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MaterialSettings
              storedMaterial={sphere.material.material}
              updateMaterial={sphere.material.updateMaterial}
              isBusy={isRendering}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary id="acc-5">
            <Typography component="span" variant="button">
              View Transform
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ViewTransformSettings
              storedFrom={viewTransform.state.from}
              storedTo={viewTransform.state.to}
              storedUp={viewTransform.state.up}
              updateFrom={viewTransform.state.updateFrom}
              updateTo={viewTransform.state.updateTo}
              updateUp={viewTransform.state.updateUp}
              isBusy={isRendering}
            />
          </AccordionDetails>
        </Accordion>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message="Image copied to clipboard."
      ></Snackbar>
    </Box>
  );
}
