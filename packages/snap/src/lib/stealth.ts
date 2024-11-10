import { ethers } from 'ethers';
import * as secp256k1 from '@noble/secp256k1';
import { SnapConstants } from './constants';

// M = G * m
// R = G * r
// S = M * r = m * R
// P = M0 + G * hash(S)
// p = m0 + hash(S)

const getSharedSecret = (
  privateKey: string,
  publicKey: string,
  max = SnapConstants.MaxSharedSecret,
) => {
  const S = secp256k1.getSharedSecret(privateKey, publicKey, false);
  const ks = ethers.utils.keccak256(S);
  const hashS = ethers.BigNumber.from(ks).mod(max).toHexString();
  return { S, hashS };
};

export const generateStealthAddressByMr = (
  publicKey: string,
  privateKey: string,
) => {
  const M = secp256k1.Point.fromHex(publicKey);
  const { S, hashS } = getSharedSecret(privateKey, publicKey);
  const scalar = BigInt(hashS);
  // P = M + G * hash(S)
  const P = M.add(secp256k1.Point.BASE.multiply(scalar));
  const addressP = ethers.utils.computeAddress(P.toRawBytes());
  console.log('P', addressP);
  return { S, P, addressP, scalar, hashS };
};

const testGenerateStealthAddressByMr = async () => {
  const from = ethers.Wallet.createRandom();
  const to = ethers.Wallet.createRandom();
  if (ethers.BigNumber.from(to.privateKey).gt(SnapConstants.PrivateKeyMax)) {
    throw new Error('to.privateKey > SnapConstants.PrivateKeyMax');
  }

  // console.log('to,privateKey', to.privateKey);
  // console.log('from,privateKey', from.privateKey);
  const { hashS, addressP } = generateStealthAddressByMr(
    to.publicKey.slice(2),
    from.privateKey.slice(2),
  );
  // p = m + hash(S)
  const p = ethers.BigNumber.from(to.privateKey).add(hashS).toHexString();
  const pub = secp256k1.getPublicKey(p.slice(2, 66), false);
  const lastAddress = ethers.utils.computeAddress(pub);
  console.log('p', lastAddress);
  console.log('addressP', lastAddress === addressP);
};

testGenerateStealthAddressByMr();

// (() => {
//   let i = 1;
//   while (i > 0) {
//     i += 1;
//     testGenerateStealthAddressByMr();
//   }
// })();
