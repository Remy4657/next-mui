import Typography from "@mui/material/Typography";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h6">Loading...</Typography>
    </div>
  );
}
