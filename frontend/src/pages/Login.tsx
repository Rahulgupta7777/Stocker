import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Wallet, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { authGoogle, loginEmail, loginGuest, registerEmail } from '@/services/api';
import { useState } from 'react';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            if (credentialResponse.credential) {
                await authGoogle(credentialResponse.credential);
                login(credentialResponse.credential);
                navigate('/');
            }
        } catch (error) {
            console.error('Login Failed', error);
            setError('Google Login Failed');
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            let response;
            if (isRegister) {
                response = await registerEmail({ email, password, name });
            } else {
                response = await loginEmail({ email, password });
            }
            login(response.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Authentication failed');
        }
    };

    const handleGuestLogin = async () => {
        try {
            const response = await loginGuest();
            login(response.token);
            navigate('/');
        } catch (err: any) {
            setError('Guest login failed');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Wallet className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
                <p className="text-muted-foreground mb-8">Sign in to your Stocker account</p>

                {error && <p className="text-destructive text-sm mb-4">{error}</p>}

                <form onSubmit={handleEmailSubmit} className="space-y-4 text-left">
                    {isRegister && (
                        <div>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                        {isRegister ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <div className="mt-4 text-sm">
                    <span className="text-muted-foreground">{isRegister ? 'Already have an account?' : "Don't have an account?"} </span>
                    <button onClick={() => setIsRegister(!isRegister)} className="text-primary font-semibold hover:underline">
                        {isRegister ? 'Log In' : 'Sign Up'}
                    </button>
                </div>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <div className="flex justify-center mb-4">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Login Failed')}
                        useOneTap
                        theme="filled_black"
                        shape="pill"
                    />
                </div>

                <button onClick={handleGuestLogin} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium">
                    Continue as Guest <ArrowRight className="w-4 h-4" />
                </button>

                <p className="mt-8 text-xs text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};
