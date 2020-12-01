using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Undani.Tracking.Tools.Resource;
using Newtonsoft.Json;
using System;
using System.Security.Claims;
using System.Linq;
using Undani.Tracking.Tools;

namespace DEMO.Tracking.Internal.Controllers
{
    [Authorize(Roles = "Binnacle")]
    public class BinnacleController : Controller
    {
        private IConfiguration _configuration;

        public BinnacleController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Search()
        {
            ViewBag.Configuration = _configuration;

            return View();
        }

        public IActionResult Internal(Guid elementInstanceRefId, string returnUrl)
        {
            TrackingCall trackingCall = new TrackingCall(_configuration, User);

            User user = JsonConvert.DeserializeObject<User>(((ClaimsIdentity)User.Identity).Claims.First(c => c.Type.Contains("userdata")).Value);

            ViewBag.User = user;

            ViewBag.Configuration = _configuration;

            string jsonActivityInstance = "";
            ActivityInstance activityInstance = new TrackingCall(_configuration, User).GetSupportActivityInstance(Guid.Parse(Environment.GetEnvironmentVariable("OWNER")), elementInstanceRefId, ref jsonActivityInstance);
            ViewBag.ActivityInstance = activityInstance;
            ViewBag.JsonActivityInstance = jsonActivityInstance;

            ViewBag.FormInstanceHtml = new FormCall(_configuration, User).GetHtml(activityInstance.FormInstanceId);

            return View();
        }
    }
}