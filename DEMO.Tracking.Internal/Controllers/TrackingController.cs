using DEMO.Tracking.Internal.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using Undani.Tracking.Tools;
using Undani.Tracking.Tools.Resource;

namespace DEMO.Tracking.Internal.Controllers
{
    [Produces("application/json")]
    [Route("Tracking")]
    [Authorize(Roles = "Interno")]
    public class TrackingController : Controller
    {
        private IConfiguration _configuration;

        public TrackingController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        #region ProcedureInstance
        [Route("ProcedureInstance/Create")]
        public ProcedureInstanceCreated CreateProcedureInstance(Guid procedureRefId, string procedureInstanceKey)
        {
            return new TrackingCall(_configuration, User).CreateProcedureInstance(procedureRefId, procedureInstanceKey, Guid.Empty);
        }

        [Route("ProcedureInstance/GetInProcess")]
        public List<ProcedureInstanceSummary> GetProcedureInstanceInProcess()
        {
            return new TrackingCall(_configuration, User).GetProcedureInstanceInProcess();
        }

        [Route("ProcedureInstance/GetInProcessCount")]
        public int GetProcedureInstanceInProcessCount()
        {
            return new TrackingCall(_configuration, User).GetProcedureInstanceInProcessCount();
        }

        [Route("ProcedureInstance/GetLog")]
        public List<ActivityInstanceSummary> GetProcedureInstanceLog(Guid procedureInstanceRefId)
        {
            return new TrackingCall(_configuration, User).GetProcedureInstanceLog(procedureInstanceRefId);
        }

        [Route("ProcedureInstance/GetSupportLog")]
        public List<ActivityInstanceSummary> GetSupportProcedureInstanceLog(Guid procedureInstanceRefId)
        {
            Guid ownerId = Guid.Parse(Environment.GetEnvironmentVariable("OWNER"));

            List<ActivityInstanceSummary> activityInstanceSummaries = new TrackingCall(_configuration, User).GetSupportProcedureInstanceLog(ownerId, procedureInstanceRefId);

            List<ActivityInstanceSummary> aisResponse = new List<ActivityInstanceSummary>();

            foreach (ActivityInstanceSummary ais in activityInstanceSummaries)
            {
                if (ais.CatalogId == "FONACOT/I/A0001" || ais.CatalogId == "FONACOT/I/A0002")
                {
                    aisResponse.Add(ais);
                }
            }

            return aisResponse;
        }

        [Route("ProcedureInstance/GetComments")]
        public List<Comment> GetProcedureInstanceComments(Guid procedureInstanceRefId)
        {
            return new TrackingCall(_configuration, User).GetProcedureInstanceComments(procedureInstanceRefId);
        }

        [Route("ProcedureInstance/SetComment")]
        public string SetProcedureInstanceComment(Guid elementInstanceRefId, string comment)
        {
            return new TrackingCall(_configuration, User).SetProcedureInstanceComment(elementInstanceRefId, comment);
        }

        [Route("ProcedureInstance/IsDesist")]
        public bool IsProcedureInstanceDesist(Guid procedureInstanceRefId)
        {
            dynamic states = new TrackingCall(_configuration, User).GetProcedureInstanceState(procedureInstanceRefId);

            if (states.principal == "En desistimiento")
                return true;
            else
                return false;
        }

        [HttpPost]
        [Route("ProcedureInstance/SetContentProperty")]
        public bool SetProcedureInstanceContentProperty(Guid procedureInstanceRefId, [FromForm] string value)
        {
            return new TrackingCall(_configuration, User).SetProcedureInstanceContentProperty(procedureInstanceRefId, value);
        }

        [Authorize(Roles = "Administrator")]
        [Route("ProcedureInstance/Transfer")]
        public bool ProcedureInstanceTransfer(Guid procedureInstanceRefId, Guid destinyUserId, string key)
        {
            return new TrackingCall(_configuration, User).ProcedureInstanceTransfer(procedureInstanceRefId, destinyUserId, key);
        }

        [Authorize(Roles = "Administrator")]
        [Route("ProcedureInstance/TransferAll")]
        public bool ProcedureInstanceTransfer(Guid sourceUserId, Guid destinyUserId)
        {
            return new TrackingCall(_configuration, User).ProcedureInstanceTransferAll(sourceUserId, destinyUserId);
        }

        [Route("ProcedureInstance/GetUserSelected")]
        public List<UserSelected> GetProcedureInstanceUserSelected(Guid procedureInstanceRefId)
        {
            return new TrackingCall(_configuration, User).GetProcedureInstanceUserSelected(procedureInstanceRefId);
        }
        #endregion

        #region ActivityInstance

        #endregion

        #region Message
        [Route("Message/GetReceivedCount")]
        public int GetMessagesReceivedCount()
        {
            return new TrackingCall(_configuration, User).GetMessagesReceivedCount();
        }

        [Route("Message/GetDrafts")]
        public List<Message> GetMessagesDrafts()
        {
            return new TrackingCall(_configuration, User).GetMessagesDrafts();
        }

        [Route("Message/GetOpen")]
        public OpenedMessage GetMessageOpen(Guid messageId)
        {
            return new TrackingCall(_configuration, User).GetMessageOpen(messageId);
        }
        #endregion

        #region ActionInstance
        [Route("ActionInstance/Execute")]
        public bool ExecuteActionInstance(Guid actionRefId, Guid elementInstanceRefId)
        {
            TrackingCall trackingCall = new TrackingCall(_configuration, User);
            return trackingCall.ExecuteActionInstance(actionRefId, elementInstanceRefId);
        }
        #endregion

        #region User
        [Route("User/GetAddresseeList")]
        public List<Addressee> GetAddresseeList(string subject)
        {
            string role = null;
            string alternateRol = string.Empty;

            switch (subject)
            {
                case "constancia":
                    role = "IFT8_Interesado";
                    alternateRol = "IFT8_NoParticipante";
                    break;

                case "acuerdo":
                    role = "IFT8_Interesado";
                    alternateRol = "IFT8_Participante";
                    break;

                case "fallo":
                    role = "IFT8_Participante";
                    break;

                case "contraprestacion":
                    role = "IFT8_Ganador";
                    break;

                case "general":
                    role = "IFT8_Interesado";
                    break;
            }

            TrackingCall trackingCall = new TrackingCall(_configuration, User);

            List<UserSummary> userSummaries = trackingCall.GetUsers(role);
            List<Addressee> addressees = new List<Addressee>();
            if (alternateRol != string.Empty)
            {
                List<UserSummary> alternateUserSummaries = new List<UserSummary>();

                alternateUserSummaries = trackingCall.GetUsers(alternateRol);

                foreach (UserSummary user in userSummaries.OrderBy(item => item.UserName).ToList())
                {
                    if (!alternateUserSummaries.Exists(u => u.Id == user.Id))
                    {
                        addressees.Add(new Addressee()
                        {
                            Id = user.Id,
                            Name = (user.UserName + " / " + user.GivenName + " " + user.FamilyName).Trim(),
                            EMail = user.EMail
                        });
                    }
                }
            }
            else
            {
                foreach (UserSummary user in userSummaries.OrderBy(item => item.UserName).ToList())
                {
                    addressees.Add(new Addressee()
                    {
                        Id = user.Id,
                        Name = (user.UserName + " / " + user.GivenName + " " + user.FamilyName).Trim(),
                        EMail = user.EMail
                    });
                }
            }            

            return addressees;
        }
        #endregion
    }
}