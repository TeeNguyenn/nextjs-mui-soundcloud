"use client"
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box } from "@mui/material";
import Button from "@mui/material/Button/Button";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { convertSlugURL } from '@/utils/api';
import Image from 'next/image';

interface IMainSlider {
    data: ITrackTop[];
    title: string;
}

const MainSlider = (props: IMainSlider) => {
    const { title, data } = props;

    const NextArrow = (props: any) => {
        return (
            <Button variant="contained"
                color='inherit'
                onClick={props.onClick}
                sx={{
                    position: "absolute",
                    right: 15,
                    top: "25%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                    transform: "translateY(-50%)",


                    // ":hover": {
                    //     backgroundColor: '#ddd'
                    // }
                }}
            >
                <ChevronRightIcon />
            </Button>
        )
    }


    const PrevArrow = (props: any) => {
        return (
            <Button color='inherit' variant="contained" onClick={props.onClick}
                sx={{
                    position: "absolute",
                    top: "25%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                    transform: "translateY(-50%)",


                    // ":hover": {
                    //     backgroundColor: '#ddd'
                    // }

                }}
            >
                <ChevronLeftIcon />
            </Button>
        )
    }

    const settings: Settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]


    };
    return (
        <Box
            sx={{
                margin: "0 50px",
                ".track": {
                    padding: "0 10px",

                    img: {
                        width: '90%',
                        height: 200,
                        objectFit: 'cover'
                    }
                },
                "h3": {
                    border: "1px solid #ccc",
                    padding: "20px",
                    height: "200px",
                }
            }}
        >
            <h2> {title} </h2>
            <Slider {...settings}>

                {
                    data.map(track => (
                        <div className="track" key={track._id}>
                            <div style={{
                                position: "relative",
                                height: "150px",
                                width: "100%"
                            }}
                            >
                                <Image
                                    alt="eric image"
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                    // width={500}
                                    // height={500}
                                    fill
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                            <Link href={`/track/${convertSlugURL(track.title)}-${track._id}.html?audio=${track.trackUrl}`}><h4>{track.title}</h4></Link>
                            <h5>{track.description}</h5>
                        </div>

                    ))
                }
            </Slider>
            <Divider />
        </Box>
    );
}

export default MainSlider