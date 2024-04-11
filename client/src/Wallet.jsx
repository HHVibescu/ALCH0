import server from "./server";

import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = secp256k1.getPublicKey(privateKey);
    setAddress(toHex(address))
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Input your private key" value={privateKey} onChange={onChange}></input>
      </label>

      <h2>Public address</h2>

    <label>

      {address}
      
    </label>
    <h2>Balance</h2>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
