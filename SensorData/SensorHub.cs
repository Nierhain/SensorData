using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace SensorData;

public class SensorHub : Hub
{

    private readonly SensorDbContext _context;

    public SensorHub(SensorDbContext context)
    {
        _context = context;
    }

    public async Task GetGas(GasType type, int span){
        var gases = await _context.Gases.Where(x => x.Type == type && x.Timestamp <= DateTime.Now.AddMinutes(span * -1)).OrderBy(x => x.Timestamp).AsNoTracking().ToListAsync();

        await Clients.All.SendAsync("gas", gases);
    }
}