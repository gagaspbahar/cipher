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

export default function Vigenere() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [decrypt, setDecrypt] = useState(false);
  const [autokey, setAutokey] = useState(false);
  const [extended, setExtended] = useState(false);
  const [result, setResult] = useState("");
  const [disable, setDisable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [filename, setFilename] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    const data = {
      text: extended ? text : text.replace(/[^A-Za-z]/g, "").toUpperCase(),
      key: extended ? key : key.replace(/[^A-Za-z]/g, "").toUpperCase(),
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

  // const handleChangeFile = () => {
  //   // const fileInput = e.target.files[0];
  //   const fileInput = file
  //   console.log(fileInput)
  //   setFilename(fileInput.name);
  //   console.log("msk")
  //   setFile(fileInput);
  //   const reader = new FileReader();
  //   reader.readAsText(fileInput);
  //   reader.onload = () => {
  //     setText(reader.result);
  //     setIsDisabled(true);
  //     console.log("msk")
  //   };
  //   console.log("msk")
  // }

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
    console.log(file)
    if (file !== null){
      setFilename(file.name);
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        console.log("test")
        const text = reader.result
        setText(text);
        setIsDisabled(true);
      };
    } else {
      console.log("masuk")
      setIsDisabled(false);
    }
  }, [file]);

  // useEffect(() => {{
  //   console.log(filename)
  //   console.log(isDisabled)
  // }}, [filename, isDisabled])

  // useEffect(() => {
  //   console.log(filename)
  //   console.log(isDisabled)
  // }, [filename, isDisabled])

  // const hiddenFileInput = useRef(null);

  // This uses nextjs so dont use document
  // const fileInput = document.querySelector('input[type="file]')
  // fileInput.addEventListener("change", (e) => {
  //   const file = e.target.files[0];
  //   setFilename(file.name);
  //   setFile(file);
  //   const reader = new FileReader();
  //   reader.readAsText(file);
  //   reader.onload = () => {
  //     setText(reader.result);
  //     setIsDisabled(true);
  //   };
  // });

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
          Vigenere Cipher
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
                <Typography>Uploaded file: {filename}</Typography>
                <Button
                  variant="raised"
                  component="label"
                  sx={{
                    // width: "25%",
                    size: "small",
                  }}
                  onClick={() => {setIsDisabled(false)}}
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
                  setIsDisabled(true)
                  setFile(e.target.files[0]);
                }}
                onClick={(e) => {
                  e.target.value = null;
                }}
              />
            </Button>
          </Stack>
          <TextField
            sx={{ input: { color: "white" }, marginY: "0.5em" }}
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
