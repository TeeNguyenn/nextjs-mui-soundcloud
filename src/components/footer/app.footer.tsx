"use client"
import { useHasMounted } from '@/utils/customHook';
import { AppBar, Box, Container, Toolbar } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useTrackContext } from '@/lib/track.wrapper';
import Link from 'next/link';
import { convertSlugURL } from '@/utils/api';

const AppFooter = () => {
  const playerRef = useRef(null);
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

  const hasMounted = useHasMounted();



  useEffect(() => {
    if (currentTrack?.isPlaying === false) {
      //@ts-ignore
      playerRef?.current?.audio?.current?.pause();

    }
    if (currentTrack?.isPlaying === true) {
      //@ts-ignore
      playerRef?.current?.audio?.current?.play();

    }
  }, [currentTrack.isPlaying])


  if (!hasMounted) return (<></>);

  return (
    <>
      {
        currentTrack._id &&
        <Box sx={{ marginTop: '100px' }}>
          <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, backgroundColor: "#f2f2f2" }}>
            <Container sx={{
              display: 'flex', gap: 10,
              ".rhap_horizontal-reverse .rhap_controls-section": {
                marginRight: "30px"
              }
            }}>
              <AudioPlayer
                ref={playerRef}
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                volume={0.5}
                style={{ boxShadow: 'unset', backgroundColor: "#f2f2f2" }}
                layout='horizontal-reverse'
                onPlay={() => setCurrentTrack({ ...currentTrack, isPlaying: true })}
                onPause={() => setCurrentTrack({ ...currentTrack, isPlaying: false })}
              />
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "center",
                minWidth: 100,

                ".track-name:hover": {
                  color: "#000 !important"
                },
              }}>
                <div style={{ color: "#ccc", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{currentTrack?.uploader?.name ?? "Tee"}</div>
                <Link href={`/track/${convertSlugURL(currentTrack.title)}-${currentTrack._id}.html?audio=${currentTrack.trackUrl}`}
                  style={{ color: "inherit", textDecoration: "none" }}>
                  <div className='track-name' style={{ color: "#333", overflow: "hidden", whiteSpace: 'nowrap', textOverflow: "ellipsis" }}>{currentTrack.title}</div>
                </Link>
              </Box>
            </Container>
          </AppBar>
        </Box>
      }
    </>
  )
}

export default AppFooter