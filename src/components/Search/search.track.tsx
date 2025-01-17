'use client'
import { Divider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { convertSlugURL, sendRequest } from '@/utils/api'
import Image from 'next/image'
import Link from 'next/link'

const SearchTrack = () => {

    const searchParams = useSearchParams()

    const query = searchParams.get('q')

    const [tracks, setTracks] = useState<ITrackTop[] | null>(null);


    useEffect(() => {
        if (query) {
            fetchData();
            document.title = query
        }
    }, [query])

    const fetchData = async () => {
        const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
            method: "POST",
            body: {
                current: 1,
                pageSize: 100,
                title: query
            }
        })

        if (res.data) {
            setTracks(res.data.result);
        }

    }

    return (
        <div>
            <p>
                Kết quả tìm kiếm cho từ khóa:
                <strong>{query}</strong>
            </p>
            <Divider sx={{ my: 3 }} />
            <div>
                {
                    tracks?.map(track => (
                        <div key={track._id} style={{ display: "flex", alignItems: 'center', gap: 20, marginBottom: 16 }}>
                            <div>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                    alt=""
                                    width={60}
                                    height={60}
                                />
                            </div>
                            <Link href={`/track/${convertSlugURL(track.title)}-${track._id}.html?audio=${track.trackUrl}`} style={{ color: '#000', textDecoration: 'none' }}>
                                {track.title}
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SearchTrack