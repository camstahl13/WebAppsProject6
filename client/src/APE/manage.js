function ManagePlan(props) {
    const click = (e) => {
        e.preventDefault();
        let body = document.getElementsByTagName("body")[0];
        
        let div = document.createElement('div');
        div.className = "modal modalShown";
        div.id = "manageplanui";
        div.appendChild(document.createElement('div'));
        div.firstChild.className = "modalBody";
        div.firstChild.id = "managePlanBody";

        let plans = document.createElement('div');
        plans.id="plans";
        
        let table = document.createElement('table');
        let tbody = document.createElement('tbody');
        let toptr = document.createElement('tr');
        toptr.innerHTML="<th>Plan</th><th>Major</th><th>Minor</th><th>Catalog</th><th>Default</th>"
        tbody.appendChild(toptr);
        
        if (props.plans) {
            for (let p of props.plans.message) {
                let tr = document.createElement('tr');
                tr.id = p.plan_id;
                tr.onclick = () => {
                    props.setPlanId(tr.id);
                    body.removeChild(div);
                }
                tr.className="planitem";
                tr.innerHTML=`<td>${p.planname}</td><td>${p.majors}</td><td>${p.minors}</td><td>${p.catalog_year}</td><td>${p.default}</td>`;
                tbody.appendChild(tr);
            }
        }
        
        table.appendChild(tbody);
        plans.appendChild(table);

        let cancel = document.createElement('p');
        cancel.className = "modalButtons";
        let cancelbutton = document.createElement('input');
        cancelbutton.className = "modalButton";
        cancelbutton.type = "button";
        cancelbutton.id = "cancelManagePlan";
        cancelbutton.value = "Cancel";
        cancelbutton.onclick = () => {body.removeChild(div);}
        cancel.appendChild(cancelbutton);

        div.firstChild.appendChild(plans);
        div.firstChild.appendChild(cancel);
        body.prepend(div);
    }
    return (
        <p id="manage" onClick={click}>Manage Plan</p>
    );
}
export default ManagePlan;