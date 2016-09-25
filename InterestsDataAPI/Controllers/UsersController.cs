using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using InterestsDataAPI.Models;

namespace InterestsDataAPI.Controllers
{
    public class UsersController : ApiController
    {
        private InterestsDataAPIContext db = new InterestsDataAPIContext();

        // GET: api/Users
        [HttpGet]
        [Route("api/Users")]
        public IQueryable<User> GetUsers()
        {
            return db.Users;
        }

        /*// GET: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> GetUser(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }*/

        // GET: api/Users/userId
        [HttpGet]
        [ResponseType(typeof(User))]
        [Route("api/Users/{userId}")]
        public async Task<IHttpActionResult> GetUserByUserId(string userId)
        {
            User user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null || !UserExists(userId))
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PATCH: api/Users/guid
        [ResponseType(typeof(User))]
        [HttpPatch]
        [Route("api/Users/{userId}")]
        public async Task<IHttpActionResult> PatchUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (user == null)
            {
                return BadRequest("user can't be empty");
            }

            User xuser = await db.Users.FirstOrDefaultAsync(u => u.UserId == user.UserId);

            if (user == null)
            {
                return NotFound();
            }

            xuser.ApproveList = user.ApproveList;
            xuser.MatchList = user.MatchList;
            xuser.Interests = user.Interests;            

            db.Entry(user).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(user.UserId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(user);
        }

        // PATCH: api/Users/guid/add
        [ResponseType(typeof(User))]
        [HttpPatch]
        [Route("api/Users/{userId}/add")]
        public async Task<IHttpActionResult> AddUserInterests(string userId, List<string> interests)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(userId) || interests == null)
            {
                return BadRequest("userId or interests can't be empty");
            }

            User user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound();
            }

            user.AddInterests(interests);

            db.Entry(user).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(userId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(user);
        }

        // PATCH: api/Users/guid/remove
        [ResponseType(typeof(User))]
        [HttpPatch]
        [Route("api/Users/{userId}/remove")]
        public async Task<IHttpActionResult> RemoveUserInterests(string userId, List<string> interests)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(userId) || interests == null)
            {
                return BadRequest("userId or interests can't be empty");
            }

            User user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound();
            }

            user.RemoveInterests(interests);

            db.Entry(user).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(userId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(user);
        }

        // POST: api/Users
        [ResponseType(typeof(User))]
        [HttpPost]
        [Route("api/Users/{userId}")]
        public async Task<IHttpActionResult> PostUser(string userId, List<string> interests)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (UserExists(userId))
            {
                return BadRequest("User " + userId + " already exists! Please enter a unique user Id");
            }

            User user = new User();

            user.UserId = userId;
            user.Interests = interests;
            db.Users.Add(user);
            await db.SaveChangesAsync();

            return Created("api/Users/" + userId, user);
        }

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        [HttpDelete]
        [Route("api/Users/{userId}")]
        public async Task<IHttpActionResult> DeleteUser(string userId)
        {
            User user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            await db.SaveChangesAsync();

            return Ok(user);
        }

        // POST: api/Users/userId/judge/colleagueId
        [ResponseType(typeof(User))]
        [HttpPost]
        [Route("api/Users/{userId}/judge/{colleagueId}")]
        public async Task<IHttpActionResult> PassJudgement(string userId, string colleagueId, bool judgement)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(userId) || colleagueId == null)
            {
                return BadRequest("userId or colleague's can't be empty");
            }

            User user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound();
            }

            if(judgement)
            {
                user.AddApprove(colleagueId);
                db.Entry(user).State = EntityState.Modified;
            }

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(userId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(user);
        }

        [ResponseType(typeof(List<User>))]
        [HttpGet]
        [Route("api/Users/{userId}/matches")]
        public async Task<IHttpActionResult> GetMatches(string userId)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("userId can't be empty");
            }

            if (!UserExists(userId)) { return NotFound(); }

            User user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            List<User> matches = new List<User>();
            User match = new User();
            foreach (var au in user.ApproveList)
            {
                if(user.MatchList.Contains(au))
                {
                    continue;
                }
                match = await db.Users.FirstOrDefaultAsync(u => (u.UserId == au && u.approveListStr.Contains(userId)));
                if(match != null)
                {
                    matches.Add(match);
                    user.AddMatch(match.UserId);
                    match.AddMatch(userId);
                }
            }
            return Ok(matches);

        }

        [ResponseType(typeof(List<User>))]
        [HttpGet]
        [Route("api/Users/{userId}/candidates")]
        public async Task<IHttpActionResult> GetCandidates(string userId) 
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("userId can't be empty");
            }

            if (!UserExists(userId)) { return NotFound(); }

            User user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            List<User> all = db.Users.ToList();
            List<User> candidates = new List<User>();
            User tempU;
            foreach (var ui in user.Interests)
            {
                for (int i = 0; i < all.Count; i++)
                {
                    tempU = all.ElementAt(i);
                    if(tempU != null && tempU.UserId != userId && tempU.Interests.Contains(ui))
                    {
                        candidates.Add(tempU);
                        all.Remove(tempU);
                    }
                }
            }
            return Ok(candidates);
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.Id == id) > 0;
        }

        public bool UserExists(string userId)
        {
            if(db.Users.FirstOrDefault(u => u.UserId == userId) == null)
                return false;
            return true;
        }
    }
}