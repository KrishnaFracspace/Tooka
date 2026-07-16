import type { Asset } from 'react-native-image-picker';
import type { ProfileImage } from '../types/profileImage';

/**
 * Converts a raw image picker `Asset` into a `ProfileImage` object suitable
 * for both:
 *   - Immediate rendering via `resolveImageUri()`
 *   - Multipart upload via `objectToFormData()`
 *
 * Returns `null` if the asset has no URI (asset was invalid).
 */
export const prepareProfileImageUpload = (asset: Asset): ProfileImage | null => {
  if (!asset.uri) {
    return null;
  }

  return {
    uri: asset.uri,
    type: asset.type,
    fileName: asset.fileName,
  };
};
