/**
 * Función para categorizar productos de motos basándose en palabras clave
 */

export type ProductCategory = 
  | 'Aceites y Lubricantes'
  | 'Filtros'
  | 'Frenos'
  | 'Motor'
  | 'Transmisión'
  | 'Suspensión'
  | 'Eléctrico'
  | 'Neumáticos y Cámaras'
  | 'Baterías'
  | 'Bujías'
  | 'Iluminación'
  | 'Accesorios'
  | 'Otros';

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  keywords: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'Aceites y Lubricantes',
    name: 'Aceites y Lubricantes',
    keywords: ['aceite', 'oil', 'lubricante', 'motorex', 'liqui moly', 'liquimoly', 'coolant', 'refrigerante', 'fork oil', 'chain lube', 'chainclean', 'brake clean']
  },
  {
    id: 'Filtros',
    name: 'Filtros',
    keywords: ['filtro', 'filter', 'aire', 'aceite', 'air']
  },
  {
    id: 'Frenos',
    name: 'Frenos',
    keywords: ['pastilla', 'freno', 'brake', 'disco', 'bomba de freno', 'bomba freno', 'caliper', 'calipe']
  },
  {
    id: 'Motor',
    name: 'Motor',
    keywords: ['empaquetadura', 'gasket', 'piston', 'anillo', 'valvula', 'valvulas', 'reten', 'retenes', 'cigueñal', 'cigüeñal', 'culata', 'cilindro', 'juego anillos', 'kit piston']
  },
  {
    id: 'Transmisión',
    name: 'Transmisión',
    keywords: ['cadena', 'chain', 'catalina', 'piñon', 'sprocket', 'candado', 'transmision', 'embrague']
  },
  {
    id: 'Suspensión',
    name: 'Suspensión',
    keywords: ['horquilla', 'fork', 'resorte', 'spring', 'suspension', 'amortiguador', 'shock']
  },
  {
    id: 'Eléctrico',
    name: 'Eléctrico',
    keywords: ['relay', 'rele', 'regulador', 'voltage', 'voltaje', 'switch', 'cable', 'intermitente', 'señalizador']
  },
  {
    id: 'Neumáticos y Cámaras',
    name: 'Neumáticos y Cámaras',
    keywords: ['neumatico', 'tire', 'camara', 'mousse', 'aro']
  },
  {
    id: 'Baterías',
    name: 'Baterías',
    keywords: ['bateria', 'battery', 'ytx', 'ytz', 'ftx', 'ftz', 'litio']
  },
  {
    id: 'Bujías',
    name: 'Bujías',
    keywords: ['bujia', 'bujía', 'spark', 'ngk', 'bosch', 'cachimba']
  },
  {
    id: 'Iluminación',
    name: 'Iluminación',
    keywords: ['ampolleta', 'bulb', 'foco', 'led', 'h3', 'h4', 'halogen']
  },
  {
    id: 'Accesorios',
    name: 'Accesorios',
    keywords: ['protector', 'espejo', 'mirror', 'bolso', 'funda', 'manilla', 'manubrio', 'calienta puños', 'cubrepuños', 'phone case', 'bundle']
  },
  {
    id: 'Otros',
    name: 'Otros',
    keywords: []
  }
];

/**
 * Categoriza un producto basándose en su nombre
 */
export function categorizeProduct(productName: string): ProductCategory {
  const nameLower = productName.toLowerCase();
  
  // Buscar en cada categoría (excepto "Otros")
  for (const category of CATEGORIES) {
    if (category.id === 'Otros') continue;
    
    for (const keyword of category.keywords) {
      if (nameLower.includes(keyword.toLowerCase())) {
        return category.id;
      }
    }
  }
  
  return 'Otros';
}

/**
 * Obtiene todas las categorías que tienen productos
 */
export function getAvailableCategories(products: any[]): ProductCategory[] {
  const categorySet = new Set<ProductCategory>();
  
  products.forEach(product => {
    const category = categorizeProduct(product.name || '');
    categorySet.add(category);
  });
  
  return Array.from(categorySet).sort();
}

/**
 * Filtra productos por categoría
 */
export function filterByCategory(products: any[], category: ProductCategory | 'all'): any[] {
  if (category === 'all') {
    return products;
  }
  
  return products.filter(product => {
    const productCategory = categorizeProduct(product.name || '');
    return productCategory === category;
  });
}

/**
 * Busca productos por texto
 */
