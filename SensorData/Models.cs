namespace SensorData;

public class Gas 
{
    public Guid Id {get; set;} = Guid.NewGuid();
    public GasType Type {get; set;}
    public int Value {get; set;}
    public DateTime Timestamp {get; set;}
}

public enum GasType {
    Dioxide = 0,
    Monoxide = 1,
    Alcohol = 2,
    Ammonium = 3,
}