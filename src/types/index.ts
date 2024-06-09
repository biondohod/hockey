interface INewUser {
  first_name: string;
  last_name: string;
  middle_name: string;
  is_male: boolean;
  phone: string;
  email: string;
  birth_date: string;
  telegram?: string;
  password: string;
}

interface IUser {
  email: string;
  first_name: string;
  id: number | string;
  last_name: string;
  middle_name: string;
  isVerificated: boolean;
  player: {
    birth_date: string;
    is_male: boolean;
    phone: string;
    position: string;
    preparation: string;
    telegram: string;
  };
  role_id: number | string;
}

interface IContextType {
  user: IUser | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

interface ICompetitionForm {
  age: number;
  description: string;
  name: string;
  size: number;
  tours: number;
  closes_at: string;
  matches: number;
  days: {
    date: string;
    start_time: string;
    end_time: string;
  }[];
}

interface IFormattedCompetition {
  age: number;
  description: string;
  name: string;
  size: number;
  tours: number;
  closes_at: string;
  days: {
    date: string;
    start_time: string;
    end_time: string;
  }[];
}

interface IEditCompetition {
  description: string;
  name: string;
  closes_at: string;
}

interface ICompetition {
  id: number;
  age: number;
  closes_at: string;
  // date: string;
  // end_time: string;
  // start_time: string;
  description?: string;
  name: string;
  size: number;
  tours: number;
  trainer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    role_id: number;
  };
}

interface ISingleCompetition {
  id: number;
  age: number;
  closes_at: string;
  days: {
    date: string;
    end_time: string;
    start_time: string;
  }[];
  description: string;
  name: string;
  size: number;
  tours: number;
  trainer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    role_id: number;
  };
}

interface ErrorResponse {
  message?: string;
}

type SignUpForm = {
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: string;
  phone: string;
  email: string;
  birth_date: string;
  telegram?: string;
  password: string;
  confirmPassword: string;
};

type SignInForm = {
  email: string;
  password: string;
};

type AuthFormResponse = {
  token: string;
  id: string;
};
