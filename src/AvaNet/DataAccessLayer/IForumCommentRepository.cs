﻿using AvaNet.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvaNet.DataAccessLayer
{
    public interface IForumCommentRepository
    {

        void Add(ForumComment item);

        IEnumerable<ForumComment> GetAll();

        ForumComment Find(int id, bool eager);

        void Remove(int id);

        void Update(ForumComment item);

    }
}