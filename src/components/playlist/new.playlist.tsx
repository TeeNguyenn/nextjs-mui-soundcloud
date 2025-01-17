'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Box, DialogActions, DialogContent, FormControlLabel, Switch, TextField } from '@mui/material';
import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { useToast } from '@/utils/toast';
import { useRouter } from "next/navigation";



export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { data: session } = useSession();
    const { onClose, open } = props;
    const [isPublic, setIsPublic] = React.useState(true);
    const [title, setTitle] = React.useState('');
    const toast = useToast()
    const router = useRouter();



    const handleClose = () => {
        onClose();
    };

    const handleNewPlaylist = async () => {

        if (!title) {
            toast.error("Tiêu đề không được để trống!")
            return;
        }


        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
            method: "POST",
            body: { title, isPublic },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        })

        if (res.data) {
            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: "POST",
                queryParams: {
                    tag: 'playlist-by-user',
                    secret: "hiteedev"
                }
            })

            router.refresh();

            setTitle("");
            setIsPublic(true)
            onClose();
            toast.success("Create a new playlist success!")



        } else {
            toast.error(res.message)
        }

    }



    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogContent>
                <Typography variant='h6'>Thêm mới playlist</Typography>
                <TextField
                    label="Tiêu đề"
                    variant="standard"
                    fullWidth
                    sx={{ my: 4 }}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <FormControlLabel
                    control={<Switch checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />}
                    label={isPublic ? "Public" : "Private"} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleNewPlaylist}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

const NewPlaylist = () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" startIcon={"+"} onClick={handleClickOpen}>
                Playlist
            </Button>
            <SimpleDialog
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}

export default NewPlaylist