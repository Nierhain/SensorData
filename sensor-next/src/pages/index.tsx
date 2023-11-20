import Head from "next/head";
import { Button } from "./components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
import { Overview } from "./components/ui/overview";
import React, { useEffect } from "react";
import { SensorData }from "./SensoroData";

export default function Home() {

  const SensorNames: string[] = ['Monoxide', 'Dioxide', 'Ethanol', 'Methanol', 'Combustible'];

  const [monoxide_test_data, setMonoData] = React.useState<SensorData[]>([]);
  const [dioxide_test_data, setDioData] = React.useState<SensorData[]>([]);
  const [ethanol_test_data, setEthData] = React.useState<SensorData[]>([]);
  const [methanol_test_data, setMethData] = React.useState<SensorData[]>([]);
  const [combustible_test_data, setCombData] = React.useState<SensorData[]>([]);

  const dataHolder: any[] = [monoxide_test_data, dioxide_test_data, ethanol_test_data, methanol_test_data, combustible_test_data];

  useEffect(() => {
    if(dataHolder){
      let newDataPoint: SensorData[] = [];
      
      for (let i = 0; i < 5; i++) {
        for (let j = 1; j <= 10; j++){

          let sensorName = SensorNames[i];
          let rvalue = Math.floor(Math.random() * 101);
          let _timestamp = new Date();
          let _timeLabel = _timestamp.getHours().toString() + ":" + _timestamp.getMinutes().toString() + ":" + _timestamp.getSeconds().toString();
          
          newDataPoint.push({
            id: j,
            timestamp: _timestamp,
            timeLabel: _timeLabel,
            name: sensorName,
            value: rvalue
          });
        }

        switch (i) {
          case 0:
              setMonoData([...monoxide_test_data, ...newDataPoint]);
              break;
          case 1:
              setDioData([...dioxide_test_data, ...newDataPoint]);
              break;
          case 2:
              setEthData([...ethanol_test_data, ...newDataPoint]);
              break;
          case 3:
              setMethData([...methanol_test_data, ...newDataPoint]);
              break;
          case 4:
              setCombData([...combustible_test_data, ...newDataPoint]);
              break;
          default:
              break;
      }
      newDataPoint = [];
      }
    }
  }, []);


  const PushSomeData: React.MouseEventHandler = (event) => {
    dataHolder.forEach(element => {
      PushDataTo(element, 1)
    });
    
  };

  function PushDataTo(data: SensorData[], num: number) {
    if(data){

      const size: number = data.length;
      const newsize: number = data.length + num;
      let newDataPoints: SensorData[] = [];

      for (let i = size + 1; i <= newsize; i++) {
        const sensorName = data[0]?.name;
        const rvalue = Math.floor(Math.random() * 101);
        const _timestamp = new Date();
        const _timeLabel = _timestamp.getHours().toString() + ":" + _timestamp.getMinutes().toString() + ":" + _timestamp.getSeconds().toString();
       
        let newDataPoint: SensorData = {
          id: i,
          timestamp: _timestamp,
          timeLabel: _timeLabel,
          name: sensorName,
          value: rvalue
        };

        newDataPoints.push(newDataPoint);
      }

      switch (data[0]?.name) {
        case SensorNames[0]:
            setMonoData([...monoxide_test_data, ...newDataPoints]);
            break;
        case SensorNames[1]:
            setDioData([...dioxide_test_data, ...newDataPoints]);
            break;
        case SensorNames[2]:
            setEthData([...ethanol_test_data, ...newDataPoints]);
            break;
        case SensorNames[3]:
            setMethData([...methanol_test_data, ...newDataPoints]);
            break;
        case SensorNames[4]:
            setCombData([...combustible_test_data, ...newDataPoints]);
            break;
        default:
            break;
      }
    }
  }

  return (
    <>
      <Head>
        <title>SNIFFY</title>
        <meta name="description" content="Sniffy Overview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >
      
        <div >
          <Card >
            <CardHeader>
              <CardTitle>Sniffy the Sniffing Dog </CardTitle>
              <CardDescription>SNIFFING FOR {monoxide_test_data[0]?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <Overview data={monoxide_test_data} color="#8cd98c"/>
            </CardContent>
            <CardFooter >
              <Button onClick={PushSomeData}>Download RAM</Button>
            </CardFooter>
          </Card>
        </div>

        <div >
          <Card >
            <CardHeader>
              <CardTitle>Sniffy the Sniffing Dog </CardTitle>
              <CardDescription>SNIFFING FOR {dioxide_test_data[0]?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <Overview data={dioxide_test_data} color="#ffff00"/>
            </CardContent>
            <CardFooter >
              <Button variant="outline">Cancel</Button>
              <Button onClick={PushSomeData}>Download RAM</Button>
            </CardFooter>
          </Card>
        </div>

        <div >
          <Card >
            <CardHeader>
              <CardTitle>Sniffy the Sniffing Dog </CardTitle>
              <CardDescription>SNIFFING FOR {ethanol_test_data[0]?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <Overview data={ethanol_test_data} color="#3366ff"/>
            </CardContent>
            <CardFooter >
              <Button onClick={PushSomeData}>Download RAM</Button>
            </CardFooter>
          </Card>
        </div>

        <div >
          <Card >
            <CardHeader>
              <CardTitle>Sniffy the Sniffing Dog </CardTitle>
              <CardDescription>SNIFFING FOR {methanol_test_data[0]?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <Overview data={methanol_test_data} color=" #cc00cc"/>
            </CardContent>
            <CardFooter >
              <Button onClick={PushSomeData}>Download RAM</Button>
            </CardFooter>
          </Card>
        </div>

        <div >
          <Card >
            <CardHeader>
              <CardTitle>Sniffy the Sniffing Dog </CardTitle>
              <CardDescription>SNIFFING FOR {combustible_test_data[0]?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <Overview data={combustible_test_data} color="#ff4d4d"/>
            </CardContent>
            <CardFooter >
              <Button onClick={PushSomeData}>Download RAM</Button>
            </CardFooter>
          </Card>
        </div>

      </main>
    </>
  );
}
