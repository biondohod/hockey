interface INewUser {
  first_name: string;
  last_name: string;
  middle_name: string;
  is_male: boolean;
  phone: string;
  email: string;
  birth_date: string;
  telegram: string;
  password: string;
}

interface IEditUser {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  is_male?: boolean;
  phone?: string;
  email?: string;
  birth_date?: string;
  telegram?: string;
  password?: string;
  role_id?:  number;
  position?: string;
}

interface INewUserAdmin {
  role_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  is_male?: boolean;
  phone?: string;
  birth_date?: string;
  telegram?: string;
  password: string;
}

interface IUser {
  email: string;
  first_name: string;
  id: number | string;
  last_name: string;
  middle_name: string;
  player: {
    birth_date: string;
    is_male: boolean;
    phone: string;
    position: string;
    preparation: string;
    telegram: string;
  };
  role_id: number;
}

interface IAllUsersByRole {
  count: number;
  total: number;
  users: IUser[];
}

interface IMatchUser {
  id: number;
  name: string;
}

interface IContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  isAuthenticated: boolean | null;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
  checkAuthUser: () => void;
  isLoading: boolean;
  isAdmin: boolean | null;
  role: Irole | null;
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

interface ICompetitionRegistration {
  is_approved: boolean;
  is_dropped: boolean;
  user: IUser;
  // user: {
  // first_name: string;
  //   last_name: string;
  //   middle_name: string;
  //   email: string;
  //   id: number
  //   role_id: number;
  // };
}

interface IUpdateRegistration {
  is_approved?: boolean;
  is_dropped?: boolean;
}

interface Irole {
  can_create: boolean;
  can_participate: boolean;
  can_view: boolean;
  id: number;
  is_admin: boolean;
  is_free: boolean;
  name: string;
}


interface ErrorResponse {
  message?: string;
}

interface ICompetitionMatches {
  count: number;
  total: number;
  matches: ICompetitionMatch[];
}

interface ICompetitionMatch {
  id: number;
  left_score: number;
  left_team: IMatchUser[];
  right_score: number;
  right_team: IMatchUser[];
  start_time: string;
}

interface IDocument {
  id: number;
  name: string;
  created_at: string;
  expires_at: string;
}

interface IDocumentUrl {
  url: string;
}

interface IUserRegistrations {
  count: number;
  total: number;
  registrations: {
    competition: ISingleCompetition;
    is_approved: boolean;
    is_dropped: boolean;
  }[];
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
  position: string;
};

type EditProfileForm = {
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: string;
  phone: string;
  email: string;
  birth_date: string;
  telegram?: string;
  changePassword: boolean;
  password?: string;
  confirmPassword?: string;
  role_id?: string;
  position: string;
}

type CreateUserForm = {
  role_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  position: string;
  gender?: string;
  phone?: string;
  birth_date?: string;
  telegram?: string;
  password: string;
  confirmPassword: string;
}

type SignInForm = {
  email: string;
  password: string;
};

type AuthFormResponse = {
  token: string;
  id: string;
};

type DocumentForm = {
  document: File;
  name: string;
}


