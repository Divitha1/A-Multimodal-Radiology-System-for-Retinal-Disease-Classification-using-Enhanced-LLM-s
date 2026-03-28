import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import PatientDashboard from './pages/PatientDashboard.tsx'
import DoctorDashboard from './pages/DoctorDashboard.tsx'
import AnalysisPage from './pages/AnalysisPage.tsx'
import ReportPage from './pages/ReportPage.tsx'
import ChatbotPage from './pages/ChatbotPage.tsx'
import ClinicalRecords from './pages/ClinicalRecords.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import PDFAnalysisPage from './pages/PDFAnalysisPage.tsx'
import ExtractPDFPage from './pages/ExtractPDFPage.tsx'
import MainLayout from './components/MainLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Dashboard Routes (Unified Layout) */}
        <Route path="/patient-dashboard" element={<MainLayout><PatientDashboard /></MainLayout>} />
        <Route path="/doctor-dashboard" element={<MainLayout><DoctorDashboard /></MainLayout>} />
        
        {/* Analysis Hub with Nested Sub-Pages */}
        <Route path="/analysis" element={<MainLayout><AnalysisPage /></MainLayout>}>
           <Route index element={<Navigate to="scans" replace />} />
        </Route>
        <Route path="/analysis/scans" element={<MainLayout><AnalysisPage /></MainLayout>} />
        <Route path="/analysis/pdf-sync" element={<MainLayout><ExtractPDFPage /></MainLayout>} />
        
        <Route path="/report" element={<MainLayout><ReportPage /></MainLayout>} />
        <Route path="/clinical-records" element={<MainLayout><ClinicalRecords /></MainLayout>} />
        <Route path="/pdf-analysis" element={<MainLayout><PDFAnalysisPage /></MainLayout>} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
        
        {/* Fallback route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

