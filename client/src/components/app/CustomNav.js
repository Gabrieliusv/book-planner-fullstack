import React, { useState, useEffect } from 'react';
import {
  AppBar,
  CssBaseline,
  Icon,
  Tooltip,
  Toolbar,
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  Menu,
  MenuItem
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircle from '@material-ui/icons/AddCircle';
import ProfileIcon from '@material-ui/icons/AccountCircle';
import AddCharacter from './AddCharacter';
import Trash from './Trash';
import ConfirmDel from './ConfirmDel';
import CharInfoDisplay from './CharInfoDisplay';
import EditCharacter from './EditCharacter';
import CharactersOverview from './CharactersOverview';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import { Link } from 'react-router-dom';
import {
  getCharacters,
  characterToTrash
} from '../../redux/actions/characterActions';
import {
  toggleAddCharacter,
  toggleTrash,
  openDeleteNotification,
  openEditCharacter,
  openCharacter,
  closeCharacter
} from '../../redux/actions/navigationActions';
import PropTypes from 'prop-types';

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#36393e',
    color: 'white'
  },
  content: {
    flexGrow: 1,
    margin: theme.spacing(4),
    width: `calc(100% - ${drawerWidth}px)`
  },
  list: {
    padding: 0
  },
  listItem: {
    padding: theme.spacing(1),
    wordBreak: 'break-word'
  },
  divider: {
    backgroundColor: '#fff'
  },
  title: {
    flexGrow: 1
  },
  profileMenu: {
    marginTop: 35
  },
  link: {
    margin: 0,
    textDecoration: 'none',
    color: '#000',
    width: '100%',
    padding: '12px 16px',
    fontWeight: 500
  },
  menuItem: {
    padding: 0,
    minHeight: 0
  },
  logout: {
    fontWeight: 500,
    color: '#6595DA'
  }
}));

function CustomNav({
  navigation: {
    editCharacterWindow,
    deleteNotificationWindow,
    trashWindow,
    addCharacterWindow,
    characterInfoWindow,
    charactersOverviewWindow
  },
  container,
  toggleAddCharacter,
  toggleTrash,
  characterToTrash,
  getCharacters,
  openDeleteNotification,
  openEditCharacter,
  openCharacter,
  closeCharacter,
  logout,
  characters: { charactersInfo },
  auth: { isAuthenticated }
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getCharacters();
    }
  }, [getCharacters, isAuthenticated]);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const handleOpenEditCharacter = (i, index) => {
    const data = { open: true, index: index, character: { ...i } };
    openEditCharacter(data);
  };

  const handleDelete = (i, index) => {
    characterToTrash(i._id);
    const a = { open: true, char: i, index: index };
    openDeleteNotification(a);
  };

  const handleSelectChar = id => {
    openCharacter(id);
  };

  const handleCharactersOverview = () => {
    closeCharacter();
    setMobileOpen(false);
  };

  const handleProfile = event => {
    setAnchorEl(event.currentTarget);
  };

  function handleProfileClose() {
    setAnchorEl(null);
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        <ListItem button onClick={handleCharactersOverview}>
          <ListItemText primary='Storylines overview' />
        </ListItem>
      </List>
      <Divider className={classes.divider} />
      <List className={classes.list}>
        {charactersInfo.length > 0 &&
          charactersInfo.map((i, index) => (
            <ListItem
              button
              key={i._id}
              onClick={() => handleSelectChar(i._id)}
            >
              <ListItemText primary={i.name} className={classes.listItem} />
              {i._id !== characterInfoWindow ? null : (
                <>
                  <Tooltip title='Edit'>
                    <IconButton
                      aria-label='Edit'
                      onClick={() => handleOpenEditCharacter(i, index)}
                    >
                      <Icon>edit_icon</Icon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <IconButton
                      aria-label='Delete'
                      onClick={() => handleDelete(i, index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </ListItem>
          ))}
      </List>
      <Divider />
      <List>
        <ListItem button key={'addCharacter'} onClick={toggleAddCharacter}>
          <ListItemIcon>
            <AddCircle />
          </ListItemIcon>
          <ListItemText primary={'Add Character'} />
        </ListItem>
        <ListItem button key={'trash'} onClick={toggleTrash}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={'Trash'} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='fixed' color='secondary' className={classes.appBar}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='Open-drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title} noWrap>
            Book Planner
          </Typography>
          <IconButton
            color='inherit'
            aria-controls='profile-menu'
            aria-haspopup='true'
            onClick={handleProfile}
          >
            <ProfileIcon />
          </IconButton>
          <Menu
            id='profile-menu'
            className={classes.profileMenu}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
          >
            <MenuItem className={classes.menuItem}>
              <Link className={classes.link} to='/dashboard'>
                Book planner
              </Link>
            </MenuItem>
            <MenuItem className={classes.menuItem}>
              <Link className={classes.link} to='/profile'>
                Profile
              </Link>
            </MenuItem>
            <MenuItem className={classes.logout} onClick={logout}>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden mdUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant='permanent'
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        {!addCharacterWindow || !isAuthenticated ? null : <AddCharacter />}
        {!trashWindow || !isAuthenticated ? null : <Trash />}
        {!deleteNotificationWindow.open || !isAuthenticated ? null : (
          <ConfirmDel />
        )}
        {!editCharacterWindow.open || !isAuthenticated ? null : (
          <EditCharacter />
        )}
        <div className={classes.toolbar} />
        {characterInfoWindow === false || !isAuthenticated ? null : (
          <CharInfoDisplay />
        )}
        {!charactersOverviewWindow || !isAuthenticated ? null : (
          <CharactersOverview />
        )}
      </main>
    </div>
  );
}

CustomNav.propTypes = {
  getCharacters: PropTypes.func.isRequired,
  characterToTrash: PropTypes.func.isRequired,
  toggleAddCharacter: PropTypes.func.isRequired,
  toggleTrash: PropTypes.func.isRequired,
  characters: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  openDeleteNotification: PropTypes.func.isRequired,
  openEditCharacter: PropTypes.func.isRequired,
  openCharacter: PropTypes.func.isRequired,
  closeCharacter: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  characters: state.characters,
  navigation: state.navigation,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getCharacters,
    characterToTrash,
    toggleAddCharacter,
    toggleTrash,
    openDeleteNotification,
    openEditCharacter,
    openCharacter,
    closeCharacter,
    logout
  }
)(CustomNav);
