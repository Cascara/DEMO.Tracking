using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using Undani.Tracking.Tools;
using Undani.Tracking.Tools.Resource;

namespace DEMO.Tracking.Internal.Controllers
{
    [Produces("application/json")]
    [Route("Execution/Box")]
    public class BoxController : ControllerBase
    {
        private IConfiguration _configuration;

        public BoxController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        [Route("Upload")]
        public dynamic Upload([FromForm] Guid instanceId, [FromForm] Guid enviroment, [FromForm] string metaData, IFormFile file)
        {
            string json = new BoxCall(_configuration).Upload(instanceId, enviroment, metaData, file.OpenReadStream(), file.FileName);

            return JsonConvert.DeserializeObject<ExpandoObject>(json, new ExpandoObjectConverter());
        }

        [Route("Download")]
        public IActionResult Download(string systemName)
        {
            string originalName = "";
            Stream stream = new BoxCall(_configuration).Download(systemName, ref originalName);
            return File(stream, "application/octet-stream", originalName);
        }

        [HttpPost]
        [Route("AssertCore")]
        public void AssertCore([FromBody] AssertFiles assertFiles) 
        {
            BoxCall boxCall = new BoxCall(_configuration);
            boxCall.Assert(assertFiles);
        }

    }
}