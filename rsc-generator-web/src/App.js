import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Papa from "papaparse";
import JSZip from "jszip";
import RouterIcon from "@mui/icons-material/Router";
import InputAdornment from '@mui/material/InputAdornment';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { generateConfig, isValidIP } from "./utils/generator";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    hostname: "",
    identity: "",
    ipAddress: "",
  });
  const isIPInvalid =
  formData.ipAddress !== "" && !isValidIP(formData.ipAddress);
  const [version, setVersion] = useState("mpls");
  const [csvFile, setCsvFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.hostname || !formData.identity || !formData.ipAddress) {
    alert("Please fill in all fields.");
    return;
  }

  if (!isValidIP(formData.ipAddress)) {
  return;
}

  // Generate the single configuration mode using the utility function
  let output;

try {
  output = generateConfig(formData, version);
} catch (err) {
  alert(err.message);
  return;
}

  // Create plain text blob (NOT zip)
  const blob = new Blob([output], { type: "text/plain" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${formData.identity}.rsc`; // <-- Direct .rsc
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      alert("Please select a CSV file.");
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const zip = new JSZip();
        const outputFolder = zip.folder("output");
        results.data.forEach((row) => {
          if (row.Hostname && row.Identity && row["IP Address"]) {
            try {
            const output = generateConfig(
              {
                hostname: row.Hostname,
                identity: row.Identity,
                ipAddress: row["IP Address"],
              },
              version
            );

            outputFolder.file(`${row.Identity}.rsc`, output);
          } catch (err) {
            console.warn(`Skipped: ${row.Identity} (${err.message})`);
          }
          }
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rsc-files.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08), transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05), transparent 40%),
            linear-gradient(135deg, #0f2027, #203a43, #2c5364)
          `,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden"
        }}
      >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            mb: 4
          }}
        >

          {/* Icon + Title Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 0.5
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 48,
                height: 48
              }}
            >
              <RouterIcon />
            </Avatar>

            <Typography
              variant="h4"
              fontWeight="600"
              sx={{
                color: "#ffffff",
                letterSpacing: 0.6
              }}
            >
              RSC Generator
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.8)",
              mb: 1.5
            }}
          >
            RouterOS Configuration Tool
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.7)",
              maxWidth: "420px",
              lineHeight: 1.6
            }}
          >
            Generate RouterOS configuration files for your network devices.
          </Typography>

        </Box>  
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.95)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
          >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="rsc generator tabs"
          >
            <Tab label="Single Generation" />
            <Tab label="Bulk Generation" />
          </Tabs>
          {tabValue === 0 && (
            <form onSubmit={handleSubmit}>
              <TextField
                select
                label="Mode"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                fullWidth
                margin="normal"
                SelectProps={{ native: true }}
              >
                <option value="mpls">MPLS</option>
                <option value="nonmpls">NON-MPLS</option>
              </TextField>
              <TextField
                fullWidth
                label="Hostname"
                name="hostname"
                value={formData.hostname}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Identity"
                name="identity"
                value={formData.identity}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="IP Address"
                name="ipAddress"
                value={formData.ipAddress}
                onChange={handleChange}
                margin="normal"
                required
                error={isIPInvalid}
                helperText={isIPInvalid ? "Invalid IP format" : ""}
                InputProps={{
                  endAdornment: <InputAdornment position="end">/22</InputAdornment>,
                }}
              />
              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Generate and Download RSC File
                </Button>
              </Box>
            </form>
          )}
          {tabValue === 1 && (
            <form onSubmit={handleBulkSubmit}>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  fullWidth
                >
                  Upload CSV File
                  <input
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={(e) => {
                      handleFileChange(e);
                      setFileName(e.target.files[0]?.name || "");
                    }}
                  />
                </Button>

                {fileName && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: <strong>{fileName}</strong>
                  </Typography>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Upload a CSV file with columns: <b>Hostname, Identity, IP Address</b>
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!fileName}
                >
                  Generate and Download ZIP
                </Button>
              </Box>

            </form>
          )}
        </Paper>
      </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
