import React, { useState, useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';

const MarketCalculator = () => {
  const [marketData, setMarketData] = useState({
    title: '',
    totalCustomers: '',
    revenuePerCustomer: '',
    samPercentage: '',
    somPercentage: ''
  });

  const [calculations, setCalculations] = useState({
    tam: 0,
    sam: 0,
    som: 0
  });

  const visualizationRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMarketData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateMarkets = useCallback(() => {
    const tam = marketData.totalCustomers * marketData.revenuePerCustomer;
    const sam = tam * (marketData.samPercentage / 100);
    const som = sam * (marketData.somPercentage / 100);

    setCalculations({ tam, sam, som });
  }, [marketData]);

  const formatCurrency = (value) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getRadii = () => {
    const TAM_RADIUS = 225;
    const samRatio = calculations.tam ? calculations.sam / calculations.tam : 0;
    const somRatio = calculations.tam ? calculations.som / calculations.tam : 0;
    
    return {
      tam: TAM_RADIUS,
      sam: TAM_RADIUS * Math.sqrt(samRatio),
      som: TAM_RADIUS * Math.sqrt(somRatio)
    };
  };

  const copyToClipboard = async () => {
    try {
      const visualizationElement = visualizationRef.current;
      if (!visualizationElement) return;

      // Create canvas from the visualization div
      const canvas = await html2canvas(visualizationElement, {
        backgroundColor: 'white',
        scale: 2, // Higher resolution
      });

      // Convert canvas to blob
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
      });

      // Create ClipboardItem and copy to clipboard
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);

      alert('Visualization copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy visualization. Please try again.');
    }
  };

  const radii = getRadii();

    return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-left">Market Size Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-left">Input Data</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-left">
                Chart Title
              </label>
              <input
                type="text"
                name="title"
                value={marketData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., Electric Battery Market Opportunity in LATAM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-left">
                Total Potential Customers
              </label>
              <input
                type="number"
                name="totalCustomers"
                value={marketData.totalCustomers}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter total customers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-left">
                Revenue Per Customer (Annual)
              </label>
              <input
                type="number"
                name="revenuePerCustomer"
                value={marketData.revenuePerCustomer}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter revenue per customer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-left">
                SAM Percentage (%)
              </label>
              <input
                type="number"
                name="samPercentage"
                value={marketData.samPercentage}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter SAM percentage"
                max="100"
              />
              <p className="mt-1 text-xs font-light text-gray-500 italic text-left">
                Estimate the % of the TAM that your business can realistically serve, given your resources and capabilities.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-left">
                SOM Percentage (%)
              </label>
              <input
                type="number"
                name="somPercentage"
                value={marketData.somPercentage}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter SOM percentage"
                max="100"
              />
              <p className="mt-1 text-xs font-light text-gray-500 italic text-left">
                The portion of SAM that you can realistically capture given current market share and competition.
              </p>
            </div>

            <button
              onClick={calculateMarkets}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Calculate
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div ref={visualizationRef} className="space-y-4 bg-white p-4">
            {marketData.title && (
              <h2 className="text-xl font-semibold text-left">{marketData.title}</h2>
            )}
            
            <svg width="100%" height="100%" viewBox="0 0 500 500" style={{enableBackground: 'new 0 0 500 500'}}>
              <style type="text/css">
                {`.st0{fill:#0088FE;}
                  .st1{fill:#00C49F;}
                  .st2{fill:#FFBB28;}
                  .st3{fill:#FFFFFF;}
                  .st4{font-family:Arial-BoldMT, Arial;}
                  .st5{font-size:20px;}
                  .st6{font-size:25px;}`}
              </style>
              
              <circle className="st0" cx="250" cy="250" r={radii.tam}/>
              <circle className="st1" cx="250" cy="325" r={radii.sam}/>
              <circle className="st2" cx="250" cy="400" r={radii.som}/>
              
              {/* TAM Labels */}
              <text transform="matrix(1 0 0 1 229.082 57.7226)" className="st3 st4 st5">
                TAM
              </text>
              <text transform="matrix(1 0 0 1 209.6924 84.7226)" className="st3 st4 st6">
                {formatCurrency(calculations.tam)}
              </text>
              
              {/* SAM Labels */}
              <text transform="matrix(1 0 0 1 227.7783 210.5)" className="st3 st4 st5">
                SAM
              </text>
              <text transform="matrix(1 0 0 1 209.6924 237.5)" className="st3 st4 st6">
                {formatCurrency(calculations.sam)}
              </text>
              
              {/* SOM Labels */}
              <text transform="matrix(1 0 0 1 227.2217 392.5007)" className="st3 st4 st5">
                SOM
              </text>
              <text transform="matrix(1 0 0 1 216.6445 419.5007)" className="st3 st4 st6">
                {formatCurrency(calculations.som)}
              </text>
            </svg>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#0088FE' }}></div>
                  <span className="font-medium">TAM:</span>
                </div>
                <span>{formatCurrency(calculations.tam)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#00C49F' }}></div>
                  <span className="font-medium">SAM:</span>
                </div>
                <span>{formatCurrency(calculations.sam)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#FFBB28' }}></div>
                  <span className="font-medium">SOM:</span>
                </div>
                <span>{formatCurrency(calculations.som)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Copy Visualization to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketCalculator;