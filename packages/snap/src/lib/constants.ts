import { ethers } from 'ethers';

const MaxSharedSecret = ethers.BigNumber.from('0xffffffffff');
export const SnapConstants = {
  CoinType: 60,
  DefaultAccountIndex: 0,
  DefaultAutoSinatureExpiry: 2 * 60 * 60 * 1000, // 2 hours
  MaxSharedSecret,
  PrivateKeyMax: ethers.BigNumber.from(
    '0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
  ).sub(MaxSharedSecret),
};
