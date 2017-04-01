﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AvaNet.Models;
using AvaNet.Data;

namespace AvaNet.DataAccessLayer
{
    public class ForumLikeRepository : IForumLikeRepository
    {

        private readonly ApplicationDbContext context;

        public ForumLikeRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public void Add(ForumThreadLike like)
        {
            context.ForumThreadLikes.Add(like);
            context.SaveChanges();
        }
    }
}
