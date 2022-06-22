import React from 'react';
import { Typography, AppBar } from '@material-ui/core'; //component
import { makeStyles } from '@material-ui/core/styles'; //just doing styling

import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';

const useStyles = makeStyles((theme) => ({
    appBar: {
      borderRadius: 15,
      margin: '30px 100px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '600px',
      border: '4px solid black',
  
      [theme.breakpoints.down('xs')]: {
        width: '90%',
      },
    },

    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
  }));

const App = () => {
    const classes = useStyles();

  return (
    <div className={classes.wrapper}>
        <AppBar className={classes.appBar} position="static" color="inherit">
            <Typography variant="h2" align="center">Wisk Video Chat</Typography>
        </AppBar>

        {/* Video Player Components */}
        <VideoPlayer />

        {/* Options -> (including)Notifications Components*/}
        <Sidebar>
            <Notifications /> {/* notifications should be in inside of Options, so need to set children in Options*/}
        </Sidebar>
    </div>
  )
}

export default App;

