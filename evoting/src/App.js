import React, { useState } from 'react';
import './SignIn.css';
import SignIn from './SignIn';
import SignUp from './SignUp';

function App() {
  // State untuk menentukan halaman yang aktif (default: 'signin')
  const [currentPage, setCurrentPage] = useState('signin');

  return (
    <div>
      {/* Jika state 'signin', tampilkan komponen SignIn */}
      {currentPage === 'signin' && (
        <SignIn onSwitchToSignUp={() => setCurrentPage('signup')} />
      )}

      {/* Jika state 'signup', tampilkan komponen SignUp */}
      {currentPage === 'signup' && (
        <SignUp onSwitchToSignIn={() => setCurrentPage('signin')} />
      )}
    </div>
  );
}

export default App;