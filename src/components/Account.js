// src/components/Account.js

import { Box, Button, TextField, Typography } from '@mui/material';
import { getAuth, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';

const Account = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.displayName || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleUpdate = async () => {
        try {
            await updateProfile(auth.currentUser, {
                displayName: name
            });
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile: ' + error.message);
        }
    };

    return (
        <Box sx={{ maxWidth: 500, m: 'auto' }}>
            <Typography variant="h6">Account Settings</Typography>
            <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                disabled
            />
            <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update Profile
            </Button>
        </Box>
    );
};

export default Account;
