using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SensorData;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();
builder.Services.AddDbContext<SensorDbContext>(opts => {
    opts.UseSqlServer(builder.Configuration.GetConnectionString("DB"));
});

builder.Services.AddCors(cors => {
    cors.AddPolicy("cors", config => {
        config.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
    });
});

builder.Services.AddControllers();
var app = builder.Build();

app.UseCors();
app.UseStaticFiles();

app.UseWebSockets();

app.MapControllers();

// app.MapHub<SensorHub>("/hub");

app.Run();