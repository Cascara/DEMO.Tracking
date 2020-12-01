using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using DEMO.Tracking.Internal.Model;
using Undani.Tracking.Tools;

namespace DEMO.Tracking.Internal.Resouce
{
    public class CustomCall : Call
    {
        public CustomCall(IConfiguration configuration, ClaimsPrincipal user) : base(configuration, user) { }

        #region UnidadOrganizacional
        public List<UnidadOrganizacionalSummary> GetUnidadesOrganizacionales()
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Authorization", Token);

            string url = Configuration["ApiBr"] + "/Administration/UnidadOrganizacional/GetList";

            var content = client.GetStringAsync(url);

            string json = content.Result;

            return JsonConvert.DeserializeObject<List<UnidadOrganizacionalSummary>>(json);
        }

        public UnidadOrganizacional GetUnidadOrganizacional(int unidadOrganizacionalId)
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Authorization", Token);

            string url = Configuration["ApiBr"] + "/Administration/UnidadOrganizacional/Get?unidadOrganizacionalId=" + unidadOrganizacionalId.ToString();

            var content = client.GetStringAsync(url);

            string json = content.Result;

            return JsonConvert.DeserializeObject<UnidadOrganizacional>(json);
        }

        public bool SetUnidadOrganizacional(int unidadOrganizacionalId, string unidadOrganizacionalNombre)
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Authorization", Token);

            string url = Configuration["ApiBr"] + "/Administration/UnidadOrganizacional/Set?unidadOrganizacionalId=" + unidadOrganizacionalId.ToString() + "&unidadOrganizacionalNombre=" + unidadOrganizacionalNombre;

            var content = client.GetStringAsync(url);

            string json = content.Result;

            return JsonConvert.DeserializeObject<bool>(json);
        }

        public bool SetUnidadOrganizacionalEmpleado(int unidadOrganizacionalId, int empleadoId, int rolId, int anteriorRolId)
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Authorization", Token);

            string url = Configuration["ApiBr"] + "/Administration/UnidadOrganizacional/SetEmpleado?unidadOrganizacionalId=" + unidadOrganizacionalId.ToString() + "&empleadoId=" + empleadoId.ToString() + "&rolId=" + rolId.ToString() + "&anteriorRolId=" + anteriorRolId;

            var content = client.GetStringAsync(url);

            string json = content.Result;

            return JsonConvert.DeserializeObject<bool>(json);
        }

        public bool DeleteUnidadOrganizacionalEmpleado(int unidadOrganizacionalId, int empleadoId, int rolId)
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Authorization", Token);

            string url = Configuration["ApiBr"] + "/Administration/UnidadOrganizacional/DeleteEmpleado?unidadOrganizacionalId=" + unidadOrganizacionalId.ToString() + "&empleadoId=" + empleadoId.ToString() + "&rolId=" + rolId.ToString();

            var content = client.GetStringAsync(url);

            string json = content.Result;

            return JsonConvert.DeserializeObject<bool>(json);
        }

        public List<EmpleadoEnrolado> GetUnidadOrganizacionalEmpleados(int unidadOrganizacionalId)
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Authorization", Token);

            string url = Configuration["ApiBr"] + "/Administration/UnidadOrganizacional/GetEmpleados?unidadOrganizacionalId=" + unidadOrganizacionalId.ToString();

            var content = client.GetStringAsync(url);

            string json = content.Result;

            return JsonConvert.DeserializeObject<List<EmpleadoEnrolado>>(json);
        }
        #endregion UnidadOrganizacional

        #region Empleado
        public List<Empleado> GetEmpleados(int rolId)
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Authorization", Token);

            string url = Configuration["ApiBr"] + "/Administration/Empleado/GetList?rolId=" + rolId.ToString();

            var content = client.GetStringAsync(url);

            string json = content.Result;

            return JsonConvert.DeserializeObject<List<Empleado>>(json);
        }

        internal Empleado GetEmpleado(int id)
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Authorization", Token);

            string url = Configuration["ApiBr"] + "/Administration/Empleado/Get?id=" + id.ToString();

            var content = client.GetStringAsync(url);

            string json = content.Result;

            return JsonConvert.DeserializeObject<Empleado>(json);
        }

        public bool SetEmpleado(Empleado empleado)
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Authorization", Token);

            string url = Configuration["ApiBr"] + "/Administration/Empleado/Set";

            StringContent contentJson = new StringContent(JsonConvert.SerializeObject(empleado), Encoding.UTF8, "application/json");
            HttpResponseMessage response = client.PostAsync(url, contentJson).Result;

            if (response.StatusCode != HttpStatusCode.OK)
                throw new Exception("Hay un problema al intentar crear al usuario");

            return JsonConvert.DeserializeObject<bool>(response.Content.ReadAsStringAsync().Result);
        }
        #endregion

        #region ProcedureInstance
        public List<ProcedureInstanceSupport> GetRepositoryProcedureInstance(string nombre, string rfc, string folio)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", Token);

                string url = Configuration["ApiBr"] + "/Administration/ProcedureInstance/GetRepository";

                var formParameters = new List<KeyValuePair<string, string>>();
                formParameters.Add(new KeyValuePair<string, string>("nombre", nombre));
                formParameters.Add(new KeyValuePair<string, string>("rfc", rfc));
                formParameters.Add(new KeyValuePair<string, string>("folio", folio));
                var formContent = new FormUrlEncodedContent(formParameters);

                HttpResponseMessage response = client.PostAsync(url, formContent).Result;

                if (response.StatusCode != HttpStatusCode.OK)
                    throw new Exception("No fue posible acceder a una lista de instancias de proceso");

                return JsonConvert.DeserializeObject<List<ProcedureInstanceSupport>>(response.Content.ReadAsStringAsync().Result);
            }
        }

        public List<Activityinformation> GetRepositoryInformationProcedureInstance(Guid procedureInstanceRefId)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", Token);

                string url = Configuration["ApiBr"] + "/Administration/ProcedureInstance/GetRepositoryInformation?procedureInstanceRefId=" + procedureInstanceRefId.ToString();

                HttpResponseMessage response = client.GetAsync(url).Result;

                if (response.StatusCode != HttpStatusCode.OK)
                    throw new Exception("No fue posible acceder a una lista de instancias de proceso");

                return JsonConvert.DeserializeObject<List<Activityinformation>>(response.Content.ReadAsStringAsync().Result);
            }
        }

        public List<RepositoryInformationDocument> GetRepositoryInformationDocuments(Guid formInstanceId)
        {
            using (var client = new HttpClient())
            {
                string url = Configuration["ApiBox"] + "/Execution/Box/Download/" + formInstanceId.ToString();

                HttpResponseMessage response = client.GetAsync(url).Result;

                if (response.StatusCode != HttpStatusCode.OK)
                    throw new Exception("No fue posible acceder a una lista de instancias de proceso");

                return JsonConvert.DeserializeObject<List<RepositoryInformationDocument>>(response.Content.ReadAsStringAsync().Result);
            }
        }
        #endregion

        #region BusinessRule
        public BusinessRule GetBusinessRule(string key, string inputValue)
        {
            using (var client = new HttpClient())
            {
                string url = Configuration["ApiBr"] + "/Custom/BusinessRule/Execute?key=" + key;

                var formParameters = new List<KeyValuePair<string, string>>();
                formParameters.Add(new KeyValuePair<string, string>("inputValue", inputValue));
                var formContent = new FormUrlEncodedContent(formParameters);

                HttpResponseMessage response = client.PostAsync(url, formContent).Result;

                if (response.StatusCode != HttpStatusCode.OK)
                    throw new Exception("No fue posible acceder a la regla de negocio");

                string json = response.Content.ReadAsStringAsync().Result;

                return JsonConvert.DeserializeObject<BusinessRule>(json);
            }
        }

        public List<BusinessRule> GetBusinessRules()
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Authorization", Token);

            string url = Configuration["ApiBr"] + "/Administration/BusinessRule/GetList";

            var content = client.GetStringAsync(url);

            string json = content.Result;

            return JsonConvert.DeserializeObject<List<BusinessRule>>(json);
        }

        public bool SetBusinessRule(string key, string content)
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Authorization", Token);

            string url = Configuration["ApiBr"] + "/Administration/BusinessRule/Set?key=" + key + "&content=" + content;

            HttpResponseMessage response = client.GetAsync(url).Result;

            if (response.StatusCode != HttpStatusCode.OK)
                throw new Exception("Hay un problema al intentar actualizar la fecha");

            return JsonConvert.DeserializeObject<bool>(response.Content.ReadAsStringAsync().Result);
        }
        #endregion
    }
}
