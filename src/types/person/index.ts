export interface PersonData {
  firstName: string;
  lastName: string;
  surname?: string;
  nationalRegistration?: string;
  birthdate?: string;
  gender?: string;
  age?: string;
  weight?: string;
  height?: string;
  insurance?: string;
}

export interface PersonResponse {
  id: string;
  firstName: string;
  lastName: string;
  surname?: string;
  nationalRegistration?: string;
  birthdate?: string;
  gender?: string;
  age?: string;
  weight?: string;
  height?: string;
  insurance?: string;
  createdAt: string;
  updatedAt: string;
}
