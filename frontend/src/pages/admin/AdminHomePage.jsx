import React,{useState} from 'react'
import Button from "../../components/Button"
import MessageCard from "../../components/MessageCard"
import ErrorCard from '../../components/ErrorCard'
import { ReactComponent as Dldb } from '../../assets/svg/dldb.svg';
import axios from 'axios'

const AdminHomePage = ({ setLocation }) => {

    const [showCard, setShowCard] = useState(false)
    const [error_msg, setError_msg] = useState("")
    const [hasError, setHasError] = useState(false)



    const handleBC = async () => 
    {
        setShowCard(true);
        const access_token = sessionStorage.getItem("access_token");
        var res = await axios.post("/dldb", { access_token });
        if (res.data.status === "ERR") {
            setError_msg(res.data.msg)
            setHasError(true)
            setShowCard(false)
            return
        }
        const downloadUrl = window.location.protocol + "//" + window.location.host + res.data.split(">")[1]; 
        console.log(downloadUrl)
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "db.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowCard(false);
    }

    return (
        <>
            <Button onClick={handleBC} className="outlined" >
                <Dldb />
                Backup database
            </Button>
 
            <MessageCard
                title="fetching databases"
                duration={JSON.parse(sessionStorage.getItem("panels")).length}
                showCard={showCard}
                onClose={() => setShowCard(false)}
            />

            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />
        </>

    )
}

export default AdminHomePage