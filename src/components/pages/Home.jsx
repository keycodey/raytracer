import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import { Box, Container, Typography } from "@mui/material";

export default function Home() {
  return (
    <>
      <Box
        sx={{
          bgcolor: "#0001",
          mb: 2
        }}
      >
        <Container maxWidth="md" sx={{ bgcolor: "#FFF" }}>
          <Typography variant="h5">Ray tracing</Typography>
        </Container>
      </Box>
      <Container maxWidth="md" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          General information
        </Typography>
        <Typography variant="body2">
          The ray tracer that is used to create 3D images on this website is
          implemented with the instruction given in the excellent{" "}
          <Link
            underline="none"
            href="https://pragprog.com/titles/jbtracer/the-ray-tracer-challenge/"
            target="_blank"
          >
            The Ray Tracer Challenge
          </Link>{" "}
          book by Jamis Buck.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Gallery
        </Typography>
        <Typography variant="body2">
          Some of the features of the ray tracer are presented on the{" "}
          <Link component={RouterLink} to="/gallery" underline="none">
            Gallery
          </Link>{" "}
          page. All images are rendered by pressing the feature's Play button.
          It is possible to pause the rendering, or reset rendering altogether.
          When rendering is either completed or paused the created image can be
          copied to clipboard (hint: click the "three dots" icon button).
        </Typography>
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Playground
        </Typography>
        <Typography variant="body2">
          On the{" "}
          <Link component={RouterLink} to="/playground" underline="none">
            Playground
          </Link>{" "}
          page it is possible tweak the translations, rotations, and scaling of
          two objects: a cube and a sphere. Both objects have their own
          materials, which can also be tweaked. Changes are saved to the
          browser's local storage. Transforms and materials can be reset to
          "factory defaults".
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Playground includes an option to choose either full image rendering,
          "High", or lower quality preview rendering, "Low". The preview
          rendering option allows for a faster tweaking cycle of objects'
          transforms and materials. While the full image rendering option may be
          the better option once everything has been adjusted to meet the given
          requirements.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          The objects in the Playground have their transformations applied in
          this order: translations, scaling, rotation around the x-axis, then
          around the y-axis, and finally around the z-axis. This makes adjusting
          the transforms a bit cumbersome. Maybe later I'll mange to add an
          option to rearrange the order of the transforms.
        </Typography>
      </Container>
    </>
  );
}
