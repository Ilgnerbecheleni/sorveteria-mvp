import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaCashRegister } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";

export default function Home() {
  return (
   
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100">
    <h1 className="text-center">Bem-vindo à Sorveteria!</h1>
    <div className="d-flex gap-4 mt-4">
    <Link href="/relatorio" className="btn btn-primary btn-lg" style={{height:150, width:150, display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
        <CiCalendarDate  size={'1.6em'} /> Historico
      </Link>
      <Link href="/vendas" className="btn btn-primary btn-lg" style={{height:150, width:150, display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
        <FaCashRegister  size={'1.6em'} /> Vendas
      </Link>
      <Link href="/produto" className="btn btn-primary btn-lg" style={{height:150, width:150, display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
        <MdProductionQuantityLimits size={'1.6em'} /> Produtos
      </Link>
      <Link href="/visualizar-vendas" className="btn btn-primary btn-lg" style={{height:150, width:150, display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
        <MdProductionQuantityLimits size={'1.6em'} />Lista Vendas
      </Link>
  
    
    </div>
  </div>
      );
    }
    
