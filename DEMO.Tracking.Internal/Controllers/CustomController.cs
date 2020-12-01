using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using DEMO.Tracking.Internal.Model;
using DEMO.Tracking.Internal.Resouce;
using Undani.Tracking.Tools;
using Undani.Tracking.Tools.Resource;
using IM = Undani.Identity.Model;
using System.Globalization;
using Undani.Identity.Helper;

namespace DEMO.Tracking.Internal.Controllers
{
    [Produces("application/json")]    
    public class CustomController : Controller
    {
        private IConfiguration _configuration;

        public CustomController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        #region UnidadOrganizacional
        [Authorize(Roles = "Administrator")]
        [Route("Administration/UnidadOrganizacional/GetList")]
        public List<UnidadOrganizacionalSummary> GetUnidadesOrganizacionales()
        {
            return new CustomCall(_configuration, User).GetUnidadesOrganizacionales();
        }

        [Authorize(Roles = "Administrator")]
        [Route("Administration/UnidadOrganizacional/Get")]
        public UnidadOrganizacional GetUnidadOrganizacional(int unidadOrganizacionalId)
        {
            return new CustomCall(_configuration, User).GetUnidadOrganizacional(unidadOrganizacionalId);
        }

        [Authorize(Roles = "Administrator")]
        [Route("Administration/UnidadOrganizacional/Set")]
        public bool SetUnidadOrganizacional(int unidadOrganizacionalId, string unidadOrganizacionalNombre)
        {
            return new CustomCall(_configuration, User).SetUnidadOrganizacional(unidadOrganizacionalId, unidadOrganizacionalNombre);
        }

        [Authorize(Roles = "Administrator")]
        [Route("Administration/UnidadOrganizacional/SetEmpleado")]
        public bool SetUnidadOrganizacionalEmpleado(int unidadOrganizacionalId, int empleadoId, int rolId, int anteriorRolId)
        {
            return new CustomCall(_configuration, User).SetUnidadOrganizacionalEmpleado(unidadOrganizacionalId, empleadoId, rolId, anteriorRolId);
        }

        [Authorize(Roles = "Administrator")]
        [Route("Administration/UnidadOrganizacional/DeleteEmpleado")]
        public bool DeleteUnidadOrganizacionalEmpleado(int unidadOrganizacionalId, int empleadoId, int rolId)
        {
            return new CustomCall(_configuration, User).DeleteUnidadOrganizacionalEmpleado(unidadOrganizacionalId, empleadoId, rolId);
        }

        [Authorize(Roles = "Administrator")]
        [Route("Administration/UnidadOrganizacional/GetEmpleados")]
        public List<EmpleadoEnrolado> GetUnidadOrganizacionalEmpleados(int unidadOrganizacionalId)
        {
            return new CustomCall(_configuration, User).GetUnidadOrganizacionalEmpleados(unidadOrganizacionalId);
        }
        #endregion

        #region Empleado
        [Authorize(Roles = "Administrator")]
        [Route("Administration/Empleado/GetList")]
        public List<Empleado> GetEmpleados(int rolId)
        {
            return new CustomCall(_configuration, User).GetEmpleados(rolId);
        }

        [Authorize(Roles = "Administrator")]
        [Route("Administration/Empleado/Get")]
        public Empleado GetEmpleado(int id)
        {
            return new CustomCall(_configuration, User).GetEmpleado(id);
        }

