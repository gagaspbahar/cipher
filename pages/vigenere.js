import {
  Button,
  ButtonGroup,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Vigenere() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [decrypt, setDecrypt] = useState(false);
  const [autokey, setAutokey] = useState(false);
  const [extended, setExtended] = useState(false);
  const [result, setResult] = useState("");
  const [disable, setDisable] = useState(true);

  const handleSubmit = () => {
    const data = {
      text: extended ? text : text.replace(/[^A-Za-z]/g, '').toUpperCase(),
      key: extended ? key : key.replace(/[^A-Za-z]/g, '').toUpperCase(),
      decrypt: decrypt,
      autokey: autokey,
      extended: extended,
    };
    fetch("/api/vigenere", {
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
      if (text === "" || key === "") {
        setDisable(true);
      } else {
        setDisable(false);
      }
    };
    checkDisable();
  }, [text, key]);

  return (
    <>
      <Container className="main">
        <Typography
          sx={{
            fontSize: "2em",
            fontWeight: "500",
          }}
        >
          Vigenere Cipher
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
          <TextField
            sx={{ input: { color: "white" }, margin: "0.5em" }}
            variant="outlined"
            color="primary"
            label="Key"
            focused
            onChange={(e) => setKey(e.target.value)}
          >
            Enter text to encrypt or decrypt
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  color: "white",
                }}
              />
            }
            label="Autokey"
            onChange={(e) => setAutokey(e.target.checked)}
          />
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="Decrypt"
            onChange={(e) => setDecrypt(e.target.checked)}
          />
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="Use all ASCII characters"
            onChange={(e) => setExtended(e.target.checked)}
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
