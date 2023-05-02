import { useNavigate , useLocation } from 'react-router-dom';
import AuthConsumer from '../services/AuthService';
import './index.css';


export function RegisterPage() {
	let nav = useNavigate();
	let {signin} = AuthConsumer();

	let login = (e) => {
		e.preventDefault();
		signin(e.target.uname.value, e.target.pass.value).then((res) => {
			console.log("Rederect Here")

			fetch("http://localhost:3001/api/heading", { method: 'GET', credentials: 'include', })
			.then(res => res.json());
			nav('/', {state: {user: "res"}});
		});
	}

	let inputVisuals = (e) => {
		if (e.target.value.length) {
			e.target.classList.add("filled");
		} else {
			e.target.classList.remove("filled");
		}
	}

	return (
		<div id="main">
			<form onSubmit={(e) => login(e)} id="loginsubmit" >
				<ul className="login-cred">
					<li>
						<label htmlFor="uname">
							<input type="text" name="uname" onBlur={(e) => inputVisuals(e)}></input>
							<span>Username</span>
						</label>
					</li>
					<li>
						<label htmlFor="pass">
							<input type="password" name="pass" onBlur={(e) => inputVisuals(e)}></input>
							<span>Password</span>
						</label>
					</li>
				</ul>
				<section>
					<button className="btn login-btn" type="submit" id="sub">Sign In</button>
					<a className="btn register-btn" href="register.php">Register</a>
				</section>
			</form>
        </div>
	);
}

export default RegisterPage;
