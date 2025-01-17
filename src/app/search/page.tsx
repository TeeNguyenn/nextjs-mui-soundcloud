import SearchTrack from '@/components/Search/search.track'
import { Container } from '@mui/material'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Search your tracks',
    description: 'miêu tả thôi mà',
}

const SearchPage = () => {
    return (
        <Container>
            <SearchTrack />
        </Container>
    )
}

export default SearchPage