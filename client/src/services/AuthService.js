import React, { useContext, createContext, useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const authContext = createContext();

function getContextState() {
	let state = localStorage.getItem("auth");
	return state;
}

export function useAuth() {
	return useContext(authContext);
};


export function PrivateRoute({ children, ...rest }) {
	let auth = useAuth();
	console.log(auth);
	return auth.user ? <Outlet /> : <Navigate to="/login" />;
}

export function ProvideAuth({ children }) {
	const auth = useUserAuth();
	return (
		<authContext.Provider value={auth}>
			{children}
		</authContext.Provider>
	);
}

function useUserAuth() {
	const [user, setUser] = useState(getContextState);

	useEffect(() => {
		if (user === null)
			localStorage.removeItem("auth");
		else
			localStorage.setItem("auth", user);
	}, [user]);

	const signin = async (uname, pass) => {
		return await AuthService.login(uname, pass)
			.then((res) => {
				if (res.loggedIn)
					setUser(res.Username);
				return res.status;
			});
	};

	const signout = () => {
		return AuthService.logout()
			.then(() => setUser(null));
	};

	return {
		user,
		signin,
		signout
	};
};

export function Authenticate(e) {
	e.preventDefault();
	let auth = useAuth();
	auth.signin(e.target.uname.value, e.target.pass.value);
};

const AuthService = {
	isAuthenticated: () => {
		return User.loggedIn;
	},
	async login(uname, pass) {
		const loginData = {
			method: 'POST',
			credentials: "include",
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ uname: uname, pass: pass }),
		}
		let response = {};
		await fetch("http://localhost:3001/api/user/login", loginData)
			.then(res => {
				response.status = res.status;
				return res.json();
			})
			.then(data => {
				console.log(data.message);
				response.username = data.username

			});

		if (response.status === 200) {
			User.loggedIn = true;
			User.Username = response.username;
		}
		else
			User.loggedIn = false;

		console.log(User);

		return new Promise((resolve, reject) => {
			return resolve(User);
		});
	},
	logout() {

		const logoutConfig = {
			method: 'POST',
			credentials: "include",
		}
		fetch("http://localhost:3001/api/user/logout", logoutConfig);

		//User = {};
		User.loggedIn = false;

		return new Promise((resolve, reject) => {
			return resolve("Logged out");
		});
	},

};

const User = {
	Username: '',
	logined: false,
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