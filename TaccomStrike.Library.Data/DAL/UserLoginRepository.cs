using TaccomStrike.Library.Data.Model;
using TaccomStrike.Library.Data.ViewModel;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace TaccomStrike.Library.Data.DAL 
{
    public class UserLoginRepository 
    {
        private TaccomStrikeContext dbContext;

        public UserLoginRepository(TaccomStrikeContext dbContext) 
        {
            this.dbContext = dbContext;
        }

        public int CreateUserLogin(CreateUserLogin user, string passwordSalt, string passwordHash, int forumUserID)
        {
            UserLogin insertUser = new UserLogin()
            {
                Username = user.Username,
                PasswordSalt = passwordSalt,
                PasswordHash = passwordHash,
                ForumUserID = forumUserID
            };
            insertUser.WhenCreated = DateTime.Now;
            dbContext.UserLogin.Add(insertUser);
            dbContext.SaveChanges();
            return insertUser.ForumUserID;
        }

        public GetUserLogin GetUserLogin(string username)
        {
            var user = dbContext.UserLogin
                .Where((item) => item.Username == username)
                .Select((item) =>
                new GetUserLogin()
                {
                    Username = item.Username,
                    PasswordSalt = item.PasswordSalt,
                    PasswordHash = item.PasswordHash
                })
                .FirstOrDefault();
            return user;
        }

        public Task<GetUserLogin> GetUserLoginAsync(string username)
        {
            return Task.Run(() => 
            {
                var user = dbContext.UserLogin
                .Where((item) => item.Username == username)
                .Select((item) =>
                new GetUserLogin()
                {
                    UserLoginID = item.UserLoginID,
                    Username = item.Username,
                    PasswordSalt = item.PasswordSalt,
                    PasswordHash = item.PasswordHash
                })
                .FirstOrDefault();
                return user;
            });
        }

        public Task<UserLogin> GetUserLoginAsync(int id)
        {
            return Task.Run(() => 
            {
                var user = dbContext.UserLogin
                .Where((item) => item.UserLoginID == id)
                .FirstOrDefault();
                return user;
            });
        }

        public Task<int> CreateUserLoginAsync(CreateUserLogin user, string passwordSalt, string passwordHash, int forumUserID)
        {
            return Task.Run(() => 
            {
                UserLogin insertUser = new UserLogin()
                {
                    Username = user.Username,
                    PasswordSalt = passwordSalt,
                    PasswordHash = passwordHash,
                    ForumUserID = forumUserID
                };
                insertUser.WhenCreated = DateTime.Now;
                dbContext.UserLogin.Add(insertUser);
                dbContext.SaveChanges();
                return insertUser.ForumUserID;
            });   
        }
    }
}