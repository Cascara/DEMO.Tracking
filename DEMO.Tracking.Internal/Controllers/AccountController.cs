using DEMO.Tracking.Internal.Model;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Security.Claims;
using System.Threading.Tasks;
using Undani.Identity.Helper;
using Undani.JWT;

namespace DEMO.Tracking.Internal.Controllers
{
    public class AccountController : Controller
    {
        private IConfiguration _configuration;

        public AccountController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            return View();

        }

        public IActionResult LogIn(string ReturnUrl)
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            int limitIntents = int.Parse(_configuration["LimitIntentLogin"]);
            var usrReposotory = new UserRepository(_configuration["CnDbIdentity"]);

            var limites = usrReposotory.GetIntentLogin(model.Username);

            if (limitIntents <= limites)
            {
                model.Error = true;
                model.Description = "La cuenta de usuario se encuentra bloqueada. Contacta al administrador";

                return View(model);
            }

            var usr = usrReposotory.FindByUsername(model.Username);

            if (usrReposotory.ValidateCredentials(model.Username, model.Password))
            {
                var claims = new List<Claim>{
            new Claim(ClaimTypes.NameIdentifier, usr.SubjectId),
            new Claim(ClaimTypes.Name, usr.UserName),
            new Claim(ClaimTypes.Email, usr.Email),
            new Claim(ClaimTypes.GivenName, usr.GivenName) };

                var claimsIdentity = new ClaimsIdentity(
                    claims, CookieAuthenticationDefaults.AuthenticationScheme);

                var authProperties = new AuthenticationProperties
                {
                    AllowRefresh = true,
                    // Refreshing the authentication session should be allowed.

                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30),
                    // The time at which the authentication ticket expires. A 
                    // value set here overrides the ExpireTimeSpan option of 
                    // CookieAuthenticationOptions set with AddCookie.

                    IsPersistent = true,
                    // Whether the authentication session is persisted across 
                    // multiple requests. When used with cookies, controls
                    // whether the cookie's lifetime is absolute (matching the
                    // lifetime of the authentication ticket) or session-based.

                    //IssuedUtc = <DateTimeOffset>,
                    // The time at which the authentication ticket was issued.

                    //RedirectUri = <string>
                    // The full path or absolute URI to be used as an http 
                    // redirect response value.
                };

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity), authProperties);


                return Redirect(model.ReturnUrl);
            }
            else
            {
                model.Error = true;
                model.Description = "Acceso Denegado";

                return View(model);
            }
        }

        public async Task<IActionResult> LogOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Redirect("/");
        }

        public IActionResult AccessDenied()
        {
            return View();
        }
        public JsonResult GetToken()
        {
            if (User.Identity.IsAuthenticated)
            {
                return Json(new { token = "Bearer " + JWToken.Token((ClaimsIdentity)User.Identity) });
            }
            else
            {
                dynamic userAnonymous = JsonConvert.DeserializeObject<ExpandoObject>(_configuration["DataAnonymous"], new ExpandoObjectConverter());

                var claims = new List<Claim>();

                claims.Add(new Claim(ClaimTypes.Name, userAnonymous.Name));
                claims.Add(new Claim(ClaimTypes.NameIdentifier, userAnonymous.NameIdentifier));
                claims.Add(new Claim(ClaimTypes.Email, userAnonymous.Email));
                claims.Add(new Claim(ClaimTypes.GroupSid, userAnonymous.Email));

                var _Identity = new ClaimsIdentity(claims, "Basic");
                return Json(new { token = "Bearer " + JWToken.Token((ClaimsIdentity)User.Identity) });
            }
        }
    }
}