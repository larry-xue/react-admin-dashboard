import React from 'react';
import { Line, Pie } from '@ant-design/charts';
import { Card, Space } from 'antd';

const DemoChart: React.FC = () => {
  // Mock data for line chart
  const lineData = [
    { year: '2019', value: 3 },
    { year: '2020', value: 4 },
    { year: '2021', value: 3.5 },
    { year: '2022', value: 5 },
    { year: '2023', value: 4.9 },
  ];

  // Mock data for pie chart
  const pieData = [
    { type: 'Category A', value: 27 },
    { type: 'Category B', value: 25 },
    { type: 'Category C', value: 18 },
    { type: 'Category D', value: 15 },
    { type: 'Category E', value: 15 },
  ];

  const lineConfig = {
    data: lineData,
    xField: 'year',
    yField: 'value',
    point: {
      shapeField: 'square',
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
  };

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };

  return (
    <div className="p-4" style={{ width: '100%' }}>
      <Space direction="vertical" size="large" style={{ display: 'flex', width: '100%' }}>
        <Card title="Line Chart Demo" style={{ width: '100%' }}>
          <div style={{ width: '100%', minHeight: '300px' }}>
            <Line {...lineConfig} />
          </div>
        </Card>
        <Card title="Pie Chart Demo" style={{ width: '100%' }}>
          <div style={{ width: '100%', minHeight: '300px' }}>
            <Pie {...pieConfig} />
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default DemoChart;
