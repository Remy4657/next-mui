"use client";

// ** Next
import Image from "next/image";

// ** MUI Imports
import { useTheme } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import { Typography } from "@mui/material";

// ** Image
// import Nodata from "../../../public/svgs/no-data.svg";

type TProps = {
  widthImage?: string;
  heightImage?: string;
  textNodata?: string;
};

const NoData = (props: TProps) => {
  // ** Hook
  const theme = useTheme();

  // ** Props
  const {
    widthImage = "100px",
    heightImage = "100px",
    textNodata = "No_data",
  } = props;

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* <Image
        src={Nodata}
        alt="avatar"
        width={0}
        height={0}
        style={{
          height: heightImage,
          width: widthImage,
          objectFit: "cover",
        }}
      /> */}
      <Typography sx={{ whiteSpace: "nowrap", mt: 2 }}>{textNodata}</Typography>
    </Box>
  );
};
export default NoData;
