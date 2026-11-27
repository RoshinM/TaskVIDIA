export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthPayload = {
  user: AuthUser;
  accessToken: string;
};

export type AuthResponse = {
  user: AuthUser;
};
