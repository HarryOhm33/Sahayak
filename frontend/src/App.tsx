import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { RecommendPage } from "./pages/RecommendPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-full max-w-full overflow-hidden flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
        <Navbar />
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-slate-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recommend" element={<RecommendPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
