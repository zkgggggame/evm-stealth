import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { SnapConstants } from './constants';

export const getDefaultAccounts = async () => {
  const ethNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: { coinType: SnapConstants.CoinType },
  });
  const deriveEthAddress = await getBIP44AddressKeyDeriver(ethNode);
  return [await deriveEthAddress(SnapConstants.DefaultAccountIndex)];
};
