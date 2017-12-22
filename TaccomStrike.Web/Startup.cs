﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using AvaNet.Data;
using AvaNet.Models;
using AvaNet.Services;
using AvaNet.DataAccessLayer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using AvaNet.Models.ViewModels.ForumViewModels;

namespace AvaNet
{
    public class Startup
    {
        private IHostingEnvironment CurrentHostingEnvironment { get; set; }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                //builder.AddUserSecrets();

                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            CurrentHostingEnvironment = env;

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddApplicationInsightsTelemetry(Configuration);

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));
            //options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddMvc();
            
            //Service beans
            services.AddScoped<IForumTopicRepository, ForumTopicRepository>();
            services.AddScoped<IForumThreadRepository, ForumThreadRepository>();
            services.AddScoped<IForumCommentRepository, ForumCommentRepository>();
            services.AddScoped<IForumLikeRepository, ForumLikeRepository>();

            services.AddScoped<IPinnedForumThreadsRepository, PinnedForumThreadsRepository>();

            services.AddScoped<IGameUserRepository, GameUserRepository>();
            services.AddScoped<IGameLoreRepository, GameLoreRepository>();
            services.AddScoped<HtmlSanitizer>();
            services.AddScoped<DateFormatter>();
            services.AddScoped<ResourcePathResolverService>();

            // Add application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();
            
            services.Configure<IdentityOptions>(options =>
            {

                //Password Settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = true;

                //Lockout Settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;

                //Cookie Settings: These have been deprecated
                //options.Cookies.ApplicationCookie.ExpireTimeSpan = TimeSpan.FromDays(150);
                //options.Cookies.ApplicationCookie.LoginPath = "/Account/LogIn";
                //options.Cookies.ApplicationCookie.LogoutPath = "/Account/LogOff";

                //User Settings
                options.User.RequireUniqueEmail = true;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app, 
            ResourcePathResolverService resourcePathResolverService, 
            IHostingEnvironment env, 
            ILoggerFactory loggerFactory, 
            IPinnedForumThreadsRepository pinnedForumThreadsRepository, 
            IForumTopicRepository forumTopicRepository, 
            IGameLoreRepository gameLoreRepository, 
            RoleManager<IdentityRole> roleManager)
        {

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            //app.UseIdentity();

            //Custom middleware
            app.UseMiddleware<BanUserMiddleware>();

            // Add external authentication middleware below. To configure them please see http://go.microsoft.com/fwlink/?LinkID=532715

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            //Only redirect to SSL in production environments
            if (CurrentHostingEnvironment.IsProduction())
            {
                var options = new RewriteOptions().AddRedirectToHttpsPermanent();
                app.UseRewriter(options);
            }

            //Set property for the resource path resolver service
            resourcePathResolverService.WebRootPath = CurrentHostingEnvironment.WebRootPath;

            DbInitializer.Initialize(pinnedForumThreadsRepository, forumTopicRepository, gameLoreRepository, roleManager);

        }
    }
}