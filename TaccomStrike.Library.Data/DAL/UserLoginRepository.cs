using TaccomStrike.Library.Data.Model;
using TaccomStrike.Library.Data.ViewModel;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using TaccomStrike.Library.Utility.Security;
using TaccomStrike.Library.Data.Model.Views;

namespace TaccomStrike.Library.Data.DAL 
{
	public class UserLoginRepository 
	{
		private TaccomStrikeContext dbContext;

		private readonly ForumUserRepository forumUserRepository;

		public UserLoginRepository(TaccomStrikeContext dbContext, ForumUserRepository forumUserRepository) 
		{
			this.dbContext = dbContext;
			this.forumUserRepository = forumUserRepository;
		}

		public int CreateUserLogin(CreateUserLogin user, string passwordSalt, string passwordHash, int forumUserID)
		{
			UserLogin insertUser = new UserLogin()
			{
				Username = user.Username,
				Email = user.Email,
				PasswordSalt = passwordSalt,
				PasswordHash = passwordHash,
				ForumUserID = forumUserID
			};
			insertUser.WhenCreated = DateTime.Now;
			dbContext.UserLogin.Add(insertUser);
			dbContext.SaveChanges();
			return insertUser.UserLoginID;
		}

		public UserLogin GetUserLoginByEmail(string email)
		{
			var user = dbContext.UserLogin
				.Where((item) => item.Email == email)
				.FirstOrDefault();
			return user;
		}

		public UserLogin GetUserLogin(string username)
		{
			var user = dbContext.UserLogin
				.Where((item) => item.Username == username)
				.FirstOrDefault();
			return user;
		}

		public Task<UserLogin> GetUserLoginAsync(string username)
		{
			return Task.Run(() => 
			{
				return GetUserLogin(username);
			});
		}

		public UserLogin GetUserLogin(int id)
		{
			var user = dbContext.UserLogin
			.Where((item) => item.UserLoginID == id)
			.FirstOrDefault();
			return user;
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

		public Task<List<UserLogin>> GetUserLoginsAsync(string email = null, string username = null)
		{
			return Task.Run(() =>
			{
				var query = dbContext.UserLogin.AsQueryable();
				if(email!=null)
				{
					query = query.Where((i) => i.Email == email);
				}
				if(username!=null)
				{
					query = query.Where((i) => i.Username == username);
				}
				return query.ToList();
			});
		}

		public Task<UserLogin> CreateUserLoginAsync(CreateUserLogin userEntity)
		{
			return Task.Run(() => {
				if (GetUserLogin(userEntity.Username) != null)
				{
					return null;
				}
				if (GetUserLoginByEmail(userEntity.Email) != null)
				{
					return null;
				}

				string passwordSalt = Authentication.GenerateSalt();
				string hashPassword = Authentication.HashPassword(userEntity.Password, passwordSalt);

				var forumUserID = forumUserRepository.CreateForumUser();
				var userLoginID = CreateUserLogin(userEntity, passwordSalt, hashPassword, forumUserID);

				return GetUserLogin(userLoginID);
			});
		}

		public Task<List<UserComplete>> GetLeaderboard(int top)
		{
			return Task.Run(() =>
			{
				var query = dbContext.UserComplete.AsQueryable();
				query = query
					.OrderByDescending((i) => i.GameScore)
					.Take(top);
				return query.ToList();
			});
		}
	}
}