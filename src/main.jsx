import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './styles/global.scss'
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from './pages/users/Homepage'
import SoloGameMenu from './pages/users/SoloGameMenu'
import Marathon from './pages/users/soloGame/Marathon'
//settings 
import Settings from "./pages/users/SettingsMenu";
import Controls from './pages/users/settings/Controls';
import Handling from "./pages/users/settings/Handling"

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/solo" element={<SoloGameMenu />} />
            <Route path="/solo/marathon" element={<Marathon />} />
            <Route path='/Settings' element={<Settings />} />
            <Route path='/settings/handling' element={<Handling />} />
            <Route path='/settings/control' element={<Controls />} />
        </Routes>
    </BrowserRouter>
)