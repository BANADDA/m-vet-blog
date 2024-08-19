import { Close, Facebook, Google } from '@mui/icons-material';
import { Box, Button, Divider, IconButton, Modal, TextField, Typography } from '@mui/material';
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ open, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.currentUser) {
            onClose(); // Close the modal if the user is already signed in
        }
    }, [auth.currentUser, onClose]);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/'); // Redirect after successful login
        } catch (error) {
            console.error('Google login error', error);
        }
    };

    const handleFacebookLogin = async () => {
        const provider = new FacebookAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/'); // Redirect after successful login
        } catch (error) {
            console.error('Facebook login error', error);
        }
    };

    const handleEmailLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect after successful login
        } catch (error) {
            console.error('Email login error', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Log in</Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Facebook />}
                    sx={{ mt: 2, bgcolor: '#3b5998', '&:hover': { bgcolor: '#365492' } }}
                    onClick={handleFacebookLogin}
                >
                    Log in with Facebook
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Google />}
                    sx={{ mt: 2, bgcolor: '#db4437', '&:hover': { bgcolor: '#c33d30' } }}
                    onClick={handleGoogleLogin}
                >
                    Log in with Google
                </Button>

                <Divider sx={{ my: 2 }}>or</Divider>

                <TextField
                    label="Type email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Type password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Close />} // You can use a different icon here if needed
                    onClick={handleEmailLogin}
                >
                    Log in with email
                </Button>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => navigate('/forgot-password')}>Forgot password?</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AuthModal;
