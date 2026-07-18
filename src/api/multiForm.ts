export const objectToFormData = (obj: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (typeof value === 'object' && value.uri) {
      formData.append(key, {
        uri: value.uri,
        type: value.type || 'image/jpeg',
        name: value.fileName || value.name || 'upload.jpg',
      } as any);
    } else if (Array.isArray(value)) {
      value.forEach((val) => {
        formData.append(`${key}[]`, String(val));
      });
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};