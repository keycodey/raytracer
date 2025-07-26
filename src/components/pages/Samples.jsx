import Box from "@mui/material/Box";
import RenderImageCard from "../cards/RenderImageCard";
import { scenes } from "../../data/scenes";

export default function Samples() {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        pb: 2
      }}
    >
      {scenes.map((scene) => (
        <RenderImageCard key={scene.title} scene={scene} />
      ))}
    </Box>
  );
}
