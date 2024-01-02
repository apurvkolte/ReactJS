import { CSVLink } from 'react-csv';

const csvData = JSON.parse(JSON.stringify(orders ? orders : []));

<h5 style={{ display: 'inline' }} className="marginleft mr-1 mt-5 px-md-2">
    <CSVLink className='menuorder' data={csvData} filename={"orders.csv"} target="_blank"  >Download</CSVLink></h5>