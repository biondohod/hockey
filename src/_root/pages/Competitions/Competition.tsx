import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetCompetition } from "../../../lib/react-query/queries";

const Competition = () => {
  const { id } = useParams();
  // Parse the id outside the condition
  const parsedId = id ? parseInt(id) : undefined;

  // Call the hook at the top level
  const { data } = useGetCompetition(parsedId);

  useEffect(() => {
    console.log(data);
  }, [id, data]);

  return <div>Competition</div>;
};

export default Competition;
