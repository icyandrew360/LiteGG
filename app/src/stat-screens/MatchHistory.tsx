import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useUser } from '../UserContext.tsx';

const MatchHistoryContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '60vw',
  padding: theme.spacing(2),
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const UserSectionGroup = styled(MuiCard)(({ theme }) => ({
    height:"60px",
    width:"100%",
    display: 'flex',
    // backgroundColor: 'green',
    backgroundColor: '#141414',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingTop: theme.spacing(2),
    // paddingBottom

  }));
const UserSectionItem = styled(Stack)(({ theme }) => ({
  height:"100%",
  width: "20%",
  display: 'flex',
  // backgroundColor: 'blue',
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

type Participant = {
  riotIdName: string;
  riotIdTagline: string;
  champion: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  cs_score: number;
}

type Match = {
  game_metadata: {
    gameMode: string;
    queueId: number;
    queueType: string;
    gameDuration: string;
    gameCreation: string;
    gameId: string;
  };
  participants: Participant[];
  user_win: boolean;
}

export default function MatchHistory() {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/match-history?riotID=${encodeURIComponent(currentUser)}`);
        setMatchHistory(response.data.userMatchHistory);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchMatchHistory();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <MatchHistoryContainer>
        <CircularProgress className="customCircularProgress" />
      </MatchHistoryContainer>
    );
  }

  if (error) {
    return (
      <MatchHistoryContainer>
        <Typography variant="h6">Error loading match history</Typography>
      </MatchHistoryContainer>
    );
  }

  return (
    <MatchHistoryContainer>
      <Card>
        <Typography variant="h4">Match History</Typography>
        {matchHistory.map((match: Match, index: number) => (
          <UserSectionGroup key={index}>
            <UserSectionItem>
              <Typography variant="body1">{match.game_metadata.gameMode}</Typography>
            </UserSectionItem>
            <UserSectionItem>
              <Typography variant="body1">{match.game_metadata.queueType}</Typography>
            </UserSectionItem>
            <UserSectionItem>
              <Typography variant="body1">Duration: {match.game_metadata.gameDuration}</Typography>
            </UserSectionItem>
            <UserSectionItem>
              <Typography variant="body1">{match.game_metadata.gameCreation}</Typography>
            </UserSectionItem>
            <UserSectionItem>
                <Typography variant="body1">{match.user_win ? "Win" : "Loss"}</Typography>
            </UserSectionItem>
          </UserSectionGroup>
        ))}
      </Card>
    </MatchHistoryContainer>
  );
}
