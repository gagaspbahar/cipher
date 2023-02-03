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
  const [isDisabled, setIsDisabled] = useState(false);
  const [file, setFile] = useState(null);

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
          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              sx={{ input: { color: "white" } }}
              type="number"
              variant="outlined"
              color="primary"
              label="M-Key"
              placeholder="ex: 5"
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
              placeholder="ex: 8"
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
          <Button variant="contained" onClick={handleSubmit} disabled={disable}>
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
          <Button
            variant="outlined"
            onClick={handleSpace}
          >
            Toggle Space
          </Button>
          <Button
            variant="outlined"
            onClick={downloadAsText}
          >
            Download result
          </Button>
        </ButtonGroup>
      </Container>
    </>
  );
}
