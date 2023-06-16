import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AdminDashboard from "./pages/AdminDashboard";
import EditStudent from "./pages/edit/EditStudent";
import EditProfesor from "./pages/edit/EditProfesor";
import EditAdmin from "./pages/edit/EditAdmin";
import EditRoom from "./pages/edit/EditRoom";
import EditGroup from "./pages/edit/EditGroup";
import EditSupervisor from "./pages/edit/EditSupervisor";
import EditArea from "./pages/edit/EditArea";
import EditSchool from "./pages/edit/EditSchool";
import EditDegree from "./pages/edit/EditDegree";
import EditSubject from "./pages/edit/EditSubject";
import EditIndicator from "./pages/edit/EditIndicator";
import EditEvent from "./pages/edit/EditEvent";
import CreateDegree from "./pages/create/CreateDegree";
import SignupForm from "./pages/Signup";
import LoginForm from "./pages/Login";
import CreateArea from "./pages/create/CreateArea";
import CreateSchool from "./pages/create/CreateSchool";
import CreateGroup from "./pages/create/CreateGroup";
import CreateSubject from "./pages/create/CreateSubject";
import CreateRoom from "./pages/create/CreateRoom";
import CreateIndicator from "./pages/create/CreateIndicator";
import CreateEvent from "./pages/create/CreateEvent";
import ProfessorClasses from "./pages/ProfessorClasses";
import MainDashboard from "./pages/MainDashboard";



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student/edit" element={<EditStudent />} />
        <Route path="/profesor/edit" element={<EditProfesor />} />
        <Route path="/admin/edit" element={<EditAdmin/>} />
        <Route path="/supervisor/edit" element={<EditSupervisor/>} />
        <Route path="/school/create" element={<CreateSchool />} />
        <Route path="/school/edit" element={<EditSchool />} />
        <Route path="/area/create" element={<CreateArea />} />
        <Route path="/degree/create" element={<CreateDegree />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/subject/create" element={<CreateSubject />} />
        <Route path="/degree/edit" element={<EditDegree />} />
        <Route path="/area/edit" element={<EditArea />} />
        <Route path="/subject/edit" element={<EditSubject />} />
        <Route path="/room/edit" element={<EditRoom />} />
        <Route path="/room/create" element={<CreateRoom/>} />
        <Route path="/group/edit" element={<EditGroup />} />
        <Route path="/group/create" element={<CreateGroup />} />
        <Route path="/indicator/create" element={<CreateIndicator />} />
        <Route path="/event/create" element={<CreateEvent />} />
        <Route path="/event/edit" element={<EditEvent />} />
        <Route path="/myclasses" element={<ProfessorClasses />} />
        <Route path="/indicator/edit" element={<EditIndicator />} />
        <Route path="/dashboard" element={<MainDashboard/>}/>


        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);