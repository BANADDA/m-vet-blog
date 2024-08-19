// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAXbIKjXLs9wlcWSCEqudkf2EE0nWKAuyE",
    authDomain: "m-vet-blog.firebaseapp.com",
    projectId: "m-vet-blog",
    storageBucket: "m-vet-blog.appspot.com",
    messagingSenderId: "618017387126",
    appId: "1:618017387126:web:f867fc8d6a3c5146cbe557",
    measurementId: "G-LNERF1K8F0"
  }

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const uploadBlogPost = async (userId, title, caption, captionImageFile, galleryImageFiles, galleryCaptions, projectDetails) => {
    const storage = getStorage();

    // Upload caption image
    const captionImageRef = ref(storage, `blogs/${userId}/${Date.now()}_captionImage`);
    await uploadBytes(captionImageRef, captionImageFile);
    const captionImageUrl = await getDownloadURL(captionImageRef);

    // Upload gallery images and get URLs
    const galleryImageUrls = await Promise.all(
        galleryImageFiles.map(async (file, index) => {
            if (file) {
                const galleryImageRef = ref(storage, `blogs/${userId}/${Date.now()}_galleryImage_${index}`);
                await uploadBytes(galleryImageRef, file);
                return await getDownloadURL(galleryImageRef);
            }
            return null;
        })
    );

    // Prepare blog post data
    const blogPostData = {
        userId,
        title,
        caption,
        captionImageUrl,
        galleryImages: galleryImageUrls,
        galleryCaptions,
        projectDetails,
        createdAt: new Date()
    };

    // Save blog post to Firestore
    const docRef = await addDoc(collection(db, "blogs"), blogPostData);
    return docRef.id;
}

export { db, uploadBlogPost };
