import Head from "next/head";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Overview } from "./components/ui/overview";
import React, { useEffect } from "react";
import { SensorData }from "./SensoroData";
import { Badge } from "./components/ui/badge";

//Funktion für den Durchschnitt der angezeigten Daten
function avgData(data: SensorData[]){
  if(data.length >= 2){

    let sum = 0;
    for(let i = 0; i < data.length; i++){       
        sum += data[i]!.value;

    }
    return Math.fround(sum / data.length).toFixed(3);
  }
  return 'not enough values';
}

//Funktion, um die Prozentuale Änderung zur letzten Messung zu erhaten
function calcChange(data: SensorData[]){
  if(data.length >= 2){

    let preValue = data[data.length - 1]!.value;
    let lastValue = data[data.length - 2]!.value;

    return ((lastValue / preValue)*100).toFixed(1);
  }
  return 'not enough values';
}

export default function Home() {

  //React Variablen, die zur Runtime auf der Homepage gebraucht werden
  const SensorNames: string[] = ['Monoxide', 'Dioxide', 'Ethanol', 'Methanol', 'Combustible'];

  const [monoxide_test_data, setMonoData] = React.useState<SensorData[]>([]);
  const [dioxide_test_data, setDioData] = React.useState<SensorData[]>([]);
  const [ethanol_test_data, setEthData] = React.useState<SensorData[]>([]);
  const [methanol_test_data, setMethData] = React.useState<SensorData[]>([]);
  const [combustible_test_data, setCombData] = React.useState<SensorData[]>([]);

  const dataHolder: any[] = [monoxide_test_data, dioxide_test_data, ethanol_test_data, methanol_test_data, combustible_test_data];


  const [avgMono, setAvgMono] = React.useState('not enough values');
  const [changeMono, setChangeMono] = React.useState('Not enough values');
  const [avgDio, setAvgDio] = React.useState('not enough values');
  const [changeDio, setChangeDio] = React.useState('Not enough values');
  const [avgEth, setAvgEth] = React.useState('not enough values');
  const [changeEth, setChangeEth] = React.useState('Not enough values');
  const [avgMeth, setAvgMeth] = React.useState('not enough values');
  const [changeMeth, setChangeMeth] = React.useState('Not enough values');
  const [avgComb, setAvgComb] = React.useState('not enough values');
  const [changeComb, setChangeComb] = React.useState('Not enough values');

  const [monoxideVisible, setMonoVisibility] = React.useState(true);
  const [dioxideVisible, setDioVisibility] = React.useState(true);
  const [ethanolVisible, setEthVisibility] = React.useState(true);
  const [methanolVisible, setMethVisibility] = React.useState(true);
  const [combustibleVisible, setCombVisibility] = React.useState(true);


//Simulations-Daten generieren #################################################################################
//sollten theoretisch von InfluxDB kommen, haben wir aber nicht mehr hingekriegt
//Es sollte in regelmäßigen Abständen die letzten Datensätze geholt werden
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
  
  //Handelt den Mausklick auf den Button, um für alle Datensätze einen neuen Eintrag zu generieren
  const PushSomeData: React.MouseEventHandler = () => {
    dataHolder.forEach(element => {
      PushDataTo(element, 1)
    });
    
  };

  //dunktion, die neue Daten generiert
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
// Ende von Simulationsdaten generieren #############################################################################

//diese funktionen werden immer ausgeführt sobald eine Änderung auf den Daten passiert
  useEffect(() => {
    setAvgMono(avgData(monoxide_test_data));
    setChangeMono(calcChange(monoxide_test_data));
    setAvgDio(avgData(dioxide_test_data));
    setChangeDio(calcChange(dioxide_test_data));
    setAvgEth(avgData(ethanol_test_data));
    setChangeEth(calcChange(ethanol_test_data));
    setAvgMeth(avgData(methanol_test_data));
    setChangeMeth(calcChange(methanol_test_data));
    setAvgComb(avgData(combustible_test_data));
    setChangeComb(calcChange(combustible_test_data));
  }, [monoxide_test_data, dioxide_test_data, ethanol_test_data, methanol_test_data, combustible_test_data]);

  
//Funktion, um den Content anzuzeigen/ zu verstecken
  const handleToggleVisibility = (value: boolean, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(!value);
  };

//der Aufbau der Seite
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
              <CardTitle>{monoxide_test_data[0]?.name}</CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: monoxideVisible ? 'block' : 'none' }}>
              <Overview data={monoxide_test_data} color="#8cd98c"/>
              <Badge>AVG: {avgMono}</Badge>
              <Badge>Change: {changeMono}%</Badge>
            </CardContent>
            <CardFooter >
              <Button onClick={PushSomeData}>Download RAM</Button>
              <Button onClick={() => handleToggleVisibility(monoxideVisible, setMonoVisibility)}>{monoxideVisible ? 'Hide' : 'Show'}</Button>
            </CardFooter>
          </Card>
        </div>

        <div >
          <Card >
            <CardHeader>
              <CardTitle>{dioxide_test_data[0]?.name}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent style={{ display: dioxideVisible ? 'block' : 'none' }}>
              <Overview data={dioxide_test_data} color="#ffff00"/>
              <Badge>AVG: {avgDio}</Badge>
              <Badge>Change: {changeDio}%</Badge>
            </CardContent>
            <CardFooter >
              <Button onClick={PushSomeData}>Download RAM</Button>
              <Button onClick={() => handleToggleVisibility(dioxideVisible, setDioVisibility)}>{dioxideVisible ? 'Hide' : 'Show'}</Button>
            </CardFooter>
          </Card>
        </div>

        <div >
          <Card >
            <CardHeader>
              <CardTitle>{ethanol_test_data[0]?.name}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent style={{ display: ethanolVisible ? 'block' : 'none' }}>
              <Overview data={ethanol_test_data} color="#3366ff"/>
              <Badge>AVG: {avgEth}</Badge>
              <Badge>Change: {changeEth}%</Badge>
            </CardContent>
            <CardFooter >
              <Button onClick={PushSomeData}>Download RAM</Button>
              <Button onClick={() => handleToggleVisibility(ethanolVisible, setEthVisibility)}>{ethanolVisible ? 'Hide' : 'Show'}</Button>
            </CardFooter>
          </Card>
        </div>

        <div >
          <Card >
            <CardHeader>
              <CardTitle>{methanol_test_data[0]?.name}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent style={{ display: methanolVisible ? 'block' : 'none' }}>
              <Overview data={methanol_test_data} color=" #cc00cc"/>
              <Badge>AVG: {avgMeth}</Badge>
              <Badge>Change: {changeMeth}%</Badge>
            </CardContent>
            <CardFooter >
              <Button onClick={PushSomeData}>Download RAM</Button>
              <Button onClick={() => handleToggleVisibility(methanolVisible, setMethVisibility)}>{methanolVisible ? 'Hide' : 'Show'}</Button>
            </CardFooter>
          </Card>
        </div>

        <div >
          <Card >
            <CardHeader>
              <CardTitle>{combustible_test_data[0]?.name}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent style={{ display: combustibleVisible ? 'block' : 'none' }}>
              <Overview data={combustible_test_data} color="#ff4d4d"/>
              <Badge>AVG: {avgComb}</Badge>
              <Badge>Change: {changeComb}%</Badge>
            </CardContent>
            <CardFooter >
              <Button onClick={PushSomeData}>Download RAM</Button>
              <Button onClick={() => handleToggleVisibility(combustibleVisible, setCombVisibility)}>{combustibleVisible ? 'Hide' : 'Show'}</Button>
            </CardFooter>
          </Card>
        </div>

      </main>
    </>
  );
}
