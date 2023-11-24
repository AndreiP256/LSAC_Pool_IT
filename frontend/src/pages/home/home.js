import bg_image from "../../assets/backgrounds/it_bg-01.png"
import './home.css'
import Pool from "../../components/poll/poll"
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Turtle from '../../assets/images/testoasa.png'
import axios from "axios";
import React, { useState, useEffect } from 'react';


export default function Home() {
    const [pools, setPools] = useState([]);     

    useEffect(() => {
        axios.get('http://localhost:5000/polls')
        .then(response => {
            setPools(response.data);
        })
        .catch(error => {
            console.error('Error fetching polls:', error);
        });
    }, []);
    return (
        <div className="main-page">
            <div className="header">
                <p className="header-comp par">Opiniile sunt mai importante ca niciodată. Platformele de sondaje permit organizatorilor să culeagă feedback direct de la audiența lor și să înțeleagă mai bine nevoile și dorințele acesteia.</p>
                <img src={Turtle} className="header-comp img"/>
            </div>
            <div className="poll-container">
                {pools.map(pool => (
                    <Pool
                        received_title={pool.title}
                        is_multiple={pool.is_multiple}
                        choices={pool.options}
                        id={pool._id}
                        users_voted={pool.user_voted}
                        got_votes={pool.votes}
                    />
                ))}
            </div>
        </div>
    )
}