import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index.tsx";
import Produtores from "./pages/Produtores.tsx";
import Empresas from "./pages/Empresas.tsx";
import Lancamentos from "./pages/Lancamentos.tsx";
import Colheitas from "./pages/Colheitas.tsx";
import Talhoes from "./pages/Talhoes.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produtores" element={<Produtores />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/lancamentos" element={<Lancamentos />} />
            <Route path="/colheitas" element={<Colheitas />} />
            <Route path="/talhoes" element={<Talhoes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
