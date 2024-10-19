// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import FormLabel from '@mui/material/FormLabel';
// import FormControl from '@mui/material/FormControl';
// import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import axios from 'axios';
import { styled } from '@mui/material/styles';
// import { LiteGGIcon } from './CustomIcons';
import './user_section.css';
import { useUser } from '../UserContext.tsx';

const UserSectionContainer = styled(Stack)(({ theme }) => ({
  height:"100vh",
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'flex-start',
  width: '500px',
  alignItems: 'center',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  marginTop: '10vh',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    maxWidth: '100%',
  },
  boxShadow:
    'hsla(0, 50%, 15%, 0.2) 0px 5px 15px 0px, hsla(0, 50%, 15%, 0.2) 0px 15px 35px -5px',
}));

export default function UserSection() {
  const { currentUser, userInfo, setUserInfo} = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user-info?riotID=${encodeURIComponent(currentUser)}`);
        setUserInfo(response.data);
        setError(false)
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    if (currentUser){
      fetchData();
    }
  }, [currentUser]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6">Error loading data</Typography>;
  }

  return (
    // <AppTheme {...props}>
    <div>
      <UserSectionContainer>
        <Card>
          <Typography variant="h4">User Stats</Typography>
          <Typography variant="h6">Welcome, {currentUser}!</Typography>
          {userInfo.summonerInfo && (
            <Typography variant="body1">Level: {userInfo.summonerInfo.summonerLevel}</Typography>
          )}
          {userInfo.userRankedInfo && (
            <Typography variant="body1">Rank: {userInfo.userRankedInfo.rankedQueueInfo[0].tier} {userInfo.userRankedInfo.rankedQueueInfo[0].rank}</Typography>
          )}
        </Card>
      </UserSectionContainer>
    </div>
  );
}
