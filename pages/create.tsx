import {
  MediaRenderer,
  useAddress,
  useContract,
  useCreateAuctionListing,
  useCreateDirectListing,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { NATIVE_TOKENS, NATIVE_TOKEN_ADDRESS, NFT } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import Header from "../components/Header";
import network from "../utils/network";

type Props = {};

function Create({}: Props) {
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  const address = useAddress();
  const router = useRouter();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  const ownedNfts = useOwnedNFTs(collectionContract, address);

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const {
    mutate: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(contract);

  const {
    mutate: createAuctionListing,
    isLoading: isLoadingAuction,
    error: errorAuction,
  } = useCreateAuctionListing(contract);

  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!selectedNFT) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    //name se get kr rhe inhe radio button aur input
    const { listingType, price } = target.elements;

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNFT.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          onSuccess(data, variables, context) {
            console.log("Success", data, variables, context);
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("ERROR", error, variables, context);
          },
        }
      );
    }

    if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNFT.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log("Success", data, variables, context);
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("ERROR", error, variables, context);
          },
        }
      );
    }
  };

  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-10 pt-2">
        <h1 className="text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold pt-5">
          Select an Item you want to Sell!
        </h2>

        <hr className="mb-5" />

        <p>Below you will find the NFT's you own in your wallet</p>

        <div className="flex overflow-x-scroll space-x-2 p-4">
          {ownedNfts?.data?.map((nft) => (
            <div
              onClick={() =>
                selectedNFT === nft
                  ? setSelectedNFT(undefined)
                  : setSelectedNFT(nft)
              }
              className={`flex flex-col space-y-2 card min-w-fit border-2 bg-gray-100 
              ${
                nft.metadata.id === selectedNFT?.metadata?.id
                  ? "border-black scale-105 z-50"
                  : "border-transparent"
              }`}
              key={nft.metadata.id}
            >
              <MediaRenderer
                className="h-48 rounded-lg"
                src={nft.metadata.image}
              />
              <p className="truncate text-lg font-bold">{nft.metadata.name}</p>
              <p className="truncate text-xs">{nft.metadata.description}</p>
            </div>
          ))}
        </div>

        {selectedNFT && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col p-10">
              <div className="grid grid-cols-2 gap-10">
                <label className="border-r font-light">
                  Direct Listing / Fixed Price{" "}
                </label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="directListing"
                />

                <label className="border-r font-light">Auction</label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="auctionListing"
                />
                <label className="border-r font-light">Price</label>
                <input
                  type="text"
                  name="price"
                  className="bg-gray-100 p-5 "
                  placeholder="0.05"
                  required
                />
              </div>

              <button
                className="bg-blue-600 text-white rounded-lg p-4 mt-8"
                type="submit"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default Create;
