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
  import { useEffect, useState } from "react";

  let math = require("mathjs");
  
  export default function Hill() {
    const [text, setText] = useState("");
    const [key, setKey] = useState("");
    const [decrypt, setDecrypt] = useState(false);
    const [result, setResult] = useState("");
    const [disable, setDisable] = useState(true);
    
    const handleSubmit = () => {
      let arrKey = key.split(",").map((x) => parseInt(x));
      let matKey = [];
      if (arrKey.length == 4) {
        matKey = [[arrKey[0], arrKey[1]], [arrKey[2], arrKey[3]]];
        if (math.det(matKey) == 0) {
          setResult("The key is not invertible");
          return;
        }
      }
        else if (arrKey.length == 9) {
            matKey = [[arrKey[0], arrKey[1], arrKey[2]], [arrKey[3], arrKey[4], arrKey[5]], [arrKey[6], arrKey[7], arrKey[8]]];
            if (math.det(matKey) == 0) {
                setResult("The key is not invertible");
                return;
            }
        }
        else {
            setResult("The key is not valid");
            return;
        }
      const data = {
        text: text.replace(/[^A-Za-z]/g, '').toUpperCase(),
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
  
    return (
      <>
        <Container className="main">
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
  