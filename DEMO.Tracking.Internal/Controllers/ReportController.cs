using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace DEMO.Tracking.Internal.Controllers
{
    public class ReportController : Controller
    {
        private IConfiguration _configuration;

        public ReportController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [Route("Report")]
        public IActionResult Index(string name)
        {
            ViewBag.Name = name;
            ViewBag.Configuration = _configuration;

            return View();
        }
    }
}