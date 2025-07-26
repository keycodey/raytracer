import { useEffect, useState } from "react";
import { color } from "../../features/tuples";
import booleanValues from "../../data/forms/booleanValues.json";
import commonValues from "../../data/forms/commonValues.json";
import refractiveIndexValues from "../../data/forms/refractiveIndexValues.json";
import shininessValues from "../../data/forms/shininessValues.json";
import Box from "@mui/material/Box";
import StyledSelectWrapper from "./StyledSelectWrapper";

export default function MaterialSettings({
  storedMaterial,
  updateMaterial,
  isBusy
}) {
  const [material, setMaterial] = useState({
    color: color(0.5, 1, 1),
    ambient: 0.1,
    diffuse: 0.9,
    specular: 0.9,
    shininess: 100.0,
    pattern: null,
    reflective: 0.0,
    transparency: 0.0,
    refractive_index: 1.0,
    casts_shadows: true
  }); // only needed to initialize component

  useEffect(() => {
    setMaterial(storedMaterial);
  }, [storedMaterial]);

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "red":
        const r = color(value, material.color[1], material.color[2]);
        updateMaterial({ ...material, color: r });
        break;
      case "green":
        const g = color(material.color[0], value, material.color[2]);
        updateMaterial({ ...material, color: g });
        break;
      case "blue":
        const b = color(material.color[0], material.color[1], value);
        updateMaterial({ ...material, color: b });
        break;
      default:
        updateMaterial({ ...material, [name]: value });
        break;
    }
  };

  return (
    <Box sx={{ display: "flex", flexFlow: "column" }}>
      {/* row 1 */}
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="red"
            label="red"
            value={material.color[0]}
            onChange={handleMaterialChange}
            disabled={isBusy}
            options={commonValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="green"
            label="green"
            value={material.color[1]}
            onChange={handleMaterialChange}
            disabled={isBusy}
            options={commonValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="blue"
            label="blue"
            value={material.color[2]}
            onChange={handleMaterialChange}
            disabled={isBusy}
            options={commonValues}
          />
        </Box>
        <Box
          sx={{
            width: "25%",
            mr: 0,
            borderRadius: 1,
            border: "1px solid #c4c4c4",
            backgroundColor: `rgb(${255 * material.color[0]},${
              255 * material.color[1]
            },${255 * material.color[2]})`
          }}
        ></Box>
      </Box>
      {/* row 2 */}
      <Box sx={{ display: "flex", mt: 1.5 }}>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="ambient"
            label="ambient"
            value={material.ambient}
            onChange={handleMaterialChange}
            disabled={isBusy}
            options={commonValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="diffuse"
            label="diffuse"
            value={material.diffuse}
            onChange={handleMaterialChange}
            disabled={isBusy}
            options={commonValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="specular"
            label="specular"
            value={material.specular}
            onChange={handleMaterialChange}
            disabled={isBusy}
            options={commonValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 0 }}>
          <StyledSelectWrapper
            name="shininess"
            label="shininess"
            value={material.shininess}
            onChange={handleMaterialChange}
            disabled={isBusy}
            options={shininessValues}
          />
        </Box>
      </Box>
      {/* row 3 */}
      <Box sx={{ display: "flex", mt: 1.5 }}>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="reflective"
            label="reflective"
            value={material.reflective}
            onChange={handleMaterialChange}
            disabled={isBusy}
            options={commonValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="transparency"
            label="transparency"
            value={material.transparency}
            onChange={handleMaterialChange}
            disabled={isBusy}
            options={commonValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 1 }}>
          <StyledSelectWrapper
            name="refractive_index"
            label="refractive index"
            value={material.refractive_index}
            onChange={handleMaterialChange}
            disabled={isBusy}
            options={refractiveIndexValues}
          />
        </Box>
        <Box sx={{ width: "25%", mr: 0 }}>
          <StyledSelectWrapper
            name="casts_shadows"
            label="casts shadows"
            value={material.casts_shadows}
            onChange={handleMaterialChange}
            disabled={isBusy}
            options={booleanValues}
          />
        </Box>
      </Box>
    </Box>
  );
}
