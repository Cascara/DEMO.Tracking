using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Undani.Tracking.Tools.Resource;

namespace DEMO.Tracking.Internal
{
    public class ClaimsTransformer : IClaimsTransformation
    {

        public ClaimsTransformer(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            ClaimsPrincipal claimsPrincipal = new TrackingCall(Configuration, principal).GetUser(principal, Guid.Parse(Environment.GetEnvironmentVariable("OWNER")));

            return claimsPrincipal;
        }
    }
}
