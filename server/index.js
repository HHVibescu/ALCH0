const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");

app.use(cors());
app.use(express.json());

const balances = {
  // private key (hex): 8767a46ef6473fedf732d9d19c3ff0e751294360704d0ae459d67447811e66c3
// public key (hex): 02a2218aa934c7bfb1bf92a1a8b48c994233c178ea5d94996f36c59ad58760327a
  "02a2218aa934c7bfb1bf92a1a8b48c994233c178ea5d94996f36c59ad58760327a": 100,
  // private key (hex): 4dfe1afc09d5ecd4c0267c0eb89585d945cb4b5597ced25727cf435c4b4551a8
  // public key (hex): 02866aa66b06a0a795232bb9afad482d080dba7b2009419c7de2c62c6efbba095d 
  "02866aa66b06a0a795232bb9afad482d080dba7b2009419c7de2c62c6efbba095d": 50,
//   private key (hex): fba76934b553dcb5dbfa2daf63769a627f333cbe55c2c28844df096bf086766a
// public key (hex): 02da59f1e73db4cd432d44f36f9d3c2f703f4b7c8c7f853e525dea373f552ec224
  "02da59f1e73db4cd432d44f36f9d3c2f703f4b7c8c7f853e525dea373f552ec224": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  let addresss = toHex(secp256k1.getPublicKey(address));
  const balance = balances[addresss] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;
  let senderr = toHex(secp256k1.getPublicKey(sender));
  setInitialBalance(senderr);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
