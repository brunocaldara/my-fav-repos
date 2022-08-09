import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import Repositorie from './pages/repositorie';

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Main />} exact />
            <Route path='/repositorie' element={<Repositorie />} />
        </Routes>
    </BrowserRouter>
)

export default AppRoutes;