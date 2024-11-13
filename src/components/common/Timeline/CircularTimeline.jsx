import React from 'react';
import ReactApexChart from 'react-apexcharts';

const defalut = [
  {label: 'PL SUBMIT', isCompleted: true},
  {label: 'PL BOOKED', isCompleted: true},
  {label: 'PL FINAL', isCompleted: true},
  {label: 'BOL ISSUE', isCompleted: false},
  {label: 'SI RAISED', isCompleted: false},
];



const CircularTimeline = ({
  steps = defalut,
}) => {
  const chartOptions = {
    chart: {
      type: 'donut',
    },
    labels: steps.map(step => step.label),
    colors: steps.map(step => step.isCompleted ? '#1976d2' : '#d1d1d157'),
    legend: {
      show: false,
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return steps[opts.seriesIndex].label; // Return only the label
      },
    },
    tooltip: {
      enabled: false,
    },
  };

  const chartData = [20, 20, 20, 20, 20];

  return (
    <div>
      <ReactApexChart options={chartOptions} series={chartData} type="donut" />
    </div>
  );
};

export default CircularTimeline;
