import './App.css';
import  firebase from 'firebase/app';
import "firebase/auth";
import firebaseConfig from './firebase.config';


firebase.initializeApp(firebaseConfig);

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();

  return (
    <div >
      <button>Sign in</button>
    </div>
  );
}

export default App;
