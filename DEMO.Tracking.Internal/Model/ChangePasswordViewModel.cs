namespace DEMO.Tracking.Internal.Model
{
    public class ChangePasswordViewModel
    {
        public string SubjectId { get; set; }
        public string UserName { get; set; }
        public string ReturnUrl { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
        public string Acronym { get; set; }

    }
}
