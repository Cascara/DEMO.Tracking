using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DEMO.Tracking.Internal.Model
{
    public class ProcedureInstanceSupport
    {
        public Guid RefId { get; set; }
        public Guid ProcedureRefId { get; set; }
        public string Name { get; set; }
        public string Key { get; set; }
        public string Content { get; set; }
        public DateTime Start { get; set; }
        public DateTime? End { get; set; }
    }
}
