import CardTrack from '@/components/track/card.track';
import { sendRequest } from '@/utils/api'
import React from 'react'
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';


const ProfilePage = async ({ params }: { params: { slug: string } }) => {

  const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
    method: "POST",
    body: {
      id: params.slug,
    },
    nextOption: {
      // cache: "no-store" 
      next: { tags: ['track-by-profile'] }
    }

  })



  return (
    <Container sx={{ padding: "40px 0" }}>
      <Grid container spacing={3}>
        {
          res.data?.result.map(item => (
            <Grid item xs={8} md={6} key={item._id}>
              <CardTrack data={item} />
            </Grid>
          ))
        }
      </Grid>
    </Container>
  )
}

export default ProfilePage