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
      header: t("competitions.table.name"),
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
      header: t("competitions.table.age"),
      accessorFn: (row) => calculateAge(row.user.player.birth_date),
    },
    {
      header: t("competitions.table.position"),
      accessorFn: (row) =>
        row.user.player.position || t("competitions.table.unknownPosition"),
    },
    {
      header: t("competitions.table.pucks"),
      accessorKey: "win_score",
      enableSorting: true,
    },
    {
      header: t("competitions.table.missed"),
      accessorKey: "lose_score",
      enableSorting: true,
    },
    {
      header: t("competitions.table.rating"),
      accessorFn: (row) => "-",
    },
    {
      header: t("competitions.table.difference"),
      accessorFn: (row) => row.win_score - row.lose_score,
    },
    {
      id: "exclude",
      header: t("competitions.table.exclude"),
      cell: ({ row }) => {
        const registration = row.original;
        console.log(registration);
        return (
          <input
            type="checkbox"
            checked={registration.is_dropped}
            onChange={() =>
              onSubmit(Number(registration.user.id), competitionId, {
                is_dropped: !registration.is_dropped,
              })
            }
            disabled={isPending}
          />
        );
      },
    },
  ];

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

  if (isLoading) return <Loader />;
  if (isError) return <EmptyContent message={t("competitions.table.error")} />;
  if (!players.length)
    return <EmptyContent message={t("competitions.table.empty")} />;

  return (
    <section className="competition-players">
      <table className="competition-players__table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortDirection = header.column.getIsSorted();
                const sortClass =
                  sortDirection === "asc"
                    ? "asc"
                    : sortDirection === "desc"
                    ? "desc"
                    : "";
                return (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={sortClass}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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