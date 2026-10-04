using ELearningPlatform.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;
using ELearningPlatform.Api.Services;
using ELearningPlatform.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ELearningPlatform.Api.Hubs;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
 .AddJwtBearer(options =>
 {
     var jwtKey = builder.Configuration["Jwt:Key"];

     options.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuer = true,
         ValidateAudience = true,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,

         ValidIssuer = builder.Configuration["Jwt:Issuer"],
         ValidAudience = builder.Configuration["Jwt:Audience"],
         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!)),
     };

     options.Events = new JwtBearerEvents
     {
         OnMessageReceived = context =>
         {
             var accessToken = context.Request.Query["access_token"];
             var path = context.HttpContext.Request.Path;

             if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/progress"))
             {
                 context.Token = accessToken;
             }

             return Task.CompletedTask;
         }
     };

 });
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("ReactApp");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapHub<ProgressHub>("/hubs/progress");


await SeedDemoCoursesAsync(app);

static async Task SeedDemoCoursesAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!await context.Roles.AnyAsync())
    {
        context.Roles.AddRange(
            new ELearningPlatform.Api.Models.Role { Name = "Student" },
            new ELearningPlatform.Api.Models.Role { Name = "Instructor" },
            new ELearningPlatform.Api.Models.Role { Name = "Admin" }
        );
    }

    if (!await context.Categories.AnyAsync())
    {
        context.Categories.AddRange(
            new ELearningPlatform.Api.Models.Category { Name = "Web Development" },
            new ELearningPlatform.Api.Models.Category { Name = "Backend Development" },
            new ELearningPlatform.Api.Models.Category { Name = "Frontend Development" },
            new ELearningPlatform.Api.Models.Category { Name = "Database" }
        );
    }

    await context.SaveChangesAsync();


    var adminRole = await context.Roles.FirstAsync(role => role.Name == "Admin");
    var admin = await context.Users.FirstOrDefaultAsync(user => user.Email == "admin@elearning.local");

    if (admin == null)
    {
        context.Users.Add(new ELearningPlatform.Api.Models.User
        {
            FullName = "Platform Admin",
            Email = "admin@elearning.local",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@12345"),
            RoleId = adminRole.Id
        });

        await context.SaveChangesAsync();
    }
    var instructorRole = await context.Roles.FirstAsync(role => role.Name == "Instructor");
    var instructor = await context.Users.FirstOrDefaultAsync(user => user.Email == "demo.instructor@elearning.local");

    if (instructor == null)
    {
        instructor = new ELearningPlatform.Api.Models.User
        {
            FullName = "Demo Instructor",
            Email = "demo.instructor@elearning.local",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo@12345"),
            RoleId = instructorRole.Id
        };

        context.Users.Add(instructor);
        await context.SaveChangesAsync();
    }

    var categories = await context.Categories.ToDictionaryAsync(category => category.Name, category => category.Id);
    var existingCourseTitles = await context.Courses
        .Select(course => course.Title)
        .ToListAsync();
    var existingCourseTitleSet = existingCourseTitles.ToHashSet(StringComparer.OrdinalIgnoreCase);

    var demoCourses = new[]
    {
        new ELearningPlatform.Api.Models.Course
        {
            Title = "React Fundamentals",
            Description = "Build reusable components, manage state, and create fast single-page apps.",
            Price = 999,
            ThumbnailUrl = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
            CategoryId = categories["Frontend Development"],
            InstructorId = instructor.Id
        },
        new ELearningPlatform.Api.Models.Course
        {
            Title = "ASP.NET Core Web API",
            Description = "Create secure REST APIs with controllers, Entity Framework, JWT auth, and Swagger.",
            Price = 1299,
            ThumbnailUrl = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
            CategoryId = categories["Backend Development"],
            InstructorId = instructor.Id
        },
        new ELearningPlatform.Api.Models.Course
        {
            Title = "SQL Server Essentials",
            Description = "Learn relational design, queries, joins, indexing, and practical database workflows.",
            Price = 899,
            ThumbnailUrl = "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
            CategoryId = categories["Database"],
            InstructorId = instructor.Id
        },
        new ELearningPlatform.Api.Models.Course
        {
            Title = "Modern JavaScript",
            Description = "Master ES modules, async code, arrays, objects, DOM basics, and clean syntax.",
            Price = 799,
            ThumbnailUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
            CategoryId = categories["Web Development"],
            InstructorId = instructor.Id
        },
        new ELearningPlatform.Api.Models.Course
        {
            Title = "Responsive CSS Design",
            Description = "Design polished layouts with flexbox, grid, forms, cards, and responsive styling.",
            Price = 699,
            ThumbnailUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
            CategoryId = categories["Frontend Development"],
            InstructorId = instructor.Id
        },
        new ELearningPlatform.Api.Models.Course
        {
            Title = "Full Stack Project Bootcamp",
            Description = "Connect React, APIs, authentication, database models, and deployment basics.",
            Price = 1499,
            ThumbnailUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
            CategoryId = categories["Web Development"],
            InstructorId = instructor.Id
        }
    };

    var missingDemoCourses = demoCourses
        .Where(course => !existingCourseTitleSet.Contains(course.Title))
        .ToList();

    if (missingDemoCourses.Count > 0)
    {
        context.Courses.AddRange(missingDemoCourses);
        await context.SaveChangesAsync();
    }

    var demoCourseTitles = demoCourses.Select(course => course.Title).ToList();
    var demoCourseIds = await context.Courses
        .Where(course => demoCourseTitles.Contains(course.Title))
        .ToDictionaryAsync(course => course.Title, course => course.Id);

    var demoLessons = demoCourseIds.SelectMany(course => new[]
    {
        new ELearningPlatform.Api.Models.Lesson
        {
            CourseId = course.Value,
            OrderNumber = 1,
            Title = $"{course.Key}: Introduction",
            VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        new ELearningPlatform.Api.Models.Lesson
        {
            CourseId = course.Value,
            OrderNumber = 2,
            Title = $"{course.Key}: Core Concepts",
            VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        new ELearningPlatform.Api.Models.Lesson
        {
            CourseId = course.Value,
            OrderNumber = 3,
            Title = $"{course.Key}: Practice Project",
            VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
    }).ToList();

    var courseIdsWithLessons = await context.Lessons
        .Where(lesson => demoCourseIds.Values.Contains(lesson.CourseId))
        .Select(lesson => lesson.CourseId)
        .Distinct()
        .ToListAsync();
    var courseIdsWithLessonSet = courseIdsWithLessons.ToHashSet();
    var missingDemoLessons = demoLessons
        .Where(lesson => !courseIdsWithLessonSet.Contains(lesson.CourseId))
        .ToList();

    if (missingDemoLessons.Count > 0)
    {
        context.Lessons.AddRange(missingDemoLessons);
        await context.SaveChangesAsync();
    }
}
app.Run();





