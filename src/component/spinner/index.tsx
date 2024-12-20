"use client";

// ** MUI Imports
import { styled, useTheme } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import { Modal, ModalProps } from "@mui/material";

// component
import CircularWithValueLabel from "src/component/custom-circular-process";

const CustomModal = styled(Modal)<ModalProps>(({ theme }) => ({
  "&.MuiModal-root": {
    width: "100%",
    height: "100%",
    zIndex: 2000,
    ".MuiModal-backdrop": {
      backgroundColor: theme.palette.grey,
    },
  },
}));

const Spinner = ({ sx }: { sx?: BoxProps["sx"] }) => {
  // ** Hook
  const theme = useTheme();

  return (
    <CustomModal open={true}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          ...sx,
        }}
      >
        <CircularWithValueLabel />
      </Box>
    </CustomModal>
  );
};
export default Spinner;
