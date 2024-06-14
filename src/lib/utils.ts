import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./react-query/queryKeys";
import i18next from "i18next";
import { transliterate } from "transliteration";
import { toast } from "react-toastify";

export const LogOutUser = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useUserContext();
  const queryClient = useQueryClient();

  return () => {
    toast.success(i18next.t("auth.signOut.success"), { autoClose: 1500 });
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/auth/sign-in");
    queryClient.removeQueries({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    });
    // checkAuthUser();
  };
};

export function formatDate(dateString: string): string {
  const options: { year: "numeric"; month: "long"; day: "numeric" } = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(dateString);
  if (i18next.language.split("-")[0] === "en") {
    return date.toLocaleDateString("en-US", options);
  }

  return date.toLocaleDateString("ru-RU", options);
}

export function calculateAge(birthDateString: string): string {
  const birthDate = new Date(birthDateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (i18next.language.split("-")[0] === "en") {
    return `${age} y.o.`;
  }
  let ageString: string;
  if (age % 10 === 1 && age % 100 !== 11) {
    ageString = `${age} год`;
  } else if (
    age % 10 >= 2 &&
    age % 10 <= 4 &&
    (age % 100 < 10 || age % 100 >= 20)
  ) {
    ageString = `${age} года`;
  } else {
    ageString = `${age} лет`;
  }

  return ageString;
}

export function calculateDays(dateString: string): string {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

  const diffDays = Math.round(
    Math.abs((inputDate.getTime() - currentDate.getTime()) / oneDay)
  );

  if (i18next.language.split("-")[0] === "en") {
    if (currentDate < inputDate) {
      return `Registration closes in ${diffDays} ${pluralizeEnglish(
        diffDays,
        "day",
        "days"
      )}`;
    }
    return `Registration has been closed ${diffDays} ${pluralizeEnglish(
      diffDays,
      "day",
      "days"
    )} ago`;
  }

  if (currentDate < inputDate) {
    return `Регистрация закроется через ${diffDays} ${pluralize(
      diffDays,
      "день",
      "дня",
      "дней"
    )}`;
  }
  return `Регистрация закрылась ${diffDays} ${pluralize(
    diffDays,
    "день",
    "дня",
    "дней"
  )} назад`;
}

function pluralize(
  n: number,
  form1: string,
  form2: string,
  form3: string
): string {
  if (n % 10 === 1 && n % 100 !== 11) {
    return form1;
  } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
    return form2;
  } else {
    return form3;
  }
}

function pluralizeEnglish(n: number, singular: string, plural: string): string {
  if (n === 1) {
    return singular;
  } else {
    return plural;
  }
}

export const transliterateText = (text: string = "") => {
  return i18next.language.split("-")[0] === "en" ? transliterate(text) : text;
};

export const getDataRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startOptions: { month: "long"; day: "numeric" } = {
    month: "long",
    day: "numeric",
  };
  const endOptions: { year: "numeric"; month: "long"; day: "numeric" } = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (i18next.language.split("-")[0] === "en") {
    if (startDate === endDate) return end.toLocaleDateString("en-US", endOptions);
    return `${start.toLocaleDateString(
      "en-US",
      startOptions
    )} - ${end.toLocaleDateString("en-US", endOptions)}`;
  }

  if (startDate === endDate) return end.toLocaleDateString("ru-RU", endOptions);

  return `${start.toLocaleDateString(
    "ru-RU",
    startOptions
  )} - ${end.toLocaleDateString("ru-RU", endOptions)}`;
};

export const formatDateAndTime = (dateTimeStr: string, isNeedSeconds: boolean) => {
  const dateObj = new Date(dateTimeStr);

  const date = `${dateObj.getDate().toString().padStart(2, "0")}/${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dateObj.getFullYear()}`;
  let time = `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj
    .getMinutes()
    .toString().padStart(2, "0")}`;

   if (isNeedSeconds) {
    time += `:${dateObj.getSeconds().toString().padStart(2, "0")}`;
   }

  return { date, time };
};

// export function formatPhoneNumber(phoneNumberString: string) {
//   const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
//   const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
//   if (match) {
//     return '+' + match[1] + ' (' + match[2] + ') ' + match[3] + '-' + match[4] + '-' + match[5];
//   }
//   return "";
// }

export const getUserRole = (userRoleId: number, rolesList: Irole[]) => {
  if (!rolesList || !rolesList.length) return {name: "Неизвестно"};
  const role = rolesList.find((role) => role.id === userRoleId);
  return role || {name: "Неизвестно"};
}
