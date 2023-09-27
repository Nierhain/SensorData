import { useState } from 'react'
import { Gas } from './Gas';
import { SignalRContext } from './main';
import { Table } from 'antd';
import BarChartComponent from './BarChart';

const columns = [
  {title: 'Timestamp', dataIndex: 'timestamp'},
  {title: "Value", dataIndex: 'value'}
]
function App() {
  const [dioxide, setDioxide] = useState<Gas[]>();
  const [monoxide, setMonoxide] = useState<Gas[]>();

  SignalRContext.useSignalREffect("getDioxide", (gases: Gas[]) => {
    setDioxide(gases);
  }, [])
  
  SignalRContext.useSignalREffect("getMonoxide", (gases: Gas[]) => {
    setMonoxide(gases);
  }, [])

  return ( 
    <>
      <div className="Bars">
        <h1>Bar Chart Example</h1>
        <BarChartComponent />
      </div>
      Dioxide:
      <Table 
        columns={columns}
        dataSource={dioxide}
      />
      Monoxide:
      <Table 
        columns={columns}
        dataSource={monoxide}
      />
    </>
  )
}

export default App
