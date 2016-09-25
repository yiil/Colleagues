using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Security.Claims;
using System.IdentityModel.Tokens;
using System.Diagnostics;
using InterestsDataAPI.Models;
using System.Configuration;

namespace InterestsDataAPI.Controllers
{
    public class InterestsController : ApiController
    {
        // Uncomment following lines for service principal authentication
        //private static string trustedCallerClientId = ConfigurationManager.AppSettings["todo:TrustedCallerClientId"];
        //private static string trustedCallerServicePrincipalId = ConfigurationManager.AppSettings["todo:TrustedCallerServicePrincipalId"];

        private static Dictionary<int, User> mockData = new Dictionary<int, User>();

        static InterestsController()
        {
            List<string> ui1 = new List<string>();
            List<string> ui2 = new List<string>();

            ui1.Add("dnd");
            ui1.Add("hiking");
            ui1.Add("boardgames");
            ui2.Add("dog");
            ui2.Add("cat");
            ui2.Add("hiking");

            mockData.Add(0, new User { Id = 0, UserId = "GUID1", Interests = ui1});
            mockData.Add(1, new User { Id = 1, UserId = "GUID2", Interests = ui2 });
        }

        private static void CheckCallerId()
        {
            // Uncomment following lines for service principal authentication
            //string currentCallerClientId = ClaimsPrincipal.Current.FindFirst("appid").Value;
            //string currentCallerServicePrincipalId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
            //if (currentCallerClientId != trustedCallerClientId || currentCallerServicePrincipalId != trustedCallerServicePrincipalId)
            //{
            //    throw new HttpResponseException(new HttpResponseMessage { StatusCode = HttpStatusCode.Unauthorized, ReasonPhrase = "The appID or service principal ID is not the expected value." });
            //}
        }

        // GET: api/Interests
        [Route("api/Interests")]
        public IEnumerable<User> Get()
        {
            CheckCallerId();

            return mockData.Values;
        }

        // GET: api/Interests/guid
        [Route("api/Interests/{userId}")]
        public User GetById(string userId)
        {
            CheckCallerId();

            return mockData.Values.Where(m => m.UserId == userId).FirstOrDefault();
        }

        // POST: api/Interests/guid
        [HttpPost]
        [Route("api/Interests/{userId}")]
        public User Post(string userId, List<string> interests)
        {
            CheckCallerId();

            User u = new User();
            u.Id = mockData.Count > 0 ? mockData.Keys.Max() + 1 : 1;
            u.UserId = userId;
            u.Interests = interests;
            mockData.Add(u.Id, u);
            return u;
        }

        // Patch: api/Interests/guid/add
        [HttpPatch]
        [Route("api/Interests/{userId}/add")]
        public User Add(string userId, List<string> newInterests)
        {
            CheckCallerId();

            User xu = mockData.Values.FirstOrDefault(a => (a.UserId == userId));
            if (userId != null && xu != null)
            {
                foreach (var i in newInterests)
                {
                    if (!xu.Interests.Contains(i))
                        xu.Interests.Add(i);
                }
            }
            return xu;
        }

        // Patch: api/Interests/guid/add
        [HttpPatch]
        [Route("api/Interests/{userId}/remove")]
        public User Remove(string userId, List<string> deadInterests)
        {
            CheckCallerId();

            User xu = mockData.Values.FirstOrDefault(a => (a.UserId == userId));
            if (userId != null && xu != null)
            {
                foreach (var i in deadInterests)
                {
                    if (xu.Interests.Contains(i))
                        xu.Interests.Remove(i);
                }
            }
            return xu;
        }

        // PATCH: api/Interests/guid
        [HttpPatch]
        [Route("api/interests/{userid}")]
        public User Patch(string userId, List<string> interests)
        {
            CheckCallerId();

            User xu = mockData.Values.FirstOrDefault(a => (a.UserId == userId));
            if (userId != null && xu != null)
            {
                xu.Interests = interests;
            }
            return xu;
        }

        /*// DELETE: api/Interests/guid
        [Route("api/Interests/{id}")]
        public void Delete(int id)
        {
            CheckCallerId();

            User u = mockData.Values.First(a => a.Id == id);
            if (u != null)
            {
                mockData.Remove(u.Id);
            }
        }*/

        // DELETE: api/Interests/guid
        [HttpDelete]
        [Route("api/Interests/{userId}")]
        public void DeleteByUserId(string userId)
        {
            CheckCallerId();

            User u = mockData.Values.First(a => a.UserId == userId);
            if (u != null)
            {
                mockData.Remove(u.Id);
            }
        }
    }
}

