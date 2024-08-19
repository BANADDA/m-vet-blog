import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AuthModal from './widgets/AuthModal';

function App() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthModalOpen(false); // Close the modal when user is logged in
      } else {
        setAuthModalOpen(true); // Open the modal if the user is not logged in
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  return (
    <Router>
      <Layout />
      <AuthModal open={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
    </Router>
  );
}

export default App;
