import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { LiteGGIcon } from './CustomIcons';
import { useUser } from '../UserContext';
import './login.css';
// import AppTheme from '../shared-theme/AppTheme';
// import ColorModeSelect from '../shared-theme/ColorModeSelect';

// const flyUp = keyframes`
//   0% {
//     transform: translateY(0);
//   }
//   100% {
//     transform: translateY(-100vh);
//   }
// `;

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  // alignSelf: 'center',
  width: '100%',
  alignItems: 'center',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  marginTop: '30vh',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  // backgroundColor: theme.palette.background.default,
  height:"100vh",
  display: 'flex',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function SignIn() {
  const [idError, setIdError] = React.useState(false);
  const [idErrorMessage, setIdErrorMessage] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const { setCurrentUser } = useUser();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log('current login status:', isLoggedIn);
    event.preventDefault();
    if (idError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    const riotID = data.get('riotID') as string;
    console.log({
      riotID
    });

    setCurrentUser(riotID);
    setIsLoggedIn(true);
  };

  const validateInputs = () => {
    const riotID = document.getElementById('riotID') as HTMLInputElement;

    let isValid = true;

    if (!riotID.value || !/\S+#+\S{3,5}$/.test(riotID.value)) {
      setIdError(true);
      setIdErrorMessage('Please enter a valid Riot ID and tagline.');
      isValid = false;
    } else {
      setCurrentUser(riotID.value);
      setIdError(false);
      setIdErrorMessage('');
    }
    return isValid;
  };

  return (
    // <AppTheme {...props}>
    <div>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card className="loginCard">
          {/* <LiteGGIcon /> */}
          <Typography
            component="h1"
            variant="h1"
            className="typography-margin"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 4.5rem)' }} // vw means viewport with. if 10vw, it means 10% of the viewport width.
            //this means by default, the font size will be 10% of the viewport width, but it will not exceed 4.5rem or go below 2rem. rem is fontsize of root element (h1)
          >
            LiteGG
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel className="enterRiotID" htmlFor="riotID">RiotID</FormLabel>
              <TextField
                error={idError}
                helperText={idErrorMessage}
                id="riotID"
                name="riotID"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={idError ? 'error' : 'primary'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'gray', // Default border color when unfocused
                    },
                    '&:hover fieldset': {
                      borderColor: 'white', // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white', // Border color when focused
                    },
                  },
                  input: { color: 'white' }
                }}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign in
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    {/* // </AppTheme> */}
    </div>
  );
}
