import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../redux/actions/profileActions';
import { profileNav } from '../../redux/actions/navigationActions';
import CustomProgress from '../customMui/CustomProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Paper, Button } from '@material-ui/core';
import AccountBox from '@material-ui/icons/AccountBox';
import AddProfile from '../profile/AddProfile';
import ProfileDisplay from '../profile/ProfileDisplay';
import EditProfile from '../profile/EditProfile';

const useStyles = makeStyles(theme => ({
  grid: {
    padding: '50px 90px',
    [theme.breakpoints.down('xs')]: {
      padding: '40px 2vw',
      alignItems: 'center'
    }
  },
  title: {
    marginBottom: theme.spacing(1)
  },
  profilePaper: {
    maxWidth: '250px',
    minHeight: '140px',
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15
  },
  icon: {
    width: '70px',
    height: '70px'
  },
  form: {
    minWidth: '100%'
  }
}));

const Profile = ({
  getCurrentProfile,
  profile: { profile, loading },
  auth,
  navigation,
  profileNav
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (!auth.loading) {
      profileNav('display');
      getCurrentProfile();
    }
  }, [auth.loading, getCurrentProfile, profileNav]);

  return (
    <>
      <Navbar />
      <Grid container className={classes.grid} direction='column'>
        <Grid item>
          <Typography className={classes.title} variant='h4'>
            Profile
          </Typography>
          <Typography variant='h6'>{auth.user && auth.user.name}</Typography>
        </Grid>
        {loading ? (
          <CustomProgress />
        ) : profile === null && navigation === 'display' ? (
          <Paper elevation={5} className={classes.profilePaper}>
            <AccountBox className={classes.icon} />
            <Typography align='center' variant='subtitle2'>
              You have not yet setup a profile
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={() => profileNav('addProfile')}
            >
              Create a profile
            </Button>
          </Paper>
        ) : navigation === 'addProfile' ? (
          <Grid item className={classes.form}>
            <AddProfile />
          </Grid>
        ) : navigation === 'editProfile' ? (
          <Grid item>
            <EditProfile />
          </Grid>
        ) : (
          <Grid item>
            <ProfileDisplay />
          </Grid>
        )}
      </Grid>
    </>
  );
};

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  navigation: PropTypes.string.isRequired,
  profileNav: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  navigation: state.navigation.profileNav
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, profileNav }
)(Profile);
