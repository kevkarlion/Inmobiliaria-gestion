import React from "react";
import OportunityHome from "../shared/OportunityHome/OportunityHome";
import SalesHome from "../shared/SalesHome/SalesHome";
import AlquilerHome from "../shared/AlquilerHome/AlquilerHome";

const ContainerCardsMain = () => {
  return (
    <section className="py-16 bg-slate-100">
      <OportunityHome />
      <SalesHome />
      <AlquilerHome />
    </section>
  );
};

export default ContainerCardsMain;
