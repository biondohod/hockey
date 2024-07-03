import { FC, useEffect, useMemo, useState, useTransition } from "react";
import {
  useGetCompeitionRegistrations,
  useGetCompetitionScores,
} from "../../lib/react-query/queries";
import EmptyContent from "../EmptyElement/EmptyElement";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import "./CompetitionPlayers.scss";
import { useUserContext } from "../../context/AuthContext";
import { useUpdateRegistration } from "../../lib/react-query/mutations";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { calculateAge } from "../../lib/utils";

type CompetitionPlayersProps = {
  competitionId: number;
};

const CompetitionPlayers: FC<CompetitionPlayersProps> = ({ competitionId }) => {
  // const { data, isLoading, isError } =
  //   useGetCompeitionRegistrations(competitionId);
  const [players, setPlayers] = useState<ICompetitionScore[]>([]);
  const { role } = useUserContext();
  const { mutateAsync, isPending } = useUpdateRegistration();
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetCompetitionScores(competitionId);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    if (data) {
      setPlayers(data);
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

  const columns: ColumnDef<ICompetitionScore>[] = [
    {
      id: "rowNumber",
      header: "№",
      cell: (info) => info.row.index + 1,
      enableSorting: true,
      accessorFn: (row, index) => index,
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
      enableSorting: true,
      accessorFn: (row) => row.user.first_name + " " + row.user.last_name,
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
      accessorKey: "win_score",
      enableSorting: true,
      // accessorFn: (row) => row.win_score,
    },
    {
      header: "Пропущенные",
      accessorKey: "lose_score",
      enableSorting: true,
      // accessorFn: (row) => row.lose_score,
    },
    {
      header: "Рейтинг",
      accessorFn: (row) => "-",
    },
    {
      header: "Разность",
      accessorFn: (row) => row.win_score - row.lose_score,
    },
    // {
    //   header: "Исключить",
    //   accessorFn: () => <button>Исключить</button>,
    // },
  ];

  // if (role && role.can_create) {
  //   columns.push({
  //     id: "exclude",
  //     header: () => <span>Исключить</span>,
  //     cell: ({ row }) => {
  //       const registration = row.original;
  //       return (
  //         <button
  //           className="competition-registrations__button competition-registrations__button--exclude"
  //           onClick={() =>
  //             onSubmit(Number(registration.user.id), competitionId, {
  //               is_dropped: !registration.is_dropped,
  //             })
  //           }
  //           // Assuming `isPending` is defined and reflects the loading state of the operation
  //           disabled={isPending}
  //         >
  //           {registration.is_dropped
  //             ? t("competitions.registration.return")
  //             : t("competitions.registration.drop")}
  //         </button>
  //       );
  //     },
  //   });
  // }

  const table = useReactTable({
    data: playerData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: sorting,
    },
    onSortingChange: setSorting,
  });

  // const renderPlayers = () => {
  //   if (isLoading) return <Loader />;
  //   if (isError) return <EmptyContent message="Error loading players" />;
  //   if (!players.length) return <EmptyContent message="No players found" />;
  //   return players.map((player: ICompetitionScore) => {
  //     const playerAge = calculateAge(player.user.player.birth_date);

  //     return (
  //       <li className="competition-players__item" key={player.user.id}>
  //         <Link
  //           to={`/profile/${player.user.id}`}
  //           className="competition-players__name"
  //         >
  //           {`${player.user.first_name} ${player.user.last_name}`}
  //         </Link>
  //         <span className="competition-players__age">{playerAge}</span>
  //       </li>
  //     );
  //   });
  // };

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
              {headerGroup.headers.map((header) => {
                const sortDirection = header.column.getIsSorted();
                const sortIndicator =
                  sortDirection === "asc"
                    ? "🔼"
                    : sortDirection === "desc"
                    ? "🔽"
                    : null;
                return (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {sortIndicator}
                  </th>
                );
              })}
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
