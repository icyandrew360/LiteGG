// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import FormLabel from '@mui/material/FormLabel';
// import FormControl from '@mui/material/FormControl';
// import TextField from '@mui/material/TextField';
import React, { ReactNode, useEffect, useState } from 'react';
import { CircularProgress, MenuItem, useScrollTrigger } from '@mui/material';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import { styled } from '@mui/material/styles';
// import { LiteGGIcon } from './CustomIcons';
import './user_section.css';
import { useUser } from '../UserContext.tsx';
import MatchHistory from './MatchHistory.tsx';
import { CURRENT_BASE_URL } from './UrlConsts';

const UserSectionScreen = styled(Stack)(({ theme }) => ({
  minHeight:"100vh",
  display: 'flex',
  flexDirection: 'row',
  // alignItems: 'center',
  justifyContent: 'space-around',
  padding: theme.spacing(2),
  // [theme.breakpoints.up('sm')]: {
  //   padding: theme.spacing(4),
  // },
}));

const UserInfoContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  // backgroundColor: 'red',
  alignItems: 'center',
  // justifyContent: 'center',
  padding: theme.spacing(2),
  // [theme.breakpoints.up('sm')]: {
  //   padding: theme.spacing(4),
  // },
}));

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
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    maxWidth: '100%',
  },
  boxShadow:
    'hsla(0, 50%, 15%, 0.2) 0px 5px 15px 0px, hsla(0, 50%, 15%, 0.2) 0px 15px 35px -5px',
}));

const UserSectionGroup = styled(MuiCard)(({ theme }) => ({
  height:"60px",
  width:"100%",
  display: 'flex',
  backgroundColor: '#141414',
  flexDirection: 'row',
  justifyContent: 'space-between',

}));
const UserSectionItem = styled(Stack)(({ theme }) => ({
  height:"100%",
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(2),

}));

type RankedQueueInfo = {
  queueType: string;
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
  winrate: number;
}

type MasteryInfo = {
  champion: string;
  championPoints: number;
  championLevel: number;
  lastPlayTime: number;
}

export default function UserSection() {
  const { currentUser, userInfo, setUserInfo} = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedQueueType, setSelectedQueueType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }); // Scroll down 100vh
        console.log(`${CURRENT_BASE_URL}/user-info?riotID=${encodeURIComponent(currentUser)}`)
        const response = await axios.get(`${CURRENT_BASE_URL}/user-info?riotID=${encodeURIComponent(currentUser)}`);
        setUserInfo(response.data);
        console.log('User info:', response.data);
        setSuccess(true);
        setError(false)
        setLoading(false);
        if (response.data.userRankedInfo){
          setSelectedQueueType(response.data.userRankedInfo.rankedQueueInfo[0].queueType);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError(true);
        setLoading(false);
      }
    };

    if (currentUser){
      fetchData();
    }
  }, [currentUser]);

  const handleQueueTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedQueueType(event.target.value as string);
  };

  const selectedRankedInfo = userInfo?.userRankedInfo?.rankedQueueInfo?.find(
    (queueInfo: RankedQueueInfo) => queueInfo.queueType === selectedQueueType
  );

  if (loading) {
    return (
      <UserSectionScreen>
        <CircularProgress className="customCircularProgress"/>
      </UserSectionScreen>
    );
  }

  if (error) {
    return (
      <UserSectionScreen>
        <Typography variant="h6">Error: RiotID not found</Typography>
      </UserSectionScreen>
    );
  }

  if (success) {
    return (
      <div>
        <UserSectionScreen>
          <UserInfoContainer>
            <Card>
              <Typography variant="h4">{currentUser}</Typography>
              {userInfo.summonerInfo && (
                <Typography variant="h6">Level: {userInfo.summonerInfo.summonerLevel}</Typography>
              )}
              {userInfo.userRankedInfo ? (
                <UserSectionGroup>
                  <Select
                    value={selectedQueueType}
                    onChange={handleQueueTypeChange}
                  >
                    {userInfo.userRankedInfo.rankedQueueInfo.map((queueInfo: RankedQueueInfo, index: number) => (
                      <MenuItem key={index} value={queueInfo.queueType}>
                      {queueInfo.queueType}
                      </MenuItem>
                    ))}
                  </Select>
                  <UserSectionItem>
                    <Typography variant="body1" className='rankedInfoText'>{selectedRankedInfo.tier} {selectedRankedInfo.rank}</Typography>
                  </UserSectionItem>
                  <UserSectionItem>
                    <Typography variant="body1" className='rankedInfoText'>LP: {selectedRankedInfo.lp}</Typography>
                  </UserSectionItem>
                  <UserSectionItem>
                    <Typography variant="body1" className='rankedInfoText'>W/L</Typography>
                    <Typography variant="body1" className='rankedInfoText'>{selectedRankedInfo.wins}/{selectedRankedInfo.losses}</Typography>
                  </UserSectionItem>
                  <UserSectionItem>
                    <Typography variant="body1" className='rankedInfoText'>Winrate</Typography>
                    <Typography
                      variant="body1"
                      className='rankedInfoText'
                      style={{color: selectedRankedInfo.winrate >= 50 ? '#00b327' : '#c91844'}}
                    >
                        {selectedRankedInfo.winrate}%
                    </Typography>
                  </UserSectionItem>
                </UserSectionGroup>
              ) : (
                <Typography variant="h6">Unranked</Typography>
              )}
            </Card>
            <Card>
            <Typography variant="h4">Top 10 Masteries</Typography>
            {userInfo.userMasteries.championMasteryList.slice(0, 10).map((masteryInfo: MasteryInfo, index: number) => (
              <UserSectionGroup key={index}>
                <UserSectionItem>
                  <Typography variant="h6">{masteryInfo.champion}:</Typography>
                </UserSectionItem>
                <UserSectionItem>
                  <Typography variant="body1">Mastery points</Typography>
                  <Typography variant="body1">{masteryInfo.championPoints}</Typography>
                </UserSectionItem>
              </UserSectionGroup>
            ))}
            </Card>
          </UserInfoContainer>
          <MatchHistory/>
        </UserSectionScreen>
      </div>
    );
  }
}
