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
  
    const handleSubmit = () => {
      let newKey = key.replace(/[^A-Za-z]/g, "").toUpperCase();
      let arrKey = [[], [], [], [], []];
      for (let i = 0; i < 5; i++){
        for (let j = 0; j < 5; j++){
          arrKey[i][j] = newKey[i*5+j];
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
              // type="number"
              variant="outlined"
              color="primary"
              label="Key"
              focused
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
  