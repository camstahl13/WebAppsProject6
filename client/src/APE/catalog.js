import React from 'react';
function Catalog(props) {

    let tbody = [];
    
    const [search, setSearch] = React.useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
        tbody.filter((item) => {
            for (let td of item.props.children) {
                if (td.props.children.toString().toLowerCase().includes(e.target.value.toLowerCase())) {
                    document.getElementsByClassName(item.props.class)[0].setAttribute("style","display: table-row");
                    return true;
                }
            }
            document.getElementsByClassName(item.props.class)[0].setAttribute("style","display: none");
        });
    }
    
    if (props.courses.catalog != null) {
        for (let [i, item] of props.courses.catalog.entries()) {
            tbody.push(<tr key={i} className={item.course_id}>
                <td>{item.course_id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.credits}</td>
            </tr>);
        }
    }
    else {
        tbody.push(<tr key={0}><td>{props.courses}</td><td>{props.courses}</td><td>{props.courses}</td><td>{props.courses}</td></tr>);
    }
    
    return(<>
        <label htmlFor="search">
            Search: 
            <input id="search" type="text" onChange={handleSearch} />
        </label>
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