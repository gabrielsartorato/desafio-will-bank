export const transformPixValidateKeyFactory = (key: string): string => {
  let transformedKey = '';
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (key.startsWith('+')) {
    transformedKey = '+' + key.replace(/\D/g, '');
  }

  if (key.match(/^\d/)) {
    transformedKey = key.replace(/\D/g, '');
  }

  if (key.match(emailRegex)) {
    transformedKey = key;
  }

  return transformedKey;
};
