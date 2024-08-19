import { Avatar, Box, Grid, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import React from 'react';

const BlogView = ({ blog }) => {
    const date = blog.createdAt instanceof Date ? blog.createdAt : blog.createdAt.toDate();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userName = blog.userName || currentUser?.displayName || 'Anonymous';
    const userImageUrl = blog.userImageUrl || currentUser?.photoURL || 'default-avatar.png'; // Fallback to a default avatar if not available


    return (
        <Box sx={{ p: 4 }}>
            {blog.captionImageUrl && (
                <img
                    src={blog.captionImageUrl}
                    alt={blog.title}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
                />
            )}

            <Typography variant="h4" sx={{ mt: 3, fontWeight: 'bold' }}>
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

            <Typography variant="body1" sx={{ mt: 3 }}>
                {blog.caption}
            </Typography>
            {blog.galleryImages && blog.galleryImages.length > 0 && blog.galleryImages.map((imageUrl, index) => (
    <Box key={index} sx={{ mt: 4, textAlign: 'center' }}>
        <img
            src={imageUrl}
            alt={`Gallery Image ${index + 1}`}
            style={{ width: '50%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', display: 'block', margin: '0 auto' }}
        />
        {blog.galleryCaptions && blog.galleryCaptions[index] && (
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
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
    );
};

export default BlogView;
