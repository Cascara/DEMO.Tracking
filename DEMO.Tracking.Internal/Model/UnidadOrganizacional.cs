using System;
using System.Collections.Generic;

namespace DEMO.Tracking.Internal.Model
{
    public class UnidadOrganizacional
    {
        public UnidadOrganizacional()
        {
            Empleados = new List<EmpleadoEnrolado>();
        }
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string DireccionAdscripcion { get; set; }
        public List<EmpleadoEnrolado> Empleados { get; set; }
    }
}
