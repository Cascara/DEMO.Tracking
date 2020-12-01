using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Undani.Tracking.Tools.Resource;

namespace DEMO.Tracking.Internal.Controllers
{
    [Authorize(Roles = "Interno")]
    public class InboxController : Controller
    {
        private IConfiguration _configuration;

        public InboxController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult ProcedureInProcess()
        {
            ViewBag.Configuration = _configuration;
            ViewBag.InProcess = new TrackingCall(_configuration, User).GetProcedureInstanceInProcess();
            return View();
        }

        public IActionResult ProcedureResolved()
        {
            ViewBag.Configuration = _configuration;
            ViewBag.Resolved = new TrackingCall(_configuration, User).GetProcedureInstanceResolved();
            return View();
        }

        public IActionResult Draft()
        {
            ViewBag.Configuration = _configuration;
            ViewBag.Drafts = new TrackingCall(_configuration, User).GetMessagesDrafts();
            return View();
        }

        public IActionResult Received()
        {
            ViewBag.Configuration = _configuration;
            ViewBag.Received = new TrackingCall(_configuration, User).GetMessagesReceived();

            if (User.IsInRole("Observador"))
            {
                return Redirect("/Inbox/ProcedureInProcess");
            }
            else
            {
                return View();
            }
        }
    }
}