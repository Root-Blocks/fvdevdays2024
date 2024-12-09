# Futureverse Dev Days 2024 - POAP NFT

This is a Next.js project, used to create a POAP NFT for the Futureverse Dev Days 2024 event.

![Bildschirmfoto 2024-12-09 um 14 55 00](https://github.com/user-attachments/assets/1997c4a1-3d57-4283-a692-30a47a22f224)

## Requirements

- Node.js v20.18.0
- Yarn v1.22.22

## General Remarks

- The project uses the [Next.js](https://nextjs.org/) framework.
- The artwork is a [p5.js](https://p5js.org/) sketch that generates a unique image for each NFT.
- The metadata is stored in an S3 bucket.
- The NFTs are minted on the backend to cover gas fees for the users.
- The project uses the [Futurepass](https://futureverse.com/) login for authentication.

## Step-by-step guide

### Step 1: Create an S3 bucket and set up the AWS credentials

Create an S3 bucket to store the metadata files. You will need the bucket name to set the `S3_BUCKET` and `NEXT_PUBLIC_METADATA_URL` environment variable.

Set up the AWS credentials and get the access key ID and secret access key. You will need these to set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables.

### Step 2: Create a wallet on Metamask and get the private key

Create a wallet on Metamask and get the private key. You will need the private key to set the `PRIVATE_KEY` environment variable.

### Step 3: Create a Futurepass account and fund the wallet with testnet tokens

Create a Futurepass account and fund the wallet with testnet tokens. You will need the wallet address to fund the wallet.

The faucet can be found at the following URL:
https://faucet.rootnet.cloud/

### Step 4: Create the collection on the Portal

Create the collection on the Portal and get the collection ID. You will need the collection ID to set the `NEXT_PUBLIC_COLLECTION_ID` environment variable.

The portal can be found at the following URL:
https://portal.rootnet.live/

### Step 5: Register a client for the Futurepass login

Register a client for the Futurepass login and get the client ID. You will need the client ID to set the `NEXT_PUBLIC_FUTUREVERSE_CLIENT_ID` environment variable.

Choose a redirect URI for the Futurepass login and set the `NEXT_PUBLIC_REDIRECT_URI` environment variable.

Check the [Futurepass documentation](https://docs.futureverse.com/dev/authentication/getting-started) for more information.

### Step 6: Set up the environment variables

Environment variables are required to run the project. Create a `.env.local` file in the root of the project and add the following variables:

```bash
# Public variables
NEXT_PUBLIC_ENV= # local | dev | prod
NEXT_PUBLIC_FUTUREVERSE_CLIENT_ID= # Futurepass login client ID
NEXT_PUBLIC_REDIRECT_URI= # The redirect URI for the Futurepass login
NEXT_PUBLIC_METADATA_URL= # The base URL to the metadata files
NEXT_PUBLIC_COLLECTION_ID= # The POAP collection ID
NEXT_PUBLIC_NETWORK="porcini" # The network where the NFTs will be minted (porcini | root)
NEXT_PUBLIC_MINT_IS_LIVE="true" # Whether the mint is open or not

# Private variables
PRIVATE_KEY= # The private key of the wallet that will mint the NFTs
S3_BUCKET= # The S3 bucket name where the metadata files will be stored
AWS_ACCESS_KEY_ID= # AWS access key ID
AWS_SECRET_ACCESS_KEY= # AWS secret access key
AWS_REGION= # AWS region
AUTH_COOKIE_NAME= # The name of the cookie that will store the JWT token
FUTUREPASS_JWK_URL= # The URL to the Futurepass JWK
```

### Step 7: Install the dependencies and run the development server

First, install the dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```
