// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import FormLabel from '@mui/material/FormLabel';
// import FormControl from '@mui/material/FormControl';
// import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
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
  const { currentUser, userInfo } = useUser();
  return (
    // <AppTheme {...props}>
    <div>
      <UserSectionContainer>
        <Card>
          <Typography variant="h4">User Stats</Typography>
          <Typography variant="h6">Welcome, {currentUser}!</Typography>
          <Typography variant="body1">Level: {userInfo.summonerInfo.summonerLevel}</Typography>
          <Typography variant="body1">Rank: {userInfo.userRankedInfo.rankedQueueInfo[0].tier} {userInfo.userRankedInfo.rankedQueueInfo[0].rank}</Typography>
        </Card>
      </UserSectionContainer>
    </div>
  );
}
