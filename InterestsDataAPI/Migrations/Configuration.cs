namespace InterestsDataAPI.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using InterestsDataAPI.Models;
    using System.Collections.Generic;

    internal sealed class Configuration : DbMigrationsConfiguration<InterestsDataAPI.Models.InterestsDataAPIContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(InterestsDataAPI.Models.InterestsDataAPIContext context)
        {
            /*context.Users.AddOrUpdate(x => x.Id,
                new User() { Id = 1, InterestsStr = "books,food,boardgames", UserId = "GUID1" },
                new User() { Id = 2, InterestsStr = "books,hiking,music", UserId = "GUID2" },
                new User() { Id = 3, InterestsStr = "shoes,tech,boardgames", UserId = "GUID3" }
                );      */     
        }
    }
}
