import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../api/auth.api';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!token) return;
      await resetPassword(token, password);
      navigate('/login');
    } catch (err) {
      const typedError = err as Error;
      console.error('Error send new password', typedError);
    }
  };
  return (
    <div>
      ResetPasswordPage
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="new password"
          value={password}
          onChange={handleChange}
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
