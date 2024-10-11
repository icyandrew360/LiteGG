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
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  minHeight: '100%',
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log('current login status:', isLoggedIn);
    event.preventDefault();
    if (idError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      riotID: data.get('riotID'),
    });

    setIsLoggedIn(true);

    setTimeout(() => {
      // navigation logic to dashboard
      console.log('Redirecting to dashboard...');
    }, 1000);
  };

  const validateInputs = () => {
    const riotID = document.getElementById('riotID') as HTMLInputElement;

    let isValid = true;

    if (!riotID.value || !/\S+#+\S{3,5}/.test(riotID.value)) {
      setIdError(true);
      setIdErrorMessage('Please enter a valid Riot ID and tagline.');
      isValid = false;
    } else {
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
        <Card>
          {/* <LiteGGIcon /> */}
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
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
              <FormLabel htmlFor="riotID">Please enter your Riot ID and tagline</FormLabel>
              <TextField
                error={idError}
                helperText={idErrorMessage}
                id="riotID"
                name="riotID"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={idError ? 'error' : 'info'}
                sx={{ ariaLabel: 'riotID', input: { color: 'white' } }}
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
