// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import FormLabel from '@mui/material/FormLabel';
// import FormControl from '@mui/material/FormControl';
// import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { CircularProgress, useScrollTrigger } from '@mui/material';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import axios from 'axios';
import { styled } from '@mui/material/styles';
// import { LiteGGIcon } from './CustomIcons';
import './user_section.css';
import { useUser } from '../UserContext.tsx';
import MatchHistory from './MatchHistory.tsx';

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
  // backgroundColor: 'blue',
  alignItems: 'center',
  width: '60vw',
  // justifyContent: 'center',
  padding: theme.spacing(2),
  // [theme.breakpoints.up('sm')]: {
  //   padding: theme.spacing(4),
  // },
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  // alignSelf: 'flex-start',
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
  // backgroundColor: 'green',
  backgroundColor: '#141414',
  flexDirection: 'row',
  justifyContent: 'space-between',
  // paddingTop: theme.spacing(2),
  // paddingBottom

}));
const UserSectionItem = styled(Stack)(({ theme }) => ({
  height:"100%",
  display: 'flex',
  // backgroundColor: 'blue',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(2),

  // paddingLeft: theme.spacing(2),
  // paddingRight: theme.spacing(2),
}));


export default function UserSection() {
  const { currentUser, userInfo, setUserInfo} = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }); // Scroll down 100vh
        const response = await axios.get(`http://localhost:8000/user-info?riotID=${encodeURIComponent(currentUser)}`);
        setUserInfo(response.data);
        console.log('User info:', response.data);
        setSuccess(true);
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
                  <UserSectionItem>
                    <Typography variant="body1" className='rankedInfoText'>{userInfo.userRankedInfo.rankedQueueInfo[0].tier} {userInfo.userRankedInfo.rankedQueueInfo[0].rank}</Typography>
                  </UserSectionItem>
                  <UserSectionItem>
                    <Typography variant="body1" className='rankedInfoText'>LP: {userInfo.userRankedInfo.rankedQueueInfo[0].lp}</Typography>
                  </UserSectionItem>
                  <UserSectionItem>
                    <Typography variant="body1" className='rankedInfoText'>Win/Loss</Typography>
                    <Typography variant="body1" className='rankedInfoText'>{userInfo.userRankedInfo.rankedQueueInfo[0].wins} - {userInfo.userRankedInfo.rankedQueueInfo[0].losses}</Typography>
                  </UserSectionItem>
                  <UserSectionItem>
                    <Typography variant="body1" className='rankedInfoText'>Winrate</Typography>
                    <Typography
                      variant="body1"
                      className='rankedInfoText'
                      style={{color: userInfo.userRankedInfo.rankedQueueInfo[0].winrate >= 50 ? '#00b327' : '#c91844'}}
                    >
                        {userInfo.userRankedInfo.rankedQueueInfo[0].winrate}%
                    </Typography>
                  </UserSectionItem>
                </UserSectionGroup>
              ) : (
                <Typography variant="h6">Unranked</Typography>
              )}
            </Card>
            <Card>
            <Typography variant="h4">Top 10 Masteries</Typography>
            {userInfo.userMasteries.championMasteryList.slice(0, 10).map((mastery, index) => (
              <UserSectionGroup key={index}>
                <UserSectionItem>
                  <Typography variant="h6">{mastery.champion}:</Typography>
                </UserSectionItem>
                <UserSectionItem>
                  <Typography variant="body1">Mastery points</Typography>
                  <Typography variant="body1">{mastery.championPoints}</Typography>
                </UserSectionItem>
                {/* <UserSectionItem>
                  <Typography variant="body1">Last played</Typography>
                  <Typography variant="body1">{mastery.lastPlayTime}</Typography>
                </UserSectionItem> */}
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
