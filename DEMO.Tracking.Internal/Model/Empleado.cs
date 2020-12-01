using System;
using System.Collections.Generic;
using System.Text;

namespace DEMO.Tracking.Internal.Model
{
    public class Empleado
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string UserName { get; set; }
        public string Reference { get; set; }
        public Guid UserId { get; set; }
    }
}
