'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Grid } from '@mui/material'
import { convertSlugURL } from '@/utils/api'

interface LikeProps {
    likes: ITrackTop[];
}

const Like = (props: LikeProps) => {
    const { likes } = props;

    return (
        <Grid container spacing={2}>
            {
                likes.map(item => (
                    <Grid item xs={6} md={3} key={item._id} >
                        <div>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                                alt=""
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                        <Link href={`/track/${convertSlugURL(item.title)}-${item._id}.html?audio=${item.trackUrl}`} style={{ color: '#000', textDecoration: 'none' }}>
                            {item.title}
                        </Link>
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default Like