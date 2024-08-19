import { Close } from '@mui/icons-material';
import { Avatar, Box, Grid, IconButton, Modal, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import React from 'react';

const BlogViewModal = ({ open, onClose, blog }) => {
    // Convert the Firestore timestamp to a JavaScript Date object
    const date = blog.createdAt instanceof Date ? blog.createdAt : blog.createdAt.toDate();

    // Get the currently logged-in user from Firebase Auth
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Default to the blog's user data, but fall back to the current user if needed
    const userName = blog.userName || currentUser?.displayName || 'Anonymous';
    const userImageUrl = blog.userImageUrl || currentUser?.photoURL || 'default-avatar.png'; // Fallback to a default avatar if not available

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="view-blog-title"
            aria-describedby="view-blog-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    overflowY: 'auto',
                    p: 4,
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'red',  // Set the color to red
                            fontSize: '2rem' // Increase the size of the icon
                        }}
                    >
                        <Close sx={{ fontSize: '2.5rem' }} />
                    </IconButton>
                    {blog.captionImageUrl && (
                        <img
                            src={blog.captionImageUrl}
                            alt={blog.title} // Descriptive alt text
                            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    )}
                </Box>

                <Typography id="view-blog-title" variant="h4" sx={{ mt: 3, fontWeight: 'bold' }}>
                    {blog.title}
                </Typography>

                <Grid container alignItems="center" sx={{ mt: 2 }}>
                    <Grid item>
                        <Avatar src={userImageUrl} alt={userName} sx={{ width: 56, height: 56, mr: 2 }} />
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">{userName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {date.toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                second: 'numeric'
                            })}
                        </Typography>
                    </Grid>
                </Grid>

                <Typography id="view-blog-description" variant="body1" sx={{ mt: 3 }}>
                    {blog.caption}
                </Typography>

                {/* Render Gallery Images and Project Details */}
                {blog.galleryImages && blog.galleryImages.length > 0 && blog.galleryImages.map((imageUrl, index) => (
    <Box key={index} sx={{ mt: 4 }}>
        <img
            src={imageUrl}
            alt={`Gallery Image ${index + 1}`}
            style={{ width: '15%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
        />
        {blog.galleryCaptions && blog.galleryCaptions[index] && (
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                {blog.galleryCaptions[index]}
            </Typography>
        )}
        {blog.projectDetails && blog.projectDetails[index] && (
            <Typography variant="body2" sx={{ mt: 2 }}>
                {blog.projectDetails[index]}
            </Typography>
        )}
    </Box>
))}
            </Box>
        </Modal>
    );
};

export default BlogViewModal;
