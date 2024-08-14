import { AccountUpdate, Bool, Mina, PrivateKey, PublicKey, UInt8 } from "o1js"
import { FungibleToken, FungibleTokenAdmin } from './index.js';

import dotenv from "dotenv"

dotenv.config()



class AmityToken extends FungibleToken {}

const { privateKey: tokenPRIKey, publicKey: tokenAddress } =
  PrivateKey.randomKeypair();

console.log(`Token Public Key: ${tokenAddress.toBase58()}`);
console.log(`Token Private Key: ${tokenPRIKey.toBase58()}`);

const {privateKey: adminPRIKey, publicKey: adminAddress} =
  PrivateKey.randomKeypair();

console.log(`Admin Private Key: ${adminPRIKey.toBase58()}`);
console.log(`Admin Public Key: ${adminAddress.toBase58()}`);

const Network = Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
Mina.setActiveInstance(Network);


await FungibleTokenAdmin.compile();
await FungibleToken.compile();
await AmityToken.compile();

const deployerPRIkey = process.env.DEPLOYER_PRIVATE_KEY

const deployerKey = PrivateKey.fromBase58(
    deployerPRIkey || ''
  );

  const deployerAddress = PublicKey.fromPrivateKey(deployerKey)

//   contract instance 
const token = new AmityToken(tokenAddress)

const fungibleTokenAdmin = new FungibleTokenAdmin(adminAddress)

console.log('Admin address:', adminAddress.toBase58());
console.log('Deployer address:', deployerAddress.toBase58());

const symbol = 'AMTY';

const src = 'https://github.com/MinaFoundation/mina-fungible-token/blob/main/FungibleToken.ts'


const fee = 1e8;

try {
    const tx = await Mina.transaction(
      { sender: deployerAddress, fee },
      async () => {
        AccountUpdate.fundNewAccount(deployerAddress, 3);
  
        await fungibleTokenAdmin.deploy({ adminPublicKey: adminAddress });
        await token.deploy({
          symbol,
          src,
        });
        await token.initialize(adminAddress, UInt8.from(9), Bool(false));
      }
    );
    await tx.prove();
    console.log('tx:', tx.toPretty());
  
    tx.sign([deployerKey, tokenPRIKey, adminPRIKey]);
    const txResult = await tx.send();
    console.log(
      `See transaction at https://minascan.io/devnet/tx/${txResult.hash}`
    );
    console.log('Token successfully deployed to:', tokenAddress.toBase58());
  } catch (error) {
    console.error('Error deploying token:', error);
  }

