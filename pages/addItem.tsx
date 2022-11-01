import { useAddress, useContract } from "@thirdweb-dev/react";
import React from "react";
import Header from "../components/Header";

type Props = {};

function addItem({}: Props) {
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">Add an Item to the Marketplace</h1>
        <h2 className="text-xl font-semibold pt-5">Item Details</h2>
        <p>
          By adding an item to the marketplace, you're essentialy Minting an NFT
          of the item into your wallet which we can then list for sale!
        </p>

        <div className="flex flex-col justify-center items-center md:flex-row">
          <img
            src="https://links.papareact.com/ucj"
            className="border h-80 w-80 object-contain"
            alt=""
          />
          <form className="flex flex-1 flex-col p-2 space-y-2">
            <label>Name of Item</label>
            <input placeholder="Name of Item..." type="text" />

            <label>Description</label>
            <input type="text" placeholder="Enter Description..." />

            <label>Image of the Item</label>
            <input type="file" />

            <button>Add/Mint Item</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default addItem;
