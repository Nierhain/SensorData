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

var app = builder.Build();

app.UseCors();
app.UseStaticFiles();

app.UseWebSockets();

app.MapPost("/api/gases/co", ([FromBody]Gas gas, DbContext context) => {
    gas.Type = GasType.Monoxide;
    context.Add(gas);
});
app.MapPost("/api/gases/co2", ([FromBody]Gas gas, DbContext context) => {
    gas.Type = GasType.Dioxide;
    context.Add(gas);
});
app.MapPost("/api/gases/nh", ([FromBody]Gas gas, DbContext context) => {
    gas.Type = GasType.Ammonium;
    context.Add(gas);
});
app.MapPost("/api/gases/alcohol", ([FromBody]Gas gas, DbContext context) => {
    gas.Type = GasType.Alcohol;
    context.Add(gas);
});
app.MapHub<SensorHub>("/hub");

app.Run();