using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Security.Claims;
using Undani.Tracking.Tools;
using Undani.Tracking.Tools.Resource;

namespace DEMO.Tracking.Internal.Controllers
{

    [Authorize(Roles = "Interno")]
    public class ActivityController : Controller
    {
        private IConfiguration _configuration;

        public ActivityController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Internal(Guid elementInstanceRefId, string returnUrl)
        {

            TrackingCall trackingCall = new TrackingCall(_configuration, User);

            User user = JsonConvert.DeserializeObject<User>(((ClaimsIdentity)User.Identity).Claims.First(c => c.Type.Contains("userdata")).Value);

            ViewBag.User = user;

            ViewBag.Configuration = _configuration;

            string jsonActivityInstance = "";
            ActivityInstance activityInstance = trackingCall.GetActivityInstance(elementInstanceRefId, ref jsonActivityInstance);
            ViewBag.ActivityInstance = activityInstance;
            ViewBag.JsonActivityInstance = jsonActivityInstance;

            if (activityInstance.CoustomViewer == "")
            {
                ViewBag.FormInstanceHtml = new FormCall(_configuration, User).GetHtml(activityInstance.FormInstanceId);

                return View();
            }
            else
            {
                return View(activityInstance.CoustomViewer);
            }

        }

        [Authorize(Roles = "Administrator")]
        public IActionResult Question(string returnUrl)
        {
            TrackingCall trackingCall = new TrackingCall(_configuration, User);

            User user = JsonConvert.DeserializeObject<User>(((ClaimsIdentity)User.Identity).Claims.First(c => c.Type.Contains("userdata")).Value);

            ViewBag.User = user;

            ViewBag.Configuration = _configuration;

            ViewBag.FormInstanceHtml = new FormCall(_configuration, User).GetHtml(Guid.Parse(_configuration["QuestionFormInstanceId"]));

            return View();
        }
    }
}