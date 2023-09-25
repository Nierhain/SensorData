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

    public async Task GetGas(GasType type){
        var gases = await _context.Gases.Where(x => x.Type == type).OrderBy(x => x.Timestamp).AsNoTracking().ToListAsync();

        await Clients.All.SendAsync("gas", gases);
    }

    public async Task GetDioxide(){
        var gases = await _context.Gases.Where(x => x.Type == GasType.Dioxide).OrderBy(x => x.Timestamp).AsNoTracking().ToListAsync();

        await Clients.All.SendAsync("dioxide", gases);
    }
}