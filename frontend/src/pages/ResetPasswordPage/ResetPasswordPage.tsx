import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../api/auth.api';

import './style.css';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('The passwords you entered do not match.');
      return;
    }

    try {
      if (!token) return;
      await resetPassword(token, formData.password);
      navigate('/login');
    } catch (err) {
      const typedError = err as Error;
      setError(typedError.message || 'Error change password');
      console.error('Error send new password', typedError);
    }
  };

  return (
    <div className="reset-password">
      <h1>Enter new password</h1>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <div className="form-inputs-group">
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="new password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="button"
            title="Show Password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '🙈'}
          </button>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
