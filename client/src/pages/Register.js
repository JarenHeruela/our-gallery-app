import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle System Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Google registration
  const handleGoogleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Facebook registration
  const handleFacebookRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
  <>
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-6 col-lg-4'>
          <div className="card p-4 my-5">
            <h2 className='text-center my-4'> User Register</h2>
            <form onSubmit={handleSubmit}>
              {/* USERNAME */}
              <div className="form-group mb-3">
                <label htmlFor="username">Username</label>
                <input 
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="form-group mb-3">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="email@sample" 
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="form-group mb-3">
                <label htmlFor="password">Password</label>
                <input 
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-center mb-3 d-grid gap-2">
                <button type="submit" className='btn btn-primary mb-2'>Register</button>
              </div>
            </form>
            <div className="text-center mb-3">or</div>
              <div className="d-grid gap-2">
                  <button 
                    onClick={handleGoogleRegister} 
                    className="btn btn-outline-danger mb-2">
                      Register with Google
                  </button>
                  <button 
                     onClick={handleFacebookRegister} 
                    className="btn btn-outline-primary">
                      Register with Facebook
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Register;
