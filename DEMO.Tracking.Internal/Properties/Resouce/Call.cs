using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Security.Claims;
using Undani.JWT;

namespace DEMO.Tracking.Internal.Resouce
{
    public abstract class Call
    {
        private IConfiguration _configuration;
        private ClaimsPrincipal _user;

        public Call(IConfiguration configuration, ClaimsPrincipal user)
        {
            _configuration = configuration;
            _user = user;
        }

        public IConfiguration Configuration
        {
            get { return _configuration; }
        }

        public ClaimsPrincipal User
        {
            get { return _user; }
        }

        public string Token
        {
            get
            {
                if (_user.Identity.IsAuthenticated)
                    return "Bearer " + JWToken.Token(User);
                else
                    throw new Exception("The access is invalid");
            }
        }

        public HttpClientHandler GetHttpClientHandler()
        {
            HttpClientHandler httpClientHandler = new HttpClientHandler();

            if (!bool.Parse(Configuration["ValidateSSL"]))
            {
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) =>
                {
                    return true;
                };
            }

            return httpClientHandler;
        }
    }
}
