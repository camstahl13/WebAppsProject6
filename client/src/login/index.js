import { useNavigate , useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthService';
import './index.css';


export function LoginPage() {
	let nav = useNavigate();
	let auth = useAuth();

	let inputVisuals = (e) => {
		if (e.target.value.length) {
			e.target.classList.add("filled");
		} else {
			e.target.classList.remove("filled");
		}
	}

	let login = async (e) => {
		e.preventDefault();
		await auth.signin(e.target.uname.value, e.target.pass.value);
		nav('/', {state: {user: auth.user}});
	}

	return (
		<div id="main">
			<form id="loginsubmit" onSubmit={(e) => login(e)}>
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
			<br />
			<form onSubmit={(e) => this.getPlan(e)}>
				<button className="btn login-btn" type="submit" id="getPlan">Get Plan</button>
			</form>

		</div>
	);
}

export default LoginPage;
