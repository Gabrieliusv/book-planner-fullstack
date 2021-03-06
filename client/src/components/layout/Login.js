import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../redux/actions/authActions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  form: {
    margin: 0,
    padding: 0,
    display: 'none',
    [theme.breakpoints.up(720)]: {
      display: 'block'
    }
  },
  title: {
    flexGrow: 1
  },
  mobile: {
    display: 'block',
    [theme.breakpoints.up(720)]: {
      display: 'none'
    }
  },
  nav: {
    backgroundColor: '#FDFEFB',
    opacity: 0.9
  },
  alert: {
    top: '70px'
  },
  marginLeft: {
    marginLeft: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const Login = ({ login, alert }) => {
  const classes = useStyles();
  const [loginOpen, setLoginOpen] = useState(false);
  const [requiredField, setRequiredField] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = () => {
    const isEmpty = Object.values(formData).some(x => x === '');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isEmpty || !regex.test(email) || password.length < 6) {
      setRequiredField(true);
    } else {
      login(email, password);
    }
  };

  const handleLoginOpen = () => {
    setLoginOpen(true);
  };

  const handleClose = () => {
    setLoginOpen(false);
    setRequiredField(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position='static' color='default' className={classes.nav}>
        <Toolbar>
          <Typography className={classes.title} variant='h6' color='inherit'>
            Book planner
          </Typography>
          <form className={classes.form}>
            <TextField
              error={requiredField === true}
              id='login-email'
              label='Email'
              className={classes.marginLeft}
              margin='dense'
              type='email'
              name='email'
              value={email}
              onChange={e => handleChange(e)}
              autoComplete='email'
              variant='outlined'
            />
            <TextField
              error={requiredField === true}
              id='login-password'
              label='Password'
              className={classes.marginLeft}
              type='password'
              name='password'
              value={password}
              onChange={e => handleChange(e)}
              autoComplete='current-password'
              margin='dense'
              variant='outlined'
            />
            <Button
              className={classes.button}
              variant='contained'
              color='primary'
              onClick={handleLogin}
            >
              Log In
            </Button>
            {alert !== false && (
              <Snackbar
                open={alert !== false}
                className={classes.alert}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                message={<span>{alert}</span>}
              />
            )}
          </form>
          <Button
            className={classes.mobile}
            variant='contained'
            color='primary'
            onClick={handleLoginOpen}
          >
            Log In
          </Button>
        </Toolbar>
        <Dialog
          open={loginOpen}
          onClose={handleClose}
          aria-labelledby='mobile-form'
        >
          <DialogTitle id='mobile-form'>Log In</DialogTitle>
          <DialogContent>
            <form className={classes.dialogForm}>
              <TextField
                error={requiredField === true}
                id='login-email'
                label='Email'
                margin='dense'
                type='email'
                name='email'
                value={email}
                onChange={e => handleChange(e)}
                autoComplete='email'
                variant='outlined'
                fullWidth
              />
              <TextField
                error={requiredField === true}
                id='login-password'
                label='Password'
                type='password'
                name='password'
                value={password}
                onChange={e => handleChange(e)}
                autoComplete='current-password'
                margin='dense'
                variant='outlined'
                fullWidth
              />
            </form>
            {alert !== false && (
              <Typography
                className={classes.marginLeft}
                variant='subtitle2'
                color='error'
              >
                {alert}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              className={classes.button}
              variant='contained'
              color='primary'
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className={classes.button}
              variant='contained'
              color='primary'
              onClick={handleLogin}
            >
              Log In
            </Button>
          </DialogActions>
        </Dialog>
      </AppBar>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  alert: state.alert.loginAlert
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
