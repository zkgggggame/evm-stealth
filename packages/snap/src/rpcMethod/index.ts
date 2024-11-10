import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { getAccounts } from './getAccounts';
import { autoSignature, autoSignatureRegister } from './autoSignature';
import { generateStealthAddress } from './stealth';

export const rpcMethods: Record<string, OnRpcRequestHandler> = {
  getAccounts,
  autoSignature,
  autoSignatureRegister,
  generateStealthAddress,
};
