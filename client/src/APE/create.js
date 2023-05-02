function CreatePlan(props) {   
   
    const click = (e) => {
        e.preventDefault();
        let body = document.getElementsByTagName("body")[0];

        let div = document.createElement('div');
        div.className = "modal modalShown";
        div.id = "createplanui";
        div.appendChild(document.createElement('div'));
        div.firstChild.className = "modalBody";
        div.firstChild.id = "createPlanBody";

        let form = document.createElement('form');
        form.id="createplan";
        form.method = "post";
        form.action = `http://localhost:3001/api/createplan/${props.plan_id}`;

        let planname = document.createElement('input');
        planname.className = "modalInput";
        planname.type = "text";
        planname.name = "name";
        
        let planlabel = document.createElement('label');
        planlabel.for = "label";
        planlabel.innerText = "Plan Name: ";
        planlabel.appendChild(planname);

        let p = document.createElement('p');
        p.appendChild(planlabel);
        form.appendChild(p);

        let strings = [["major", "Major: ","createMajor",props.majors],["minor", "Minor: ","createMinor",props.minors],["catayear", "Catalog Year: ","catayear",props.years]]
        for (let s of strings) {
            let p = document.createElement('p');
            
            let select = document.createElement('select');
            select.className = "modalInput";
            select.name = s[2];
            select.id = s[2];
            
            if (Object.keys(s[3]).length > 0) {
                for (let dt of s[3].message) {
                    let option = document.createElement('option');
                    option.value = dt.major_id != null ? dt.major : dt.minor_id != null? dt.minor : dt.catalog_year;
                    option.text = option.value;
                    select.appendChild(option);
                }
            }

            let label = document.createElement('label');
            label.for = s[0];
            label.innerText = s[1];

            label.appendChild(select);
            p.appendChild(label);
            form.appendChild(p);
        }

        let buttons = document.createElement('p');
        buttons.className = "modalButtons";
        let createplanbutton = document.createElement('input');
        let cancelbutton = document.createElement('input');
        createplanbutton.className = "modalButton";
        createplanbutton.type = "submit";
        createplanbutton.id = "submitCreatePlan";
        createplanbutton.value = "Create Plan";
        cancelbutton.className = "modalButton";
        cancelbutton.type = "button";
        cancelbutton.id = "cancelCreatePlan";
        cancelbutton.value = "Cancel";
        cancelbutton.onclick = (e) => {body.removeChild(div);}
        buttons.appendChild(createplanbutton);
        buttons.appendChild(cancelbutton);

        form.appendChild(buttons);

        div.firstChild.appendChild(form);

        body.prepend(div);
    }

    return (
        <p id="create" onClick={click}>Create Plan</p>
    );
}
export default CreatePlan;