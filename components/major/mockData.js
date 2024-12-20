export const chart = {
    statistics: [
      {
          correctness: 0,
          wrongness: 1,
          row: 'simple'
      },
      {
          correctness: 0,
          wrongness: 0,
          row: 'medium'
      },
      {
          correctness: 0,
          wrongness: 0,
          row: 'complex'
      }
    ],
    type: 'bar',
    options: {
        animation: false,
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            intersect: true,
            mode: 'index'
        },
        plugins: {
            legend: false,
            tooltip: {
                callbacks: {
                    label: function (context) {
                        // Ваша логика для форматирования текста в подсказке
                        return 'Value: ' + context.parsed.y;
                    },
                },
                enabled: true
            }
        },
        scales: {
            x: {
                axis: 'x',
                grid: {
                  drawOnChartArea: false,
                  tickWidth: 0,
                  dash: [8, 4],
                  tickBorderDash: [10, 20],
                  offset: true,
                  display: true,
                  lineWidth: 1,
                  drawTicks: true,
                  tickLength: 8,
                  color: 'rgba(0,0,0,1)',
                },
                border: {
                  display: false,
                  dash: [],
                  dashOffset: 0,
                  width: 1,
                  color: 'rgba(0,0,0,0.1)',
                },
                ticks: {
                  maxRotation: 0,
                  autoSkip: true,
                  minRotation: 0,
                  mirror: false,
                  textStrokeWidth: 0,
                  textStrokeColor: '',
                  padding: 3,
                  display: true,
                  autoSkipPadding: 3,
                  labelOffset: 0,
                  minor: {},
                  major: {},
                  align: 'center',
                  crossAlign: 'near',
                  showLabelBackdrop: false,
                  backdropColor: 'rgba(255, 255, 255, 0.75)',
                  backdropPadding: 2,
                  color: '#666',
                },
                type: 'category',
                offset: true,
                display: true,
                reverse: false,
                beginAtZero: false,
                bounds: 'ticks',
                clip: true,
                grace: 0,
                title: {
                  display: false,
                  text: '',
                  padding: {
                    top: 4,
                    bottom: 4,
                  },
                  color: '#666',
                },
                id: 'x',
                position: 'bottom',
                stacked: true,
            },
            y: {
            axis: 'y',
            min: 0,
            max: 12,
            grid: {
                tickWidth: 0,
                tickBorderDash: [10, 20],
                display: true,
                lineWidth: 1,
                drawOnChartArea: true,
                drawTicks: true,
                tickLength: 8,
                offset: false,
                color: 'rgba(0,0,0,0.1)',
            },
            border: {
                display: false,
                dash: [2, 2],
                dashOffset: 0,
                width: 1,
                color: 'rgba(0,0,0,0.1)',
            },
            ticks: {
                precision: 0,
                stepSize: 2,
                minRotation: 0,
                maxRotation: 50,
                mirror: false,
                textStrokeWidth: 0,
                textStrokeColor: '',
                padding: 0,
                display: true,
                autoSkip: true,
                autoSkipPadding: 1,
                labelOffset: 0,
                minor: {},
                major: {},
                align: 'center',
                crossAlign: 'near',
                showLabelBackdrop: false,
                backdropColor: 'rgba(255, 255, 255, 0.75)',
                backdropPadding: 2,
                color: '#666',
                callback: function (value) {
                    return value % 4 === 0 ? value : '';
                },
            },
            type: 'linear',
            beginAtZero: true,
            display: true,
            offset: false,
            reverse: false,
            bounds: 'ticks',
            clip: true,
            grace: 0,
            title: {
                display: false,
                text: '',
                padding: {
                top: 4,
                bottom: 4,
                },
                color: '#666',
            },
            id: 'y',
            position: 'left',
            stacked: true,
            },
        }
    },
    data: {
        labels: [
            'Пн, 7 нояб',
            '',
            '',
            '',
            '',
            '',
            'Вс, 13 нояб',
        ],
        datasets: [
            {
                label: 'С ошибкой',
                backgroundColor: '#FEC84D80',
                data: [1, 4, 0, 0, 0, 1],
                borderColor: '#FEC84D80',
                barPercentage: 8,
                categoryPercentage: 0.1
            },
            {
                label: 'Верно',
                backgroundColor: '#21BD4FB2',
                data: [6, 4, 6, 0.5, 3.5, 2.5],
                borderColor: '#21BD4FB2',
                barPercentage: 8,
                categoryPercentage: 0.1
            },
        ]
    }
}

export const russianData = [
    {
        label: 'С ошибкой',
        backgroundColor: '#FEC84D80',
        data: [1, 0, 0, 0, 2, 0],
        borderColor: '#FEC84D80',
        barPercentage: 8,
        categoryPercentage: 0.1
    },
    {
        label: 'Верно',
        backgroundColor: '#21BD4FB2',
        data: [5, 8, 0, 6, 3, 10],
        borderColor: '#21BD4FB2',
        barPercentage: 8,
        categoryPercentage: 0.1
    },
];

export const mathData = [
    {
        label: 'С ошибкой',
        backgroundColor: '#FEC84D80',
        data: [1, 4, 0, 0, 0, 1],
        borderColor: '#FEC84D80',
        barPercentage: 8,
        categoryPercentage: 0.1
    },
    {
        label: 'Верно',
        backgroundColor: '#21BD4FB2',
        data: [6, 4, 6, 0.5, 3.5, 2.5],
        borderColor: '#21BD4FB2',
        barPercentage: 8,
        categoryPercentage: 0.1
    },
]