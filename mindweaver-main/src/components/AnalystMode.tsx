import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, 
  Activity, Download, RefreshCw, Filter 
} from 'lucide-react';

interface DataPoint {
  name: string;
  value: number;
  category?: string;
  date?: string;
}

interface ChartData {
  id: string;
  name: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data: DataPoint[];
  description?: string;
}

const AnalystMode: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([
    {
      id: '1',
      name: 'Продажи по месяцам',
      type: 'line',
      data: [
        { name: 'Янв', value: 4000, date: '2024-01' },
        { name: 'Фев', value: 3000, date: '2024-02' },
        { name: 'Мар', value: 5000, date: '2024-03' },
        { name: 'Апр', value: 2780, date: '2024-04' },
        { name: 'Май', value: 6890, date: '2024-05' },
        { name: 'Июн', value: 7390, date: '2024-06' },
      ],
      description: 'Динамика продаж за последние 6 месяцев'
    },
    {
      id: '2',
      name: 'Категории товаров',
      type: 'pie',
      data: [
        { name: 'Электроника', value: 35, category: 'tech' },
        { name: 'Одежда', value: 25, category: 'fashion' },
        { name: 'Продукты', value: 20, category: 'food' },
        { name: 'Книги', value: 15, category: 'books' },
        { name: 'Другое', value: 5, category: 'other' },
      ],
      description: 'Распределение продаж по категориям'
    },
    {
      id: '3',
      name: 'Активность пользователей',
      type: 'bar',
      data: [
        { name: 'Пн', value: 120 },
        { name: 'Вт', value: 132 },
        { name: 'Ср', value: 101 },
        { name: 'Чт', value: 134 },
        { name: 'Пт', value: 190 },
        { name: 'Сб', value: 230 },
        { name: 'Вс', value: 210 },
      ],
      description: 'Ежедневная активность пользователей'
    }
  ]);

  const [selectedChart, setSelectedChart] = useState<ChartData>(chartData[0]);
  const [timeRange, setTimeRange] = useState('6m');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const generateMockData = (type: ChartData['type'], count: number = 6): DataPoint[] => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    
    if (type === 'pie') {
      return [
        { name: 'Категория A', value: Math.floor(Math.random() * 100) + 20 },
        { name: 'Категория B', value: Math.floor(Math.random() * 100) + 20 },
        { name: 'Категория C', value: Math.floor(Math.random() * 100) + 20 },
        { name: 'Категория D', value: Math.floor(Math.random() * 100) + 20 },
        { name: 'Категория E', value: Math.floor(Math.random() * 100) + 20 },
      ];
    }

    return months.slice(0, count).map((month, index) => ({
      name: month,
      value: Math.floor(Math.random() * 5000) + 1000,
      date: `2024-${String(index + 1).padStart(2, '0')}`,
    }));
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedData = chartData.map(chart => ({
      ...chart,
      data: generateMockData(chart.type),
    }));
    
    setChartData(updatedData);
    setSelectedChart(updatedData[0]);
    setIsRefreshing(false);
  };

  const addNewChart = (type: ChartData['type']) => {
    const newChart: ChartData = {
      id: Date.now().toString(),
      name: `Новый график ${chartData.length + 1}`,
      type,
      data: generateMockData(type),
      description: 'Автоматически сгенерированные данные'
    };
    
    setChartData([...chartData, newChart]);
    setSelectedChart(newChart);
  };

  const renderChart = (chart: ChartData) => {
    const commonProps = {
      data: chart.data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chart.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Неподдерживаемый тип графика</div>;
    }
  };

  const renderDataTable = (data: DataPoint[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Название</th>
            <th className="text-right p-2">Значение</th>
            {data[0]?.date && <th className="text-left p-2">Дата</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2 font-medium">{item.name}</td>
              <td className="p-2 text-right">{item.value.toLocaleString()}</td>
              {item.date && <td className="p-2">{item.date}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Аналитический режим</h2>
          <p className="text-muted-foreground">Визуализация данных и аналитика</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 месяц</SelectItem>
              <SelectItem value="3m">3 месяца</SelectItem>
              <SelectItem value="6m">6 месяцев</SelectItem>
              <SelectItem value="1y">1 год</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Графики</h3>
            <div className="space-y-2">
              {chartData.map((chart) => (
                <Button
                  key={chart.id}
                  variant={selectedChart.id === chart.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedChart(chart)}
                >
                  {chart.type === 'line' && <TrendingUp className="w-4 h-4 mr-2" />}
                  {chart.type === 'bar' && <BarChart3 className="w-4 h-4 mr-2" />}
                  {chart.type === 'pie' && <PieChartIcon className="w-4 h-4 mr-2" />}
                  {chart.type === 'area' && <Activity className="w-4 h-4 mr-2" />}
                  {chart.name}
                </Button>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Добавить график:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => addNewChart('line')}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Линия
                </Button>
                <Button variant="outline" size="sm" onClick={() => addNewChart('bar')}>
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Столбцы
                </Button>
                <Button variant="outline" size="sm" onClick={() => addNewChart('pie')}>
                  <PieChartIcon className="w-3 h-3 mr-1" />
                  Круг
                </Button>
                <Button variant="outline" size="sm" onClick={() => addNewChart('area')}>
                  <Activity className="w-3 h-3 mr-1" />
                  Область
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Статистика</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Всего графиков</span>
                <Badge variant="secondary">{chartData.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Точек данных</span>
                <Badge variant="secondary">
                  {chartData.reduce((sum, chart) => sum + chart.data.length, 0)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Период</span>
                <Badge variant="secondary">{timeRange}</Badge>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{selectedChart.name}</h3>
              {selectedChart.description && (
                <p className="text-sm text-muted-foreground">{selectedChart.description}</p>
              )}
            </div>

            <Tabs defaultValue="chart" className="w-full">
              <TabsList>
                <TabsTrigger value="chart">График</TabsTrigger>
                <TabsTrigger value="table">Таблица</TabsTrigger>
                <TabsTrigger value="analysis">Анализ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="mt-4">
                {renderChart(selectedChart)}
              </TabsContent>
              
              <TabsContent value="table" className="mt-4">
                {renderDataTable(selectedChart.data)}
              </TabsContent>
              
              <TabsContent value="analysis" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Максимум</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {Math.max(...selectedChart.data.map(d => d.value)).toLocaleString()}
                    </p>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium">Минимум</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {Math.min(...selectedChart.data.map(d => d.value)).toLocaleString()}
                    </p>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Среднее</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        selectedChart.data.reduce((sum, d) => sum + d.value, 0) / selectedChart.data.length
                      ).toLocaleString()}
                    </p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalystMode;
