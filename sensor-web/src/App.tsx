import { useState } from 'react'
import { Gas } from './Gas';
import { SignalRContext } from './main';
import { Table } from 'antd';
const columns = [
  {title: 'Timestamp', dataIndex: 'timestamp'},
  {title: "Value", dataIndex: 'value'}
]
function App() {
  const [dioxide, setDioxide] = useState<Gas[]>();

  SignalRContext.useSignalREffect("getDioxide", (gases: Gas[]) => {
    setDioxide(gases);
  }, [])

  return ( 
    <>
      Dioxide:
      <Table 
        columns={columns}
        dataSource={dioxide}
      />
    </>
  )
}

export default App
