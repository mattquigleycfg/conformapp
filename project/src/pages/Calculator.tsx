import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Calculator as CalculatorIcon } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import Standard from './products/Standard';
import EasyMechMR from './products/EasyMechMR';
import SpanPlus from './products/SpanPlus';
import EasyMechCR from './products/EasyMechCR';
import RFScreen from './products/RFScreen';
import AcousticLouvre from './products/AcousticLouvre';
import Guardrail from './products/Guardrail';
import ToConcrete from './products/ToConcrete';
import ToRoof from './products/ToRoof';
import Walkway from './products/Walkway';

const CATEGORIES = {
  platforms: [
    { value: 'easymech-mr', label: 'EasyMech MR', component: EasyMechMR },
    { value: 'span-plus', label: 'Span+', component: SpanPlus },
    { value: 'easymech-cr', label: 'EasyMech CR', component: EasyMechCR }
  ],
  screens: [
    { value: 'standard', label: 'Standard', component: Standard },
    { value: 'rf-screen', label: 'RF Screen', component: RFScreen },
    { value: 'acoustic-louvre', label: 'Acoustic+ Louvre', component: AcousticLouvre },
    { value: 'to-concrete', label: 'To Concrete', component: ToConcrete },
    { value: 'to-roof', label: 'To Roof', component: ToRoof }
  ],
  access: [
    { value: 'walkway', label: 'Walkway', component: Walkway },
    { value: 'guardrail', label: 'Guardrail', component: Guardrail }
  ]
};

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current product for breadcrumbs
  const currentProduct = Object.values(CATEGORIES)
    .flat()
    .find(p => location.pathname.includes(p.value));

  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Calculator', href: '/calculator' },
    ...(currentProduct ? [{ label: currentProduct.label }] : [])
  ];

  const ProductSelector = () => (
    <div className="space-y-8">
      {/* Platforms */}
      <div>
        <h2 className="text-xl font-medium text-gray-800 mb-4">Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.platforms.map(product => (
            <button
              key={product.value}
              onClick={() => navigate(`/calculator/${product.value}`)}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <h3 className="text-lg font-medium text-gray-900">{product.label}</h3>
              <p className="mt-2 text-sm text-gray-600">
                Calculate dimensions and costs for {product.label} platforms
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Screens */}
      <div>
        <h2 className="text-xl font-medium text-gray-800 mb-4">Screens</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.screens.map(product => (
            <button
              key={product.value}
              onClick={() => navigate(`/calculator/${product.value}`)}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <h3 className="text-lg font-medium text-gray-900">{product.label}</h3>
              <p className="mt-2 text-sm text-gray-600">
                Calculate dimensions and costs for {product.label} screens
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Access */}
      <div>
        <h2 className="text-xl font-medium text-gray-800 mb-4">Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.access.map(product => (
            <button
              key={product.value}
              onClick={() => navigate(`/calculator/${product.value}`)}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <h3 className="text-lg font-medium text-gray-900">{product.label}</h3>
              <p className="mt-2 text-sm text-gray-600">
                Calculate dimensions and costs for {product.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <Routes>
        <Route path="/" element={<ProductSelector />} />
        {Object.values(CATEGORIES).flat().map(product => (
          <Route
            key={product.value}
            path={`/${product.value}`}
            element={<product.component />}
          />
        ))}
      </Routes>
    </div>
  );
};

export default Calculator;