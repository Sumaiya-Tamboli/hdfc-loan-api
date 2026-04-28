const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const loanRoutes = require("./routes/loanRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Loan Mock API Running...");
});

app.use("/", loanRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});