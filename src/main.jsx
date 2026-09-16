import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './styles/global.scss'

import Homepage from './pages/users/Homepage'
import SoloGameIndex from './pages/users/soloGame/SoloGameIndex'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/solo" element={<SoloGameIndex />} />
        </Routes>
    </BrowserRouter>
)