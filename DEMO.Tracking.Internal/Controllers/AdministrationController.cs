using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using DEMO.Tracking.Internal.Resouce;
using Undani.Tracking.Tools.Resource;

namespace DEMO.Tracking.Internal.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class AdministrationController : Controller
    {
        private IConfiguration _configuration;

        public AdministrationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult UnidadOrganizacional()
        {
            ViewBag.Configuration = _configuration;
            ViewBag.UnidadesOrganizacionales = new CustomCall(_configuration, User).GetUnidadesOrganizacionales();

            ViewBag.Empleados = new CustomCall(_configuration, User).GetEmpleados(0);

            return View();
        }

        public IActionResult Transfer()
        {
            ViewBag.Configuration = _configuration;
            ViewBag.ToTransfer = new TrackingCall(_configuration, User).GetProcedureInstanceToTransfer();

            ViewBag.Empleados = new CustomCall(_configuration, User).GetEmpleados(6);

            return View();
        }

        public IActionResult Empleado()
        {
            ViewBag.Configuration = _configuration;
            ViewBag.Empleados = new CustomCall(_configuration, User).GetEmpleados(0);

            return View();
        }

        public IActionResult Calendario()
        {
            ViewBag.Configuration = _configuration;
            ViewBag.Calendario = new CustomCall(_configuration, User).GetBusinessRules();

            return View();
        }

        public IActionResult DocumentProcedure()
        {
            ViewBag.Configuration = _configuration;

            return View();
        }
    }
}