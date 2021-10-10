import React, { useEffect, useState } from 'react';

import Alert from './Alert';
import Button from './Button';
import Input from './Input';
import URL from '../URL';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const PW_EMAIL_ENDPOINT = '/api/users/forgot_password/';
const NEW_PW_ENDPOINT = '/api/users/new_password/';

const ForgotPassword = () => {
	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(false);
	const [formState, setFormState] = useState({
		password1: '',
		password2: '',
	});
	const { password1, password2 } = formState;

	const handleFormChange = e => {
		const { name, value } = e.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const sendNewPassword = newPassword =>
		axios.post(URL + NEW_PW_ENDPOINT, newPassword);

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);
		try {
			if (password1 === password2) {
				const response = await sendNewPassword(password2);
				console.log('response:', response);
				if (response.statusText === 'OK') {
					history.push('/');
				}
			}
			if (password1 !== password2) {
				setErrorMsg('The passwords do not match.');
			}
		} catch (err) {
			setErrorMsg(err.message);
			console.error(err);
		}
		setLoading(false);
		setFormState({ password1: '', password2: '' });
	};

	return (
		<>
			<div>
				<form onSubmit={handleSubmit}>
					<label htmlFor='password1'>New Password:</label>
					<input
						name='password1'
						value={password1}
						onChange={handleFormChange}
						required
					/>
					<label htmlFor='password2'>Confirm Password:</label>
					<input
						name='password2'
						value={password2}
						onChange={handleFormChange}
						required
					/>
					<button type='submit' disabled={loading}>
						Submit
					</button>
				</form>
				{errorMsg && (
					<Alert onClose={setErrorMsg}>
						<p>{errorMsg}</p>
						<small>Tap to dismiss.</small>
					</Alert>
				)}
			</div>
		</>
	);
};

export default ForgotPassword;
