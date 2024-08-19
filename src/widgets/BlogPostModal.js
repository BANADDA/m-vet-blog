import { Add, Close, Delete } from '@mui/icons-material';
import {
    Box, Button,
    CircularProgress,
    Grid,
    IconButton, Modal, TextField, Typography
} from '@mui/material';
import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadBlogPost } from '../firebase-config';

const BlogPostModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [captionImage, setCaptionImage] = useState(null);
  const [captionImageFile, setCaptionImageFile] = useState(null); // Save the file for upload
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]); // Save the files for upload
  const [galleryCaptions, setGalleryCaptions] = useState(['']);
  const [projectDetails, setProjectDetails] = useState(['']);

  const resetForm = () => {
    setTitle('');
    setCaption('');
    setCaptionImage(null);
    setCaptionImageFile(null);
    setGalleryImages([]);
    setGalleryImageFiles([]);
    setGalleryCaptions(['']);
    setProjectDetails(['']);
  };

  const handleAddGalleryImage = () => {
    setGalleryImages([...galleryImages, null]);
    setGalleryImageFiles([...galleryImageFiles, null]);
    setGalleryCaptions([...galleryCaptions, '']);
  };

  const handleRemoveGalleryImage = (index) => {
    const newImages = [...galleryImages];
    const newFiles = [...galleryImageFiles];
    const newCaptions = [...galleryCaptions];
    newImages.splice(index, 1);
    newFiles.splice(index, 1);
    newCaptions.splice(index, 1);
    setGalleryImages(newImages);
    setGalleryImageFiles(newFiles);
    setGalleryCaptions(newCaptions);
  };

  const handleAddProjectDetail = () => {
    setProjectDetails([...projectDetails, '']);
  };

  const handleRemoveProjectDetail = (index) => {
    const newDetails = [...projectDetails];
    newDetails.splice(index, 1);
    setProjectDetails(newDetails);
  };

  const handleSubmit = async () => {
    // Form validation
    if (!title || !caption || !captionImageFile) {
      toast.error("Please fill out the title, caption, and upload a caption image.");
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth(); // Get the auth instance
      const userId = auth.currentUser.uid;

      // Upload the blog post to Firestore with image file uploads
      const docId = await uploadBlogPost(
        userId, title, caption, captionImageFile, galleryImageFiles, galleryCaptions, projectDetails
      );

      toast.success("Blog post saved successfully!");
      console.log("Blog post ID:", docId);
      resetForm(); // Clear the form after successful submission
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error uploading blog post:", error);
      toast.error("Failed to save blog post.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm(); // Clear the form when closing the modal
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Create New Blog Post</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!title}
            helperText={!title ? 'Title is required' : ''}
          />

          <TextField
            label="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            required
            error={!caption}
            helperText={!caption ? 'Caption is required' : ''}
          />

          <Typography variant="body1" sx={{ mt: 2 }}>Caption Image</Typography>
          {!captionImage && (
            <Button variant="contained" component="label" sx={{ mt: 1 }} color={captionImage ? 'primary' : 'error'}>
              {captionImage ? 'Change Image' : 'Upload Image'}
              <input type="file" hidden onChange={(e) => {
                const file = e.target.files[0];
                setCaptionImage(URL.createObjectURL(file));
                setCaptionImageFile(file);
              }} />
            </Button>
          )}
          {!captionImage && <Typography variant="caption" color="error">Caption image is required</Typography>}
          {captionImage && (
            <Box sx={{ mt: 2 }}>
              <img src={captionImage} alt="Caption" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
            </Box>
          )}

          <Typography variant="body1" sx={{ mt: 4 }}>Gallery Images</Typography>
          {galleryImages.map((image, index) => (
            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }} key={index}>
              <Grid item xs={4}>
                {!galleryImages[index] && (
                  <Button variant="contained" component="label" fullWidth>
                    Upload Image
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        const newImages = [...galleryImages];
                        const newFiles = [...galleryImageFiles];
                        newImages[index] = URL.createObjectURL(file);
                        newFiles[index] = file;
                        setGalleryImages(newImages);
                        setGalleryImageFiles(newFiles);
                      }}
                    />
                  </Button>
                )}
              </Grid>
              <Grid item xs={6} sx={{alignContent: "left", alignItems: "start" }}>
                {galleryImages[index] && (
                  <>
                    <img src={galleryImages[index]} alt={`Gallery ${index + 1}`} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginTop: '8px' }} />
                    <TextField
                      label="Image Caption"
                      value={galleryCaptions[index]}
                      onChange={(e) => {
                        const newCaptions = [...galleryCaptions];
                        newCaptions[index] = e.target.value;
                        setGalleryCaptions(newCaptions);
                      }}
                      fullWidth
                      margin="normal"
                      sx={{ mt: 2 }}
                    />
                  </>
                )}
              </Grid>
              <Grid item xs={2}>
                <Button variant="outlined" color="error" onClick={() => handleRemoveGalleryImage(index)}>Remove</Button>
              </Grid>
            </Grid>
          ))}
          <Button variant="contained" startIcon={<Add />} sx={{ mt: 2 }} onClick={handleAddGalleryImage}>
            Add Another Image
          </Button>

          <Typography variant="body1" sx={{ mt: 4 }}>Project Details</Typography>
          {projectDetails.map((detail, index) => (
            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }} key={index}>
              <Grid item xs={10}>
                <TextField
                  label={`Detail ${index + 1}`}
                  value={detail}
                  onChange={(e) => {
                    const newDetails = [...projectDetails];
                    newDetails[index] = e.target.value;
                    setProjectDetails(newDetails);
                  }}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton color="error" onClick={() => handleRemoveProjectDetail(index)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button variant="contained" startIcon={<Add />} sx={{ mt: 2 }} onClick={handleAddProjectDetail}>
            Add Another Detail
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={24} /> : null}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Blog Post'}
            </Button>
          </Box>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default BlogPostModal;
