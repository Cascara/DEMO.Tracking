using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;

[assembly: HostingStartup(typeof(DEMO.Tracking.Internal.Configuration))]
namespace DEMO.Tracking.Internal
{
    internal class Configuration : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration(config =>
            {
                var dic = Undani.Configuration.Load(
                    Environment.GetEnvironmentVariable("OWNER"),
                    Environment.GetEnvironmentVariable("SYSTEM")
                    );

                dic["WebForm"] = "https://serift8-dev.karaklab.com";

                var dicForm = Undani.Configuration.Load(
                    Environment.GetEnvironmentVariable("OWNER"),
                    Environment.GetEnvironmentVariable("SYSTEM_FORM")
                    );

                dicForm["WebForm"] = "https://serift8-dev.karaklab.com";

                dicForm.Add("WebIdentityRedirect", $"{dic["WebIdentity"]}/login/" + Environment.GetEnvironmentVariable("LOGOUT"));

                dic.Add("ConfigurationForm", JsonConvert.SerializeObject(dicForm));

                config.AddInMemoryCollection(dic);
            });
        }
    }
}
