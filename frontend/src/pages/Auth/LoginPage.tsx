import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
// import { useAuth } from '../../context/AuthContext';
// import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

import './style.css';

export interface LoginFormData {
  email: string;
  password: string;
  captchaToken: string | null;
  isActivated: boolean;
}

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  // const turnstileRef = useRef<TurnstileInstance>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaToken: null,
    isActivated: false,
  });

  // Общая функция для сброса виджета
  // const handleReset = () => {
  //   console.log('Сброс виджета Turnstile...')
  //   turnstileRef.current?.reset();
  // }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!formData.captchaToken) {
    //   setError('Пройдите верификацию Turnstile');
    //   return;
    // }

    setLoading(true);
    setError('');

    try {
      // await login(formData.email, formData.password, formData.captchaToken, formData.isActivated);
      await login(formData);

      if (user) {
        navigate('/');
      } else {
        navigate('/verify-your-email');
      }
    } catch (err) {
      const typedError = err as Error;
      setError(typedError.message || 'Login failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Sign in to your account</h1>

      {error && <div>{error}</div>}
      <form className="login-page-form" onSubmit={handleSubmit}>
        <div className="form-inputs-group">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* <Turnstile
          ref={turnstileRef}
          as="aside"
          siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          options={{
            action: 'submit-form',
            theme: 'auto',
            size: 'normal',
            language: 'auto',
            refreshExpired: 'auto', // Виджет сам обновится и получит новый токен
          }}
          scriptOptions={{
            appendTo: 'body',
          }}
          onSuccess={(token) => {
            setFormData((prev) => ({ ...prev, captchaToken: token }));
            setError('');
          }}
          // Сброс, если произошла ошибка сети или Cloudflare
          onError={() => {
            setFormData((prev) => ({ ...prev, captchaToken: null }));
            setError('Error Turnstile');
            handleReset();
          }}
          // Сброс, если токен протух (5 минут истекли)
          onExpire={() => {
            setFormData((prev) => ({ ...prev, captchaToken: null }));
            setError('Token is expired.');
            handleReset();
          }}
        /> */}

        {/* <button type="submit" disabled={!formData.captchaToken || loading}> */}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="links-group">
          <Link to="/reset-password">Forgot Password?</Link>
          <Link to="/register">Sign Up</Link>

          {/* <a href="/register">Create new account</a> */}
        </div>
      </form>
    </div>
  );
}
