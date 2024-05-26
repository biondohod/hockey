import React, { useEffect } from "react";
import { useGetCompetitions } from "../../../lib/react-query/queries";
import { useParams } from "react-router-dom";

const AllCompetitions = () => {
  const { type } = useParams();
  const { data } = useGetCompetitions();

  useEffect(() => {
    console.log(data);
  }, [type, data]);
  
  return <div>AllCompetitions</div>;
};

export default AllCompetitions;
