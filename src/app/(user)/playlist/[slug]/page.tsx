import { sendRequest } from '@/utils/api'
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Container, Divider, IconButton } from '@mui/material';
import NewPlaylist from '@/components/playlist/new.playlist';
import NewTrackInPlaylist from '@/components/playlist/new.track.in.playlist';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TrackItem from '@/components/playlist/track.item';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Playlist bạn đã tạo',
  description: 'miêu tả thôi mà',
}




const PlaylistPage = async ({ params }: { params: { slug: string } }) => {
  const session = await getServerSession(authOptions);


  const playListRes = await sendRequest<IBackendRes<IModelPaginate<IPlaylist<ITrackTop>>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
    method: "POST",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['playlist-by-user'] }
    }
  })

  const tracksRes = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['all-tracks'] }
    }
  })

  return (
    <Container sx={{ mt: 3, padding: "20px", backgroundColor: "aliceblue" }}>
      <div style={{ margin: "20px 0", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h6'>Danh sách phát</Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <NewPlaylist />
          <NewTrackInPlaylist playlists={playListRes.data?.result ?? []} tracks={tracksRes.data?.result ?? []} />
        </div>
      </div>
      <Divider sx={{ my: 3 }} />
      {
        playListRes.data?.result.map(item => (
          <Accordion key={item._id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id={item._id}
            >
              <Typography component="span">{item.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {
                item.tracks.length > 0 && item.tracks.map(track => (
                  <TrackItem track={track} />
                ))
              }
            </AccordionDetails>
          </Accordion>
        ))
      }
    </Container>
  );
}

export default PlaylistPage