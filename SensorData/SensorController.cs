using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace SensorData;

[ApiController]
[Route("api/sensor")]
public class SensorController: ControllerBase
{
    private readonly SensorDbContext _context;
    private readonly IHubContext<SensorHub> _hub;
    
    public SensorController(SensorDbContext context, IHubContext<SensorHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    [HttpPost]
    public async Task InputData()
    {
        await _hub.Clients.All.SendAsync("data", "Hello World");
        await _context.SaveChangesAsync();
    }
}