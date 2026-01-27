import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
// import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // if (user) {
  //   return <Navigate to="/" replace />;
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Register failed');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div>
        <h2>Create new account</h2>
      </div>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        <div>
          <a href="/login">Sign in to your account</a>
        </div>
      </form>
    </div>
  );
}
