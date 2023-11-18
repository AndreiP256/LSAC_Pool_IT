import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FacebookIcon from '../../assets/social_icons/facebook_icon.png';
import InstagramIcon from '../../assets/social_icons/instagram_icon.png';
import TwitchIcon from '../../assets/social_icons/twitch_icon.png';

import './footer.css';

export default function FooterComponent() {
    return (
            <Container fluid className="footer">
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <a href="https://www.instagram.com/lsacbucuresti/" className='social-icon' target="_blank">
                            <img src={InstagramIcon} alt="Instagram"  className="social-icon"/>
                        </a>
                    </Col>
                    <Col xs="auto">
                        <a href="https://www.facebook.com/LsacBucuresti" className='social-icon' target="_blank">
                            <img src={FacebookIcon} alt="Faceboook" className="social-icon"/>
                        </a>
                    </Col>
                    <Col xs="auto" >
                        <a href="https://www.twitch.tv/lsac_bucuresti" className='social-icon' target="_blank">
                            <img src={TwitchIcon} alt="Twitch"  className="social-icon"/>
                        </a>
                    </Col>
                </Row>
            </Container>
    )
}