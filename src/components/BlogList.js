import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import AuthModal from '../widgets/AuthModal';
import BlogCard from '../widgets/BlogCard';

const BlogList = ({ onView }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false); // State for managing the AuthModal
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthModalOpen(false); // Close the modal when user is logged in
                const q = query(collection(db, "blogs"), where("userId", "==", user.uid));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const blogsArray = [];
                    querySnapshot.forEach((doc) => {
                        blogsArray.push({ id: doc.id, ...doc.data() });
                    });
                    setBlogs(blogsArray);
                    setLoading(false); // Set loading to false after fetching data
                });
    
                return () => unsubscribe();
            } else {
                setAuthModalOpen(true); // Open the modal if the user is not logged in
                setLoading(false); // Set loading to false if the user is not authenticated
            }
        });
    
        return () => unsubscribeAuth();
    }, [auth]);
    
    const handleDeleteClick = (blog) => {
        setSelectedBlog(blog);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedBlog) {
            try {
                await deleteDoc(doc(db, "blogs", selectedBlog.id));
                alert("Blog post deleted successfully!");
            } catch (error) {
                console.error("Error deleting blog post: ", error);
                alert("Failed to delete blog post. Please try again.");
            } finally {
                setDeleteDialogOpen(false);
                setSelectedBlog(null);
            }
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedBlog(null);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    if (blogs.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <ErrorOutlineIcon sx={{ color: 'red', fontSize: '4rem' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    No Blogs Found
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <AuthModal open={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} /> {/* Auth Modal */}
            
            <Grid container spacing={3}>
                {blogs.map((blog) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={blog.id}>
                        <BlogCard
                            imageUrl={blog.captionImageUrl}
                            title={blog.title}
                            createdAt={blog.createdAt}
                            caption={blog.caption}
                            onView={() => onView(blog)}
                            onDelete={() => handleDeleteClick(blog)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={isDeleteDialogOpen}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Delete Blog Post</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the blog post titled "{selectedBlog?.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BlogList;
