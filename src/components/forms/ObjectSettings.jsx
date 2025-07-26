import { useEffect, useState } from "react";
import { Box, Paper, TextField, Typography } from "@mui/material";
import StyledSelectWrapper from "./StyledSelectWrapper";
import translationValues from "../../data/forms/translationValues.json";
import scalingValues from "../../data/forms/scalingValues.json";
import rotationValues from "../../data/forms/rotationValues.json";

export default function ObjectSettings({
  storedTranslation,
  storedScaling,
  storedRotation,
  updateTranslation,
  updateScaling,
  updateRotation,
  disabled
}) {
  // only needed for initialization
  const [translation, setTranslation] = useState({ x: 0, y: 1, z: 0 });
  const [scaling, setScaling] = useState({ x: 1, y: 1, z: 1 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    setTranslation(storedTranslation);
    setScaling(storedScaling);
    setRotation(storedRotation);
  }, [storedTranslation, storedScaling, storedRotation]);

  // changes are saved to localstorage
  const handleTranslationChange = (e) => {
    updateTranslation({ ...translation, [e.target.name]: e.target.value });
  };

  const handleScalingChange = (e) => {
    updateScaling({ ...scaling, [e.target.name]: e.target.value });
  };

  const handleRotationChange = (e) => {
    updateRotation({ ...rotation, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ display: "flex", flexFlow: "column" }}>
      {/* row 1 */}
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "25%", mr: 1, alignContent: "center" }}>
          <Typography>Translation</Typography>
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="x"
            value={translation.x}
            onChange={handleTranslationChange}
            disabled={disabled}
            label="x"
            options={translationValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            value={translation.y}
            onChange={handleTranslationChange}
            disabled={disabled}
            name="y"
            label="y"
            options={translationValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 0 }}>
          <StyledSelectWrapper
            value={translation.z}
            onChange={handleTranslationChange}
            disabled={disabled}
            name="z"
            label="z"
            options={translationValues}
          />
        </Box>
      </Box>
      {/* row 2 */}
      <Box sx={{ display: "flex", mt: 1.5 }}>
        <Box sx={{ width: "25%", mr: 1, alignContent: "center" }}>
          <Typography>Scaling</Typography>
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            value={scaling.x}
            onChange={handleScalingChange}
            disabled={disabled}
            name="x"
            label="x"
            options={scalingValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            value={scaling.y}
            onChange={handleScalingChange}
            disabled={disabled}
            name="y"
            label="y"
            options={scalingValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 0 }}>
          <StyledSelectWrapper
            value={scaling.z}
            onChange={handleScalingChange}
            disabled={disabled}
            name="z"
            label="z"
            options={scalingValues}
          />
        </Box>
      </Box>
      {/* row 3 */}
      <Box sx={{ display: "flex", mt: 1.5 }}>
        <Box sx={{ width: "25%", mr: 1, alignContent: "center" }}>
          <Typography>Rotation</Typography>
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            value={rotation.x}
            onChange={handleRotationChange}
            disabled={disabled}
            name="x"
            label="x"
            options={rotationValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            value={rotation.y}
            onChange={handleRotationChange}
            disabled={disabled}
            name="y"
            label="y"
            options={rotationValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 0 }}>
          <StyledSelectWrapper
            value={rotation.z}
            onChange={handleRotationChange}
            disabled={disabled}
            name="z"
            label="z"
            options={rotationValues}
          />
        </Box>
      </Box>
    </Box>
  );
}
