import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate  } from 'react-router-dom';

import MuiDrawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import { Box, List, CssBaseline, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, Tooltip, Menu, MenuItem, Avatar } from '@mui/material';
import { HomeRounded, MenuRounded, MenuOpenRounded, AccountCircle, Login, Favorite, Public, MenuBook, Person, People } from '@mui/icons-material';
import { IoTelescope } from "react-icons/io5";
import { RiCameraLensLine } from "react-icons/ri";
import { Image } from 'react-bootstrap';
import { toast } from 'react-toastify';

import sideBarStyles from '../styles/sideBarStyles.module.css'

import LogoBig from '/LogoBig1.png';
import Logo from '/Logo1.png';

import { setSideBarStatus } from '../slices/customizeSlice';
import { clearUserInfo } from '../slices/authSlice';

import { FaSignInAlt } from 'react-icons/fa';

const drawerWidth = 240;

const openedMixin = (theme, issmallscreen) => ({
  width: issmallscreen=='true' ? `calc(${theme.spacing(8)} + 1px)` : drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  background: 'white',
  color:'black',
  justifyContent:'space-between'
});

const closedMixin = (theme, issmallscreen) => ({
  width: issmallscreen=='true' ? 0 : `calc(${theme.spacing(8)} + 1px)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  background: 'white',
  color:'black',
  justifyContent:'space-between'
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 0),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open, issmallscreen }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme, issmallscreen),
      '& .MuiDrawer-paper': openedMixin(theme, issmallscreen),
    }),
    ...(!open && {
      ...closedMixin(theme, issmallscreen),
      '& .MuiDrawer-paper': closedMixin(theme, issmallscreen),
    }),
  }),
);

export default function Sidebar() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { sideBar } = useSelector((state) => state.customize);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [open, setOpen] = React.useState(sideBar ? sideBar.status : false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const activeRoute = location.pathname;

  const handleDrawerOpen = () => {
    setOpen(true);
    dispatch(setSideBarStatus({status:true})); 
  };

  const handleDrawerClose = () => {
    setOpen(false);
    dispatch(setSideBarStatus({status:false})); 
  };

  const logout = async() => {
    setAnchorEl(null)
    try {
      dispatch(clearUserInfo())
      toast.success('Logged Out Successfully')
    } catch (error) {
      console.log(error);
      toast.error(error.message || error.error)
    }
  }

  React.useEffect(() => {
    setOpen(sideBar ? sideBar.status : false);
  },[isSmallScreen]);

  
  return (
    <Box sx={{ display: 'flex' }} id='sideBarBox'>
      <CssBaseline  style={{border:'none !important'}}/>
      <Drawer variant="permanent" open={open} issmallscreen={isSmallScreen.toString()}>
        <DrawerHeader style={{justifyContent: (open && !isSmallScreen ? 'flex-start':'center')}}>
          <Link to='/'><Image src={open && !isSmallScreen ? LogoBig : Logo} height={open && !isSmallScreen ? '45px' : '70px'} style={{margin: open && '13px 0px 12px', transition: 'all .4s ease-in-out'}} id="logo"/></Link>
          {open && !isSmallScreen ? <div onClick={handleDrawerClose} className={sideBarStyles.closeMenuBtn}><MenuOpenRounded style={{verticalAlign:'bottom'}} /></div> : <></>}
        </DrawerHeader>
        <Divider />
        <List style={{height:'80vh', overflowY:'auto', overflowX:'hidden'}}>
          <Link to='/' style={{textDecoration:'none', color:'black'}}><ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title={!open ? 'Home' : ''} placement="right" arrow>
              <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} className={`${sideBarStyles.itmBtn} ${activeRoute === '/' ? sideBarStyles.active : ''}`}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                  <HomeRounded />
                </ListItemIcon>
                <ListItemText primary={'Home'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Tooltip>
          </ListItem></Link>
          
          {userInfo && userInfo.userType === 'ROLE_LEARNER' &&
          <Link to='/learner' style={{textDecoration:'none', color:'black'}}><ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title={!open ? 'Profile' : ''} placement="right" arrow>
              <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} className={`${sideBarStyles.itmBtn} ${activeRoute.split('/')[activeRoute.split('/').length - 1] == ('learner') ? sideBarStyles.active : ''}`}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                  <Person />
                </ListItemIcon>
                <ListItemText primary={'Profile'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Tooltip>
          </ListItem></Link>
          }

          {userInfo && userInfo.userType === 'ROLE_ADMIN' &&
          <>
            <Link to='/admin' style={{textDecoration:'none', color:'black'}}><ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!open ? 'Profile' : ''} placement="right" arrow>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} className={`${sideBarStyles.itmBtn} ${activeRoute.split('/')[activeRoute.split('/').length - 1] == ('admin') ? sideBarStyles.active : ''}`}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary={'Profile'} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem></Link>

            <Link to='/admin/users/all' style={{textDecoration:'none', color:'black'}}><ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!open ? 'Users' : ''} placement="right" arrow>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} className={`${sideBarStyles.itmBtn} ${activeRoute.includes('/admin/users/all') ? sideBarStyles.active : ''}`}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                    <People />
                  </ListItemIcon>
                  <ListItemText primary={'Users'} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem></Link>

            <Link to='/admin/courses' style={{textDecoration:'none', color:'black'}}><ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!open ? 'Courses' : ''} placement="right" arrow>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} className={`${sideBarStyles.itmBtn} ${activeRoute.includes('/admin/course') ? sideBarStyles.active : ''}`}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                    <MenuBook />
                  </ListItemIcon>
                  <ListItemText primary={'Courses'} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem></Link>
          </>
          }

          {userInfo && userInfo.userType === 'ROLE_INSTRUCTOR' &&
          <>
            <Link to='/instructor' style={{textDecoration:'none', color:'black'}}><ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!open ? 'Profile' : ''} placement="right" arrow>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} className={`${sideBarStyles.itmBtn} ${activeRoute.split('/')[activeRoute.split('/').length - 1] == ('instructor') ? sideBarStyles.active : ''}`}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary={'Profile'} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem></Link>
            
            <Link to='/instructor/courses' style={{textDecoration:'none', color:'black'}}><ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!open ? 'My Courses' : ''} placement="right" arrow>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} className={`${sideBarStyles.itmBtn} ${activeRoute.includes('/instructor/course') ? sideBarStyles.active : ''}`}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                    <MenuBook />
                  </ListItemIcon>
                  <ListItemText primary={'My Courses'} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem></Link>
          </>
          }
          
        </List>
        <Divider />
        <List>
        {userInfo ? // If user is logged in, show user info
          <>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={(e) => setAnchorEl(e.currentTarget)}>
              <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'initial', px: 2.5, }} className={`${sideBarStyles.itmBtn}`}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                  {userInfo.photoURL ? <Avatar alt={userInfo.displayName} src={userInfo.photoURL} sx={!open ? { width: 24, height: 24 } : {}} style={{ transition: 'all .2s ease-in-out'}} /> : <AccountCircle />}
                </ListItemIcon>
                <ListItemText primary={userInfo.firstName} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </>
        : 
          <>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/login')}>
              <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'initial', px: 2.5, }} className={`${sideBarStyles.itmBtn}`}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                  <FaSignInAlt />
                </ListItemIcon>
                <ListItemText primary={'Signin'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </>
        }
          
        </List>
      </Drawer>
      {open && isSmallScreen? <div id="smMenuBtn" onClick={handleDrawerClose} style={{left: `calc(${theme.spacing(7)} + 9px)`, boxShadow: '0 0 10px 5px #00000029'}} className={sideBarStyles.openMenuBtn}><MenuOpenRounded style={{verticalAlign:'bottom'}} /></div> : <div id="smMenuBtn" onClick={handleDrawerOpen} style={{left: 0, boxShadow: '0 0 10px 5px #00000029'}} className={sideBarStyles.openMenuBtn}><MenuRounded style={{verticalAlign:'bottom'}} /></div>}
      {!open && !isSmallScreen? <div id="smMenuBtn" onClick={handleDrawerOpen} style={{left: `calc(${theme.spacing(7)} + 9px)`, boxShadow: '0 0 10px 5px #00000029'}} className={sideBarStyles.openMenuBtn}><MenuRounded style={{verticalAlign:'bottom'}} /></div> : <></>}
      </Box>
  );
}