export function searchProducts(products: any[], searchText: string): any[] {
  if (!searchText.trim()) {
    return products;
  }
  
  const searchLower = searchText.toLowerCase().trim();
  
  return products.filter(product => {
    const name = (product.name || '').toLowerCase();
    const description = (product.description || '').toLowerCase();
    const sku = (product.sku || '').toLowerCase();
    
    return name.includes(searchLower) || 
           description.includes(searchLower) || 
           sku.includes(searchLower);
  });
}

/**
 * Obtiene sugerencias de autocompletado basadas en nombres de productos
 */
export function getAutocompleteSuggestions(products: any[], searchText: string, limit: number = 5): string[] {
  if (!searchText.trim()) {
    return [];
  }
  
  const searchLower = searchText.toLowerCase().trim();
  const suggestions = new Set<string>();
  
  products.forEach(product => {
    const name = product.name || '';
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes(searchLower)) {
      suggestions.add(name);
      if (suggestions.size >= limit) return;
    }
  });
  
  return Array.from(suggestions).slice(0, limit);
}

/**
 * Marcas de motos comunes
 */
export const MOTORCYCLE_BRANDS = [
  'KTM', 'Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'BMW', 'Ducati', 
  'Husqvarna', 'Triumph', 'Aprilia', 'Beta', 'GasGas', 'Sherco', 
  'Bajaj', 'Bridgestone', 'Continental', 'Heidenau', 'Shinko', 'ANLAS'
];

/**
 * Extrae la marca de un producto basándose en su nombre y descripción
 */
export function extractBrand(product: any): string | null {
  const text = `${product.name || ''} ${product.description || ''}`.toUpperCase();
  
  for (const brand of MOTORCYCLE_BRANDS) {
    if (text.includes(brand.toUpperCase())) {
      return brand;
    }
  }
  
  return null;
}

/**
 * Modelos comunes por marca
 */
export const MOTORCYCLE_MODELS: Record<string, string[]> = {
  'KTM': ['Duke', 'RC', 'Adventure', 'EXC', 'SX', 'Enduro', 'Rally', 'LC4', '990', '1190', '1290', '790', '890', '901', '200', '250', '390', '401', '690'],
  'Honda': ['CRF', 'CR', 'XR', 'Transalp', 'Africa Twin', 'CBR', 'CB', 'CR50', 'CR125', 'CR250'],
  'Yamaha': ['WR', 'YZ', 'MT', 'Ténéré', 'R1', 'R6'],
  'Suzuki': ['RMZ', 'DR', 'DL', 'GSX'],
  'Kawasaki': ['KX', 'KLX', 'Ninja', 'Versys'],
  'BMW': ['F650', 'GS', 'R', 'S'],
  'Ducati': ['Monster', 'Multistrada', 'Panigale'],
  'Husqvarna': ['701', 'TE', 'FE', 'TC'],
};

/**
 * Extrae el modelo de un producto basándose en su nombre y descripción
 */
export function extractModel(product: any, brand: string | null): string | null {
  const text = `${product.name || ''} ${product.description || ''}`.toUpperCase();
  const models = brand ? MOTORCYCLE_MODELS[brand] || [] : Object.values(MOTORCYCLE_MODELS).flat();
  
  for (const model of models) {
    if (text.includes(model.toUpperCase())) {
      return model;
    }
  }
  
  return null;
}

/**
 * Obtiene todas las marcas disponibles en los productos
 */
export function getAvailableBrands(products: any[]): string[] {
  const brandSet = new Set<string>();
  
  products.forEach(product => {
    const brand = extractBrand(product);
    if (brand) {
      brandSet.add(brand);
    }
  });
  
  return Array.from(brandSet).sort();
}

/**
 * Obtiene todos los modelos disponibles para una marca específica
 */
export function getAvailableModels(products: any[], brand: string): string[] {
  const modelSet = new Set<string>();
  
  products.forEach(product => {
    const productBrand = extractBrand(product);
    if (productBrand === brand) {
      const model = extractModel(product, brand);
      if (model) {
        modelSet.add(model);
      }
    }
  });
  
  return Array.from(modelSet).sort();
}

/**
 * Filtra productos por marca
 */
export function filterByBrand(products: any[], brand: string | 'all'): any[] {
  if (brand === 'all') {
    return products;
  }
  
  return products.filter(product => {
    const productBrand = extractBrand(product);
    return productBrand === brand;
  });
}

/**
 * Filtra productos por modelo
 */
export function filterByModel(products: any[], model: string | 'all', brand?: string | null): any[] {
  if (model === 'all') {
    return products;
  }
  
  return products.filter(product => {
    const productBrand = extractBrand(product);
    const productModel = extractModel(product, productBrand);
    return productModel === model && (!brand || productBrand === brand);
  });
}

