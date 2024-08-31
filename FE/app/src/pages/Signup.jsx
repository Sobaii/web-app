import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signUpUser, signUpUserWithGoogle } from '../services/userServices';
import ColouredLongLogo from '../assets/logos/coloured-long-logo.svg';
import LandingAnimation from '../components/LandingAnimation';
import Separator from '../components/Separator';
import Button from '../components/Button';
import Input from '../components/Input';
import GoogleLogo from '../assets/logos/google-logo.svg';

function Signup() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        mode: 'onChange'  // Set validation mode to onBlur
    });

    const onSignupSubmit = async (data) => {
        try {
            const response = await signUpUser(data.email, data.password);
            navigate('/expenses');
        } catch (error) {
            console.error('Sign up failed:', error.message);
        }
    };

    const handleSignupWithGoogle = async () => {
        try {
            const data = await signUpUserWithGoogle();
            window.location.href = data.url;
        } catch (error) {
            console.error('Sign up with Google failed:', error.message);
        }
    };

    return (
        <main className='grid grid-cols-2 h-screen'>
            <div className='w-full flex flex-col gap-5 h-fit m-auto border-4 max-w-md p-6 bg-white'>
                <img src={ColouredLongLogo} className='mb-5 h-7 w-fit' />
                <h1 className='text-3xl font-semibold'>Create an account</h1>
                <p className='text-gray-600 text-sm -mt-2 mb-4'>Let's get started with your projects.</p>
                <form onSubmit={handleSubmit(onSignupSubmit)} className="flex flex-col gap-4">
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
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                                message: 'Password must contain 8 characters, 1 uppercase letter, 1 number, and 1 special character'
                            }
                        })}
                        error={errors.password?.message}
                        placeHolder='Enter your password' />
                    <Separator />
                    <Button type='submit' text='Sign up' variant='primary' />
                    <Button type='button' variant='outline' text='Sign up with Google' handleClick={handleSignupWithGoogle} imageSrc={GoogleLogo} />
                </form>
                <div className='flex justify-center items-center'>
                    <div className='bg-gray-50 border p-2 pl-8 pr-8 rounded-lg flex'>
                        <p className='text-gray-600'>Don't have an account?</p>
                        <Link to='/' className='text-green-600 ml-1 hover:underline'>Login</Link>
                    </div>
                </div>
            </div>
            <LandingAnimation />
        </main>
    );
}

export default Signup;
