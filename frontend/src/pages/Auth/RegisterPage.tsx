import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
// import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';

import './style.css';

export interface RegisterFormData {
  email: string;
  password: string;
  captchaToken: string | null;
  isActivated: boolean;
}

export default function RegisterPage() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // if (user) {
  //   return <Navigate to="/" replace />;
  // }

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    captchaToken: null,
    isActivated: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.captchaToken) {
      setError('Пройдите верификацию Turnstile');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(
        formData.email,
        formData.password,
        formData.captchaToken,
        formData.isActivated,
      );
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
          onSuccess={(token) => setFormData((prev) => ({ ...prev, captchaToken: token }))}
          onError={() => {
            setFormData((prev) => ({ ...prev, captchaToken: null }));
            setError('Error Turnstile');
          }}
          onExpire={() => {
            setFormData((prev) => ({ ...prev, captchaToken: null }));
            setError('Token is expired.');
          }}
        />

        <button type="submit" disabled={!formData.captchaToken || loading}>
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        <div>
          <a href="/login">Sign in to your account</a>
        </div>
      </form>
    </div>
  );
}
