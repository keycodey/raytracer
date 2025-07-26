import React from "react";
import { TextField, MenuItem } from "@mui/material";

export default function StyledSelectWrapper({ options, ...otherProps }) {
  const configSelect = {
    ...otherProps,
    select: true,
    variant: "outlined",
    size: "small",
    fullWidth: true,
    style: { background: "#FFF" },
    sx: {
      "& .MuiInputBase-input": {
        fontSize: "0.875rem",
        lineHeight: "1rem",
        paddingTop: "0.7rem",
        paddingBottom: "0.4rem"
      },

      "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "#000"
      },
      "& .MuiOutlinedInput-root.Mui-disabled": {
        background: "#f2f2f2"
      }
    }
  };

  // hack to show html characters like '&pi;'
  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div>
      <TextField {...configSelect}>
        {options
          .sort((a, b) => (a.id > b.id ? 1 : -1))
          .map((item, pos) => {
            return (
              <MenuItem key={pos} value={item.value}>
                {decodeHtml(item.label)}
              </MenuItem>
            );
          })}
      </TextField>
    </div>
  );
}
