import {
  Button,
  ButtonGroup,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
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
    let arrKey = key.split(",").map((x) => parseInt(x));
    let matKey = [];
    if (arrKey.length == 4) {
      matKey = [
        [arrKey[0], arrKey[1]],
        [arrKey[2], arrKey[3]],
      ];
      if (math.det(matKey) == 0) {
        setResult("The key is not invertible");
        return;
      }
    } else if (arrKey.length == 9) {
      matKey = [
        [arrKey[0], arrKey[1], arrKey[2]],
        [arrKey[3], arrKey[4], arrKey[5]],
        [arrKey[6], arrKey[7], arrKey[8]],
      ];
      if (math.det(matKey) == 0) {
        setResult("The key is not invertible");
        return;
      }
    } else {
      setResult("The key is not valid");
      return;
    }
    const data = {
      text: text.replace(/[^A-Za-z]/g, "").toUpperCase(),
      key: matKey,
      decrypt: decrypt,
    };
    fetch("/api/hill", {
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
          Hill Cipher
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
            placeholder="17,17,5,21,18,21,2,2,19"
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
        </FormGroup>

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
