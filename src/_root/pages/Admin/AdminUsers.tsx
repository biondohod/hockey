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
import { renderPaginationButtons } from "../../../lib/utils";

/**
 * 
 * @returns {JSX.Element} Функциональный компонент, который возвращает разметку страницы администрирования пользователей
 */
const AdminUsers = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const [roleId, setRoleId] = useState<string>(
    searchParams.get("roleId") || "3"
  );
  const [limit, setLimit] = useState<string>(searchParams.get("limit") || "10");
  const [offset, setOffset] = useState<string>(
    searchParams.get("offset") || "0"
  );
  
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();
  const { data: usersList, isLoading: isLoadingUsers, refetch, isFetching: isFetchingUsers, isError } = useGetUsersAsAdmin(
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

  const validateParams = (limit: string, offset: string) => {
    const validateOptions = {
      limit: ["10", "20", "50", "100"],
      roles: roles.map((role: Irole) => role.id.toString()),
    };

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
    return renderPaginationButtons(usersList, setOffset, offset, limit);
  };

  if (isLoadingRoles) return <Loader />;

  if (isError)
    return <EmptyContent message={t("global.loadError")} />;

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
        <div className="schedule__pagination">{renderPagination()}</div>
      </div>
    </section>
  );
};

export default AdminUsers;
