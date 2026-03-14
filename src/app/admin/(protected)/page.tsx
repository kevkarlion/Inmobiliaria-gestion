/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Encabezado de Bienvenida */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo, 👋</h2>
        <p className="text-slate-500">Aquí tienes un resumen de lo que está pasando hoy.</p>
      </div>

      {/* Grid de Stats (KPIs) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Ingresos Totales" 
          value="$45,231.89" 
          icon={<DollarSign className="text-emerald-600" />} 
          trend="+20.1%" 
          positive={true} 
        />
        <StatCard 
          title="Nuevos Clientes" 
          value="+2,350" 
          icon={<Users className="text-blue-600" />} 
          trend="+180.1%" 
          positive={true} 
        />
        <StatCard 
          title="Ventas" 
          value="+12,234" 
          icon={<ShoppingBag className="text-purple-600" />} 
          trend="+19%" 
          positive={true} 
        />
        <StatCard 
          title="Tasa de Rebote" 
          value="42.5%" 
          icon={<TrendingUp className="text-rose-600" />} 
          trend="-4%" 
          positive={false} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráfico (Placeholder Visual) */}
        <div className="col-span-4 p-6 bg-white border rounded-xl border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Resumen de Ventas</h3>
            <select className="text-sm border-none bg-slate-50 rounded-md p-1 outline-none">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
            </select>
          </div>
          <div className="h-75 w-full bg-slate-50 rounded-lg flex items-end justify-around p-4">
            {/* Simulación de barras de gráfico */}
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div 
                key={i} 
                style={{ height: `${height}%` }} 
                className="w-8 bg-blue-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>

        {/* Ventas Recientes */}
        <div className="col-span-3 p-6 bg-white border rounded-xl border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4">Ventas Recientes</h3>
          <div className="space-y-6">
            <RecentSale name="Olivia Martin" email="olivia.m@email.com" amount="+$1,999.00" />
            <RecentSale name="Jackson Lee" email="jlee@email.com" amount="+$39.00" />
            <RecentSale name="Isabella Nguyen" email="isabella.n@email.com" amount="+$299.00" />
            <RecentSale name="William Kim" email="will@email.com" amount="+$99.00" />
            <RecentSale name="Sofia Davis" email="sofia.d@email.com" amount="+$39.00" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Sub-componentes --- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatCard({ title, value, icon, trend, positive }: any) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className="p-2 bg-slate-50 rounded-md">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-bold">{value}</h4>
          <p className={`flex items-center text-xs mt-1 ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend} <span className="text-slate-400 ml-1">vs mes pasado</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function RecentSale({ name, email, amount }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
          {name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div>
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-xs text-slate-500">{email}</p>
        </div>
      </div>
      <div className="text-sm font-bold text-slate-900">{amount}</div>
    </div>
  );
}