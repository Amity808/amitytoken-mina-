import dotenv from "dotenv";
import { Mina, PrivateKey, PublicKey, UInt64, AccountUpdate } from "o1js";
import { eqaul } from "node:assert";

dotenv.config()

const Network = Mina.Network("https://api.minascan.io/node/devnet/v1/graphql");
Mina.setActiveInstance(Network);

class AmityToken extends FungibleToken {}


await FungibleTokenAdmin.compile();
await FungibleToken.compile();
await AmityToken.compile();

const token_private_key = process.env.TOKEN_PRIVATE_KEY

const mintToAddress = PublicKey.fromBase58(process.env.ADDRESS_TO_MINT || '');
const mintAmount = UInt64.from(100);

const tokenKey = PrivateKey.fromBase58(
    token_private_key || ''
  );
  const token_public_key = process.env.TOKEN_PUBLIC_KEY;
const tokenAddress = PublicKey.fromBase58(token_public_key || '');
const token = new AmityToken(tokenAddress);
console.log("token: ", token);
console.log("token ID: ", token.deriveTokenId());

const ownerBalanceBMint = await token.getBalanceOf(mintToAddress).toBigInt()