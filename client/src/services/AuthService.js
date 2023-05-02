import React, { useContext, createContext, useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import hash from "./sha256";

const AuthContext = React.createContext();
export default AuthContext;

const User = {
	username: '',
	plan: -1,
	isFaculty: false,
	loggedIn: false,
};


function getContextState() {
	let singedIn = localStorage.getItem("user");
	return singedIn ? JSON.parse(singedIn) : User;
}

export function ProvideAuth({ children }) {
	const auth = useUserAuth();
	return (
		<AuthContext.Provider value={auth}>
			{children}
		</AuthContext.Provider>
	);
}

export function AuthRequiredStudent({ children, ...res }) {
	const { user } = useAuth();
	/*AuthService.isAuthenticated()
		.then(res => {
			console.log(res.error);
			if(res.error.status != 200){
				user.loggedIn = false;
				localStorage.removeItem("user");
			}
		})*/
	return (user.loggedIn ? <Outlet /> : <Navigate to="/login" />);
}

export function AuthRequiredFaculty({children, ...res}) {
	const {user} = useAuth();
	return (user.loggedIn && user.is_faculty === 1? <Outlet /> : <Navigate to ="/login"/>);
}

export function useAuth() {
	return useContext(AuthContext);
}


function useUserAuth() {
	const [user, setUser] = useState(getContextState());

	const signin = (uname, pass) => {
		return AuthService.login(uname, pass)
			.then((res) => {
				if (res.username === uname){
					setUser(res);
					localStorage.setItem("user", JSON.stringify(res));
				}
				return res;
			});
	};

	const signout = () => {
		return AuthService.logout()
			.then(() => {
				setUser(User)
				localStorage.removeItem("user");	
			});
	};

	return {
		user,
		signin,
		signout
	};
};

export function Authenticate(e) {
	e.preventDefault();
	let { signin } = useAuth();
	signin(e.target.uname.value, e.target.pass.value);
};

const AuthService = {
	isAuthenticated: async () => {

		const cfg = {
			method: 'GET',
			credentials: "include",
			redirect: 'follow',
			headers: { 'content-type': 'application/json' },
		}
		return await fetch("http://localhost:3001/api/user", cfg)
			.then(res => {
				return res.json();
			});
	},

	async login(uname, pass) {
		pass = await hash(pass);
		const cfg = {
			method: 'POST',
			credentials: "include",
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ uname: uname, pass: pass }),
		}
		return fetch('http://localhost:3001/api/user/login', cfg)
			.then(res => res.json());
	},
	logout() {
		const logoutConfig = {
			method: 'POST',
			credentials: "include",
		}
		return fetch("http://localhost:3001/api/user/logout", logoutConfig);
	},

};

export const AuthSignout = async (e) => {
	e.preventDefault();
	let auth = useAuth();
	let nav = useNavigate();
	await auth.signout();
	nav('/login');
};

export const AuthSignin = async (e) => {
	e.preventDefault();
	let auth = useAuth();
	let nav = useNavigate();
	await auth.signin(e.target.uname.value, e.target.pass.value);
	nav('/', { state: { user: auth.user } });
};