import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Sell from './Pages/Sell';
import Purchase from './Pages/Purchase';
import Analytics from './Pages/Analytics';
import Aboutus from './Pages/Aboutus';
import Login from './Pages/Login';
import Signup from './Pages/Signup';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route exact path='/' element={<Login />} />
        <Route exact path='/signup' element={<Signup />} />
        <Route exact path='/home' element={<Dashboard />} />
        <Route exact path='/sell' element={<Sell />} />
        <Route exact path='/purchase' element={<Purchase />} />
        <Route exact path='/analytics' element={<Analytics />} />
        <Route exact path='/aboutus' element={<Aboutus/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;