// app/layout.tsx
import "@/app/globals.css"; // Tus estilos de Tailwind aquí

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}