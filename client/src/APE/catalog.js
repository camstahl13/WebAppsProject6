import { listenerCount } from 'jsdom/lib/jsdom/virtual-console';
import React from 'react';
function Catalog(props) {
    
    const [search, setSearch] = React.useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const data = {
        //nodes: list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
        //I'm trying to implement search/filter
    };

    let tbody = [];
    
    if (props.courses.catalog != null) {
        for (let item of props.courses.catalog) {
            tbody.push(<tr>
                <td>{item.course_id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.credits}</td>
            </tr>);
        }
    }
    else {
        tbody.push(<tr><td>{props.courses}</td><td>{props.courses}</td><td>{props.courses}</td><td>{props.courses}</td></tr>);
    }
    
    return(<>
        <table id="coursefinder">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Credits</th>
                </tr>
            </thead>
            <tbody>
                {tbody}
            </tbody>
        </table>
    </>);
}
export default Catalog;