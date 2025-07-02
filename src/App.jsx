import { useState } from 'react';
import UploadForm from './components/UploadForm';
import Login from './components/Login';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <UploadForm />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}
