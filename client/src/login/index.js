import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../services/AuthService';
import './index.css';


export function LoginPage() {
	const [state, setState] = useState("");
	let nav = useNavigate();
	let { signin } = useAuth();

	let login = (e) => {
		e.preventDefault();
		signin(e.target.uname.value, e.target.pass.value).then((res) => {
			if(res.username) {
				let path = res.is_faculty ? `/faculty/${res.username}` : `/student/${res.username}`;
				nav(path, {state: {user: res}});
			}
			else
				setState("Invalid username or password");

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
				<p className="loginerror" style={{color: 'red'}}>{state}</p>
			</form>
			
		</div>
	);
}

export default LoginPage;
