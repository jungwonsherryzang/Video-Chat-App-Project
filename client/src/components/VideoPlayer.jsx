
import React, { useContext } from 'react';
import { Grid, Typography, Paper } from '@material-ui/core'; 


import { SocketContext } from '../SocketContext.js';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px', //width on mobile devices
    },
  },
  

  gridContainer: { 
    justifyContent: 'center', //center in desktop devices
    
    //in mobile device
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));


const VideoPlayer = () => {
  const classes = useStyles();

  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext); 

  return (
      <Grid container className={classes.gridContainer}>
          
          {/* 1. Our own video */}
          {//if there is only stream, then render own stream<Paper>
            stream && (
                <Paper className={classes.paper}>
                  <Grid item xs={12} md={6}>  
                    <Typography variant="h5" gutterBottom>{ name || 'Name' }</Typography>
              
                    <video playsInline muted ref={myVideo} autoPlay className={classes.video} /> 
                  </Grid>
                </Paper>
            )}
           
          {/* 2. User's video */}
          {//if the call is accepted, and call didnt end
          //we want to show the user's screen
            callAccepted && !callEnded && (
              <Paper className={classes.paper}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" gutterBottom>{ call.name || 'Name' }</Typography>
            
                  <video playsInline ref={userVideo} autoPlay className={classes.video} />
                </Grid>
              </Paper>
            )}
      </Grid>
  );
};

export default VideoPlayer;
