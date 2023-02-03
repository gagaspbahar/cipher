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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import Link from "next/link";

let math = require("mathjs");

export default function Hill() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [decrypt, setDecrypt] = useState(false);
  const [result, setResult] = useState("");
  const [disable, setDisable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    let newKey = key.replace(/[^A-Za-z]/g, "").toUpperCase();
    let arrKey = [[], [], [], [], []];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        arrKey[i][j] = newKey[i * 5 + j];
      }
    }
    let newText = text.replace(/[^A-Za-z]/g, "").toUpperCase();
    const data = {
      text: newText,
      key: arrKey,
      decrypt: decrypt,
    };
    fetch("/api/playfair", {
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

  useEffect(() => {
    if (file !== null) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const text = reader.result;
        setText(text);
        setIsDisabled(true);
      };
    } else {
      setIsDisabled(false);
    }
  }, [file]);

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
          Playfair Cipher
        </Typography>
        <FormGroup>
          <Stack
            direction="row"
            spacing="1em"
            sx={{
              marginY: "1em",
              justifyContent: "space-between",
            }}
          >
            {isDisabled ? (
              <>
                <Typography>Uploaded file: {file.name}</Typography>
                <Button
                  variant="raised"
                  component="label"
                  sx={{
                    // width: "25%",
                    size: "small",
                  }}
                  onClick={() => {
                    setIsDisabled(false);
                  }}
                >
                  Use text
                </Button>
              </>
            ) : (
              <TextField
                sx={{
                  input: { color: "white" },
                  marginY: "0.5em",
                  width: "70%",
                }}
                variant="outlined"
                color="primary"
                label="Text"
                focused
                placeholder="Enter text to encrypt or decrypt"
                onChange={(e) => setText(e.target.value)}
              >
                Enter text to encrypt or decrypt
              </TextField>
            )}

            <Button
              variant="raised"
              component="label"
              sx={{
                // width: "25%",
                size: "small",
              }}
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={(e) => {
                  setIsDisabled(true);
                  setFile(e.target.files[0]);
                }}
                onClick={(e) => {
                  e.target.value = null;
                }}
              />
            </Button>
          </Stack>
          <TextField
            sx={{ input: { color: "white" } }}
            // type="number"
            variant="outlined"
            color="primary"
            label="Key"
            focused
            placeholder="ABCDEFGHIKLMNOPQRSTUVWXYZ"
            onChange={(e) => setKey(e.target.value)}
          >
            Enter Key
          </TextField>
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="Decrypt"
            onChange={(e) => setDecrypt(e.target.checked)}
          />
          <Button variant="outlined" onClick={handleSubmit} disabled={disable}>
            Go!
          </Button>
          <TextField
            sx={{
              input: { color: "white" },
              marginTop: "2em",
              marginBottom: "1em",
            }}
            variant="outlined"
            color="primary"
            label="Result"
            focused
            value={result}
          />
        </FormGroup>

        <ButtonGroup>
          <Button variant="outlined" onClick={handleSpace}>
            Toggle Space
          </Button>
          <Button variant="outlined" onClick={downloadAsText}>
            Download result
          </Button>
        </ButtonGroup>
      </Container>
    </>
  );
}
