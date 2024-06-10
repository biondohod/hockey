import { FC, useEffect } from 'react';
import './CompetitionSchedule.scss';
import { useGetCompetitionMatches } from '../../lib/react-query/queries';
import { useSearchParams } from 'react-router-dom';

type CompetitionScheduleProps = {
  competitionId: number;
}

const CompetitionSchedule: FC<CompetitionScheduleProps> = ({competitionId}) => {
  const [searchParams] = useSearchParams();
  const limit = searchParams.get("limit") || undefined;
  const offset = searchParams.get("offset") || undefined;
  const {data} = useGetCompetitionMatches(competitionId, offset, limit);
  
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>CompetitionSchedule</div>
  )
}

export default CompetitionSchedule