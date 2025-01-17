import React from 'react'

import type { Metadata } from 'next'
import { Container, Divider, Grid, Typography } from '@mui/material'
import { convertSlugURL, sendRequest } from '@/utils/api'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import Like from '@/components/like/like'



export const metadata: Metadata = {
    title: "Tee like page",
    description: "Tee like page desc"
}

const LikePage = async () => {

    const session = await getServerSession(authOptions);


    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['liked-by-user'] }
        }
    })


    return (
        <Container sx={{ mt: 2 }}>
            <Typography variant='h6'>Hear the tracks you've liked:</Typography>
            <Divider sx={{ my: 2 }} />
            <Like likes={res.data?.result ?? []} />
        </Container>
    )
}

export default LikePage