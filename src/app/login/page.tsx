import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import styles from "./page.module.css";

export default function BasicButtons() {
  return (
    <div className="container d-flex">
      <Box
        component="form"
        sx={{ "& > :not(style)": { m: 1 } }}
        noValidate
        autoComplete="off"
        className={`d-flex flex-column ${styles.form}`}
      >
        <TextField
          id="standard-basic"
          label="Email"
          variant="standard"
          error={true}
        />
        <TextField id="standard-basic" label="Password" variant="standard" />
      </Box>
    </div>
  );
}
