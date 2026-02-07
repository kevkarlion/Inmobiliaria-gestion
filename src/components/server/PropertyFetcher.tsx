// // @/components/server/PropertyFetcher.tsx
// import { getUiProperties } from "@/components/server/data-access/get-ui-properties";
// import SearchTypePage from "../shared/SearchTypePage/SearchTypePage";

// // Definimos la interfaz donde params es una Promesa
// interface Props {
//   params: Promise<{ type: string }>;
// }

// export default async function PropertyFetcher({ params }: Props) {
//   // 1. DEBEMOS esperar a los params (Requisito Next.js 15+)
//   const { type } = await params;

//   // 2. Ahora pasamos el string ya resuelto
//   const properties = await getUiProperties({ 
//     type: type, 
//     limit: 20 
//   });

//   return <SearchTypePage properties={properties} filterParam={type} />;
// }