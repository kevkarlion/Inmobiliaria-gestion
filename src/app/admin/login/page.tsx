"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, User, Eye, EyeOff, Building2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }), 
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        window.location.href = "/admin/properties"; 
      } else {
        const data = await res.json();
        alert(data.error || "Error al ingresar");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000814] p-4 relative overflow-hidden">
      {/* Círculos de luz decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-100 z-10">
        {/* Cabecera del Panel */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-4">
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-white text-3xl font-black uppercase tracking-tighter">
            LOGIN <span className="text-blue-500">PROPIEDADES</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Panel de Administración Inmobiliaria
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-900/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[2rem] shadow-2xl space-y-6">
          
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Usuario / Email</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input 
                type="email" 
                placeholder="admin@riquelmeprop.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 pl-11 h-14 text-white focus:border-blue-500/50 focus:ring-0 transition-all rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 pl-11 pr-12 h-14 text-white focus:border-blue-500/50 focus:ring-0 transition-all rounded-xl"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : "Ingresar al Sistema"}
            </Button>
          </div>

          <p className="text-center text-[9px] text-gray-600 uppercase font-bold tracking-widest">
            Acceso restringido a personal autorizado
          </p>
        </form>
      </div>
    </div>
  );
}