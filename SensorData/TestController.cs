using Microsoft.AspNetCore.Mvc;

namespace SensorData;

[ApiController]
[Route("/api/test")]
public class TestController : ControllerBase
{
    private SensorDbContext _context;

    public TestController(SensorDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult> Test(Text message)
    {
        _context.Texts.Add(new()
        {
            Id = Guid.NewGuid(),
            Message = message.Message
        });
        await _context.SaveChangesAsync();
        return Ok();
    }
}