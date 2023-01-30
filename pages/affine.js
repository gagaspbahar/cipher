import {
  Button,
  ButtonGroup,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";

export default function Affine() {
  const [text, setText] = useState("");
  const [mkey, setMKey] = useState("");
  const [bkey, setBKey] = useState("");
  const [decrypt, setDecrypt] = useState(false);
  const [result, setResult] = useState("");
  const [disable, setDisable] = useState(true);

  const handleSubmit = () => {
    const data = {
      text: text.replace(/[^A-Za-z]/g, "").toUpperCase(),
      mkey: parseInt(mkey),
      bkey: parseInt(bkey),
      decrypt: decrypt,
    };
    fetch("/api/affine", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then((data) => {
        setResult(data.result);
      });
    });
  };

  const handleSpace = () => {
    if (result.includes(" ")) {
      setResult(result.replace(/ /g, ""));
    } else {
      setResult(result.replace(/(.{5})/g, "$1 "));
    }
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "result.txt";
    document.body.appendChild(element);
    element.click();
  };

  useEffect(() => {
    const checkDisable = () => {
      if (text === "" || mkey === "" || bkey === "") {
        setDisable(true);
      } else {
        setDisable(false);
      }
    };
    checkDisable();
  }, [text, mkey, bkey]);

  return (
    <>
      <Container className="main">
        <Link href="/">
          <ArrowBackIcon
            sx={{
              color: "white",
              "&:hover": {
                cursor: "pointer",
                color: "primary.main",
              },
              marginBottom: "1em",
            }}
          />
        </Link>
        <Typography
          sx={{
            fontSize: "2em",
            fontWeight: "500",
          }}
        >
          Affine Cipher
        </Typography>
        <FormGroup>
          <TextField
            sx={{ input: { color: "white" }, margin: "0.5em" }}
            variant="outlined"
            color="primary"
            label="Text"
            focused
            onChange={(e) => setText(e.target.value)}
          >
            Enter text to encrypt or decrypt
          </TextField>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              margin: "0.5em",
            }}
          >
            <TextField
              sx={{ input: { color: "white" } }}
              type="number"
              variant="outlined"
              color="primary"
              label="M-Key"
              focused
              onChange={(e) => setMKey(e.target.value)}
            >
              Enter M-Key
            </TextField>
            <TextField
              sx={{ input: { color: "white" } }}
              type="number"
              variant="outlined"
              color="primary"
              label="B-Key"
              focused
              onChange={(e) => setBKey(e.target.value)}
            >
              Enter B-Key
            </TextField>
          </Stack>
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="Decrypt"
            onChange={(e) => setDecrypt(e.target.checked)}
          />
          <Button variant="outlined" onClick={handleSubmit} disabled={disable}>
            Go!
          </Button>
        </FormGroup>

        <Typography
          sx={{
            marginY: "1em",
          }}
        >
          Result: {result}
        </Typography>

        <ButtonGroup>
          <Button
            variant="outlined"
            sx={{
              width: "25%",
            }}
            onClick={handleSpace}
          >
            Toggle Space
          </Button>
          <Button
            variant="outlined"
            sx={{
              width: "25%",
            }}
            onClick={downloadAsText}
          >
            Download as Text File
          </Button>
        </ButtonGroup>
      </Container>
    </>
  );
}
