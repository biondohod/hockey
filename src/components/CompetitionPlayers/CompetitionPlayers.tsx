import { FC, useEffect, useMemo, useState, useTransition } from "react";
import { useGetCompeitionRegistrations } from "../../lib/react-query/queries";
import EmptyContent from "../EmptyElement/EmptyElement";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import { calculateAge } from "../../lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import "./CompetitionPlayers.scss";
import { useUserContext } from "../../context/AuthContext";
import { useUpdateRegistration } from "../../lib/react-query/mutations";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type CompetitionPlayersProps = {
  competitionId: number;
};

const CompetitionPlayers: FC<CompetitionPlayersProps> = ({ competitionId }) => {
  const { data, isLoading, isError } =
    useGetCompeitionRegistrations(competitionId);
  const [players, setPlayers] = useState<ICompetitionRegistration[]>([]);
  const { role } = useUserContext();
  const { mutateAsync, isPending } = useUpdateRegistration();
  const { t } = useTranslation();

  useEffect(() => {
    if (data) {
      const filteredData: ICompetitionRegistration[] = data.filter(
        (item: ICompetitionRegistration) => item.is_approved
      );
      setPlayers(filteredData);
    }
  }, [data]);

  // useEffect(() => {
  //   if (role && role.can_create) {
  //     columns.push({
  //       id: "exclude",
  //       header: () => <span>Исключить</span>,
  //       cell: ({ row }) => {
  //         const registration = row.original;
  //         return (
  //           <button
  //             className="competition-registrations__button competition-registrations__button--exclude"
  //             onClick={() =>
  //               onSubmit(Number(registration.user.id), competitionId, {
  //                 is_dropped: !registration.is_dropped,
  //               })
  //             }
  //             // Assuming `isPending` is defined and reflects the loading state of the operation
  //             disabled={isPending}
  //           >
  //             {registration.is_dropped
  //               ? t("competitions.registration.return")
  //               : t("competitions.registration.drop")}
  //           </button>
  //         );
  //       },
  //     });
  //   }
  // }, [role]);

  const onSubmit = (
    playerId: number,
    competitionId: number,
    data: IUpdateRegistration
  ) => {
    toast.promise(mutateAsync({ playerId, competitionId, data }), {
      pending: t("competitions.registration.pending"),
    });
  };

  const playerData = useMemo(() => players, [players]);

  const columns: ColumnDef<ICompetitionRegistration>[] = [
    {
      id: "rowNumber",
      header: "№",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Имя",
      cell: (info) => (
        <Link
          to={`/profile/${info.row.original.user.id}`}
          className="competition-players__name"
          target="_blank"
        >
          {info.row.original.user.first_name +
            " " +
            info.row.original.user.last_name}
        </Link>
      ),
    },
    {
      header: "Возраст",
      accessorFn: (row) => calculateAge(row.user.player.birth_date),
    },
    {
      header: "Амплуа",
      accessorFn: (row) => row.user.player.position || "Неизвестно",
    },
    {
      header: "Шайбы",
      accessorFn: (row) => Math.ceil(Math.random() * 10),
    },
    {
      header: "Пропущенные",
      accessorFn: (row) => Math.ceil(Math.random() * 20),
    },
    {
      header: "Рейтинг",
      accessorFn: (row) => Math.ceil(Math.random() * 1000),
    },
    {
      header: "Разность",
      accessorFn: (row) =>
        Math.ceil(Math.random() * (Math.random() - Math.random()) * 100),
    },
    // {
    //   header: "Исключить",
    //   accessorFn: () => <button>Исключить</button>,
    // },
  ];

  if (role && role.can_create) {
    columns.push({
      id: "exclude",
      header: () => <span>Исключить</span>,
      cell: ({ row }) => {
        const registration = row.original;
        return (
          <button
            className="competition-registrations__button competition-registrations__button--exclude"
            onClick={() =>
              onSubmit(Number(registration.user.id), competitionId, {
                is_dropped: !registration.is_dropped,
              })
            }
            // Assuming `isPending` is defined and reflects the loading state of the operation
            disabled={isPending}
          >
            {registration.is_dropped
              ? t("competitions.registration.return")
              : t("competitions.registration.drop")}
          </button>
        );
      },
    });
  }

  const table = useReactTable({
    data: playerData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderPlayers = () => {
    if (isLoading) return <Loader />;
    if (isError) return <EmptyContent message="Error loading players" />;
    if (!players.length) return <EmptyContent message="No players found" />;
    return players.map((player: ICompetitionRegistration) => {
      const playerAge = calculateAge(player.user.player.birth_date);

      return (
        <li className="competition-players__item" key={player.user.id}>
          <Link
            to={`/profile/${player.user.id}`}
            className="competition-players__name"
          >
            {`${player.user.first_name} ${player.user.last_name}`}
          </Link>
          <span className="competition-players__age">{playerAge}</span>
        </li>
      );
    });
  };

  if (isLoading) return <Loader />;
  if (isError) return <EmptyContent message="Error loading players" />;
  if (!players.length) return <EmptyContent message="No players found" />;

  return (
    <section className="competition-players">
      {/* <ul className="competition-players__list">{renderPlayers()}</ul> */}
      <table className="competition-players__table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default CompetitionPlayers;
