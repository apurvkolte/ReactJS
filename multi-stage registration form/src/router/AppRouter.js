import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import FirstStep from '../components/FirstStep';
import Header from '../components/Header';
import Login from '../components/Login';
import SecondStep from '../components/SecondStep';
import ThirdStep from '../components/ThirdStep';

const AppRouter = () => {
  const [user, setUser] = useState({});

  const updateUser = (data) => {
    setUser((prevUser) => ({ ...prevUser, ...data }));
  };

  const resetUser = () => {
    setUser({});
  };

  return (
    <BrowserRouter>
      <div className="container">
        <Header />
        <Routes >

          <Route element={<FirstStep user={user} updateUser={updateUser} />} path="/" />
          <Route element={<SecondStep user={user} updateUser={updateUser} />} path="/second" />
          <Route element={<ThirdStep user={user} updateUser={updateUser} resetUser={resetUser} />} path="/third" />
          <Route element={<Login />} path="/login" />
          <Route element={() => <Navigate to="/" />} />
        </Routes >
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
