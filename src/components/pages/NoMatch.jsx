import { Link as RouterLink } from "react-router-dom";
import { Link, Typography } from "@mui/material";

export default function NoMatch() {
  return (
    <>
      <Typography variant="h6">Unable to find page.</Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Return to{" "}
        <Link component={RouterLink} to="/" underline="none">
          home page
        </Link>
        .
      </Typography>
    </>
  );
}
