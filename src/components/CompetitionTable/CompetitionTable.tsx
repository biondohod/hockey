import { FC, useEffect, useMemo, useState } from "react";
import {
  useGetCompetitionMatches,
  useGetCompetitionScores,
} from "../../lib/react-query/queries";
import { Link, useSearchParams } from "react-router-dom";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import Loader from "../Loader/Loader";
import EmptyContent from "../EmptyElement/EmptyElement";
import { renderPaginationButtons } from "../../lib/utils";

type CompetitionTableProps = {
  competitionId: number;
};

const CompetitionTable: FC<CompetitionTableProps> = ({ competitionId }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [offset, setOffset] = useState<string>(
    searchParams.get("offset") || "0"
  );
  const limit = "8";
  const [competitionMatches, setCompetitionMatches] = useState<
    ICompetitionMatches | undefined
  >(undefined);
  const [competitionScores, setCompetitionScores] = useState<
    ICompetitionScore[]
  >([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const {
    data: matches,
    refetch,
    isLoading: isLoadingMatches,
    isError: isErrorMatches,
    isFetching,
  } = useGetCompetitionMatches(competitionId, offset, limit);
  const {
    data: scores,
    isLoading: isLoadingScores,
    isError: isErrorScores,
  } = useGetCompetitionScores(competitionId);

  useEffect(() => {
    {
      validateParams(offset);
    }
  }, []);

  useEffect(() => {
    if (scores) {
      setCompetitionScores(scores);
    }
  }, [scores]);

  useEffect(() => {
    if (matches) {
      checkIfPageExists(offset, matches.total);
      setCompetitionMatches(matches);
    }
  }, [matches]);

  useEffect(() => {
    setSearchParams({
      offset,
    });
    refetch();
  }, [offset]);

  const checkIfPageExists = (offset: string, total: number) => {
    if (parseInt(offset) > total) {
      setOffset("0");
    }
  };

  const validateParams = (offset: string) => {
    if (!isNaN(parseInt(offset))) {
      if (parseInt(offset) < 0) {
        setOffset(Math.abs(parseInt(offset)).toString());
      } else {
        setOffset(offset);
      }
    } else setOffset("0");
  };

  const playerData = useMemo(() => {
    if (competitionMatches && competitionScores) {
      const temp = [...competitionScores];
      // temp.map((player) => {
      //   player.matchScores;
      // });
      temp.sort((a) => a.win_score - a.lose_score);
      temp.forEach((player) => {
        player.matchScores = [];
        player.team = [];
        for (const match of competitionMatches.matches) {
          if (!player.matchScores) player.matchScores = [];
          let isFinished: boolean = false;

          if (match.left_score === null && match.right_score === null) {
            player.matchScores.push({ win: "-", lose: "-" });
            player.team?.push("none");
            continue;
          }

          for (const teamPlayer of match.left_team) {
            if (teamPlayer.id === player.user.id) {
              player.team?.push("left");
              isFinished = true;
              player.matchScores!.push({
                win: teamPlayer.win_score,
                lose: teamPlayer.lose_score,
              });
              break;
            }
          }

          if (isFinished) continue;

          for (const teamPlayer of match.right_team) {
            if (teamPlayer.id === player.user.id) {
              isFinished = true;
              player.team?.push("right");
              player.matchScores!.push({
                win: teamPlayer.win_score,
                lose: teamPlayer.lose_score,
              });
              break;
            }
          }

          if (isFinished) continue;

          player.matchScores.push({ win: "-", lose: "-" });
          player.team?.push("none");
        }
      });
      return temp;
    }
    return [];
  }, [competitionScores, competitionMatches]);

  const gamesColumns: ColumnDef<ICompetitionScore>[] =
    competitionMatches?.matches?.map((match, index) => ({
      id: index.toString(),
      header: () => (
        <div className="competition-players__game-name">
          <span>Игра {index + 1 + parseInt(offset)}</span>
          <div className="competition-players__score--game">
            <span className="competition-players__score--match-left">
              {match.left_score !== null ? match.left_score : "-"}
            </span>
            :
            <span className="competition-players__score--match-right">
              {match.right_score !== null ? match.right_score : "-"}
            </span>
          </div>
        </div>
      ),
      cell: (info) => {
        let className = "";
        if (isFetching) {
          className = "competition-players__score--loading";
        } else if (info.row.original.team![index] === "left") {
          className = "competition-players__score--left-team";
        } else if (info.row.original.team![index] === "right") {
          className = "competition-players__score--right-team";
        }
        return (
          <div className={className}>
            {info.row.original.matchScores![index].win +
              " : " +
              info.row.original.matchScores![index].lose}
          </div>
        );
      },
      enableSorting: false,
    })) ?? [];

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
      header: "Разность",
      accessorFn: (row) => row.win_score - row.lose_score,
    },
    ...gamesColumns,
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

  if (isLoadingMatches || isLoadingScores) return <Loader />;
  if (isErrorMatches || isErrorScores)
    return <EmptyContent message="Ошибка загрузки данных" />;
  if (!competitionScores?.length || !competitionMatches?.matches.length) {
    return <EmptyContent message="Нет данных" />;
  }

  return (
    <section className="competition-players competition-players--table">
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
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
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
      <div className="schedule__pagination">
        {renderPaginationButtons(competitionMatches, setOffset, offset, limit)}
      </div>
    </section>
  );
};

export default CompetitionTable;
