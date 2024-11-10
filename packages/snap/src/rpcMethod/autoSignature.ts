import { Json, OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text, divider } from '@metamask/snaps-ui';
import * as ethers from 'ethers';
import { getDefaultAccounts } from '../lib/getDefaultAccounts';
import { SnapConstants } from '../lib/constants';

const autoSignatures: Record<string, number> = {};

export const autoSignatureRegister: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  const params = request.params as Record<string, Json>;
  const defaultAccounts = await getDefaultAccounts();
  const prefix = String(params.prefix);
  const res = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        //
        text(`From: **${origin}**`),
        text(`Request **automatic signature**`),
        text(`Account: **${defaultAccounts[0].address}**`),
        divider(),
        text(`Message:`),
        text(`  **automatic signature**`),
        text(`  **${origin}**`),
        text(`  **${prefix}**`),
      ]),
    },
  });
  if (!res) {
    throw new Error('User rejected the request.');
  }
  autoSignatures[`${origin}:${prefix}`] = Date.now();
  return true;
};

export const autoSignature: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  const params = request.params as Record<string, Json>;
  const prefix = String(params.prefix);
  const registerPrefix = autoSignatures[`${origin}:${prefix}`];
  if (!registerPrefix) {
    throw new Error('Prefix not registered.');
  }

  if (Date.now() - registerPrefix > SnapConstants.DefaultAutoSinatureExpiry) {
    throw new Error('Prefix expired.');
  }

  const types = params.types as string[];
  const values = params.values as string[];
  if (types.length !== values.length) {
    throw new Error('Invalid params.');
  }

  if (types[0] !== 'string') {
    throw new Error('Invalid params(types[0]).');
  }

  if (types[1] !== 'string') {
    throw new Error('Invalid params(types[1]).');
  }

  if (types[2] !== 'string') {
    throw new Error('Invalid params(types[2]).');
  }

  if (values[0] !== 'automatic signature') {
    throw new Error('Invalid params(automatic signature).');
  }

  if (values[1] !== origin) {
    throw new Error('Invalid params(origin).');
  }

  if (values[2] !== prefix) {
    throw new Error('Invalid params(prefix).');
  }

  try {
    const message = ethers.utils.solidityKeccak256(types, values);
    const defaultAccounts = await getDefaultAccounts();
    if (!defaultAccounts[0].privateKey) {
      throw new Error('No private key.');
    }
    const signer = new ethers.Wallet(defaultAccounts[0].privateKey);
    const signature = await signer.signMessage(message);
    return signature;
  } catch (err) {
    throw new Error(`Failed to sign the message:${err}.`);
  }
};
