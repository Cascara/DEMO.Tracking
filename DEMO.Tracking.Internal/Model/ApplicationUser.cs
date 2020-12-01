using Microsoft.AspNetCore.Identity;
using Undani;

namespace DEMO.Tracking.Internal.Model
{
    public class ApplicationUser : IdentityUser
    {


    }

    public class RegisterUser : IdentityUser
    {
        private string aesPssword;
        public string AESPssword
        {
            get
            {
                var appKey = this.Id.Replace("-", "").ToUpper().Trim().Substring(0, 16);
                aesPssword = Undani.Security.DecryptString(this.aesPssword, appKey, appKey);
                return aesPssword;
            }
            set
            {
                var appKey = this.Id.Replace("-", "").ToUpper().Trim().Substring(0, 16);
                value = Undani.Security.EncryptString(this.aesPssword, appKey, appKey);
                aesPssword = value;
            }
        }

        public string Password { get; set; }
    }
}
