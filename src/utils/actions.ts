'use server'
import { revalidateTag } from 'next/cache'
import { sendRequest } from './api'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.options';

export const handleLikeTrackAction = async (id: any, quantity: any) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "POST",
        body: {
            track: id,
            quantity: quantity,
        },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    })

    if (res.data) {
        // Revalidate for clear cache and fetch data again
        revalidateTag("track-by-id");
        revalidateTag("liked-by-user");
    }

}