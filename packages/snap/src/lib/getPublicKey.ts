import { ethers } from 'ethers';

export const getPublicKeyBySinature = (
  signature: string,
  message: ethers.utils.BytesLike,
) => {
  const pub = ethers.utils.recoverPublicKey(
    ethers.utils.hashMessage(message),
    signature,
  );
  return pub;
};

export const getPublicKeyBytx = async (tx: string) => {
  console.log(tx);
  // https://www.reddit.com/r/ethdev/comments/poqlb4/recover_a_public_key_from_a_transaction/
};

const test = async () => {
  const account = ethers.Wallet.createRandom();
  const message = ethers.utils.arrayify(
    ethers.utils.solidityKeccak256(['string'], ['a msg']),
  );
  const signature = await account.signMessage(message);
  const pub = getPublicKeyBySinature(signature, message);

  console.log(pub === account.publicKey, pub);
};

test();
