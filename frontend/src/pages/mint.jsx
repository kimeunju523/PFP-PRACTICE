import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import mintNFTABI from "../mintNFT.json";

const Mint = () => {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState();

  const { sdk, provider } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickMint = async () => {
    try {
      if (!account || !contract) return;

      await contract.methods.mintNFT().send({
        from: account,
      });

      const balance = await contract.methods.balanceOf(account).call();

      const newTokenId = await contract.methods
        .tokenOfOwnerByIndex(account, Number(balance) - 1)
        .call();

      const metadataURI = await contract.methods
        .tokenURI(Number(newTokenId))
        .call();

      console.log(metadataURI);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setContract(
      new web3.eth.Contract(
        mintNFTABI,
        "0xe10f3a559290398e5aa9757ea3acac97fa8d8779"
      )
    );
  }, [web3]);

  return (
    <div className="bg-red-100 max-w-screen-md mx-auto min-h-screen flex flex-col justify-center items-center">
      <div className="bg-blue-100 w-full fixed top-0 max-w-screen-md mx-auto">
        {account ? (
          <div>{account}</div>
        ) : (
          <button onClick={onClickMetaMask}>MetaMask LogIn</button>
        )}
      </div>
      <button onClick={onClickMint}>Mint</button>
    </div>
  );
};

export default Mint;