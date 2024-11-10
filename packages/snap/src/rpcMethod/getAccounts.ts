import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { getDefaultAccounts } from '../lib/getDefaultAccounts';

export const getAccounts: OnRpcRequestHandler = async () => {
  const defaultAccounts = await getDefaultAccounts();
  return defaultAccounts.map((account) => account.address);
};
