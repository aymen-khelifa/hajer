import React from 'react';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Provider } from 'react-redux';
import { store ,persistor} from './redux/store1';
import { PersistGate } from 'redux-persist/integration/react';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
    <PersistGate persistor={persistor}>
    
     <App />
   
     </PersistGate>
    </Provider>
     
    
);
