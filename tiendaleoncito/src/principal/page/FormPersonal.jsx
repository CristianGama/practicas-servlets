
export default function FormPersonal() {
  return (
    <>
        <div className="bg-[#FFF0E5] h-screen overflow-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="m-6 space-y-8 bg-white shadow-xl rounded-2xl md:flex-row md:space-y-0">
                    <form action="">
                        <h1 className="text-center font-sans text-2xl py-0 my-2 m-0">FORMULARIO</h1>
                        <div id="container">
                            <div className="flex flex-row py-2">


                                <div className="flex flex-col py-1 my-0 m-2">
                                    <label className="mb-2 text-sm">NOMBRE</label>
                                    <input type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                        name="nombre"
                                        id="nombre"
                                    />
                                </div>

                                <div className="flex flex-col py-1 my-0 m-2">
                                        <label className="mb-2 text-sm">APELLIDO</label>
                                        <input type="text"
                                            className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                            name="nombre"
                                            id="nombre"
                                        />
                                </div>

                            <div className="flex flex-col py-1 my-0 m-2">
                                <label className="mb-2 text-sm">Edad</label>
                                <select name="tipo" id="tipo" className="w-full h-full border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500">
                                    <option value="null">-</option>
                                    <option value="Alumno">10</option>
                                    <option value="Alumno">11</option>
                                    <option value="Alumno">12</option>
                                    <option value="Alumno">13</option>
                                    <option value="Alumno">14</option>
                                    <option value="Alumno">15</option>
                                </select>
                                {/* <input type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    name="nombre"
                                    id="nombre"
                                /> */}
                            </div>
                            </div>

                                <p className="text-center font-sans text-sm py-0 my-2 m-0">SEXO</p>

                                <div className="flex flex-row py-2 items-center-safe">
                                    <div className="flex flex-row py-1 my-0 m-2">
                                        <label className=" px-1 text-sm text-center">M</label>
                                        <input type="checkbox"
                                            className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                            name="nombre"
                                            id="nombre"
                                        />
                                    </div>
                                    <div className="flex flex-row py-1 my-0 m-2">
                                        <label className=" px-1 text-sm text-center">F</label>
                                        <input type="checkbox"
                                            className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                            name="nombre"
                                            id="nombre"
                                        />
                                    </div>
                                </div>
                            

                            <div className="flex flex-col py-1 my-0 m-2">
                                <label className="mb-2 text-sm">Juego preferido</label>
                                <select name="tipo" id="tipo" className="w-full h-full border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500">
                                    <option value="null">-</option>
                                    <option value="Alumno">Plantas vs Zombies</option>
                                    <option value="Alumno">Metal Slug</option> 
                                    <option value="Alumno">Minecraft</option>
                                    <option value="Alumno">Call of duty</option>
                                    <option value="Alumno">Roblox</option>
                                </select>
                                {/* <input type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    name="nombre"
                                    id="nombre"
                                /> */}
                            </div>

                            <div className="flex flex-col py-1 my-0 m-2">
                                <label className="mb-2 text-sm">Que prefieres utilizar?</label>
                                <select name="tipo" id="tipo" className="w-full h-full border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500">
                                    <option value="null">Celular</option>
                                    <option value="Alumno">Tablet</option>
                                    <option value="Alumno">Computadora</option> 
                                </select>
                                {/* <input type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    name="nombre"
                                    id="nombre"
                                /> */}
                            </div>

                            
                            <div className="py-2 my-0 m-2">
                                <button className="w-50 bg-green-600 text-white font-bold p-2 rounded-lg m-1 hover:bg-[#C8D498] hover:text-white hover:border-[#C8D498]">Enviar</button>
                                <button className="w-50 bg-orange-600 text-white font-bold p-2 rounded-lg m-1 hover:bg-[#C8D498] hover:text-white hover:border-[#C8D498]">Limpiar</button>
                                <button className="w-50 bg-red-600 text-white font-bold p-2 rounded-lg m-1 hover:bg-[#C8D498] hover:text-white hover:border-[#C8D498]">Regresar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}
