import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import EmptyContent from "../../../components/EmptyElement/EmptyElement";
import { useGetRoles, useGetUsersAsAdmin } from "../../../lib/react-query/queries";

const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [roleId, setRoleId] = useState<string>(searchParams.get("roleId") || "3");
  const [limit, setLimit] = useState<string>(searchParams.get("limit") || "10");
  const [offset, setOffset] = useState<string>(
    searchParams.get("offset") || "0"
  );
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();
  const { t } = useTranslation();
  const {data: usersList, isLoading: isLoadingUsers} = useGetUsersAsAdmin(parseInt(roleId), limit, offset);

  useEffect(() => {
    {
      validateParams(limit, offset);
    }
  }, []);

  // useEffect(() => {
  //   if (data) {
  //     checkIfPageExists(offset, data.total);
  //     setCompetitionMatches(data);
  //   }
  // }, [data]);

  useEffect(() => {
    setSearchParams({
      limit,
      offset,
      roleId
    });
    // refetch();
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
      roles: roles.map((role: Irole) => role.id.toString())
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
      console.log("not includes")
      const defaultRole = roles.find((role: Irole) => role.name === "Неподтвержденный")?.id.toString() || "3"
      console.log(defaultRole);
      setRoleId(defaultRole);
      console.log("setted default role", roleId);
    } else {
      console.log("includes")
      setRoleId(roleId)
      console.log("setted roleId itself", roleId);
    };

    console.log(roleId);
  };

  const checkIfPageExists = (offset: string, total: number) => {
    if (parseInt(offset) > total) {
      setOffset("0");
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(e.target.value);
    setOffset("0");
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleId(e.target.value);
    setOffset("0");
  }

  const renderPagination = () => {
    // const pages = Math.ceil(competitionMatches!.total / parseInt(limit));
    const pages = 5;
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

  if (!roles?.length) return <EmptyContent message={t("admin.users.empty")} />;

  const renderUsersList = () => {
    if (isLoadingUsers) return <Loader />;
    if (!usersList || !usersList.users?.length) return <EmptyContent message={t("admin.users.empty")} />;
    return (
      <ul>
        {usersList.users.map((user: IUser) => (
          <li key={user.id}>
            {user.first_name} {user.last_name}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="adminUsers">
      <div className="admin__filters">
        <div className="admin__filter">
          <span className="schedule__filter-name">
            {t("admin.users.filterLimit")}
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
        <div className="admin__filter">
          <span className="schedule__filter-name">
            {t("admin.users.filterRole")}
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
