import { useSearchParams } from "react-router-dom";
import { useUserContext } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useGetPlayerMatches } from "../../lib/react-query/queries";

const ProfileMatches = () => {
  const {user} = useUserContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState<string>(searchParams.get("limit") || "10");
  const [offset, setOffset] = useState<string>(
    searchParams.get("offset") || "0"
  );
  const userId = typeof user?.id === "string" ? parseInt(user?.id) : user?.id;
  const {data, refetch, isLoading} = useGetPlayerMatches(userId, offset, limit);
  const [playerMatches, setPlayerMatches] = useState<any | null>();

  useEffect(() => {
    {
      validateParams(limit, offset);
    }
  }, []);

  useEffect(() => {
    if (data) {
      checkIfPageExists(offset, data.total);
      // setCompetitionMatches(data);
    }
  }, [data]);

  useEffect(() => {
    setSearchParams({
      limit,
      offset,
    });
    refetch();
  }, [limit, offset]);

  // useEffect(() => {
  //   if (data) {
  //     checkIfPageExists(offset, data.total);
  //     setCompetitionMatches(data);
  //   }
  // }, [data]);

  const validateParams = (limit: string, offset: string) => {
    const validateOptions = ["10", "20", "50", "100"];

    if (!isNaN(parseInt(offset))) {
      if (parseInt(offset) < 0) {
        setOffset(Math.abs(parseInt(offset)).toString());
      } else {
        setOffset(offset);
      }
    } else setOffset("0");

    if (!validateOptions.includes(limit)) {
      setLimit(validateOptions[0]);
    } else setLimit(limit);
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
  return (
    <div>ProfileMatches</div>
  )
}

export default ProfileMatches