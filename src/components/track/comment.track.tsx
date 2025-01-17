import { fetchDefaultImage, sendRequest } from '@/utils/api';
import { TextField } from '@mui/material';
import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useHasMounted } from '@/utils/customHook';
import Image from 'next/image';

dayjs.extend(relativeTime)


interface CommentTrackProps {
    comments: ITrackComment[] | null;
    track: ITrackTop | null;
    wavesurfer: any;
}
const CommentTrack = (props: CommentTrackProps) => {
    const { comments, track, wavesurfer } = props;
    const [yourComment, setYourComment] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

    const hasMounted = useHasMounted();

    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${session?.access_token}`,
            },
            body: {
                content: yourComment,
                moment: Math.round(wavesurfer.getCurrentTime()),
                track: track?._id,
            }
        })

        if (res.data) {
            setYourComment("")
            router.refresh();   //same f5
        }

    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    const handleJumpAudio = (moment: number) => {
        wavesurfer.seekTo(moment / wavesurfer.getDuration());
        wavesurfer.play();
    }

    return (
        <div style={{ margin: "0 0 50px" }}>
            <TextField value={yourComment} label="Comments" variant="standard" fullWidth
                onChange={e => setYourComment(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        handleSubmit();
                    }
                }} />
            <div style={{ display: 'flex', margin: "50px 0", gap: 50 }}>
                <div className="uploader">
                    <Image src={fetchDefaultImage(track?.uploader.type!)} alt="" width={150} height={150} style={{ borderRadius: "50%" }} />
                    <p style={{ margin: "10px 0", textAlign: 'center' }}>{track?.uploader.email}</p>
                </div>
                <div className="comments" style={{ flex: 1 }}>
                    {
                        comments?.map(comment => (
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', margin: "24px 0" }} key={comment._id}>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <Image src={fetchDefaultImage(comment.user.type)} width={40} height={40} alt="" style={{ borderRadius: "50%" }} />
                                    <div>
                                        <div style={{ color: "#555" }}>{`${comment.user.email} at `}
                                            <span style={{ color: "rgba(255, 85, 0, 0.8)", cursor: 'pointer' }} onClick={() => handleJumpAudio(comment.moment)}>{formatTime(comment.moment)}</span>
                                        </div>
                                        <div>{comment.content}</div>
                                    </div>
                                </div>
                                <div style={{ color: "#999" }}>
                                    {hasMounted && dayjs(comment.createdAt).fromNow()}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default CommentTrack