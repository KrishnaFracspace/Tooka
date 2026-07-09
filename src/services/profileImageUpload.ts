import type { Asset } from 'react-native-image-picker';

export interface PreparedProfileImage {
  uri: string;
  fileName?: string;
  type?: string;
}

export const prepareProfileImageUpload = (asset: Asset): PreparedProfileImage | null => {
  if (!asset.uri) {
    return null;
  }

  return {
    uri: asset.uri,
    fileName: asset.fileName,
    type: asset.type,
  };
};
