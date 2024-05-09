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
