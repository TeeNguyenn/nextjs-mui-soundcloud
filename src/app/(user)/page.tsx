import * as React from 'react';
import MainSlider from '@/components/main/main.slider';
import { Container } from '@mui/material';
import { sendRequest } from '@/utils/api';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../api/auth/auth.options';

export default async function HomePage() {

  // Get session
  const session = await getServerSession(authOptions);

  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "CHILL",
      limit: 10
    },

  })

  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 10
    },

  })

  const parties = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "PARTY",
      limit: 10
    },

  })

  return (
    <Container >
      <MainSlider title='Chill' data={chills.data ?? []} />
      <MainSlider title='Workout' data={workouts.data ?? []} />
      <MainSlider title='Party' data={parties.data ?? []} />
    </Container>
  );
}
