import '../login/index.css';
import {useParams} from "react-router-dom";

export function FacultyPage() {
    let { name } = useParams();
    return (<><p>{name}</p></>);
}
export default FacultyPage;