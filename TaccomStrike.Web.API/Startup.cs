﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using library.data.Model;
using library.data.DAL;
using TaccomStrike.Web.API.Authentication;
using TaccomStrike.Library.Utility.Security;

namespace TaccomStrike.Web.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            //Data layer service configurations
            services.AddDbContext<TaccomStrikeContext>();
            services.AddScoped<ForumThreadRepository>();
            services.AddScoped<ForumCommentRepository>();
            
            var sessionStore = new SessionStore();
            services.AddSingleton<SessionStore>(sessionStore);

            services.AddTaccomStrikeAuthentication(sessionStore);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
