import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./react-query/queryKeys";
import i18next from "i18next";
import { transliterate } from "transliteration";
import { toast } from "react-toastify";

export const LogOutUser = (showToast: boolean = true) => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useUserContext();
  const queryClient = useQueryClient();

  return () => {
    if (showToast) {
      toast.success(i18next.t("auth.signOut.success"), { autoClose: 1500 });
    }
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/auth/sign-in");
    queryClient.removeQueries({
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
    if (startDate === endDate)
      return end.toLocaleDateString("en-US", endOptions);
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

export const formatDateAndTime = (
  dateTimeStr: string,
  isNeedSeconds: boolean
) => {
  const dateObj = new Date(dateTimeStr);

  const date = `${dateObj.getDate().toString().padStart(2, "0")}/${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dateObj.getFullYear()}`;
  let time = `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

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
  if (!rolesList || !rolesList.length) return { name: "Неизвестно" };
  const role = rolesList.find((role) => role.id === userRoleId);
  return role || { name: "Неизвестно" };
};

export const renderPaginationButtons = (
  dataList: any,
  setOffset: React.Dispatch<React.SetStateAction<string>>,
  offset: string,
  limit: string
) => {
  const pages = Math.ceil(dataList.total / parseInt(limit));
  const currentPage = Math.ceil(parseInt(offset) / parseInt(limit) + 1);
  const pagination = [];
  for (let i = 1; i <= pages; i++) {
    pagination.push(
      <button
        key={i}
        onClick={() => {
          setOffset(((i - 1) * parseInt(limit)).toString());
        }}
        disabled={currentPage === i}
        className={`schedule__pagination-button ${
          currentPage === i ? "schedule__pagination-button--active" : ""
        }`}
      >
        {i}
      </button>
    );
  }
  return pagination;
};

// export const renderPaginationButtons = (
//   dataList: any,
//   setOffset: React.Dispatch<React.SetStateAction<string>>,
//   offset: string,
//   limit: string
// ) => {
//   const totalItems = dataList.total;
//   const itemsPerPage = parseInt(limit);
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const currentPage = Math.ceil(parseInt(offset) / itemsPerPage + 1);
//   const maxButtons = 10;
//   let startPage, endPage;

//   if (totalPages <= maxButtons) {
//     // Less than maxButtons total pages so show all
//     startPage = 1;
//     endPage = totalPages;
//   } else {
//     // More than maxButtons total pages so calculate start and end pages
//     if (currentPage <= 6) {
//       startPage = 1;
//       endPage = maxButtons - 1; // Adjust to always show maxButtons
//     } else if (currentPage + 4 >= totalPages) {
//       startPage = totalPages - (maxButtons - 2);
//       endPage = totalPages;
//     } else {
//       startPage = currentPage - 4;
//       endPage = currentPage + 4;
//       // Adjust if we have space to add more buttons
//       if (startPage === 2) {
//         // If startPage is 2, we can just show 2 instead of an ellipsis
//         startPage = 1;
//       }
//       if (endPage === totalPages - 1) {
//         // Similarly, if endPage is second last, show last page instead of ellipsis
//         endPage = totalPages;
//       }
//     }
//   }

//   if (currentPage === 1 && totalPages >= maxButtons) {
//     endPage = maxButtons - 1; // Since first page is always shown, adjust endPage to maintain button count
//   }
//   if (currentPage === totalPages && totalPages >= maxButtons) {
//     startPage = totalPages - (maxButtons - 2); // Adjust startPage to maintain button count
//   }

//   const pagination = [];

//   // Always add the first page
//   pagination.push(
//     <button
//       key={1}
//       onClick={() => setOffset('0')}
//       disabled={currentPage === 1}
//       className={`schedule__pagination-button ${currentPage === 1 ? "schedule__pagination-button--active" : ""}`}
//     >
//       1
//     </button>
//   );

//   // Ellipsis after the first page if needed
//   if (startPage > 2) {
//     pagination.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>);
//   }

//   // Middle pages
//   for (let i = startPage; i <= endPage; i++) {
//     if (i !== 1 && i !== totalPages) {
//       pagination.push(
//         <button
//           key={i}
//           onClick={() => setOffset(((i - 1) * itemsPerPage).toString())}
//           disabled={currentPage === i}
//           className={`schedule__pagination-button ${currentPage === i ? "schedule__pagination-button--active" : ""}`}
//         >
//           {i}
//         </button>
//       );
//     }
//   }

//   // Ellipsis before the last page if needed
//   if (endPage < totalPages - 1) {
//     pagination.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>);
//   }

//   // Always add the last page if it's not the first page
//   if (totalPages !== 1) {
//     pagination.push(
//       <button
//         key={totalPages}
//         onClick={() => setOffset(((totalPages - 1) * itemsPerPage).toString())}
//         disabled={currentPage === totalPages}
//         className={`schedule__pagination-button ${currentPage === totalPages ? "schedule__pagination-button--active" : ""}`}
//       >
//         {totalPages}
//       </button>
//     );
//   }

//   return pagination;
// };