namespace InterestsDataAPI.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Migration1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "approveListStr", c => c.String());
            AddColumn("dbo.Users", "matchListStr", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "matchListStr");
            DropColumn("dbo.Users", "approveListStr");
        }
    }
}
