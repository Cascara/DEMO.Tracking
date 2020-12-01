using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DEMO.Tracking.Internal.Model
{
    public class RepositoryInformationDocument
    {
        public string ExpirationDate { get; set; }
        public string SystemName { get; set; }
        public string OriginalName { get; set; }
        public string EnviromentContainerRefId { get; set; }
        public string ContentType { get; set; }
        public string Hash { get; set; }
        public string SourceIp { get; set; }
        public string InstanceId { get; set; }
        public string MetaData { get; set; }
        public string CreatedDate { get; set; }
        public string Size { get; set; }
    }
}
