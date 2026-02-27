let accessTokenInMemory: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessTokenInMemory = token;
};

export const getAccessToken = (): string | null => {
  return accessTokenInMemory;
};

export const clearAccessToken = () => {
  accessTokenInMemory = null;
};