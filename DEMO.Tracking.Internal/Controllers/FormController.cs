using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Undani.Tracking.Tools.Resource;

namespace DEMO.Tracking.Internal.Controllers
{
    [Produces("application/json")]
    [Route("Execution")]
    [Authorize(Roles = "Externo")]
    public class FormController : ControllerBase
    {
        private IConfiguration _configuration;

        public FormController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [Route("GetInstance")]
        public dynamic GetInstance(Guid instanceId)
        {
            return new FormCall(_configuration, User).GetObjectInstance(instanceId);
        }

        [Route("GetJsonInstance")]
        public dynamic GetJsonInstance(Guid instanceId)
        {
            return new FormCall(_configuration, User).GetObjectJsonInstance(instanceId);
        }

        [HttpPost]
        [Route("UpdateInstance")]
        public dynamic UpdateInstance(Guid instanceId, [FromForm] string json, bool readOnly)
        {
            return new FormCall(_configuration, User).UpdateInstance(instanceId, json, readOnly);
        }

    }
}