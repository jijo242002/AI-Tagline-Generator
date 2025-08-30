import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

function App() {
  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("professional");
  const [numTaglines, setNumTaglines] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const HF_API_URL = "https://api-inference.huggingface.co/models/<YOUR_MODEL_NAME>";
  const HF_API_KEY = "<YOUR_HF_API_KEY>"; // Replace with your Hugging Face API key

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Build prompt
    const prompt = `Generate ${numTaglines} ${tone} tagline(s) for the following product:
Product Name: ${product}
Description: ${description}
Target Audience: ${audience}`;

    try {
      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HF API error: ${response.statusText}`);
      }

      const data = await response.json();

      // HF can return array of generated texts or a single object
      let taglines = [];
      if (Array.isArray(data)) {
        taglines = data.map((item) => item.generated_text?.trim()).filter(Boolean);
      } else if (data.generated_text) {
        taglines = [data.generated_text.trim()];
      } else {
        throw new Error("No taglines returned from HF API");
      }

      setResult({ taglines });
    } catch (err) {
      setError(err.message || "❌ Failed to generate taglines");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        🚀 AI Tagline Generator
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
        Generate catchy taglines for your product instantly
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Product Name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Target Audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          select
          fullWidth
          label="Tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          margin="normal"
        >
          <MenuItem value="funny">Funny</MenuItem>
          <MenuItem value="professional">Professional</MenuItem>
          <MenuItem value="luxury">Luxury</MenuItem>
          <MenuItem value="casual">Casual</MenuItem>
        </TextField>
        <TextField
          fullWidth
          type="number"
          label="Number of Taglines"
          value={numTaglines}
          onChange={(e) => setNumTaglines(e.target.value)}
          margin="normal"
          inputProps={{ min: 1, max: 10 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.5, fontSize: "16px", borderRadius: "12px" }}
          startIcon={<RocketLaunchIcon />}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Taglines"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" align="center" sx={{ mt: 3 }}>
          {error}
        </Typography>
      )}

      {result && (
        <Card sx={{ mt: 4, p: 2, borderRadius: "16px", boxShadow: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ✨ Generated Taglines
            </Typography>
            {result.taglines.map((line, i) => (
              <Typography key={i} variant="body1" sx={{ mb: 1 }}>
                • {line}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default App;

