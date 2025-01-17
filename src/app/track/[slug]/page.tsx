import React, { cache } from 'react'
import WaveTrack from '@/components/track/wave.track';
import { Container } from '@mui/material';
import { sendRequest } from '@/utils/api';

import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const slug = (await params).slug

    const paramsTemp = slug.split('.html');

    const paramsTemp1 = paramsTemp[0].split('-');

    const id = paramsTemp1[paramsTemp1.length - 1];

    // fetch data
    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: "GET",
    })

    return {
        title: res.data?.title,
        description: res.data?.description,
        openGraph: {
            title: 'Tee dev',
            description: 'Beyond Your Coding Skills',
            type: 'website',
            images: [`https://raw.githubusercontent.com/TeeNguyenn/sharing-host-files/refs/heads/main/imgs/Soundcloud-30b9efaf99f54cd6bdb2a45cd18cf444.jpg`],
        },

    }
}


export async function generateStaticParams() {

    return [
        {
            slug: "song-cho-het-doi-thanh-xuan-6751c72f7e7d7ed2fe5511db.html"
        },

    ]
}

const DetailTrackPage = async (props: any) => {
    const { params } = props;

    const paramsTemp = params.slug.split('.html');

    const paramsTemp1 = paramsTemp[0].split('-');

    const id = paramsTemp1[paramsTemp1.length - 1];

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: "GET",
        // nextOption: { cache: "no-store" }   //no use caching data next server
        nextOption: {
            next: {
                tags: ["track-by-id"]
            }
        }
    })

    const commentsRes = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 10,
            trackId: id,
            sort: "-createdAt"
        }
    })


    if (!res.data || !commentsRes.data) {
        notFound();     // call to file not-found.tsx ngang cap 
    }


    return (
        <Container>
            <div>
                <WaveTrack track={res?.data ?? null} comments={commentsRes.data?.result ?? null} />
            </div>
        </Container>
    )
}

export default DetailTrackPage