// src/pages/Login.js

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from './useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../schemas/loginSchema';
import { Input, Button, Separator, Card } from '../../components/ui';
import LandingAnimation from '../../components/LandingAnimation';
import { GoogleLogo, ColouredLongLogo } from '../../assets/logos';

function Login() {
    const { onLoginSubmit, handleSignupWithGoogle, error } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data) => {
        await onLoginSubmit(data);
    };

    return (
        <main className="grid grid-cols-1 md:grid-cols-2 h-screen">
            <Card className="m-auto max-w-[500px]">
                <img src={ColouredLongLogo} className="mb-5 h-7 w-fit" alt="Logo" />
                <h1 className="text-3xl font-semibold">Login to your account</h1>
                <p className="text-gray-600 text-sm -mt-2 mb-4">
                    Let's get started with your projects.
                </p>
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                    <Input
                        type="email"
                        label="Email *"
                        {...register('email')}
                        error={errors.email?.message}
                        placeHolder="Enter your email"
                    />
                    <Input
                        type="password"
                        label="Password *"
                        {...register('password')}
                        error={errors.password?.message}
                        placeHolder="Enter your password"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Separator />
                    <Button
                        type="button"
                        text="Login"
                        variant="primary"
                        handleClick={handleSubmit(onSubmit)}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        text="Login with Google"
                        handleClick={handleSignupWithGoogle}
                        imageSrc={GoogleLogo}
                    />
                </form>
                <div className="flex justify-center items-center mt-4">
                    <div className="bg-gray-50 border p-2 pl-8 pr-8 rounded-lg flex">
                        <p className="text-gray-600">Don't have an account?</p>
                        <Link to="/signup" className="text-green-600 ml-1 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </Card>
            <LandingAnimation />
        </main>
    );
}

export default Login;