        [Authorize(Roles = "Administrator")]
        [Route("Administration/Empleado/Set")]
        public bool SetEmpleado(int id, string nombre, string apellidos, string userName, string reference, Guid userId)
        {
            Empleado empleado = new Empleado() { Id = id, Nombre = nombre, Apellidos = apellidos, UserName = userName, Reference = reference, UserId = userId };

            TrackingCall trackingCall = new TrackingCall(_configuration, User);
            IdentityCall identityCall = new IdentityCall(_configuration, User);

            string email;
            string password;
            if (empleado.UserName.Contains("@"))
            {
                if (empleado.UserName.Substring(empleado.UserName.IndexOf('@')) == _configuration["EmailPostfix"])
                {
                    email = empleado.UserName;
                    password = _configuration["EmailCommonPassword"];
                }
                else
                    throw new Exception("Lo sentimos, el usuario es incorrecto");
            }
            else
            {
                email = empleado.UserName;
                password = _configuration["LDAPCommonPassword"];
            }             

            if (new CustomCall(_configuration, User).SetEmpleado(empleado))
            {
                Guid ownerId = Guid.Parse(Environment.GetEnvironmentVariable("OWNER"));

                IM.User userIdentity = new IM.User()
                {
                    SubjectId = Guid.NewGuid().ToString(),
                    GivenName = empleado.Nombre,
                    FamilyName = empleado.Apellidos,
                    UserName = empleado.UserName,
                    Password = password,
                    Email = email,
                    Enabled = true,
                    Owners = new string[] { ownerId.ToString() }
                };

                userIdentity = identityCall.CreateUser(userIdentity);

                //UserIdentity userIdentity = identityCall.CreateUser(ownerId, empleado.Nombre, empleado.Apellidos, empleado.UserName, password, email, empleado.Reference);
                
                trackingCall.CreateUser(Guid.Parse(userIdentity.SubjectId), ownerId, empleado.Reference, "Interno", userIdentity.UserName, userIdentity.GivenName, userIdentity.FamilyName, userIdentity.Email, "{}");

                return true;
            }
            else
            {
                identityCall.UpdateUser(empleado.UserId, empleado.UserName, email);

                //trackingCall.UpdateUser(empleado.UserId, empleado.Reference, empleado.Nombre, empleado.Apellidos, email,);

                return false;
            }
        }
        #endregion Empleado

        #region Administration
        [Authorize(Roles = "Administrator,Binnacle")]
        [HttpPost]
        [Route("Repository/Search")]
        public List<ProcedureInstanceSupport> GetRepositoryProcedureInstance([FromForm] string nombre, [FromForm] string rfc, [FromForm] string folio)
        {
            return new CustomCall(_configuration, User).GetRepositoryProcedureInstance(nombre, rfc, folio);
        }

        [Authorize(Roles = "Administrator,Binnacle")]
        [Route("Repository/Information")]
        public List<Activityinformation> GetRepositoryInformationProcedureInstance(Guid procedureInstanceRefId)
        {
            return new CustomCall(_configuration, User).GetRepositoryInformationProcedureInstance(procedureInstanceRefId);
        }

        [Authorize(Roles = "Administrator,Binnacle")]
        [Route("Repository/InformationDocuments")]
        public List<RepositoryInformationDocument> GetRepositoryInformationDocuments(Guid formInstanceId)
        {
            return new CustomCall(_configuration, User).GetRepositoryInformationDocuments(formInstanceId);
        }
        #endregion

        #region BusinessRule
        [AllowAnonymous]
        [HttpPost]
        [Route("BusinessRule")]
        public BusinessRule GetBusinessRule(string key, [FromForm] string inputValue)
        {
            return new CustomCall(_configuration, User).GetBusinessRule(key, inputValue);
        }

        [Authorize(Roles = "Administrator")]
        [Route("Administration/BusinessRule/GetList")]
        public List<BusinessRule> GetBusinessRules()
        {
            return new CustomCall(_configuration, User).GetBusinessRules();
        }

        [Authorize(Roles = "Administrator")]
        [Route("Administration/BusinessRule/Set")]
        public bool SetBusinessRule(string key, string content)
        {
            DateTime fecha = DateTime.Parse(content, new CultureInfo("es-MX"));

            return new CustomCall(_configuration, User).SetBusinessRule(key, content);
        }
        #endregion Empleado

        #region Account  
        [HttpPost]
        [Route("Account/SignIn")]
        public string SignIn([FromForm]string userName, [FromForm]string password)
        {
            int limitIntents = int.Parse(_configuration["LimitIntentLogin"]);
            var usrReposotory = new UserRepository(_configuration["CnDbIdentity"]);

            var limites = usrReposotory.GetIntentLogin(userName);

            if (limitIntents <= limites)
            {
                return "La cuenta de usuario se encuentra bloqueada. Contacte al administrador.";
            }

            var usr = usrReposotory.FindByUsername(userName);

            if (!usrReposotory.ValidateCredentials(userName, password))
            {
                return "Lo sentimos, el usuario o la contraseña que proporcionó no son correctos. Por favor, intente de nuevo.";
            }

            return "";
        }
        #endregion
    }
}