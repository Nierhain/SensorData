import Head from "next/head";
import {Table} from './components/ui/table';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./components/ui/menubar"
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
import { timeStamp } from "console";

interface SensorData {
  id: number;
  timestamp: Date;
  timeLabel: string;
  name: string;
  value: number;
};

/*
function test() {
  let x = 1 + 1;
  return x == 2;
}

function HelloWorld({value}: {value: number}) {
  const [counter, setCounter] = useState<number>(0);
  const otherValue = 0;

  return <div>Counter: {counter}<button onClick={() => setCounter(prev => prev + 1)}>Counter +</button></div>
}
*/

export default function Home() {


  const [_test_data, setData] = React.useState<SensorData[]>([{id: 0,timestamp: new Date(), timeLabel: 'testLabel',name: 'Sensor 0', value: 42}]);

  useEffect(() => {
    if(_test_data){
      const newDataPoint: SensorData[] = [];
      
      for (let i = 1; i <= 5; i++) {

        const sensorName = `Sensor ${i}`;
        const rvalue = Math.floor(Math.random() * 101);
        const _timestamp = new Date();
        const _timeLabel = _timestamp.toTimeString();
        
        newDataPoint.push({
          id: i,
          timestamp: _timestamp,
          timeLabel: _timeLabel,
          name: sensorName,
          value: rvalue
        });
        
    }
    setData([..._test_data, ...newDataPoint]);
  }
  }, []);

  const PushSomeData: React.MouseEventHandler = (event) => {
    
    if(_test_data){

      const size: number = _test_data.length;
      const newsize: number = _test_data.length + 1;

      for (let i = size + 1; i <= newsize; i++) {
        const sensorName = `Sensor ${i}`;
        const rvalue = Math.floor(Math.random() * 101);
        const _timestamp = new Date();
        const _timeLabel = _timestamp.toTimeString();
       
        const newDataPoint: SensorData = {
          id: i,
          timestamp: _timestamp,
          timeLabel: _timeLabel,
          name: sensorName,
          value: rvalue
        };
        
        setData([..._test_data, newDataPoint]);
      }
    }
  };

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
              <CardDescription>SNIFFY SNIFFING FOR {_test_data[0]?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <Overview data={_test_data}/>
            </CardContent>
            <CardFooter >
              <Button variant="outline">Cancel</Button>
              <Button onClick={PushSomeData}>Download RAM</Button>
            </CardFooter>
          </Card>
        </div>

      </main>
    </>
  );
}
