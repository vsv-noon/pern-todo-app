import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
// import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';

import './style.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // if (user) {
  //   return <Navigate to="/" replace />;
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError('Пройдите верификацию Turnstile');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(email, password, captchaToken);
      navigate('/');
    } catch (err) {
      const typedError = err as Error;
      setError(typedError.message || 'Register failed');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="register-page">
      <div>
        <h2>Create new account</h2>
      </div>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-inputs-group">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Turnstile
          as="aside"
          siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          options={{
            action: 'submit-form',
            theme: 'auto',
            size: 'normal',
            language: 'auto',
          }}
          scriptOptions={{
            appendTo: 'body',
          }}
          onSuccess={(token) => setCaptchaToken(token)}
          onError={() => {
            setCaptchaToken(null);
            setError('Error Turnstile');
          }}
          onExpire={() => {
            setCaptchaToken(null);
            setError('Token is expired.');
          }}
        />

        <button type="submit" disabled={!captchaToken || loading}>
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        <div>
          <a href="/login">Sign in to your account</a>
        </div>
      </form>
    </div>
  );
}
