import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from "./redux/store.js";
import  { Provider } from 'react-redux'; 
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from './components/ThemeProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
  <Provider store={store}>
    <ThemeProvider>
    <App />
    </ThemeProvider>
    <ToastContainer
        position="top-right"
        autoClose={2100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition:Bounce
        bodyClassName="toastBody"
      />
      
  </Provider>
  </PersistGate>
);
