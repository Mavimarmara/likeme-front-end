export interface AuthResult {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  user: {
    email: string;
    name?: string;
    picture?: string;
  };
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface StoredUser {
  email: string;
  name?: string;
  picture?: string;
  nickname?: string;
}

