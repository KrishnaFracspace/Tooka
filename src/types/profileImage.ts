/**
 * Represents a profile photo value that can exist in one of three states:
 *
 * - `string`  — A remote URL already stored on the server (e.g. "https://...")
 *               OR a local URI already reduced to a plain string.
 * - `object`  — A newly-selected local asset that must be uploaded via
 *               multipart/form-data.  The `uri` field is mandatory; `type`
 *               and `fileName` / `name` are optional but strongly recommended.
 * - `null`    — No photo selected / user has no avatar.
 */
export type ProfileImage =
  | string
  | {
      uri: string;
      type?: string;
      fileName?: string;
      name?: string;
    }
  | null;

/**
 * Safely resolves a `ProfileImage` value to a plain URI string for use with
 * React Native's `<Image source={{ uri }}>` prop.
 *
 * Returns `null` when no valid URI can be determined so callers can fall back
 * to a placeholder without risking a native "ReadableNativeMap → string" crash.
 */
export const resolveImageUri = (photo: ProfileImage): string | null => {
  if (!photo) {
    return null;
  }

  if (typeof photo === 'string') {
    return photo.trim() || null;
  }

  return photo.uri?.trim() || null;
};
