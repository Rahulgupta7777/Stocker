import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { authGoogle } from '@/services/api';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse: any) => {
        try {
            if (credentialResponse.credential) {
                // Send to backend to verify and get user data/session if needed
                // For now, we trust the token for client-side state
                // In a real app: const { token, user } = await authGoogle(credentialResponse.credential);
                // login(token);

                // Using client-side decoding for immediate UI update (Backend verification should happen in background or on API calls)
                await authGoogle(credentialResponse.credential); // Verify with backend
                login(credentialResponse.credential);
                navigate('/');
            }
        } catch (error) {
            console.error('Login Failed', error);
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
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-muted-foreground mb-8">Sign in to your Stocker account</p>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        useOneTap
                        theme="filled_black"
                        shape="pill"
                    />
                </div>

                <p className="mt-8 text-xs text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};
