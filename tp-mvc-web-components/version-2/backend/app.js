const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;

app.use(express.json());
app.use(cors());

app.post("/calculate", (req, res) => {
    const { firstNumber, operator, secondNumber } = req.body;
    let result;

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;
        case "-":
            result = firstNumber - secondNumber;
            break;
        case "x":
            result = firstNumber * secondNumber;
            break;
        case "/":
            if (secondNumber === 0) {
                return res
                    .status(400)
                    .json({ error: "Error: Division by zero" });
            }
            result = firstNumber / secondNumber;
            break;
        default:
            return res.status(400).json({ error: "Invalid operator" });
    }

    res.json({ result });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
