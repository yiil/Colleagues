using System.Collections.Generic;

namespace InterestsDataAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        public string approveListStr { get; set; }

        public string matchListStr { get; set; }

        private string iMatches { get; set; }
        
        public string UserId { get; set; }

        public List<string> Interests {
            get {
                if (string.IsNullOrEmpty(InterestsStr))
                {
                    return new List<string>();
                }
                string[] parts = InterestsStr.Split(','); 
                return new List<string>(parts); 
            }
            set {
                InterestsStr = string.Join(",", value);
                InterestsStr = InterestsStr.ToLower();
            }
        }
        public List<string> AddInterests (List<string> interests)
        {
            if(string.IsNullOrEmpty(InterestsStr))
            {
                return null;
            }

            List<string> I = Interests;

            foreach (var i in interests)
            {
                if (!I.Contains(i))
                {
                    I.Add(i);
                }
            }

            Interests = I;
            return I;
        }
        public List<string> RemoveInterests(List<string> interests)
        {
            if (string.IsNullOrEmpty(InterestsStr))
            {
                return null;
            }

            List<string> I = Interests;

            foreach (var i in interests)
            {
                I.Remove(i);
            }

            Interests = I;
            return I;
        }

        public List<string> ApproveList
        {
            get
            {
                if(string.IsNullOrEmpty(approveListStr))
                {
                    return new List<string>();
                }
                string[] parts = approveListStr.Split(',');
                return new List<string>(parts);
            }
            set
            {
                approveListStr = string.Join(",", value);
            }
        }
        public List<string> AddApprove (string newApprove)
        {

            List<string> a = ApproveList;

            if (!a.Contains(newApprove))
            {
                a.Add(newApprove);
            }

            ApproveList = a;
            return a;

        }
        public List<string> RemoveApproves (List<string> oldApproves)
        {

            List<string> a = ApproveList;

            foreach (var oa in oldApproves)
            {
                a.Remove(oa);
            }

            ApproveList = a;
            return a;
        }

        public List<string> MatchList
        {
            get
            {
                if (string.IsNullOrEmpty(matchListStr))
                {
                    return new List<string>();
                }
                string[] parts = matchListStr.Split(',');
                return new List<string>(parts);
            }
            set
            {
                matchListStr = string.Join(",", value);
            }
        }
        public List<string> AddMatch(string match)
        {
            List<string> m = MatchList;
            if (!m.Contains(match))
            {
                m.Add(match);
            }
            MatchList = m;
            return m;
        }
        public List<string> AddMatches (List<string> newMatches)
        {
            List<string> m = MatchList;

            foreach (var nm in newMatches)
            {
                if (!m.Contains(nm))
                {
                    m.Add(nm);
                }
            }

            MatchList = m;
            return m;
        }
        public List<string> RemoveMatches (List<string> oldMatches)
        {
            List<string> m = MatchList;

            foreach (var om in oldMatches)
            {
                m.Remove(om);
            }

            MatchList = m;
            return m;
        }

        // TODO: cleanup for post match making. Removes from approve and matches list.
        public string InterestsStr { get; set; }
    }
}
