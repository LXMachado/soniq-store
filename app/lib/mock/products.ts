export interface MockProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    nodes: Array<{
      id: string;
      url: string;
      altText: string;
      width: number;
      height: number;
    }>;
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      availableForSale: boolean;
      price: {
        amount: string;
        currencyCode: string;
      };
      compareAtPrice: {
        amount: string;
        currencyCode: string;
      } | null;
      selectedOptions: Array<{
        name: string;
        value: string;
      }>;
      image: {
        url: string;
        altText: string;
      } | null;
    }>;
  };
  metafields: Array<{
    key: string;
    value: string;
  }>;
}

export const mockProducts: MockProduct[] = [
  {
    id: 'gid://shopify/Product/1',
    handle: 'soniq-h1-pro',
    title: 'SŌNIQ H1 Pro',
    description: 'Flagship over-ear headphones featuring our proprietary 50mm Beryllium driver technology. The open-back design delivers an expansive soundstage with exceptional transient response and natural timbre.',
    descriptionHtml: '<p>Flagship over-ear headphones featuring our proprietary 50mm Beryllium driver technology. The open-back design delivers an expansive soundstage with exceptional transient response and natural timbre.</p>',
    vendor: 'SŌNIQ',
    productType: 'Over-ear headphones',
    tags: ['flagship', 'open-back', 'new-arrival'],
    priceRange: {
      minVariantPrice: {
        amount: '1299.00',
        currencyCode: 'USD',
      },
    },
    images: {
      nodes: [
        {
          id: 'gid://shopify/ProductImage/1',
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
          altText: 'SŌNIQ H1 Pro headphones',
          width: 800,
          height: 800,
        },
        {
          id: 'gid://shopify/ProductImage/2',
          url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
          altText: 'SŌNIQ H1 Pro side view',
          width: 800,
          height: 800,
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/1',
          title: 'Default',
          availableForSale: true,
          price: {
            amount: '1299.00',
            currencyCode: 'USD',
          },
          compareAtPrice: null,
          selectedOptions: [{ name: 'Color', value: 'Matte Black' }],
          image: {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
            altText: 'SŌNIQ H1 Pro',
          },
        },
      ],
    },
    metafields: [
      { key: 'driver_type', value: '50mm Beryllium Dynamic' },
      { key: 'impedance', value: '300Ω' },
      { key: 'frequency_response', value: '4Hz - 50kHz' },
      { key: 'sensitivity', value: '98dB/mW' },
      { key: 'weight', value: '420g' },
      { key: 'connector', value: '3.5mm / 6.3mm stereo' },
      { key: 'cable_length', value: '3m OCC copper' },
    ],
  },
  {
    id: 'gid://shopify/Product/2',
    handle: 'soniq-h1',
    title: 'SŌNIQ H1',
    description: 'Professional over-ear headphones with 40mm custom drivers. Closed-back design for critical listening and studio monitoring applications.',
    descriptionHtml: '<p>Professional over-ear headphones with 40mm custom drivers. Closed-back design for critical listening and studio monitoring applications.</p>',
    vendor: 'SŌNIQ',
    productType: 'Over-ear headphones',
    tags: ['studio', 'closed-back'],
    priceRange: {
      minVariantPrice: {
        amount: '599.00',
        currencyCode: 'USD',
      },
    },
    images: {
      nodes: [
        {
          id: 'gid://shopify/ProductImage/3',
          url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop',
          altText: 'SŌNIQ H1 headphones',
          width: 800,
          height: 800,
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/2',
          title: 'Default',
          availableForSale: true,
          price: {
            amount: '599.00',
            currencyCode: 'USD',
          },
          compareAtPrice: null,
          selectedOptions: [{ name: 'Color', value: 'Matte Black' }],
          image: {
            url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop',
            altText: 'SŌNIQ H1',
          },
        },
      ],
    },
    metafields: [
      { key: 'driver_type', value: '40mm Custom Dynamic' },
      { key: 'impedance', value: '32Ω' },
      { key: 'frequency_response', value: '10Hz - 40kHz' },
      { key: 'sensitivity', value: '100dB/mW' },
      { key: 'weight', value: '280g' },
      { key: 'connector', value: '3.5mm / 6.3mm stereo' },
      { key: 'cable_length', value: '3m OFC copper' },
    ],
  },
  {
    id: 'gid://shopify/Product/3',
    handle: 'soniq-e3',
    title: 'SŌNIQ E3',
    description: 'Triple-driver in-ear monitors with independent tweeter and woofer for each channel. Universal fit with premium memory foam tips.',
    descriptionHtml: '<p>Triple-driver in-ear monitors with independent tweeter and woofer for each channel. Universal fit with premium memory foam tips.</p>',
    vendor: 'SŌNIQ',
    productType: 'In-ear monitors',
    tags: ['iem', 'triple-driver', 'new-arrival'],
    priceRange: {
      minVariantPrice: {
        amount: '449.00',
        currencyCode: 'USD',
      },
    },
    images: {
      nodes: [
        {
          id: 'gid://shopify/ProductImage/4',
          url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
          altText: 'SŌNIQ E3 IEM',
          width: 800,
          height: 800,
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/3',
          title: 'Default',
          availableForSale: true,
          price: {
            amount: '449.00',
            currencyCode: 'USD',
          },
          compareAtPrice: null,
          selectedOptions: [{ name: 'Color', value: 'Titanium' }],
          image: {
            url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
            altText: 'SŌNIQ E3',
          },
        },
      ],
    },
    metafields: [
      { key: 'driver_type', value: 'Triple Balanced Armature' },
      { key: 'impedance', value: '18Ω' },
      { key: 'frequency_response', value: '20Hz - 20kHz' },
      { key: 'sensitivity', value: '108dB/mW' },
      { key: 'weight', value: '5g per unit' },
      { key: 'connector', value: '0.78mm 2-pin' },
      { key: 'cable_length', value: '1.2m silver-plated copper' },
    ],
  },
  {
    id: 'gid://shopify/Product/4',
    handle: 'soniq-d1',
    title: 'SŌNIQ D1 Desktop DAC',
    description: 'Reference-grade desktop digital-to-analog converter with dual ESS9038Q2M chips. Supports PCM up to 32-bit/768kHz and DSD512.',
    descriptionHtml: '<p>Reference-grade desktop digital-to-analog converter with dual ESS9038Q2M chips. Supports PCM up to 32-bit/768kHz and DSD512.</p>',
    vendor: 'SŌNIQ',
    productType: 'DAC',
    tags: ['desktop', 'reference', 'new-arrival'],
    priceRange: {
      minVariantPrice: {
        amount: '1799.00',
        currencyCode: 'USD',
      },
    },
    images: {
      nodes: [
        {
          id: 'gid://shopify/ProductImage/5',
          url: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&h=800&fit=crop',
          altText: 'SŌNIQ D1 Desktop DAC',
          width: 800,
          height: 800,
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/4',
          title: 'Default',
          availableForSale: true,
          price: {
            amount: '1799.00',
            currencyCode: 'USD',
          },
          compareAtPrice: null,
          selectedOptions: [{ name: 'Color', value: 'Silver' }],
          image: {
            url: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&h=800&fit=crop',
            altText: 'SŌNIQ D1',
          },
        },
      ],
    },
    metafields: [
      { key: 'driver_type', value: 'Dual ESS9038Q2M' },
      { key: 'impedance', value: 'N/A' },
      { key: 'frequency_response', value: '20Hz - 20kHz (±0.1dB)' },
      { key: 'sensitivity', value: 'N/A' },
      { key: 'weight', value: '1200g' },
      { key: 'connector', value: 'USB-C, Coaxial, Optical' },
      { key: 'cable_length', value: 'N/A' },
    ],
  },
  {
    id: 'gid://shopify/Product/5',
    handle: 'soniq-a2',
    title: 'SŌNIQ A2 Headphone Amp',
    description: 'Class-A desktop headphone amplifier with discrete transistor design. Delivers 2W into 32Ω with ultra-low distortion.',
    descriptionHtml: '<p>Class-A desktop headphone amplifier with discrete transistor design. Delivers 2W into 32Ω with ultra-low distortion.</p>',
    vendor: 'SŌNIQ',
    productType: 'Amplifier',
    tags: ['desktop', 'class-a'],
    priceRange: {
      minVariantPrice: {
        amount: '1199.00',
        currencyCode: 'USD',
      },
    },
    images: {
      nodes: [
        {
          id: 'gid://shopify/ProductImage/6',
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
          altText: 'SŌNIQ A2 Headphone Amp',
          width: 800,
          height: 800,
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/5',
          title: 'Default',
          availableForSale: true,
          price: {
            amount: '1199.00',
            currencyCode: 'USD',
          },
          compareAtPrice: null,
          selectedOptions: [{ name: 'Color', value: 'Black' }],
          image: {
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
            altText: 'SŌNIQ A2',
          },
        },
      ],
    },
    metafields: [
      { key: 'driver_type', value: 'Discrete Class-A' },
      { key: 'impedance', value: '8Ω - 600Ω' },
      { key: 'frequency_response', value: '10Hz - 100kHz' },
      { key: 'sensitivity', value: 'N/A' },
      { key: 'weight', value: '2500g' },
      { key: 'connector', value: 'RCA, 6.3mm, 4.4mm Pentaconn' },
      { key: 'cable_length', value: 'N/A' },
    ],
  },
  {
    id: 'gid://shopify/Product/6',
    handle: 'soniq-cable-4-4mm',
    title: 'SŌNIQ Balanced Cable 4.4mm',
    description: 'Premium balanced audio cable with 4.4mm Pentaconn termination. 6N OCC silver-plated copper conductors in braided geometry.',
    descriptionHtml: '<p>Premium balanced audio cable with 4.4mm Pentaconn termination. 6N OCC silver-plated copper conductors in braided geometry.</p>',
    vendor: 'SŌNIQ',
    productType: 'Cable',
    tags: ['cable', 'balanced', 'accessory'],
    priceRange: {
      minVariantPrice: {
        amount: '199.00',
        currencyCode: 'USD',
      },
    },
    images: {
      nodes: [
        {
          id: 'gid://shopify/ProductImage/7',
          url: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=800&h=800&fit=crop',
          altText: 'SŌNIQ Balanced Cable',
          width: 800,
          height: 800,
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/6',
          title: '1.2m',
          availableForSale: true,
          price: {
            amount: '199.00',
            currencyCode: 'USD',
          },
          compareAtPrice: null,
          selectedOptions: [{ name: 'Length', value: '1.2m' }],
          image: {
            url: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=800&h=800&fit=crop',
            altText: 'SŌNIQ Cable',
          },
        },
        {
          id: 'gid://shopify/ProductVariant/7',
          title: '2.0m',
          availableForSale: true,
          price: {
            amount: '249.00',
            currencyCode: 'USD',
          },
          compareAtPrice: null,
          selectedOptions: [{ name: 'Length', value: '2.0m' }],
          image: {
            url: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=800&h=800&fit=crop',
            altText: 'SŌNIQ Cable',
          },
        },
      ],
    },
    metafields: [
      { key: 'driver_type', value: 'N/A' },
      { key: 'impedance', value: 'N/A' },
      { key: 'frequency_response', value: 'N/A' },
      { key: 'sensitivity', value: 'N/A' },
      { key: 'weight', value: '45g' },
      { key: 'connector', value: '4.4mm Pentaconn to 2.5mm/3.5mm' },
      { key: 'cable_length', value: '1.2m / 2.0m' },
    ],
  },
];

export function getMockProduct(handle: string): MockProduct | undefined {
  return mockProducts.find((product) => product.handle === handle);
}

export function getMockProducts(): MockProduct[] {
  return mockProducts;
}
