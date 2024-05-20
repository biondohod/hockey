interface INewUser {
  first_name: string,
  last_name: string,
  middle_name: string,
  is_male: boolean,
  phone: string,
  email: string,
  birth_date: string,
  telegram?: string
  password: string,
}

interface IUser {
  email: string,
  first_name: string,
  id: number | string,
  last_name: string,
  middle_name: string,
  isVerificated: boolean,
  player: {
    birth_date: string,
    is_male: boolean,
    phone: string,
    position: string,
    preparation: string,
    telegram: string
  },
  role_id: number | string
}

interface IContextType {
  user: IUser | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

type SignUpForm = {
  first_name: string,
  last_name: string,
  middle_name: string,
  gender: string,
  phone: string,
  email: string,
  birth_date: string,
  telegram?: string,
  password: string,
  confirmPassword: string,
}

type SignInForm = {
  email: string,
  password: string,
}

type AuthFormResponse = {
  token: string,
  id: string,
}
