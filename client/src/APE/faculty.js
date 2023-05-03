import '../login/index.css';
import {useParams} from "react-router-dom";
import { useState, useEffect } from "react";

export function FacultyPage() {
    let { name } = useParams();

    let [students, setStudents] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/api/students`,
            { method: 'GET', credentials: "include" })
            .then(res => res.json())
            .then(res => setStudents(res));
    }, []);

    return (
        <div className="faculty-student-list">
            <h1>Hello {name}!</h1>
            <ul>
                {students.map((student) => {
                    return <li><a href={`/student/${student.username}`}>{student.first_name} {student.last_name}</a></li>;
                })}
            </ul>
        </div>
    );
}
export default FacultyPage;