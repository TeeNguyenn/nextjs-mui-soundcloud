'use client'
import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useSession } from "next-auth/react"
import { sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast';
import Image from 'next/image';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const category = [
    {
        value: 'CHILL',
        label: 'CHILL',
    },
    {
        value: 'WORKOUT',
        label: 'WORKOUT',
    },
    {
        value: 'PARTY',
        label: 'PARTY',
    },

];


function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

interface IProps {
    uploadTrack: {
        fileName: string;
        percent: number;
        uploadedTrackName: string;
    },
    setValue: any;
}

interface INewTrack {
    title: string;
    description: string;
    trackUrl: string;
    imgUrl: string;
    category: string;
}

const Step2 = (props: IProps) => {
    const { data: session } = useSession();
    const toast = useToast()
    const { uploadTrack } = props;
    const [info, setInfo] = React.useState<INewTrack>({
        title: "",
        description: "",
        trackUrl: "",
        imgUrl: "",
        category: "",
    })

    React.useEffect(() => {
        if (uploadTrack && uploadTrack.uploadedTrackName) {
            setInfo({
                ...info,
                trackUrl: uploadTrack.uploadedTrackName
            })

        }
    }, [uploadTrack])

    const handleUploadImage = async (image: any) => {
        const formData = new FormData();

        formData.append('fileUpload', image);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, formData, {
                headers: {
                    "Authorization": `Bearer ${session?.access_token}`,
                    "target_type": "images",
                },

            })

            setInfo({
                ...info,
                imgUrl: res.data.data.fileName
            })

        } catch (error) {
            //@ts-ignore
            toast.error(error.response.data.message)

        }
    }

    const handleSubmit = async () => {

        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${session?.access_token}`,
            },
            body: {
                title: info.title,
                description: info.description,
                trackUrl: info.trackUrl,
                imgUrl: info.imgUrl,
                category: info.category,
            },
        })

        if (res.data) {
            props.setValue(0)
            toast.success("Create a new track success!")

            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: "POST",
                queryParams: {
                    tag: "track-by-profile",
                    secret: "hiteedev"
                }
            })
        } else {
            toast.error(res.message)
        }

    }

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                <Typography>{uploadTrack.fileName}</Typography>
                <LinearProgressWithLabel value={uploadTrack.percent} />
            </Box>
            <Grid container spacing={2} mt={5}>
                <Grid item xs={6} md={4}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                        <div style={{ width: '80%', height: 300, backgroundColor: !info.imgUrl ? "#ccc" : "#fff" }}>
                            {
                                info.imgUrl &&
                                <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`} alt="" width={250} height={250} style={{
                                    objectFit: 'contain'
                                }} />
                            }
                        </div>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload files
                            <VisuallyHiddenInput
                                type="file"
                                onChange={(event) => {
                                    if (event.target.files) {
                                        handleUploadImage(event.target.files[0])
                                    }
                                }}
                            // multiple
                            />
                        </Button>

                    </div>
                </Grid>
                <Grid item xs={6} md={8}>
                    <TextField
                        value={info.title}
                        onChange={(e) => setInfo({ ...info, title: e.target.value })}
                        label="Title"
                        variant="standard"
                        fullWidth
                        margin='dense' />
                    <TextField
                        value={info.description}
                        onChange={(e) => setInfo({ ...info, description: e.target.value })}
                        label="Description"
                        variant="standard"
                        fullWidth
                        margin='dense' />
                    <div style={{ margin: '24px 0 50px' }}>
                        <TextField
                            value={info.category}
                            onChange={(e) => setInfo({ ...info, category: e.target.value })}
                            select
                            label="Category"
                            defaultValue="CHILL"
                            variant="standard"
                            fullWidth
                        >
                            {category.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <Button variant="outlined" onClick={() => handleSubmit()}>Save</Button>
                </Grid>

            </Grid>
        </Box>
    );
}

export default Step2