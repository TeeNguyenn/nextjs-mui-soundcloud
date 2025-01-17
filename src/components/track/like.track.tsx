'use client'
import Chip from '@mui/material/Chip';
import React, { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface LikeTrackProps {
    track: ITrackTop | null;
}

const LikeTrack = (props: LikeTrackProps) => {

    const { track } = props
    const { data: session } = useSession();
    const [likedTracks, setLikedTracks] = useState<ITrackLike[] | []>([])
    const router = useRouter();

    const fetchData = async () => {
        const res2 = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
            method: "GET",
            queryParams: {
                current: 1,
                pageSize: 100,
                sort: "-createdAt"
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        })

        if (res2.data) {
            setLikedTracks(res2.data.result)
        }
    }

    useEffect(() => {
        if (session?.access_token) {
            fetchData();
        }
    }, [session])

    const handleClick = async () => {
        const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
            method: "POST",
            body: {
                track: track?._id,
                quantity: likedTracks.some(item => item._id === track?._id) ? -1 : 1,
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        })

        if (res.data) {

            // Revalidate for clear cache

            await Promise.all([
                sendRequest<IBackendRes<any>>({
                    url: `/api/revalidate`,
                    method: "POST",
                    queryParams: {
                        tag: "track-by-id",
                        secret: "hiteedev"
                    }
                }),

                sendRequest<IBackendRes<any>>({
                    url: `/api/revalidate`,
                    method: "POST",
                    queryParams: {
                        tag: "liked-by-user",
                        secret: "hiteedev"
                    }
                })
            ])

            fetchData();
            router.refresh();
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: "20px 0 30px" }}>
            <Chip
                color={likedTracks.some(item => item._id === track?._id) ? "error" : "default"}
                label="Like"
                variant="outlined"
                icon={<FavoriteIcon />}
                sx={{ borderRadius: '6px', cursor: 'pointer' }}
                onClick={handleClick}
            />
            <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <PlayArrowIcon color='disabled' />
                    {track?.countPlay}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FavoriteIcon color='disabled' />
                    {track?.countLike}
                </div>
            </div>
        </div>
    )
}

export default LikeTrack