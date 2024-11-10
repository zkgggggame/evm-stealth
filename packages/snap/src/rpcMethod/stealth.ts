import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { getDefaultAccounts } from '../lib/getDefaultAccounts';
import { generateStealthAddressByMr } from '../lib/stealth';

// / @notice Generates a stealth address from a stealth meta address.
// / @param stealthMetaAddress The recipient's stealth meta-address.
// / @return stealthAddress The recipient's stealth address.
// / @return ephemeralPubKey The ephemeral public key used to generate the stealth address.
// / @return viewTag The view tag derived from the shared secret.
// function generateStealthAddress(bytes memory stealthMetaAddress)
//   external
//   view
//   returns (address stealthAddress, bytes memory ephemeralPubKey, bytes1 viewTag);
export const generateStealthAddress: OnRpcRequestHandler = async (props) => {
  const params = props.request.params as Record<string, string>;
  const stealthMetaAddress = String(params.stealthMetaAddress);
  const from = (await getDefaultAccounts())[0];
  if (!from.privateKey) {
    throw new Error('No private key.');
  }
  return generateStealthAddressByMr(stealthMetaAddress, from.privateKey);
};

// / @notice Returns true if funds sent to a stealth address belong to the recipient who controls
// / the corresponding spending key.
// / @param stealthAddress The recipient's stealth address.
// / @param ephemeralPubKey The ephemeral public key used to generate the stealth address.
// / @param viewingKey The recipient's viewing private key.
// / @param spendingPubKey The recipient's spending public key.
// / @return True if funds sent to the stealth address belong to the recipient.
// function checkStealthAddress(
//   address stealthAddress,
//   bytes memory ephemeralPubKey,
//   bytes memory viewingKey,
//   bytes memory spendingPubKey
// ) external view returns (bool);

// / @notice Computes the stealth private key for a stealth address.
// / @param stealthAddress The expected stealth address.
// / @param ephemeralPubKey The ephemeral public key used to generate the stealth address.
// / @param spendingKey The recipient's spending private key.
// / @return stealthKey The stealth private key corresponding to the stealth address.
// / @dev The stealth address input is not strictly necessary, but it is included so the method
// / can validate that the stealth private key was generated correctly.
// function computeStealthKey(
//   address stealthAddress,
//   bytes memory ephemeralPubKey,
//   bytes memory spendingKey
// ) external view returns (bytes memory);
