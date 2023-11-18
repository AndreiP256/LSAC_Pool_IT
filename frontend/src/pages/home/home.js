import bg_image from "../../assets/backgrounds/it_bg-01.png"
import './home.css'
import Pool from "../../components/poll/poll"
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Turtle from '../../assets/images/testoasa.png'

const poolProps = {
    received_title: "Sample Title",
    is_multiple: "checkbox",
    choices: ["Option 1", "Option 2", "Option 3"],
    id: 1,
  };

export default function Home() {
    return (
        <div className="main-page">
            <div className="header">
                <p className="header-comp par">Opiniile sunt mai importante ca niciodată. Platformele de sondaje permit organizatorilor să culeagă feedback direct de la audiența lor și să înțeleagă mai bine nevoile și dorințele acesteia.</p>
                <img src={Turtle} className="header-comp"/>
            </div>
            <div className="poll-container">
                <Pool {...poolProps}/>
                <Pool {...poolProps}/>
                <Pool {...poolProps}/>
                <Pool {...poolProps}/>
            </div>
        </div>
    )
}