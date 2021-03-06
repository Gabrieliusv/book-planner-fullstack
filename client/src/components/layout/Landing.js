import React, { useState } from 'react';
import Login from './Login';
import { makeStyles } from '@material-ui/core/styles';
import Image1 from '../images/landing-2.svg';
import Image2 from '../images/Landing-page.svg';
import { connect } from 'react-redux';
import Alert from './Alert';
import { register } from '../../redux/actions/authActions';
import { setAlert, removeAlert } from '../../redux/actions/alertActions';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box
} from '@material-ui/core';

const appBar = 64;

const useStyles = makeStyles(theme => ({
  landing: {
    backgroundImage: `url(${Image1})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%'
  },
  container: {
    width: '100%',
    minHeight: `calc(100vh - ${appBar}px)`,
    paddingTop: theme.spacing(4),
    margin: 0
  },
  paper: {
    background: 'rgba(241, 241, 239, 0.7)'
  },
  showcase: {
    maxWidth: 800
  },
  signup: {
    maxHeight: 800,
    maxWidth: 450
  },
  welcomeText: {
    maxWidth: 505
  },
  img: {
    width: '65%'
  },
  alert: {
    margin: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(2)
  }
}));

const Landing = ({ register, setAlert, removeAlert, isAuthenticated }) => {
  const classes = useStyles();
  const [requiredField, setRequiredField] = useState(false);
  const [match, setMatch] = useState(true);
  const [emailValidation, setEmailValidation] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = () => {
    const isEmpty = Object.values(formData).some(x => x === '');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const reset = () => {
      setMatch(true);
      setEmailValidation(true);
      setRequiredField(false);
    };
    reset();
    removeAlert();
    if (isEmpty) {
      setRequiredField(formData);
    } else if (!regex.test(email)) {
      setEmailValidation(false);
    } else if (password !== password2) {
      setMatch(false);
    } else if (password.length < 6) {
      setAlert('Please enter a password with 6 or more characters', 'error');
    } else {
      reset();
      register({ name, email, password });
    }
  };

  //Redirect if with token
  if (localStorage.token) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <>
      <Login />
      <div className={classes.landing}>
        <Grid
          container
          className={classes.container}
          spacing={2}
          direction='row'
          justify='center'
          alignItems='center'
        >
          <Grid item xs={11} sm={6} className={classes.showcase}>
            <Grid
              container
              direction='column'
              justify='center'
              alignItems='center'
            >
              <Box p={1} className={classes.welcomeText}>
                <Typography variant='h6' align='center'>
                  Start Writing your book today!
                </Typography>
                <Typography variant='subtitle2' align='center'>
                  The book planner will help you plan your next novel,
                  characters and storylines. It provides a graphical overview of
                  character's storyline for easier story planing.
                </Typography>
              </Box>
              <img className={classes.img} src={Image2} alt='writer' />
            </Grid>
          </Grid>
          <Grid item xs={11} sm={6} className={classes.signup}>
            <Paper elevation={2} className={classes.paper}>
              <Box p={2}>
                <Typography variant='h6' align='center'>
                  Create a New Account
                </Typography>
                <form>
                  <TextField
                    error={requiredField.name === ''}
                    id='register-name'
                    label='Name'
                    onChange={e => handleChange(e)}
                    type='name'
                    autoComplete='name'
                    name='name'
                    value={name}
                    margin='normal'
                    variant='outlined'
                  />
                  <TextField
                    error={requiredField.email === '' || !emailValidation}
                    id='register-email'
                    label='Email'
                    onChange={e => handleChange(e)}
                    type='email'
                    name='email'
                    value={email}
                    autoComplete='email'
                    margin='normal'
                    variant='outlined'
                    fullWidth
                  />
                  {emailValidation || requiredField.email === '' ? null : (
                    <Typography
                      variant='subtitle2'
                      color='error'
                      className={classes.alert}
                    >
                      Invalid email address
                    </Typography>
                  )}
                  <TextField
                    error={requiredField.password === '' || !match}
                    id='register-password'
                    label='Password'
                    onChange={e => handleChange(e)}
                    type='password'
                    name='password'
                    value={password}
                    autoComplete='password'
                    margin='normal'
                    variant='outlined'
                    fullWidth
                  />
                  <TextField
                    error={requiredField.password2 === '' || !match}
                    id='register-confirm-password'
                    label='Confirm Password'
                    onChange={e => handleChange(e)}
                    type='password'
                    name='password2'
                    autoComplete='password'
                    value={password2}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                  />
                  <Box className={classes.alert}>
                    <Alert />
                    {match ? null : (
                      <Typography variant='subtitle2' color='error'>
                        Passwords do not match
                      </Typography>
                    )}
                  </Box>
                  <Button
                    className={classes.button}
                    variant='contained'
                    color='primary'
                    onClick={handleRegister}
                  >
                    Sign up
                  </Button>
                </form>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

Landing.propTypes = {
  register: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  removeAlert: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { register, setAlert, removeAlert }
)(Landing);
