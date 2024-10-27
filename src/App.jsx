import './App.css'
import { VideoPlayer } from './VideoPlayer/VideoPlayer'
import { FileUploadInput } from './fileUploadVideo/FileUploadVideo'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import { useState } from 'react';

function App() {

  const [isPlaying, setIsPlaying] = useState(false);
  const [playBackRate, setPlayBackRate] = useState(1);

  const playVideo = () => {
    console.log('play');
    setIsPlaying(true);
  }

  const pauseVideo = () => {
    console.log('pause');
    setIsPlaying(false);
  }

  const setPlayBackRateToQuarter = () => {
    setPlayBackRate(0.05);
  }

  const setPlayBackRateToHalf = () => {
    setPlayBackRate(0.40);
  }

  const setPlayBackRateToOriginal = () => {
    setPlayBackRate(1);
  }

  return (
    <>
      <h1>Multi Video Player</h1>
      <div className='video-player'>
        <div className='controls-container'>
          <h2>Controls</h2>

          {/* <FileUploadInput />  */}
          <Stack
            className='stack'
            spacing={2}
            direction="row"
            divider={<Divider orientation='horizontal' flexItem />}>
            <Button variant="contained" onClick={playVideo}>Play</Button>
            <Button variant="contained" onClick={pauseVideo}>Pause</Button>
            <Button variant="contained" onClick={setPlayBackRateToQuarter}>x0.25</Button>
            <Button variant="contained" onClick={setPlayBackRateToHalf}>x0.5</Button>
            <Button variant="contained" onClick={setPlayBackRateToOriginal}>x1</Button>
          </Stack> 
        </div>

        <div className='videos-container'>
          <VideoPlayer play={isPlaying} playBackRate={playBackRate}></VideoPlayer>
          <VideoPlayer play={isPlaying} playBackRate={playBackRate}></VideoPlayer>
          {/* <VideoPlayer play={isPlaying} playBackRate={playBackRate}></VideoPlayer>
          <VideoPlayer play={isPlaying} playBackRate={playBackRate}></VideoPlayer> */}
        </div>
      </div>
    </>
  )
}

export default App
