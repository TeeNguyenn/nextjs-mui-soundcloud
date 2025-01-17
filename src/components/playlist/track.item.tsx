'use client'
import { IconButton, Typography } from '@mui/material'
import React from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTrackContext } from '@/lib/track.wrapper';
import PauseIcon from '@mui/icons-material/Pause';
import Link from 'next/link';
import { convertSlugURL } from '@/utils/api';


interface TrackItemProps {
    track: ITrackTop;
}

const TrackItem = (props: TrackItemProps) => {
    const { track } = props;
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;


    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: "8px 0", borderTop: "1.5px solid #ccc" }}>
            <Link
                href={`/track/${convertSlugURL(track.title)}-${track._id}.html?audio=${track.trackUrl}`}
                style={{ color: '#000', textDecoration: 'none' }}
            >
                {track.title}
            </Link>

            {/* Play */}
            {
                (track._id !== currentTrack._id || (track._id === currentTrack._id && !currentTrack.isPlaying)) &&
                <IconButton aria-label="play/pause" onClick={() => setCurrentTrack({ ...track, isPlaying: true })}>
                    <PlayArrowIcon sx={{ height: 24, width: 24 }} />
                </IconButton>
            }
            {/* Pause */}
            {
                (track._id === currentTrack._id && currentTrack.isPlaying) &&
                <IconButton aria-label="play/pause" onClick={() => setCurrentTrack({ ...track, isPlaying: false })}>
                    <PauseIcon sx={{ height: 24, width: 24 }} />
                </IconButton>
            }
        </div>
    )
}

export default TrackItem