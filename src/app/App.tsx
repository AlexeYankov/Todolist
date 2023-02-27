import React, { useEffect } from "react";
import "./App.css";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
import { useAppDispatch, useAppSelector } from "./store";
import { RequestStatusType, setAppInitializedAC, setAppInitializedTC } from "./app-reducer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import { Menu } from "@mui/icons-material";
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "../features/Login/Login";
import { CircularProgress } from "@mui/material";

function App() {
  const dispatch = useAppDispatch()
  useEffect(()=>{
    dispatch(setAppInitializedTC)
  },[])
  const status = useAppSelector<RequestStatusType>((state) => state.app.status);
  const initialized = useAppSelector<boolean>((state) => state.app.initialized);
  
  // dispatch(setAppInitializedAC(!auth))
  if (!initialized) {
    console.log(initialized)
    // dispatch()
    return <CircularProgress style={{position: "fixed", margin:"30% 48%"}}/>
  }

  return (
    <BrowserRouter>
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6">News</Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
          {status === "loading" && <LinearProgress />}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path={"/"} element={<Login />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/home"} element={<TodolistsList />} />
            
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;
