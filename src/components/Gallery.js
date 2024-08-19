import { CloudUpload } from '@mui/icons-material';
import {
    Box, Button, Card, CardContent, CircularProgress, Container,
    Grid, Input, Typography
} from '@mui/material';
import {
    getDownloadURL,
    getStorage,
    listAll,
    ref,
    uploadBytes
} from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Gallery = () => {
    const [newClass, setNewClass] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [galleryClasses, setGalleryClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [classImages, setClassImages] = useState([]);

    const handleClassChange = (event) => {
        setNewClass(event.target.value);
    };

    const handleImageChange = (event) => {
        setImageFiles(event.target.files);
    };

    const uploadImages = async () => {
        if (!newClass || imageFiles.length === 0) {
            alert('Please provide a class name and select images.');
            return;
        }

        setIsLoading(true);
        const storage = getStorage();
        const classRef = ref(storage, `gallery/${newClass}/`);

        const uploadPromises = Array.from(imageFiles).map(async (imageFile) => {
            const imageRef = ref(classRef, `${uuidv4()}-${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
        });

        await Promise.all(uploadPromises);

        setIsLoading(false);
        alert('Images uploaded successfully!');
        setNewClass('');
        setImageFiles([]);
        fetchGalleryClasses();
    };

    const fetchGalleryClasses = async () => {
        setIsLoading(true);
        const storage = getStorage();
        const galleryRef = ref(storage, 'gallery/');

        const result = await listAll(galleryRef);
        const classesList = result.prefixes.map(folderRef => folderRef.name);
        setGalleryClasses(classesList);
        setIsLoading(false);
    };

    const fetchImagesForClass = async (galleryClass) => {
        setIsLoading(true);
        setSelectedClass(galleryClass);

        const storage = getStorage();
        const classRef = ref(storage, `gallery/${galleryClass}/`);
        const imagesSnapshot = await listAll(classRef);

        const imagesList = await Promise.all(
            imagesSnapshot.items.map(itemRef => getDownloadURL(itemRef))
        );

        setClassImages(imagesList);
        setIsLoading(false);
    };

    const handleAddMoreImages = async () => {
        if (!selectedClass || imageFiles.length === 0) {
            alert('Please select images to upload.');
            return;
        }

        setIsLoading(true);
        const storage = getStorage();
        const classRef = ref(storage, `gallery/${selectedClass}/`);

        const uploadPromises = Array.from(imageFiles).map(async (imageFile) => {
            const imageRef = ref(classRef, `${uuidv4()}-${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
        });

        await Promise.all(uploadPromises);

        setIsLoading(false);
        alert('Images uploaded successfully!');
        setImageFiles([]);
        fetchImagesForClass(selectedClass); // Refresh the images in the view
    };

    useEffect(() => {
        fetchGalleryClasses();
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                    Create a New Gallery Set
                </Typography>
            </Box>

            <Box sx={{ marginTop: 3 }}>
                <Input
                    variant="outlined"
                    placeholder="Class Name"
                    fullWidth
                    value={newClass}
                    onChange={handleClassChange}
                />
            </Box>

            <Box sx={{ marginTop: 3 }}>
                <Input
                    type="file"
                    inputProps={{ multiple: true }}
                    onChange={handleImageChange}
                    fullWidth
                />
            </Box>

            <Box sx={{ marginTop: 3, textAlign: 'center' }}>
                <Button variant="contained" color="primary" onClick={uploadImages} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Upload Images'}
                </Button>
            </Box>

            <Box sx={{ marginTop: 5 }}>
                <Typography variant="h5" component="h2">
                    Existing Gallery Classes
                </Typography>
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    {galleryClasses.map((galleryClass, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Button
                                variant={selectedClass === galleryClass ? "contained" : "outlined"}
                                fullWidth
                                onClick={() => fetchImagesForClass(galleryClass)}
                            >
                                {galleryClass}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {selectedClass && (
                <Box sx={{ marginTop: 5 }}>
                    <Typography variant="h5" component="h2" sx={{ textAlign: 'center', marginBottom: 2 }}>
                        Images for Class: {selectedClass}
                    </Typography>

                    <Card sx={{ marginBottom: 5, marginTop: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ marginTop: 3 }}>
                                <Input
                                    type="file"
                                    inputProps={{ multiple: true }}
                                    onChange={handleImageChange}
                                    fullWidth
                                />
                            </Box>
                            <Box sx={{ marginTop: 3, textAlign: 'center' }}>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    sx={{ mb: 5 }}
                                    tabIndex={-1}
                                    disabled={isLoading}
                                    onClick={handleAddMoreImages}
                                    startIcon={<CloudUpload />}
                                >
                                    {isLoading ? <CircularProgress size={24} /> : 'Add More Images'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                    <Grid container spacing={2}>
                        {classImages.map((url, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <img src={url} alt={`img-${index}`} style={{ width: '100%', borderRadius: '8px' }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {selectedClass && classImages.length === 0 && (
                <Typography variant="h6" component="p" sx={{ textAlign: 'center', marginTop: 5 }}>
                    No images found for this class.
                </Typography>
            )}
        </Container>
    );
};

export default Gallery;
