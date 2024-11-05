import { useState } from 'react';
import axios from 'axios';

export default function Accounts() {
  const [info, setAccountInfo] = useState({
    username: '',
    password: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault(); // prevents page from reloading after form submission
    try {
      await axios.post('endpoint', info, { headers: { 'Content-Type': 'application/json' } });
      console.log('Successful creation of account');
      setAccountInfo({ username: '', password: '', email: '' });
    } catch {
      console.log('Error when creating account');
    }
    console.log("Account created with:", info);
  };

  return (
    <form onSubmit={handleCreateAccount}>
      <input
        type="text"
        name="username"
        value={info.username}
        onChange={handleInputChange}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        value={info.password}
        onChange={handleInputChange}
        placeholder="Password"
      />
      <input
        type="email"
        name="email"
        value={info.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <button type="submit">Create Account</button>
    </form>
  );
}
