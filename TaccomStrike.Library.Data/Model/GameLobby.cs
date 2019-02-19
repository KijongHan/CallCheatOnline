using System.Linq;
using System.Collections.Generic;
using System.Security.Claims;
using TaccomStrike.Library.Utility.Security;
using TaccomStrike.Game.CallCheat.Services;
using System;
using TaccomStrike.Library.Data.Enums;

namespace TaccomStrike.Library.Data.ViewModel
{
	public class GameLobby
	{
		public string GameLobbyName {get;set;}
		public long GameLobbyID {get;set;}
		public string GameLobbyPassword {get;set;}

		private List<ClaimsPrincipal> hosts {get;set;}
		private object lobbyLock = new object();
		private List<ClaimsPrincipal> players {get;set;}

		public GameMode GameMode { get; set; }

		public GameLogicController GameLogicController {get;set;}

		public int MaxRoomLimit {get;set;}

		public GameLobby()
		{
			hosts = new List<ClaimsPrincipal>();
			players = new List<ClaimsPrincipal>();
		}

		public bool InGame()
		{
			if(GameLogicController==null)
			{
				return false;
			}
			return true;
		}

		public bool StartGame(Action<long> onPreparationEnd)
		{
			lock(lobbyLock)
			{
				if (players.Count < 2)
				{
					return false;
				}

				var callPhaseDuration = GetCallPhaseDuration(GameMode);
				var turnPhaseDuration = GetTurnPhaseDuration(GameMode);
				var preparationPhaseDuration = 20000;

				GameLogicController = new GameLogicController();
				GameLogicController.StartGame(players, GameLobbyID, callPhaseDuration, turnPhaseDuration, preparationPhaseDuration, onPreparationEnd);
				return true;
			}
		 }

		public ClaimsPrincipal GetHost()
		{
			lock(lobbyLock)
			{
				if (hosts.Count <= 0)
				{
					return null;
				}
				return hosts[0];
			}
		}

		public List<ClaimsPrincipal> GetUsers()
		{
			lock(lobbyLock)
			{
				return players;
			}
		}

		public int GetUsersCount()
		{
			lock(lobbyLock)
			{
				int count = 0;

				count += players.Count;
				return count;
			}
		}

		public void AddUser(ClaimsPrincipal user)
		{
			lock(lobbyLock)
			{
				if (HasUser(user))
				{
					return;
				}

				if (hosts.Count == 0)
				{
					hosts.Add(user);
				}
				players.Add(user);
			}
		}

		public void RemoveUser(ClaimsPrincipal user)
		{
			lock (lobbyLock)
			{
				if (!HasUser(user))
				{
					return;
				}

				var removeUser = players
				.Where((item) => item.GetUserLoginID() == user.GetUserLoginID())
				.FirstOrDefault();

				players.Remove(removeUser);
				hosts.Remove(removeUser);
				if (hosts.Count == 0 && players.Count > 0)
				{
					hosts.Add(players[0]);
				}
			}
		}

		public bool HasUser(ClaimsPrincipal user)
		{
			lock(lobbyLock)
			{
				foreach (var u in GetUsers())
				{
					if (u.GetUserLoginID() == user.GetUserLoginID())
					{
						return true;
					}
				}
				return false;
			}
		}

		public void UseLobbyLock(Action protectedAction)
		{
			lock(lobbyLock)
			{
				protectedAction();
			}
		}

		private int GetCallPhaseDuration(GameMode gameMode)
		{
			if(gameMode== GameMode.Casual)
			{
				return 10000;
			}
			if(gameMode== GameMode.Competitive)
			{
				return 5000;
			}
			else
			{
				return 10000;
			}
		}

		private int GetTurnPhaseDuration(GameMode gameMode)
		{
			if (gameMode == GameMode.Casual)
			{
				return 40000;
			}
			if (gameMode == GameMode.Competitive)
			{
				return 20000;
			}
			else
			{
				return 40000;
			}
		}
	}
}
