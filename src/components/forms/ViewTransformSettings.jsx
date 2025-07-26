import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import StyledSelectWrapper from "./StyledSelectWrapper";
import viewTransformValues from "../../data/forms/viewTransformValues.json";

export default function ViewTransformSettings({
  storedFrom,
  storedTo,
  storedUp,
  updateFrom,
  updateTo,
  updateUp,
  isBusy
}) {
  // init
  const [from, setFrom] = useState({ x: 0, y: 2, z: -5 });
  const [to, setTo] = useState({ x: 0, y: 1, z: 0 });
  const [up, setUp] = useState({ x: 0, y: 1, z: 0 });

  useEffect(() => {
    setFrom(storedFrom);
    setTo(storedTo);
    setUp(storedUp);
  }, [storedFrom, storedTo, storedUp]);

  const handleFromChange = (e) => {
    updateFrom({ ...from, [e.target.name]: e.target.value });
  };

  const handleToChange = (e) => {
    updateTo({ ...to, [e.target.name]: e.target.value });
  };

  const handleUpChange = (e) => {
    updateUp({ ...up, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ display: "flex", flexFlow: "column" }}>
      {/* row 1 */}
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "25%", mr: 1, alignContent: "center" }}>
          <Typography>From</Typography>
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="x"
            label="x"
            value={from.x}
            onChange={handleFromChange}
            disabled={isBusy}
            options={viewTransformValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="y"
            label="y"
            value={from.y}
            onChange={handleFromChange}
            disabled={isBusy}
            options={viewTransformValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 0 }}>
          <StyledSelectWrapper
            name="z"
            label="z"
            value={from.z}
            onChange={handleFromChange}
            disabled={isBusy}
            options={viewTransformValues}
          />
        </Box>
      </Box>
      {/* row 2 */}
      <Box sx={{ display: "flex", mt: 1.5 }}>
        <Box sx={{ width: "25%", mr: 1, alignContent: "center" }}>
          <Typography>To</Typography>
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="x"
            label="x"
            value={to.x}
            onChange={handleToChange}
            disabled={isBusy}
            options={viewTransformValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="y"
            label="y"
            value={to.y}
            onChange={handleToChange}
            disabled={isBusy}
            options={viewTransformValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 0 }}>
          <StyledSelectWrapper
            name="z"
            label="z"
            value={to.z}
            onChange={handleToChange}
            disabled={isBusy}
            options={viewTransformValues}
          />
        </Box>
      </Box>
      {/* row 3 */}
      <Box sx={{ display: "flex", mt: 1.5 }}>
        <Box sx={{ width: "25%", mr: 1, alignContent: "center" }}>
          <Typography>Up</Typography>
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="x"
            label="x"
            value={up.x}
            onChange={handleUpChange}
            disabled={isBusy}
            options={viewTransformValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="y"
            label="y"
            value={up.y}
            onChange={handleUpChange}
            disabled={isBusy}
            options={viewTransformValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 0 }}>
          <StyledSelectWrapper
            name="z"
            label="z"
            value={up.z}
            onChange={handleUpChange}
            disabled={isBusy}
            options={viewTransformValues}
          />
        </Box>
      </Box>
    </Box>
  );
}
