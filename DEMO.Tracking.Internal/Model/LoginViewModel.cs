
using System;
using System.Collections.Generic;
using System.Linq;

namespace DEMO.Tracking.Internal.Model
{
    public class LoginViewModel: LoginInputModel
    {
        public bool Error { get; set; } = false;
        public string Description { get; set; }


    }
}
