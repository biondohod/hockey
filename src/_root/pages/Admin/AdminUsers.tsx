import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import EmptyContent from "../../../components/EmptyElement/EmptyElement";
import {
  useGetRoles,
  useGetUsersAsAdmin,
} from "../../../lib/react-query/queries";
import AdminUserItem from "../../../components/AdminUser/AdminUserItem";
import './AdminUsers.scss'

const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [roleId, setRoleId] = useState<string>(
    searchParams.get("roleId") || "3"
  );
  const [limit, setLimit] = useState<string>(searchParams.get("limit") || "10");
  const [offset, setOffset] = useState<string>(
    searchParams.get("offset") || "0"
  );
  // const [usersList, setUsersList] = useState<IUsersList | undefined>(undefined);
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();
  const { t } = useTranslation();
  const { data: usersList, isLoading: isLoadingUsers, refetch, isFetching: isFetchingUsers } = useGetUsersAsAdmin(
    parseInt(roleId),
    limit,
    offset
  );

  

  useEffect(() => {
    {
      validateParams(limit, offset);
    }
  }, []);

  useEffect(() => {
    if (usersList) {
      checkIfPageExists(offset, usersList.total);
      // setCompetitionMatches(data);
    }
  }, [usersList]);

  useEffect(() => {
    setSearchParams({
      limit,
      offset,
      roleId,
    });
    refetch();
  }, [limit, offset, roleId]);

  // useEffect(() => {
  //   if (data) {
  //     checkIfPageExists(offset, data.total);
  //     setCompetitionMatches(data);
  //   }
  // }, [data]);

  const validateParams = (limit: string, offset: string) => {
    const validateOptions = {
      limit: ["10", "20", "50", "100"],
      roles: roles.map((role: Irole) => role.id.toString()),
    };
    // const validateOptions = ["10", "20", "50", "100"];

    if (!isNaN(parseInt(offset))) {
      if (parseInt(offset) < 0) {
        setOffset(Math.abs(parseInt(offset)).toString());
      } else {
        setOffset(offset);
      }
    } else setOffset("0");

    if (!validateOptions.limit.includes(limit)) {
      setLimit(validateOptions.limit[0]);
    } else setLimit(limit);

    if (!validateOptions.roles.includes(roleId)) {
      const defaultRole =
        roles
          .find((role: Irole) => role.name === "Неподтвержденный")
          ?.id.toString() || "3";
      setRoleId(defaultRole);
    } else {
      setRoleId(roleId);
    }

  };

  const checkIfPageExists = (offset: string, total: number) => {
    if (parseInt(offset) > total) {
      setOffset("0");
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(e.target.value);
    setOffset("0");
    refetch();
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleId(e.target.value);
    setOffset("0");
  };

  const renderPagination = () => {
    if (!usersList || !usersList.users?.length) return <></>;
    const pages = Math.ceil(usersList!.total / parseInt(limit));
    console.log(usersList!.total, parseInt(limit));
    // const pages = Math.ceil(10 / 10);
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

  // isFetching or isLoading
  if (isLoadingRoles) return <Loader />;

  // if (isError)
  //   return <EmptyContent message={t("global.loadError")} />;

  // if (!competitionMatches?.matches.length)
  //   return (
  //     <EmptyContent message={t("competitions.schedule.emptyContent")} />
  //   );

  if (!roles?.length) return <EmptyContent message={t("global.admin.users.empty")} />;

  const renderUsersList = () => {
    if (isLoadingUsers || isFetchingUsers) return <Loader />;
    if (!usersList || !usersList.users?.length)
      return <EmptyContent message={t("global.admin.users.empty")} />;
    return (
      <ul className="admin-users__list">
        {usersList.users.map((user: IUser) => (
          <AdminUserItem key={user.id} user={user} />
        ))}
      </ul>
    );
  };

  return (
    <section className="admin-users">
      <div className="admin-users__filters">
        <div className="admin-users__filter">
          <span className="schedule__filter-name">
            {t("global.admin.users.filterLimit")}
          </span>
          <select
            name="limit"
            id="limit"
            className="schedule__selector"
            onChange={handleLimitChange}
            defaultValue={limit}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="admin-users__filter">
          <span className="schedule__filter-name">
            {t("global.admin.users.filterRole")}
          </span>
          <select
            name="role_id"
            id="role_id"
            className="schedule__selector"
            onChange={handleRoleChange}
            value={roleId}
          >
            {roles.map((role: Irole) => (
              <option key={role.id} value={role.id.toString()}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="schedule__matches">
        {renderUsersList()}
        {/* <ul className="matches__list">
            {competitionMatches.matches.map((match) => (
              <CompetitionMatch key={match.id} match={match} />
            ))}
          </ul> */}
        {/* <div className="schedule__wrapper">
          {isFetching && <Loader message="Обновляем список матчей" />}
        </div> */}
        <div className="schedule__pagination">{renderPagination()}</div>
      </div>
    </section>
  );
};

export default AdminUsers;
