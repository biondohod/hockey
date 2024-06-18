import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateProfileAsAdmin } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

type AdminUserItemProps = {
  user: IUser;
};

const AdminUserItem: FC<AdminUserItemProps> = ({user}) => {
  const {mutateAsync, isPending} = useUpdateProfileAsAdmin();
  const {t} = useTranslation();
  
  const handleSelectRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (user.id.toString() !== e.target.value) {
      const role_id = parseInt(e.target.value);
      toast.promise(mutateAsync({id: user.id, user: {role_id}, isNavigateAfterSuccess: false}), {
        pending: t("global.pending"),
      });
    }
  }

  return (
    <li className="admin-users__item">
      <Link to={`/profile/${user.id}`} target="_blank" className="admin-users__name">
        {user.first_name} {user.last_name}
      </Link>

      <label htmlFor="last_name" className="auth__label">
        {t("profile.editProfile.role")}*
        <select
          id="last_name"
          className="auth__input"
          required={true}
          autoComplete="off"
          name="role_id"
          defaultValue={user.role_id}
          disabled={isPending}
          onChange={handleSelectRoleChange}
        >
          <option value={1}>Администратор</option>
          <option value={2}>Судья</option>
          <option value={3}>Неподтвержденный</option>
          <option value={4}>Игрок</option>
          <option value={5}>Спартаковец</option>
        </select>
      </label>
    </li>
  );
};

export default AdminUserItem;
