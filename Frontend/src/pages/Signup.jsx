import React from 'react'
import API from '../Api';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            console.log('Attempting signup with:', form);
            const response = await API.post('/signup',form);
            console.log('Signup response:', response.data);
            alert(response.data.message);
            navigate('/verify-otp',{state:{email:form.email}})
        }catch(err){
            console.error('Signup error:', err);
            console.error('Error response:', err.response);
            alert(err.response?.data?.message || err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    }
    
  return (
    <div className="auth-container">
        <div className="auth-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name='name' placeholder='Username' onChange={handleChange} required/>
                <input type="email" name='email' placeholder='Email' onChange={handleChange} required/>
                <input type="password" name='password' placeholder='Password' onChange={handleChange} required/>
                <button type='submit' disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Sign Up'}
                </button>
            </form>
            <p>Already have an account? <a href="/login">Login here</a></p>
            <p><a href="/">← Back to Home</a></p>
        </div>
    </div>
  )
}

export default Signup