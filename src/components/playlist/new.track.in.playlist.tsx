'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Box, DialogActions, DialogContent, FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { useToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
    playlists: IPlaylist<ITrackTop>[];
    tracks: ITrackTop[];


}


function getStyles(name: any, selectedTracks: readonly string[], theme: Theme) {
    return {
        fontWeight: selectedTracks.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, open, playlists, tracks } = props;
    const [playlistId, setPlaylistId] = React.useState("");
    const handleClose = () => {
        setPlaylistId("");
        setSelectedTracks([])
        onClose();
    };

    const { data: session } = useSession();
    const toast = useToast()
    const router = useRouter();

    const theme = useTheme();
    const [selectedTracks, setSelectedTracks] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof selectedTracks>) => {
        const {
            target: { value },
        } = event;
        setSelectedTracks(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleNewTrackInPlaylist = async () => {

        if (!playlistId) {
            toast.error("Vui lòng chọn playlist!")
            return;
        }
        if (!selectedTracks.length) {
            toast.error("Vui lòng chọn tracks!")
            return;
        }


        const chosenPlaylist = playlists.find(playlist => playlist._id === playlistId);

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
            method: "PATCH",
            body: {
                "id": chosenPlaylist?._id,
                "title": chosenPlaylist?.title,
                "isPublic": chosenPlaylist?.isPublic,
                "tracks": selectedTracks
            },
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
            setPlaylistId("");
            setSelectedTracks([])

            onClose();
            toast.success("Add tracks to the playlist success!")



        } else {
            toast.error(res.message)
        }

    }


    return (
        <Dialog open={open} maxWidth="sm" fullWidth >
            <DialogContent>
                <Typography variant='h6'>Thêm track vào playlist</Typography>
                <TextField
                    select
                    label="Chọn playlist"
                    variant="standard"
                    fullWidth
                    sx={{ my: 3 }}
                    value={playlistId}
                    onChange={e => setPlaylistId(e.target.value)}
                >

                    {
                        playlists.map(playlist => (
                            <MenuItem key={playlist._id} value={playlist._id}>
                                {playlist.title}
                            </MenuItem>
                        ))
                    }
                </TextField>
                <div>
                    <FormControl fullWidth>
                        <InputLabel id="tracks">Track</InputLabel>
                        <Select
                            labelId="tracks"
                            id="demo-multiple-chip"
                            multiple
                            value={selectedTracks}
                            onChange={handleChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={tracks.find(track => track._id === value)?.title} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {tracks.map((track) => (
                                <MenuItem
                                    key={track._id}
                                    value={track._id}
                                    style={getStyles(track._id, selectedTracks, theme)}
                                >
                                    {track.title}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleNewTrackInPlaylist}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
interface NewTrackInPlaylistProps {
    playlists: IPlaylist<ITrackTop>[];
    tracks: ITrackTop[];
}

const NewTrackInPlaylist = (props: NewTrackInPlaylistProps) => {
    const { playlists, tracks } = props;
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
                Tracks
            </Button>
            <SimpleDialog
                open={open}
                onClose={handleClose}
                playlists={playlists}
                tracks={tracks}
            />
        </div>
    );
}

export default NewTrackInPlaylist