import { Link } from "react-router"

export const Nav = () => {
  return (
    <>
        <div className=" shadow rounded-4xl py-5 m-2 h-7 flex flex-row items-center justify-center bg-green-800">
            <Link className=" m-7 text-white hover:text-emerald-400" to="/form-personal">Personal</Link>
            <Link className=" m-7 text-white hover:text-emerald-400" to="/form-productos">Productos</Link>
            <Link className=" m-7 text-white hover:text-emerald-400" to="/form-proveedores">Provedores</Link>
            <Link className=" m-7 text-white hover:text-emerald-400" to="/form-nomina">Nomina</Link>
        </div>
    </>
  )
}
