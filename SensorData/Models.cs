namespace SensorData;


public class SensorData
{
    public int Temperature { get; set; }
    public int Humidity { get; set; }
    public List<Gas> Gases { get; set; }
    
}

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

public class Text
{
    public Guid Id { get; set; }
    public string Message { get; set; }
}