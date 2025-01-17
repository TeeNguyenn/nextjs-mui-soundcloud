'use client'
import React, { useCallback } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone';
import './theme.css'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useSession } from "next-auth/react"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { sendRequestFile } from '@/utils/api';
import axios from 'axios';

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

function InputFileUpload() {
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            onClick={(e) => e.preventDefault()}
        >
            Upload files
            <VisuallyHiddenInput
                type="file"
                // onChange={(event) => console.log(event.target.files)}
                multiple
            />
        </Button>
    );
}

interface IProps {
    setValue: (v: number) => void;
    setUploadTrack: any;
    uploadTrack: any
}

const Step1 = (props: IProps) => {

    const { data: session } = useSession();

    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        // Do something with the files
        if (acceptedFiles && acceptedFiles[0]) {
            props.setValue(1);
            const audio = acceptedFiles[0];

            const formData = new FormData();

            formData.append('fileUpload', audio);

            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, formData, {
                    headers: {
                        "Authorization": `Bearer ${session?.access_token}`,
                        "target_type": "tracks",
                        // delay: 5000     // delay call api, for follow uploading percent
                    },
                    onUploadProgress: progressEvent => {
                        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!);
                        // do whatever you like with the percentage complete
                        // maybe dispatch an action that will update a progress bar or something

                        props.setUploadTrack({
                            ...props.uploadTrack,
                            fileName: acceptedFiles[0].name,
                            percent: percentCompleted,
                        })
                    }
                })

                props.setUploadTrack((prev: any) => ({
                    ...prev,
                    uploadedTrackName: res.data.data.fileName
                }))

            } catch (error) {
                //@ts-ignore
                alert(error.response.data.message)
            }



        }

    }, [session])


    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'audio': [".mp3", "m4a", ".wav", ".mp4"]
        }
    });

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <InputFileUpload />
                <p>Drag 'n' drop file here, or click to select file</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}

export default Step1