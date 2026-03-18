import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import './Dashboard.css';
import Select from 'react-select';
import WarehouseChart from './WarehouseChart.js'
import { useNavigate } from "react-router-dom";
import Circle from './DashboardImages/circle.svg'
const config = require('./Apiconfig');

const Dashboard = () => {
  const navigate = useNavigate();

  const [totalSales, setTotalSales] = useState('');
  const [totalPurchase, setTotalPurchase] = useState('');
  const [totalItem, setTotalItem] = useState('');
  const [totalCloseItem, setTotalCloseItem] = useState('');
  const [totalActiveItem, setTotalActiveItem] = useState('');
  const [stock, setStock] = useState('');

  const [salesChartType, setSalesChartType] = useState('bar');
  const [itemSalesChartType, setItemSalesChartType] = useState('bar');
  const [purchaseChartType, setPurchaseChartType] = useState('bar');
  const [currentStockChartType, setCurrentStockChartType] = useState('bar');
  const [negativeStockChartType, setNegativeStockChartType] = useState('bar');

  const [purchaseTimeRange, setPurchaseTimeRange] = useState('CurrentFinancialYear');
  const [salesTimeRange, setSalesTimeRange] = useState('CurrentFinancialYear');
  const [itemWiseSalesTimeRange, setItemWiseSalesTimeRange] = useState('CurrentFinancialYear');
  const [salesCustomDateRange, setSalesCustomDateRange] = useState({ from: '', to: '' });
  const [purchaseCustomDateRange, setPurchaseCustomDateRange] = useState({ from: '', to: '' });
  const [itemWiseSalesCustomDateRange, setItemWiseSalesCustomDateRange] = useState({ from: '', to: '' });
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
  const [purchaseChart, setPurchaseChart] = useState([]);
  const [salesChart, setSalesChart] = useState([]);
  const [itemWiseSalesChart, setItemWiseSalesChart] = useState([]);
  const [currentStockChart, setCurrentStockChart] = useState([]);
  const [negativeStockChart, setNegativeStockChart] = useState([]);
  const [selectedSalesPeriod, setSelectedSalesPeriod] = useState('');
  const [selectedPurchasePeriod, setSelectedPurchasePeriod] = useState('');
  const [selectedItemWisePeriod, setSelectedItemWisePeriod] = useState('');
  const [purchasePeriod, setPurchasePeriod] = useState("");
  const [itemWisePeriod, setItemWisePeriod] = useState("");
  const [salesPeriod, setSalesPeriod] = useState("");
  const [perioddrop, setPerioddrop] = useState([]);
  const [itemperioddrop, setItemPerioddrop] = useState([]);
  const [formattedTotalSales, setFormattedTotalSales] = useState('0');
  const [formattedTotalPurchase, setFormattedTotalPurchase] = useState('0');
  const [formattedTotalStock, setFormattedTotalStock] = useState('0');
  const [sales, setSales] = useState(0);
  const [purchase, setPurchase] = useState(0);
  const [stockValue, setStockValue] = useState(0);


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDateRange`)
      .then((data) => data.json())
      .then((val) => {
        setPerioddrop(val);

        if (val.length > 0) {
          const firstOption = {
            value: val[0].Sno,
            label: val[0].DateRangeDescription,
          };
          setSelectedPurchasePeriod(firstOption);
          setSelectedSalesPeriod(firstOption);
          setPurchasePeriod(firstOption.value);
          setSalesPeriod(firstOption.value);
        }
      });
  }, []);

    useEffect(() => {
      fetch(`${config.apiBaseUrl}/getDateRange`)
          .then((data) => data.json())
          .then((val) => {
              const filteredVal = val.filter(option => option.DateRangeDescription !== "Last Three Months" && option.DateRangeDescription !== "Current Month" && option.DateRangeDescription !== "Last Week");
              setItemPerioddrop(filteredVal);
              if (filteredVal.length > 0) {
                  const firstOption = {
                      value: filteredVal[0].Sno,
                      label: filteredVal[0].DateRangeDescription,
                  };
                  setSelectedItemWisePeriod(firstOption);
                  setItemWisePeriod(firstOption.value);
              }
          });
  }, []);

  const filteredOptionPeriod = perioddrop.map((option) => ({
    value: option.Sno,
    label: option.DateRangeDescription,
  }));
  const filteredOptionItemPeriod = itemperioddrop.map((option) => ({
    value: option.Sno,
    label: option.DateRangeDescription,
  }));

  const handleChangeSalesPeriod = (selectedPeriod) => {
    setSelectedSalesPeriod(selectedPeriod);
    setSalesPeriod(selectedPeriod ? selectedPeriod.value : '');
  };

  const handleChangePurchasePeriod = (selectedPeriod) => {
    setSelectedPurchasePeriod(selectedPeriod);
    setPurchasePeriod(selectedPeriod ? selectedPeriod.value : '');
  };

  const handleChangeItemWisePeriod = (selectedPeriod) => {
    setSelectedItemWisePeriod(selectedPeriod);
    setItemWisePeriod(selectedPeriod ? selectedPeriod.value : '');
  };

useEffect(() => {
  const fetchDataAndAnimate = async () => {
    try {
      const companyCode = sessionStorage.getItem("selectedCompanyCode");
      const response = await fetch(`${config.apiBaseUrl}/getAllDashboardData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_code: companyCode }),
      });
      const data = await response.json();
      const [{ TotalSales, TotalPurchase }] = data;

      setTotalSales(TotalSales);
      setTotalPurchase(TotalPurchase);

      const duration = 2000; 
      const stepTime = 10; 
      const steps = duration / stepTime;
      const incrementSales = TotalSales / steps;
      const incrementPurchase = TotalPurchase / steps;

      let currentValueSales = 0;
      let currentValuePurchase = 0;

      const sales = setInterval(() => {
        currentValueSales += incrementSales;
        if (currentValueSales >= TotalSales) {
          clearInterval(sales);
          setSales(TotalSales);
        } else {
          setSales(Math.round(currentValueSales));
        }
      }, stepTime);

      const purchase = setInterval(() => {
        currentValuePurchase += incrementPurchase;
        if (currentValuePurchase >= TotalPurchase) {
          clearInterval(purchase);
          setPurchase(TotalPurchase);
        } else {
          setPurchase(Math.round(currentValuePurchase));
        }
      }, stepTime);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchDataAndAnimate();
}, []);

  useEffect(() => {
    setFormattedTotalSales(sales.toLocaleString('en-IN'));
  }, [sales]); 

  useEffect(() => {
    setFormattedTotalPurchase(purchase.toLocaleString('en-IN'));
  }, [purchase]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");
        const response = await fetch(`${config.apiBaseUrl}/DashboardItemData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }), 
        });
        const data = await response.json();
        const [{ totalItem, totalCloseItem, totalActiveItem }] = data;
        setTotalItem(totalItem);
        setTotalCloseItem(totalCloseItem);
        setTotalActiveItem(totalActiveItem);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");
        const response = await fetch(`${config.apiBaseUrl}/DashboardStockData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });
        const data = await response.json();
        const [{ overallStockValue }] = data;
        setStock(overallStockValue);

        const duration = 2000; 
        const stepTime = 10; 
        const steps = duration / stepTime;
        const incrementStock = overallStockValue / steps;

        let currentValue = 0;

        const stock = setInterval(() => {
          currentValue += incrementStock;
          if (currentValue >= overallStockValue) {
            clearInterval(stock);
            setStockValue(overallStockValue);
          } else {
            setStockValue(Math.round(currentValue));
          }
        }, stepTime);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFormattedTotalStock(stockValue.toLocaleString('en-IN'));
  }, [stockValue]); 

  useEffect(() => {
    const fetchCurrentStockData = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");
        const response = await fetch(`${config.apiBaseUrl}/getCurrentStock`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setCurrentStockChart(data);
        } else {
          console.warn('Invalid data format:', data);
          setCurrentStockChart([]); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCurrentStockChart([]); 
      }
    };
    fetchCurrentStockData();
  }, []);

  useEffect(() => {
    const fetchNegativeStockData = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");
        const response = await fetch(`${config.apiBaseUrl}/getNegativeStock`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });
  
        const data = await response.json();
  
        if (Array.isArray(data)) {
          setNegativeStockChart(data);
        } else {
          setNegativeStockChart([]); 
        }
      } catch (error) {
        setNegativeStockChart([]); 
      }
    };
  
    fetchNegativeStockData();
  }, []);

  const handleNavigateToItem = (e) => {
    navigate("/ItemData");
    e.preventDefault();
  };

  const handleNavigateToSalesTrans = (e) => {
    navigate("/SalesAnalysis");
    e.preventDefault();
  };

  const handleNavigateToProductDash = (e) => {
    navigate("/PurchaseAnalysis");
    e.preventDefault();
  };
  const handleNavigateToTStockDash = (e) => {
    navigate("/TotalStock");
    e.preventDefault();
  };
  const handleNavigateToCurrentStock = (e) => {
    navigate("/CurrentStock");
    e.preventDefault();
  };

  // const formattedTotalSales = totalSales.toLocaleString('en-IN');
  // const formattedTotalPurchase = totalPurchase.toLocaleString('en-IN');
  // const formattedTotalStock = stock.toLocaleString('en-IN');

  const fetchPurchaseData = async () => {
    try {
      const body = {
        mode: purchasePeriod.toString(),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };
  
      if (selectedPurchasePeriod.label === "Custom Date") {
        body.StartDate = purchaseCustomDateRange.from;
        body.EndDate = purchaseCustomDateRange.to;
      }
  
      const response = await fetch(`${config.apiBaseUrl}/getDashboardPurchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        const searchData = await response.json();
        setPurchaseChart(Array.isArray(searchData) ? searchData : []); 
        console.log(searchData);
      } else if (response.status === 404) {
        console.log("Data Not Found");
        setPurchaseChart([]); 
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      setPurchaseChart([]);
    }
  };

  const fetchSalesData = async () => {
    try {
      const body = {
        mode: salesPeriod.toString(),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };
  
      if (selectedSalesPeriod?.label === "Custom Date") {
        body.StartDate = salesCustomDateRange?.from;
        body.EndDate = salesCustomDateRange?.to;
      }
  
      const response = await fetch(`${config.apiBaseUrl}/getDashboardSales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        const searchData = await response.json();
        setSalesChart(Array.isArray(searchData) ? searchData : []); // Ensure data is an array
        console.log(searchData);
      } else if (response.status === 404) {
        console.log("Data Not Found");
        setSalesChart([]); // Set empty data if not found
      } else {
        console.log("Bad Request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      setSalesChart([]); 
    }
  };

  const fetchItemWiseSalesData = async () => {
    try {
      const body = {
        mode: itemWisePeriod.toString(),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };
  
      if (selectedItemWisePeriod.label === "Custom Date") {
        body.StartDate = itemWiseSalesCustomDateRange.from;
        body.EndDate = itemWiseSalesCustomDateRange.to;
      }
  
      const response = await fetch(`${config.apiBaseUrl}/getDashboardItemSales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        const searchData = await response.json();
        setItemWiseSalesChart(Array.isArray(searchData) ? searchData : []); 
        console.log(searchData);
      } else if (response.status === 404) {
        console.log("Data Not Found");
        setItemWiseSalesChart([]);
      } else {
        console.log("Bad Request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      setItemWiseSalesChart([]);
    }
  };

  useEffect(() => {
    if(purchasePeriod){
      fetchPurchaseData();
    }
  },[purchaseCustomDateRange,purchasePeriod]);

  useEffect(() => {
    if(salesPeriod){
      fetchSalesData();
    }
  }, [salesCustomDateRange,salesPeriod]);

  useEffect(() => {
    if (itemWisePeriod) {
      fetchItemWiseSalesData();
    }
  }, [itemWisePeriod, itemWiseSalesCustomDateRange]);

  const handleTimeRangeChange = (e) => {
    setPurchaseTimeRange(e.target.value);
    if (e.target.value !== 'CustomDate') {
      setCustomDateRange({ from: '', to: '' });
    }
  };
  const handleSalesTimeRange = (e) => {
    setSalesTimeRange(e.target.value);
    if (e.target.value !== 'CustomDate') {
      setCustomDateRange({ from: '', to: '' });
    }
  };
  const handleItemWiseSalesTimeRange = (e) => {
    setItemWiseSalesTimeRange(e.target.value);
    if (e.target.value !== 'CustomDate') {
      setCustomDateRange({ from: '', to: '' });
    }
  };


  const handleSalesCustomDateChange = (e) => {
    const { name, value } = e.target;
    setSalesCustomDateRange((prevRange) => ({
      ...prevRange,
      [name]: value
    }));
  };
  const handlePurchaseCustomDateChange = (e) => {
    const { name, value } = e.target;
    setPurchaseCustomDateRange((prevRange) => ({
      ...prevRange,
      [name]: value
    }));
  };
  
  const handleItemSalesCustomDateChange = (e) => {
    const { name, value } = e.target;
    setItemWiseSalesCustomDateRange((prevRange) => ({
      ...prevRange,
      [name]: value
    }));
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const aggregatePurchaseData = () => {
    if (!Array.isArray(purchaseChart)) {
      return { purchaseSeries: [], purchaseCategories: [] };
    }
  
    const aggregatedData = {};
  
    purchaseChart.forEach((item) => {
      const dateKey =
        purchaseTimeRange === "CurrentFinancialYear" ||
        purchaseTimeRange === "LastThreeMonth" ||
        purchaseTimeRange === "LastYear" ||
        purchaseTimeRange === "LastWeek" ||
        purchaseTimeRange === "CustomDate" ||
        purchaseTimeRange === "CurrentMonth"
          ? item.MonthYear
          : formatDate(item.transaction_date);
  
      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = 0;
      }
  
      // Sum up the TotalPurchaseAmount for each date
      aggregatedData[dateKey] += item.TotalPurchaseAmount;
    });
  
    // Prepare categories and series data
    const purchaseCategories = Object.keys(aggregatedData);
    const seriesData = Object.values(aggregatedData);
  
    // Create the series array for the chart
    const purchaseSeries = [
      {
        name: "Total Purchase Amount",
        data: seriesData,
        backgroundColor: "#a3d2ff",
      },
    ];
  
    return { purchaseSeries, purchaseCategories };
  };

  const { purchaseSeries, purchaseCategories } = aggregatePurchaseData();

  const purchaseData = {
    series: purchaseChartType === 'pie' ||purchaseChartType === 'donut'
    ? purchaseSeries[0].data
    : purchaseSeries,
    options: {
      chart: {
        type: purchaseChartType,
        height: 350,
        width: 500,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (value) {
          if (value >= 100000) {
            return `₹${(value / 100000).toFixed(2)}L`; // For lakhs
          } else if (value >= 1000) {
            return `₹${(value / 1000).toFixed(2)}K`; // For thousands
          }
          return `₹${value}`; // For values less than a thousand
        },
        offsetY: -10,
        style: {
          fontSize: '10px',
          colors: ['#000']
        },
        background: {
          enabled: false, // Disables background
          foreColor: '#000', // Set foreground color for text if needed
          borderRadius: 0 // No border radius
        },
      },
      stroke: {
        width: purchaseChartType === "line" || purchaseChartType === "area" ? 4 : 0, 
        curve: 'smooth'
      },
      xaxis: {
        categories: purchaseCategories,
        title: {
          text: 'Date'
        }
      },
      yaxis: {
        title: {
          text: 'Total Purchase Amount (₹)'
        },
        labels: {
          formatter: function (value) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(2)}K`;
            }
            return `₹${value}`;
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(2)}K`;
            }
            return `₹${value}`;
          }
        }
      },
      plotOptions: {
        bar: {
          distributed: true
        },
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(2);
                },
              },
            },
          },
        },
      },
      labels: purchaseCategories,
    }
  };
  

  const aggregateSalesData = () => {
    if (!Array.isArray(salesChart)) {
      return { salesSeries: [], salesCategories: [] };
    }
  
    const aggregatedData = {};
  
    salesChart.forEach((item) => {
      const dateKey =
        salesTimeRange === "CurrentFinancialYear" ||
        salesTimeRange === "LastThreeMonth" ||
        salesTimeRange === "LastYear" ||
        salesTimeRange === "LastWeek" ||
        salesTimeRange === "CustomDate" ||
        salesTimeRange === "CurrentMonth"
          ? item?.MonthYear
          : formatDate(item?.bill_date);
  
      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = 0;
      }
  
      aggregatedData[dateKey] += item?.TotalSaleAmount || 0; 
    });
  
    const salesCategories = Object.keys(aggregatedData);
    const seriesData = Object.values(aggregatedData);
  
    const salesSeries = [
      {
        name: "Total Sales Amount",
        data: seriesData,
        backgroundColor: "#a3d2ff",
      },
    ];
  
    return { salesSeries, salesCategories };
  };

  const { salesSeries, salesCategories } = aggregateSalesData();

  const salesData = {
    series: salesChartType === 'pie' || salesChartType === 'donut'
      ? salesSeries[0].data
      : salesSeries,
    options: {
      chart: {
        type: salesChartType,
        height: 350,
        width: 500,
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (value) {
          if (value >= 100000) {
            return `₹${(value / 100000).toFixed(2)}L`; 
          } else if (value >= 1000) {
            return `₹${(value / 1000).toFixed(2)}K`;
          }
          return `₹${value}`;
        },
        offsetY: -10,
        style: {
          fontSize: '10px',
          colors: ['#000']
        },
        background: {
          enabled: false,
          foreColor: '#000',
          borderRadius: 0
        },
      },
      stroke: {
        width: salesChartType === "line" || salesChartType === "area" ? 4 : 0,
        curve: 'smooth'
      },
      xaxis: {
        categories: salesCategories,
        title: {
          text: 'Date'
        }
      },
      yaxis: {
        title: {
          text: 'Total Sales Amount (₹)'
        },
        labels: {
          formatter: function (value) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(2)}K`;
            }
            return `₹${value}`;
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(2)}K`;
            }
            return `₹${value}`;
          }
        }
      },
      plotOptions: {
        bar: {
          distributed: true
        },
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(2);
                }
              }
            }
          }
        }
      },
      labels: salesCategories
    }
  };

   const aggregateItemSalesData = () => {
  if (!Array.isArray(itemWiseSalesChart)) {
    return { itemSalesSeries: [], itemSalesCategories: [] };
  }

  const aggregatedData = {};

  itemWiseSalesChart.forEach((item) => {
    const dateKey =
      itemWiseSalesTimeRange === "CurrentFinancialYear" ||
      itemWiseSalesTimeRange === "LastMonth" ||
      itemWiseSalesTimeRange === "LastYear" ||
      itemWiseSalesTimeRange === "TodayDate" ||
      itemWiseSalesTimeRange === "CustomDate"
        ? item.item_code
        : formatDate(item.bill_date);

    if (!aggregatedData[dateKey]) {
      aggregatedData[dateKey] = 0;
    }

    aggregatedData[dateKey] += item.OverallTotalSales;
  });

  const itemSalesCategories = Object.keys(aggregatedData);
  const seriesData = Object.values(aggregatedData);

  const itemSalesSeries = [
    {
      name: "Item-wise Sale",
      data: seriesData,
      backgroundColor: "#a3d2ff",
    },
  ];

  return { itemSalesSeries, itemSalesCategories };
};

  const { itemSalesSeries, itemSalesCategories } = aggregateItemSalesData();

  const itemWiseData = {
    series: itemSalesChartType === 'pie' || itemSalesChartType === 'donut'
      ? itemSalesSeries[0].data
      : itemSalesSeries,
    options: {
      chart: {
        type: itemSalesChartType,
        height: 350,
        width: 500,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -10,
        style: {
          fontSize: '10px',
          colors: ['#000'],
        },
        background: {
          enabled: false,
          foreColor: '#000',
          borderRadius: 0,
        },
        formatter: function (value, { dataPointIndex }) {
          return `${value.toFixed(2)} Qty`;
        }
      },
      stroke: {
        width: itemSalesChartType === "line" || itemSalesChartType === "area" ? 4 : 0, 
        curve: 'smooth',
      },
      xaxis: {
        categories: itemSalesCategories,
        title: {
          text: 'Item Code',
        },
      },
      yaxis: {
        title: {
          text: 'Item-wise Sales (Qty)',
        },
        labels: {
          formatter: function (value) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`; 
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(2)}K`; 
            }
            return `${value} Qty`; 
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (value) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(2)}K`; 
            }
            return `${value} Qty`; 
          },
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
        },
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(2);
                },
              },
            },
          },
        },
      },
      labels: itemSalesCategories, 
    },
  };

  const aggregateCurrentStockData = () => {
    if (!Array.isArray(currentStockChart)) {
      return { currentStockSeries: [], currentStockSeries: [] };
    }
    const aggregatedData = {};

    currentStockChart.forEach(item => {
      const dateKey = item.VariantGroup;

      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = 0;
      }

      aggregatedData[dateKey] += item.TotalQty;
    });

    const currentStockCategories = Object.keys(aggregatedData);
    const seriesData = Object.values(aggregatedData);

    const currentStockSeries = [{
      name: 'Current Stock',
      data: seriesData,
      backgroundColor: '#a3d2ff'
    }];

    return { currentStockSeries, currentStockCategories };
  };

  const { currentStockSeries, currentStockCategories } = aggregateCurrentStockData();

  const currentStockData = {
    series: currentStockChartType === 'pie' || currentStockChartType === 'donut'
      ? currentStockSeries[0].data
      : currentStockSeries,
    options: {
      chart: {
        type: currentStockChartType,
        height: 350,
        width: 500,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -10,
        style: {
          fontSize: '10px',
          colors: ['#000'],
        },
        background: {
          enabled: false,
          foreColor: '#000',
          borderRadius: 0,
        },
        formatter: function (value, { dataPointIndex }) {
          return `${value.toFixed(2)} Qty`;
        }
      },
      stroke: {
        width: currentStockChartType === "line" || currentStockChartType === "area" ? 4 : 0,
        curve: 'smooth',
      },
      xaxis: {
        categories: currentStockCategories,
        title: {
          text: 'Item Varient',
        },
      },
      yaxis: {
        title: {
          text: 'Current Stock (Qty)',
        },
        labels: {
          formatter: function (value) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`; 
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(2)}K`;
            }
            return `${value} Qty`;
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (value) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(2)}K`; 
            }
            return `${value} Qty`;
          },
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
        },
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(2);
                },
              },
            },
          },
        },
      },
      labels: currentStockCategories, 
    },
  };

   // Chart configuration
   const aggregateNegativeStockData = () => {
    if (!Array.isArray(negativeStockChart)) {
      return { negativeStockSeries: [], negativeStockCategories: [] };
    }
  
    const aggregatedData = {};
  
    negativeStockChart.forEach((item) => {
      const dateKey = item.VariantGroup;
  
      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = 0;
      }
  
      aggregatedData[dateKey] += item.TotalQty;
    });
  
    const negativeStockCategories = Object.keys(aggregatedData);
    const seriesData = Object.values(aggregatedData);

    const negativeStockSeries = [
      {
        name: 'Negative Stock',
        data: seriesData,
        backgroundColor: '#a3d2ff',
      },
    ];
  
    return { negativeStockSeries, negativeStockCategories };
  };

  const { negativeStockSeries, negativeStockCategories } = aggregateNegativeStockData();

  const negativeStockData = {
    series: negativeStockChartType === 'pie' || negativeStockChartType === 'donut'
      ? negativeStockSeries[0].data
      : negativeStockSeries,
    options: {
      chart: {
        type: negativeStockChartType,
        height: 350,
        width: 500,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -10,
        style: {
          fontSize: '10px',
          colors: ['#000'],
        },
        background: {
          enabled: false,
          foreColor: '#000',
          borderRadius: 0,
        },
        formatter: function (value, { dataPointIndex }) {
          return `${value.toFixed(2)} Qty`;
        }
      },
      stroke: {
        width: negativeStockChartType === "line" || negativeStockChartType === "area" ? 4 : 0,
        curve: 'smooth',
      },
      xaxis: {
        categories: negativeStockCategories,
        title: {
          text: 'Item Varient',
        },
        labels: {
          style: {
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Negative Stock (Qty)',
        },
        labels: {
          formatter: function (value) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`; // For lakhs
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(2)}K`; // For thousands
            }
            return `${value} Qty`; // For values less than a thousand
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (value) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`; // For lakhs
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(2)}K`; // For thousands
            }
            return `${value} Qty`; // For values less than a thousand
          },
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
        },
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                },
              },
            },
          },
        },
      },
      labels: negativeStockCategories,
    },
  };



  return (
  <div className="container-fluid Topnav-screen">
      
  <div className="dashboard">
  <div className="dashboard-card bg-primary" style={{ cursor: "pointer" }} onClick={handleNavigateToSalesTrans}>
  <img src={Circle} className='dashboard-image' alt=''/>
    <div className="text-white fw-bold">Total Sales</div>
    <div className="text-white fs-4 d-flex mt-2">₹ {formattedTotalSales}</div>
    <div className="graph-line">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" >
    <line className="graph-path" x1="10" y1="10" x2="10" y2="118" stroke="currentColor" />
    <line className="graph-path" x1="10" y1="118" x2="118" y2="118" stroke="currentColor" />
    <rect className="graph-path" x="20" y="90" width="10" height="28" fill="#4caf50" />
    <rect className="graph-path" x="40" y="70" width="10" height="48" fill="#2196f3" />
    <rect className="graph-path" x="60" y="50" width="10" height="68" fill="#ff9800" />
    <rect className="graph-path" x="80" y="30" width="10" height="88" fill="#f44336" />
    <polyline className="graph-path" points="20,90 40,70 60,50 80,30" fill="none" stroke="gold" strokeWidth="6" />
    <polygon className="graph-path" points="80,30 75,40 85,40" fill="gold" />
  </svg>
  </div> 
  </div>

  <div className="dashboard-card bg-success animated-bg" style={{ cursor: "pointer" }} onClick={handleNavigateToProductDash}>
  <img src={Circle} className='dashboard-image' alt=''/>
    <div className="text-white fw-bold">Total Purchase</div>
    <div className="text-white fs-4 d-flex  mt-2">₹ {formattedTotalPurchase}</div>
    <div className="graph-line">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" >
    <rect className="graph-path" x="40" y="80" width="176" height="160" rx="20" fill="#ff9800" stroke="currentColor" />
    <path className="graph-path" d="M80,80 C80,40 176,40 176,80" fill="none" stroke="currentColor" />
    <circle className="graph-path" cx="80" cy="80" r="8" fill="currentColor" />
    <circle className="graph-path" cx="176" cy="80" r="8" fill="currentColor" />
    <text className="graph-path" x="128" y="160" textAnchor="middle" fontSize="64px" fill="#4caf50" fontFamily="Arial" fontWeight="bold">$</text>
    <path className="graph-path" d="M128,200 L160,160" fill="none" stroke="#4caf50" />
    <polygon className="graph-path" points="160,160 150,170 170,170" fill="#4caf50" />
  </svg>
  </div> 
  </div>

  <div className="dashboard-card bg-danger animated-bg" style={{ cursor: "pointer" }} onClick={handleNavigateToItem}>
  <img src={Circle} className='dashboard-image' alt=''/>
    <div className="text-white fw-bold">Total Items</div>
    <div className="text-white fs-4 d-flex mt-2">{totalActiveItem}/{totalItem}</div>
    <div className="graph-line">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
    <rect className="graph-path" x="40" y="120" width="80" height="80" rx="12" fill="#ffcc00" stroke="currentColor" />
    <rect className="graph-path" x="88" y="80" width="80" height="80" rx="12" fill="#4caf50" stroke="currentColor" />
    <rect className="graph-path" x="136" y="120" width="80" height="80" rx="12" fill="#2196f3" stroke="currentColor" />
    <text className="graph-path" x="80" y="160" textAnchor="middle" fontSize="16px" fill="#000" fontFamily="Arial" fontWeight="bold">A</text>
    <text className="graph-path" x="128" y="120" textAnchor="middle" fontSize="16px" fill="#000" fontFamily="Arial" fontWeight="bold">B</text>
    <text className="graph-path" x="176" y="160" textAnchor="middle" fontSize="16px" fill="#000" fontFamily="Arial" fontWeight="bold">C</text>
  </svg>
  </div>
  </div>

  <div className="dashboard-card bg-info animated-bg" style={{ cursor: "pointer" }} onClick={handleNavigateToTStockDash}>
  <img src={Circle} className='dashboard-image' alt=''/>
    <div className="text-white fw-bold">Total Stock Values</div>
    <div className="text-white fs-4 d-flex  mt-2">₹ {formattedTotalStock}</div>
    <div className="graph-line">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" >
    <path className="graph-path" d="M40 200 L80 160 L120 180 L160 120 L200 140 L240 80" fill="none" stroke="#4caf50" strokeWidth="12" />
    <line className="graph-path" x1="40" y1="200" x2="240" y2="200" stroke="#000" strokeWidth="12" />
    <line className="graph-path" x1="40" y1="200" x2="40" y2="40" stroke="#000" strokeWidth="12" />
    <circle className="graph-path" cx="40" cy="200" r="8" fill="#4caf50" />
    <circle className="graph-path" cx="80" cy="160" r="8" fill="#4caf50" />
    <circle className="graph-path" cx="120" cy="180" r="8" fill="#4caf50" />
    <circle className="graph-path" cx="160" cy="120" r="8" fill="#4caf50" />
    <circle className="graph-path" cx="200" cy="140" r="8" fill="#4caf50" />
    <circle className="graph-path" cx="240" cy="80" r="8" fill="#4caf50" />
    <text className="graph-path" x="40" y="220" textAnchor="middle" fontSize="16px" fill="#000" fontFamily="Arial" fontWeight="bold">Start</text>
    <text className="graph-path" x="240" y="220" textAnchor="middle" fontSize="16px" fill="#000" fontFamily="Arial" fontWeight="bold">End</text>
  </svg>
  </div>
  </div>
</div>

      <div className="">
        <div className="row">
          <div className="col-md-6 col-lg-4 mb-4 ">
            <div className="chart shadow-lg rounded-4">
              <h3>Sales Value</h3>
              {selectedSalesPeriod.label === "Custom Date" && (
                <div className='row d-flex justify-content-center mb-3'>
                  <div className='col-3 col-md-1'>
                    <label className="form-label">From</label>
                  </div>
                  <div className='col-5 col-md-5'>
                    <input
                      type="date"
                      className="form-control"
                      name="from"
                      value={salesCustomDateRange.from}
                      onChange={handleSalesCustomDateChange}
                    />
                  </div>
                  <div className='col-1'>
                    <label className="form-label">To</label>
                  </div>
                  <div className='col-5 col-md-5'>
                    <input
                      type="date"
                      className="form-control"
                      name="to"
                      value={salesCustomDateRange.to}
                      onChange={handleSalesCustomDateChange}
                    />
                  </div>
                </div>
              )}
              <div className="select-container">
                <select onChange={(e) => setSalesChartType(e.target.value)} value={salesChartType}>
                  <option value="bar">Bar</option>
                  <option value="area">Area</option>
                  <option value="line">Line</option>
                  <option value="donut">Donut</option>
                  <option value="pie">Pie</option>
                </select>
                <Select
                id="wcode"
                value={selectedSalesPeriod}
                onChange={handleChangeSalesPeriod}
                options={filteredOptionPeriod}
                className="exp-input-field"
                placeholder=""
                required title="Please select a item code"
                maxLength={18}
              />
              </div>
              <ApexCharts
                options={salesData.options}
                series={salesData.series}
                type={salesChartType}
                height="300"
              />
            </div>
          </div>

          <div className="col-md-6 col-lg-4 mb-4">
            <div className="chart shadow-lg rounded-4">
              <h3>Item-wise Sales</h3>
              {selectedItemWisePeriod.label === "Custom Date" && (
                <div className='row d-flex justify-content-center mb-3'>
                  <div className='col-3 col-md-1'>
                    <label className="form-label">From</label>
                  </div>
                  <div className='col-5 col-md-5'>
                    <input
                      type="date"
                      className="form-control "
                      name="from"
                      value={itemWiseSalesCustomDateRange.from}
                      onChange={handleItemSalesCustomDateChange}
                    />
                  </div>
                  <div className='col-1'>
                    <label className="form-label">To</label>
                  </div>
                  <div className='col-5 col-md-5'>
                    <input
                      type="date"
                      className="form-control"
                      name="to"
                      value={itemWiseSalesCustomDateRange.to}
                      onChange={handleItemSalesCustomDateChange}
                    />
                  </div>
                </div>
              )}
              <div className="select-container">
                <select onChange={(e) => setItemSalesChartType(e.target.value)} value={itemSalesChartType}>
                  <option value="bar">Bar</option>
                  <option value="area">Area</option>
                  <option value="line">Line</option>
                  <option value="donut">Donut</option>
                  <option value="pie">Pie</option>
                </select>
                <Select
                id="wcode"
                value={selectedItemWisePeriod}
                onChange={handleChangeItemWisePeriod}
                options={filteredOptionItemPeriod}
                className="exp-input-field"
                placeholder=""
                required title="Please select a item code"
                maxLength={18}
              />
              </div>
              <ApexCharts
                options={itemWiseData.options}
                series={itemWiseData.series}
                type={itemSalesChartType}
                height="300"
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="chart shadow-lg rounded-4">
              <h3>Purchase Value</h3>
              {selectedPurchasePeriod.label === "Custom Date" && (
                <div className='row d-flex justify-content-center mb-3'>
                  <div className='col-3 col-md-1'>
                    <label className="form-label">From</label>
                  </div>
                  <div className='col-5 col-md-5'>
                    <input
                      type="date"
                      className="form-control"
                      name="from"
                      value={purchaseCustomDateRange.from}
                      onChange={handlePurchaseCustomDateChange}
                    />
                  </div>
                  <div className='col-1'>
                    <label className="form-label">To</label>
                  </div>
                  <div className='col-5 col-md-5'>
                    <input
                      type="date"
                      className="form-control"
                      name="to"
                      value={purchaseCustomDateRange.to}
                      onChange={handlePurchaseCustomDateChange}
                    />
                  </div>
                </div>
              )}
              <div className="select-container">
                <select onChange={(e) => setPurchaseChartType(e.target.value)} value={purchaseChartType}>
                  <option value="bar">Bar</option>
                  <option value="area">Area</option>
                  <option value="line">Line</option>
                  <option value="donut">Donut</option>
                  <option value="pie">Pie</option>
                </select>
                <Select
                id="wcode"
                value={selectedPurchasePeriod}
                onChange={handleChangePurchasePeriod}
                options={filteredOptionPeriod}
                className="exp-input-field"
                placeholder=""
                required title="Please select a item code"
                maxLength={18}
              />
              </div>
              <ApexCharts
                options={purchaseData.options}
                series={purchaseData.series}
                type={purchaseChartType}
                height="300"
              />
            </div>
          </div>

          <div className="col-md-6 col-lg-4 mb-4">
          <div className="chart shadow-lg rounded-4">
          <h3>Warehouse Stock</h3>
          <WarehouseChart />
          </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-4" style={{cursor:"pointer"}} >
            <div className="chart shadow-lg rounded-4">
              <h3 onClick={ handleNavigateToCurrentStock}>Current Stock</h3>
              <div className="select-container">
                <select onChange={(e) => setCurrentStockChartType(e.target.value)} value={currentStockChartType}>
                  <option value="bar">Bar</option>
                  <option value="area">Area</option>
                  <option value="line">Line</option>
                  <option value="donut">Donut</option>
                  <option value="pie">Pie</option>
                </select>
              </div>
              <ApexCharts
                options={currentStockData.options}
                series={currentStockData.series}
                type={currentStockChartType}
                height="300"
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="chart shadow-lg rounded-4">
              <h3>Negative Stock</h3>
              <div className="select-container">
                <select onChange={(e) => setNegativeStockChartType(e.target.value)} value={negativeStockChartType}>
                <option value="bar">Bar</option>
                  <option value="area">Area</option>
                  <option value="line">Line</option>
                  <option value="donut">Donut</option>
                  <option value="pie">Pie</option>
                </select>
              </div>
              <ApexCharts
                options={negativeStockData.options}
                series={negativeStockData.series}
                type={negativeStockChartType}
                height="300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
