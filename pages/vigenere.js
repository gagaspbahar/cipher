import {
  Button,
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
  const [result, setResult] = useState("");
  const [disable, setDisable] = useState(true);

  const handleSubmit = () => {
    const data = new FormData();
    data.append("text", text);
    data.append("key", key);
    data.append("decrypt", decrypt);
    data.append("autokey", autokey);

    const data2 = {
      text: text.toUpperCase(),
      key: key,
      decrypt: decrypt,
      autokey: autokey,
    };
    fetch("/api/vigenere", {
      method: "POST",
      body: JSON.stringify(data2),
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
        <Button
          variant="outlined"
          sx={{
            width: "15%",
          }}
          onClick={handleSpace}
        >
          Toggle Space
        </Button>
      </Container>
    </>
  );
}
