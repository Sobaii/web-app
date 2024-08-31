import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser, signUpUserWithGoogle } from '../services/userServices';
import ColouredLongLogo from '../assets/logos/coloured-long-logo.svg';
import LandingAnimation from '../components/LandingAnimation';
import Separator from '../components/Separator';
import Button from '../components/Button';
import Input from '../components/Input';
import GoogleLogo from '../assets/logos/google-logo.svg';

function Login() {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        mode: 'onChange'  // Set validation mode to onBlur
    });

    const onLoginSubmit = async (data) => {
        try {
            const response = await loginUser(data.email, data.password);
            navigate('/expenses');
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    const handleLoginWithGoogle = async () => {
        try {
            const data = await signUpUserWithGoogle();
            window.location.href = data.url;
        } catch (error) {
            console.error('Login with Google failed:', error.message);
        }
    };

    return (
        <main className='grid grid-cols-2 h-screen'>
            <div className='w-full flex flex-col gap-5 h-fit m-auto border-4 max-w-md p-6 bg-white'>
                <img src={ColouredLongLogo} className='mb-5 h-7 w-fit' />
                <h1 className='text-3xl font-semibold'>Login to your account</h1>
                <p className='text-gray-600 text-sm -mt-2 mb-4'>Let's get started with your projects.</p>
                <form onSubmit={handleSubmit(onLoginSubmit)} className="flex flex-col gap-4">
                    <Input type='email' label='Email *' fullWidth={true}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Invalid email address'
                            }
                        })}
                        error={errors.email?.message}
                        placeHolder='Enter your email' />
                    <Input type='password' label='Password *' fullWidth={true}
                        {...register('password', {
                            required: 'Password is required',
                        })}
                        error={errors.password?.message}
                        placeHolder='Enter your password' />
                    <Separator />
                    <Button type='submit' text='Login' variant='primary' />
                    <Button type='button' variant='outline' text='Login with Google' handleClick={handleLoginWithGoogle} imageSrc={GoogleLogo} />
                </form>
                <div className='flex justify-center items-center'>
                    <div className='bg-gray-50 border p-2 pl-8 pr-8 rounded-lg flex'>
                        <p className='text-gray-600'>Don't have an account?</p>
                        <Link to='/signup' className='text-green-600 ml-1 hover:underline'>Sign up</Link>
                    </div>
                </div>
            </div>
            <LandingAnimation />
        </main>
    );
}

export default Login;
