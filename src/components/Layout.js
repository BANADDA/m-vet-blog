import { AccountBox, Add, Home, LogoutOutlined, PhotoAlbumOutlined } from '@mui/icons-material';
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../widgets/AuthModal';
import BlogPostModal from '../widgets/BlogPostModal';
import Account from './Account';
import BlogList from './BlogList';
import BlogView from './BlogView'; // New component for viewing a blog
import Gallery from './Gallery';

const drawerWidth = 240;

const Sidebar = ({ currentScreen, setCurrentScreen, navigate }) => {
    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // navigate('/');
        }).catch((error) => {
            console.error("Logout failed", error);
        });
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#034B05', color: '#FDFCFC' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto', padding: 2 }}>
            <Button
  variant="outlined"
  color="primary"
  fullWidth
  sx={{
    marginBottom: 2,
    color: '#ffffff', // Set the text color to white
    borderColor: '#ffffff', // Set the border color to white
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: Set a slightly visible background on hover
      borderColor: '#ffffff',
    },
  }}
>
  M-VET POSTS
</Button>
                <Divider sx={{ backgroundColor: '#ffffff' }} /> {/* Make the divider white */}
<List>
    {[
        { text: 'Blog Posts', icon: <Home sx={{ color: '#ffffff' }} />, component: 'BlogPosts' },
        { text: 'Gallery', icon: <PhotoAlbumOutlined sx={{ color: '#ffffff' }} />, component: 'Gallery' },
        { text: 'Account', icon: <AccountBox sx={{ color: '#ffffff' }} />, component: 'Account' },
        { text: 'Logout', icon: <LogoutOutlined sx={{ color: '#ffffff' }} />, action: handleLogout },
    ].map((item) => (
        <ListItem
            button
            key={item.text}
            selected={currentScreen === item.component}
            onClick={() => {
                if (item.action) {
                    item.action();
                } else {
                    setCurrentScreen(item.component);
                }
            }}
        >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: '#ffffff' }} /> {/* Optional: Make the text white */}
        </ListItem>
    ))}
</List>
            </Box>
        </Drawer>
    );
};

const Layout = () => {
    const [currentScreen, setCurrentScreen] = useState('BlogPosts');
    const [selectedBlog, setSelectedBlog] = useState(null); // State to store the selected blog
    const [isModalOpen, setModalOpen] = useState(false);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setAuthModalOpen(false); // Close the modal when user is logged in
            } else {
                setAuthModalOpen(true); // Open the modal if the user is not logged in
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, [auth]);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleViewBlog = (blog) => {
        setSelectedBlog(blog);
        setCurrentScreen('BlogView'); // Switch to the blog view screen
    };

    return (
        <>
            <AuthModal open={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
            <Box sx={{ display: 'flex', minHeight: '100vh' }} className='bg-slate-100'>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#034B05' }}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h5" noWrap component="div">
                                M-Vet Blogs
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box sx={{ display: 'flex', width: '100%' }}>
                    <Sidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} navigate={navigate} />
                    <Box component="main" sx={{ backgroundColor: '#F0F4F0', flexGrow: 1, p: 3, minHeight: '100vh', position: 'relative' }} className='bg-slate-100'>
                        <Toolbar />
                        {currentScreen === 'BlogPosts' && <BlogList onView={handleViewBlog} />} {/* Pass handleViewBlog */}
                        {currentScreen === 'Account' && <Account />}
                        {currentScreen === 'BlogView' && <BlogView blog={selectedBlog} />} {/* Render BlogView with selected blog */}
                        {currentScreen === 'Gallery' && <Gallery />} {/* Render Gallery when selected */}

                        {currentScreen === 'BlogPosts' && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Add sx={{ fontSize: '2rem' }} />}
                                sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    right: 16,
                                    marginBottom: 5,
                                    fontSize: '1.2rem',
                                    padding: '12px 24px',
                                    backgroundColor: !auth.currentUser ? '#cfcfcf' : 'primary.main',
                                    color: !auth.currentUser ? '#a9a9a9' : '#ffffff',
                                    '&:hover': {
                                        backgroundColor: !auth.currentUser ? '#cfcfcf' : 'primary.dark',
                                    },
                                }}
                                onClick={auth.currentUser ? handleModalOpen : null}
                                disabled={!auth.currentUser}
                            >
                                New Blog
                            </Button>
                        )}
                        <BlogPostModal open={isModalOpen} onClose={handleModalClose} />
                    </Box>
                </Box>
            </Box>
        </>
    );
};
export default Layout;
