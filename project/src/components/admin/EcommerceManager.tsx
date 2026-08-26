import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Package, Shirt, Plus, Tag, RefreshCw, CheckCircle2, 
  TrendingUp, Edit, Trash2, Eye, Truck, Check, Search, DollarSign, 
  Sparkles, Layers, Image as ImageIcon, AlertTriangle, ArrowUpDown, 
  X, Copy, Sliders, Palette, ShieldAlert, BarChart3, Clock, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  size?: string;
  color?: string;
  colorHex?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  sku: string;
  basePrice: number;
  comparePrice?: number;
  costPerItem?: number;
  stock: number;
  lowStockThreshold: number;
  ordersCount: number;
  associatedNumber?: number;
  rulingPlanet?: string;
  featuredImage: string;
  galleryImages: string[];
  description: string;
  features: string[];
  status: 'active' | 'draft' | 'archived';
  isFeatured: boolean;
  variants: ProductVariant[];
  weightGrams?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered';
  courierName?: string;
  trackingNumber?: string;
  itemsSummary: string;
  createdAt: string;
}

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'The Sovereign Pioneer — Mulank 1 Luxury T-Shirt',
    slug: 'mulank-1-luxury-tshirt',
    category: 'Mulank T-Shirts',
    sku: 'TSH-M1-BLK',
    basePrice: 999,
    comparePrice: 1999,
    costPerItem: 380,
    stock: 230,
    lowStockThreshold: 20,
    ordersCount: 142,
    associatedNumber: 1,
    rulingPlanet: 'Sun (Surya)',
    featuredImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Imbued with the solar leadership frequency of Mulank 1. Heavyweight 240 GSM organic French Terry cotton featuring metallic 24K gold foil geometric sun glyphs.',
    features: [
      '240 GSM 100% Super-Combed Bio-Washed French Terry Cotton',
      '24K Metallic Gold Foil Sacred Solar Geometry Glyph',
      'Boxy Streetwear Fit with Ribbed Neckline (Pre-shrunk)',
      'Free ₹999 Master Kundli & Numerology Report PDF Included'
    ],
    status: 'active',
    isFeatured: true,
    variants: [
      { id: 'v-1-s', title: 'Matte Black / S', sku: 'TSH-M1-BLK-S', price: 999, comparePrice: 1999, stock: 45, size: 'S', color: 'Matte Black', colorHex: '#121212' },
      { id: 'v-1-m', title: 'Matte Black / M', sku: 'TSH-M1-BLK-M', price: 999, comparePrice: 1999, stock: 65, size: 'M', color: 'Matte Black', colorHex: '#121212' },
      { id: 'v-1-l', title: 'Matte Black / L', sku: 'TSH-M1-BLK-L', price: 999, comparePrice: 1999, stock: 70, size: 'L', color: 'Matte Black', colorHex: '#121212' },
      { id: 'v-1-xl', title: 'Matte Black / XL', sku: 'TSH-M1-BLK-XL', price: 999, comparePrice: 1999, stock: 35, size: 'XL', color: 'Matte Black', colorHex: '#121212' },
      { id: 'v-1-xxl', title: 'Matte Black / XXL', sku: 'TSH-M1-BLK-XXL', price: 1099, comparePrice: 2199, stock: 15, size: 'XXL', color: 'Matte Black', colorHex: '#121212' }
    ],
    tags: ['Mulank 1', 'Sun', 'Leadership', 'Gold Foil', 'Streetwear'],
    createdAt: '2026-08-01 10:00',
    updatedAt: '2026-08-25 14:00'
  },
  {
    id: 'prod-2',
    name: 'The Intuitive Diplomat — Mulank 2 Luxury T-Shirt',
    slug: 'mulank-2-luxury-tshirt',
    category: 'Mulank T-Shirts',
    sku: 'TSH-M2-SLV',
    basePrice: 999,
    comparePrice: 1999,
    costPerItem: 380,
    stock: 180,
    lowStockThreshold: 15,
    ordersCount: 89,
    associatedNumber: 2,
    rulingPlanet: 'Moon (Chandra)',
    featuredImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Lunar diplomacy crest with pearl-silver cosmic geometry on luxury heavyweight combed cotton.',
    features: [
      '240 GSM Heavyweight Combed Cotton',
      'Pearl-Silver Metallic Cosmic Moon Crest',
      'Bio-washed and anti-pilling fabric finish',
      'Free ₹999 Master Kundli & Numerology Report PDF Included'
    ],
    status: 'active',
    isFeatured: true,
    variants: [
      { id: 'v-2-s', title: 'Obsidian Black / S', sku: 'TSH-M2-BLK-S', price: 999, comparePrice: 1999, stock: 30, size: 'S', color: 'Obsidian Black', colorHex: '#18181b' },
      { id: 'v-2-m', title: 'Obsidian Black / M', sku: 'TSH-M2-BLK-M', price: 999, comparePrice: 1999, stock: 60, size: 'M', color: 'Obsidian Black', colorHex: '#18181b' },
      { id: 'v-2-l', title: 'Obsidian Black / L', sku: 'TSH-M2-BLK-L', price: 999, comparePrice: 1999, stock: 55, size: 'L', color: 'Obsidian Black', colorHex: '#18181b' },
      { id: 'v-2-xl', title: 'Obsidian Black / XL', sku: 'TSH-M2-BLK-XL', price: 999, comparePrice: 1999, stock: 35, size: 'XL', color: 'Obsidian Black', colorHex: '#18181b' }
    ],
    tags: ['Mulank 2', 'Moon', 'Diplomacy', 'Silver Foil'],
    createdAt: '2026-08-01 10:00',
    updatedAt: '2026-08-25 14:00'
  },
  {
    id: 'prod-3',
    name: 'Certified Natural Burma Ruby (Manikya) Talisman',
    slug: 'certified-natural-ruby-gemstone',
    category: 'Vedic Gemstones',
    sku: 'GEM-RUBY-5R',
    basePrice: 5999,
    comparePrice: 11999,
    costPerItem: 2400,
    stock: 14,
    lowStockThreshold: 5,
    ordersCount: 38,
    associatedNumber: 1,
    rulingPlanet: 'Sun (Surya)',
    featuredImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: '100% Untreated Natural Burma Ruby certified by government gemological lab. Enhances leadership, vitality, and career elevation.',
    features: [
      'Government Lab Certified Natural Unheated Ruby',
      'Prana Pratishtha Vedic Puja & Mantra Chanting Done',
      'Choice of Panchdhatu or 925 Sterling Silver Ring/Pendant',
      'Personalized Muhurat Wearing Date & Time Certificate'
    ],
    status: 'active',
    isFeatured: true,
    variants: [
      { id: 'v-gem-4r', title: '4.25 Ratti / Silver Ring', sku: 'GEM-RUBY-425-SLV', price: 5999, comparePrice: 11999, stock: 6 },
      { id: 'v-gem-5r', title: '5.25 Ratti / Silver Ring', sku: 'GEM-RUBY-525-SLV', price: 7499, comparePrice: 14999, stock: 5 },
      { id: 'v-gem-6r', title: '6.25 Ratti / Panchdhatu Ring', sku: 'GEM-RUBY-625-PCH', price: 8999, comparePrice: 17999, stock: 3 }
    ],
    tags: ['Gemstone', 'Ruby', 'Sun', 'Leadership', 'Surya'],
    createdAt: '2026-08-05 10:00',
    updatedAt: '2026-08-25 14:00'
  },
  {
    id: 'prod-4',
    name: 'Original 7-Mukhi Nepal Rudraksha (Mahalaxmi Blessed)',
    slug: 'original-7-mukhi-nepal-rudraksha',
    category: 'Sacred Rudraksha',
    sku: 'RUD-7M-NEPAL',
    basePrice: 2499,
    comparePrice: 4999,
    costPerItem: 900,
    stock: 28,
    lowStockThreshold: 8,
    ordersCount: 74,
    associatedNumber: 6,
    rulingPlanet: 'Venus (Shukra)',
    featuredImage: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sacred 7 Mukhi Nepali Rudraksha blessed by Goddess Mahalakshmi. Bestows abundance, financial turnaround, and romance.',
    features: [
      '100% Authentic Nepal Origin with X-Ray Certification',
      'Energized with 108 Shukra Gayatri Mantras',
      'Strung in Pure 925 Sterling Silver Capping',
      'Free Vedic Remedial Wearing Ritual Guide'
    ],
    status: 'active',
    isFeatured: true,
    variants: [
      { id: 'v-rud-std', title: 'Standard Bead (20mm) in Silver Cap', sku: 'RUD-7M-20MM', price: 2499, comparePrice: 4999, stock: 18 },
      { id: 'v-rud-col', title: 'Collector Bead (24mm) in Silver Mala', sku: 'RUD-7M-24MM', price: 3999, comparePrice: 7999, stock: 10 }
    ],
    tags: ['Rudraksha', '7 Mukhi', 'Venus', 'Wealth', 'Laxmi'],
    createdAt: '2026-08-10 10:00',
    updatedAt: '2026-08-25 14:00'
  }
];

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-7FA3B',
    customerName: 'Saransh Gulati',
    customerEmail: 'saransh@example.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: '402, Celestia Tower, Golf Course Road, Gurgaon, Haryana 122002',
    totalAmount: 999,
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
    courierName: 'BlueDart Air',
    trackingNumber: 'BD-789456123IN',
    itemsSummary: 'Mulank 1 Luxury T-Shirt (Matte Black / L)',
    createdAt: '2026-08-25 14:30'
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-98CE1',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav@example.com',
    customerPhone: '+91 98111 22334',
    shippingAddress: 'B-12, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103',
    totalAmount: 1998,
    paymentStatus: 'paid',
    fulfillmentStatus: 'processing',
    courierName: 'Delhivery Express',
    trackingNumber: 'DLV-441199200',
    itemsSummary: 'Mulank 8 T-Shirt (XL) + Mulank 3 T-Shirt (M)',
    createdAt: '2026-08-25 18:45'
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-31B9F',
    customerName: 'Priya Mehta',
    customerEmail: 'priya@example.com',
    customerPhone: '+91 99887 76655',
    shippingAddress: 'Flat 904, Sea Breeze, Worli Sea Face, Mumbai 400018',
    totalAmount: 5999,
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    courierName: 'Shiprocket / BlueDart',
    trackingNumber: 'SR-998811223',
    itemsSummary: 'Certified Natural Burma Ruby Talisman (5.25 Ratti)',
    createdAt: '2026-08-24 11:15'
  }
];

export default function EcommerceManager() {
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('ank_admin_products_v2');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('ank_admin_orders_v2');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'catalog' | 'inventory' | 'orders' | 'analytics'>('catalog');

  // Modal State for Product Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('Mulank T-Shirts');
  const [formSku, setFormSku] = useState('');
  const [formBasePrice, setFormBasePrice] = useState(999);
  const [formComparePrice, setFormComparePrice] = useState(1999);
  const [formCostPerItem, setFormCostPerItem] = useState(380);
  const [formStock, setFormStock] = useState(100);
  const [formLowStockThreshold, setFormLowStockThreshold] = useState(15);
  const [formAssociatedNumber, setFormAssociatedNumber] = useState(1);
  const [formRulingPlanet, setFormRulingPlanet] = useState('Sun (Surya)');
  const [formFeaturedImage, setFormFeaturedImage] = useState('');
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [formIsFeatured, setFormIsFeatured] = useState(true);
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([]);

  // Variant generator sub-state
  const [newVariantTitle, setNewVariantTitle] = useState('');
  const [newVariantSku, setNewVariantSku] = useState('');
  const [newVariantPrice, setNewVariantPrice] = useState(999);
  const [newVariantStock, setNewVariantStock] = useState(25);
  const [newVariantSize, setNewVariantSize] = useState('M');
  const [newVariantColor, setNewVariantColor] = useState('Matte Black');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [orderCourierInput, setOrderCourierInput] = useState('');
  const [orderTrackingInput, setOrderTrackingInput] = useState('');

  // Persist State
  useEffect(() => {
    localStorage.setItem('ank_admin_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ank_admin_orders_v2', JSON.stringify(orders));
  }, [orders]);

  // Open Edit Modal
  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormCategory(p.category);
    setFormSku(p.sku);
    setFormBasePrice(p.basePrice);
    setFormComparePrice(p.comparePrice || p.basePrice * 2);
    setFormCostPerItem(p.costPerItem || 0);
    setFormStock(p.stock);
    setFormLowStockThreshold(p.lowStockThreshold || 10);
    setFormAssociatedNumber(p.associatedNumber || 1);
    setFormRulingPlanet(p.rulingPlanet || 'Sun (Surya)');
    setFormFeaturedImage(p.featuredImage);
    setFormGalleryImages(p.galleryImages || [p.featuredImage]);
    setFormDescription(p.description);
    setFormFeatures(p.features || []);
    setFormStatus(p.status);
    setFormIsFeatured(p.isFeatured);
    setFormVariants(p.variants || []);
    setIsModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSlug('');
    setFormCategory('Mulank T-Shirts');
    setFormSku(`ANK-${Date.now().toString().slice(-6)}`);
    setFormBasePrice(999);
    setFormComparePrice(1999);
    setFormCostPerItem(380);
    setFormStock(100);
    setFormLowStockThreshold(15);
    setFormAssociatedNumber(1);
    setFormRulingPlanet('Sun (Surya)');
    setFormFeaturedImage('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80');
    setFormGalleryImages(['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80']);
    setFormDescription('');
    setFormFeatures([
      '240 GSM 100% Super-Combed French Terry Cotton',
      '24K Metallic Gold Foil Sacred Geometry',
      'Free ₹999 Master Kundli Report Included'
    ]);
    setFormStatus('active');
    setFormIsFeatured(true);
    setFormVariants([
      { id: 'v-s', title: 'S', sku: 'SKU-S', price: 999, stock: 25, size: 'S' },
      { id: 'v-m', title: 'M', sku: 'SKU-M', price: 999, stock: 35, size: 'M' },
      { id: 'v-l', title: 'L', sku: 'SKU-L', price: 999, stock: 30, size: 'L' },
      { id: 'v-xl', title: 'XL', sku: 'SKU-XL', price: 999, stock: 10, size: 'XL' }
    ]);
    setIsModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = () => {
    if (!formName.trim()) {
      toast.error('Product name is required');
      return;
    }

    const calculatedStock = formVariants.length > 0 
      ? formVariants.reduce((sum, v) => sum + v.stock, 0)
      : formStock;

    const newSlug = formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const productPayload: ProductItem = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formName,
      slug: newSlug,
      category: formCategory,
      sku: formSku,
      basePrice: Number(formBasePrice),
      comparePrice: Number(formComparePrice),
      costPerItem: Number(formCostPerItem),
      stock: calculatedStock,
      lowStockThreshold: Number(formLowStockThreshold),
      ordersCount: editingProduct ? editingProduct.ordersCount : 0,
      associatedNumber: Number(formAssociatedNumber),
      rulingPlanet: formRulingPlanet,
      featuredImage: formFeaturedImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      galleryImages: formGalleryImages.length > 0 ? formGalleryImages : [formFeaturedImage],
      description: formDescription,
      features: formFeatures,
      status: formStatus,
      isFeatured: formIsFeatured,
      variants: formVariants,
      tags: [formCategory, `Mulank ${formAssociatedNumber}`, formRulingPlanet],
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString().slice(0, 16).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? productPayload : p));
      toast.success('Product updated successfully!');
    } else {
      setProducts(prev => [productPayload, ...prev]);
      toast.success('New product created successfully!');
    }

    setIsModalOpen(false);
  };

  // Quick Stock Adjustment
  const handleQuickStockAdjust = (productId: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextStock = Math.max(0, p.stock + delta);
        toast.info(`Stock updated: ${p.name} (${nextStock} units)`);
        return { ...p, stock: nextStock };
      }
      return p;
    }));
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted.');
    }
  };

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'active' ? 'draft' : 'active';
        toast.success(`Status changed to ${nextStatus}`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  // Add Gallery Image
  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setFormGalleryImages(prev => [...prev, newGalleryUrl.trim()]);
    setNewGalleryUrl('');
  };

  // Remove Gallery Image
  const handleRemoveGalleryImage = (idx: number) => {
    setFormGalleryImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Add Feature
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormFeatures(prev => [...prev, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  // Add Variant
  const handleAddVariant = () => {
    if (!newVariantTitle.trim()) {
      toast.error('Variant title is required (e.g. "XL / Matte Black")');
      return;
    }
    const newV: ProductVariant = {
      id: `v-${Date.now()}`,
      title: newVariantTitle,
      sku: newVariantSku || `${formSku}-${newVariantSize}`,
      price: Number(newVariantPrice),
      stock: Number(newVariantStock),
      size: newVariantSize,
      color: newVariantColor
    };
    setFormVariants(prev => [...prev, newV]);
    setNewVariantTitle('');
    setNewVariantSku('');
  };

  // Remove Variant
  const handleRemoveVariant = (id: string) => {
    setFormVariants(prev => prev.filter(v => v.id !== id));
  };

  // Order Fulfillment Updates
  const handleUpdateOrderFulfillment = (orderId: string, status: OrderItem['fulfillmentStatus']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, fulfillmentStatus: status };
      }
      return o;
    }));
    toast.success(`Order status updated to: ${status.toUpperCase()}`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, fulfillmentStatus: status } : null);
    }
  };

  const handleSaveShippingTracking = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          courierName: orderCourierInput || o.courierName || 'Shiprocket Air',
          trackingNumber: orderTrackingInput || o.trackingNumber || `AWB-${Date.now()}`,
          fulfillmentStatus: 'shipped'
        };
      }
      return o;
    }));
    toast.success('Tracking details saved and customer notified!');
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.stock * p.basePrice), 0);
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Quick Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            E-Commerce Store & Product Inventory
          </h2>
          <p className="text-sm text-zinc-400">
            Manage multi-variant apparel, natural gemstones, rudrakshas, inventory stock levels, and order fulfillment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Product
          </Button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 uppercase font-medium">Total Products</p>
              <h3 className="text-2xl font-bold text-white mt-1">{products.length}</h3>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {products.filter(p => p.status === 'active').length} Active Live
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Package className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 uppercase font-medium">Stock in Warehouse</p>
              <h3 className="text-2xl font-bold text-white mt-1">{totalStockUnits.toLocaleString('en-IN')} units</h3>
              <p className="text-xs text-zinc-400 mt-1">₹{totalInventoryValue.toLocaleString('en-IN')} Asset Value</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 uppercase font-medium">Low Stock Alerts</p>
              <h3 className={`text-2xl font-bold mt-1 ${lowStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {lowStockCount} Products
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {lowStockCount > 0 ? 'Needs re-order soon' : 'All stock levels healthy'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${lowStockCount > 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 uppercase font-medium">Merchandise Sales</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-zinc-400 mt-1">{orders.length} orders completed</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
            <TabsTrigger value="catalog" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black gap-2">
              <Shirt className="w-4 h-4" /> Products Catalog ({products.length})
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black gap-2">
              <Layers className="w-4 h-4" /> Inventory & Stock ({totalStockUnits})
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black gap-2">
              <Truck className="w-4 h-4" /> Orders & Shipping ({orders.length})
            </TabsTrigger>
          </TabsList>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input 
                placeholder="Search products or SKU..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-zinc-900/80 border-zinc-800 text-sm h-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 bg-zinc-900/80 border-zinc-800 text-xs h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Mulank T-Shirts">Mulank T-Shirts</SelectItem>
                <SelectItem value="Vedic Gemstones">Vedic Gemstones</SelectItem>
                <SelectItem value="Sacred Rudraksha">Sacred Rudraksha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* TAB 1: PRODUCT CATALOG */}
        <TabsContent value="catalog" className="space-y-4 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => {
              const isLowStock = product.stock <= product.lowStockThreshold;
              const discountPercent = product.comparePrice 
                ? Math.round(((product.comparePrice - product.basePrice) / product.comparePrice) * 100)
                : 0;

              return (
                <Card key={product.id} className="bg-zinc-900/60 border-zinc-800 overflow-hidden group hover:border-zinc-700 transition-all flex flex-col justify-between">
                  <div>
                    {/* Image Banner */}
                    <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                      <img 
                        src={product.featuredImage} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <Badge className="bg-zinc-900/80 backdrop-blur-md text-amber-300 border-amber-500/30 text-xs">
                          {product.category}
                        </Badge>
                        {product.associatedNumber && (
                          <Badge className="bg-amber-500 text-black font-bold text-xs">
                            Mulank {product.associatedNumber}
                          </Badge>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <Badge className={`text-xs capitalize ${product.status === 'active' ? 'bg-emerald-500/80 text-white' : 'bg-zinc-700 text-zinc-300'}`}>
                          {product.status}
                        </Badge>
                      </div>

                      {/* Stock overlay badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <Badge variant={isLowStock ? "destructive" : "secondary"} className="text-xs">
                          {isLowStock ? `Low Stock: ${product.stock} left` : `${product.stock} in stock`}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-white text-base line-clamp-1 group-hover:text-amber-400 transition-colors">
                          {product.name}
                        </h4>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Pricing & SKU */}
                      <div className="flex items-baseline justify-between pt-1 border-t border-zinc-800/80">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-white">₹{product.basePrice.toLocaleString('en-IN')}</span>
                          {product.comparePrice && (
                            <span className="text-xs text-zinc-500 line-through">₹{product.comparePrice.toLocaleString('en-IN')}</span>
                          )}
                          {discountPercent > 0 && (
                            <span className="text-[10px] text-emerald-400 font-semibold">{discountPercent}% OFF</span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500">{product.sku}</span>
                      </div>

                      {/* Variants preview pill */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          <span className="text-[11px] text-zinc-500 mr-1">Variants ({product.variants.length}):</span>
                          {product.variants.slice(0, 4).map(v => (
                            <span key={v.id} className="text-[10px] bg-zinc-800/90 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">
                              {v.size || v.title}
                            </span>
                          ))}
                          {product.variants.length > 4 && (
                            <span className="text-[10px] text-zinc-500">+{product.variants.length - 4} more</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-zinc-800/60 mt-2">
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleQuickStockAdjust(product.id, -5)}
                        className="h-7 px-2 text-xs text-zinc-400 hover:text-white"
                        title="Reduce stock by 5"
                      >
                        -5
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleQuickStockAdjust(product.id, 10)}
                        className="h-7 px-2 text-xs text-zinc-400 hover:text-white"
                        title="Add stock by 10"
                      >
                        +10
                      </Button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleToggleStatus(product.id)}
                        className="h-8 text-xs border-zinc-700"
                      >
                        {product.status === 'active' ? 'Draft' : 'Publish'}
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleOpenEdit(product)}
                        className="h-8 bg-zinc-800 hover:bg-zinc-700 text-white text-xs gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="h-8 px-2 text-zinc-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 2: INVENTORY & STOCK MATRIX */}
        <TabsContent value="inventory" className="space-y-4 m-0">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="p-4 border-b border-zinc-800">
              <CardTitle className="text-base text-white">Stock Level Monitoring & Fast Batch Adjustments</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Live inventory tracking across all SKUs, sizes, and planetary alignments.
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-zinc-300">
                <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/60 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3">Product / SKU</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock Level</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredProducts.map(p => {
                    const isLow = p.stock <= p.lowStockThreshold;
                    return (
                      <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.featuredImage} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-zinc-950" />
                            <div>
                              <p className="font-medium text-white text-sm line-clamp-1">{p.name}</p>
                              <p className="text-xs font-mono text-zinc-500">SKU: {p.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">{p.category}</td>
                        <td className="px-4 py-3 font-semibold text-white">₹{p.basePrice.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {p.stock} units
                            </span>
                            {isLow && (
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                Low Stock
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-[10px] capitalize ${p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'}`}>
                            {p.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleQuickStockAdjust(p.id, 25)}
                              className="h-7 text-xs border-zinc-700 hover:border-amber-500 hover:text-amber-400"
                            >
                              +25
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleQuickStockAdjust(p.id, 50)}
                              className="h-7 text-xs border-zinc-700 hover:border-amber-500 hover:text-amber-400"
                            >
                              +50
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleOpenEdit(p)}
                              className="h-7 bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-2.5"
                            >
                              Edit All
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: ORDERS & SHIPPING FULFILLMENT */}
        <TabsContent value="orders" className="space-y-4 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders Table */}
            <Card className="lg:col-span-2 bg-zinc-900/60 border-zinc-800">
              <CardHeader className="p-4 border-b border-zinc-800 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base text-white">Customer Orders ({orders.length})</CardTitle>
                  <CardDescription className="text-xs text-zinc-400">Click any order to view address and manage shipping</CardDescription>
                </div>
              </CardHeader>
              <div className="divide-y divide-zinc-800/60">
                {orders.map(order => (
                  <div 
                    key={order.id} 
                    onClick={() => {
                      setSelectedOrder(order);
                      setOrderCourierInput(order.courierName || '');
                      setOrderTrackingInput(order.trackingNumber || '');
                    }}
                    className={`p-4 hover:bg-zinc-800/40 cursor-pointer transition-colors flex items-start justify-between gap-4 ${selectedOrder?.id === order.id ? 'bg-zinc-800/60 border-l-2 border-amber-500' : ''}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono text-sm">{order.orderNumber}</span>
                        <Badge className={`text-[10px] capitalize ${
                          order.fulfillmentStatus === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          order.fulfillmentStatus === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {order.fulfillmentStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-300 font-medium">{order.customerName}</p>
                      <p className="text-xs text-zinc-400 line-clamp-1">{order.itemsSummary}</p>
                      <p className="text-[11px] text-zinc-500">{order.createdAt}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-bold text-emerald-400">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                      <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-700 capitalize mt-1">
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Selected Order Detail Sidebar */}
            <Card className="bg-zinc-900/60 border-zinc-800 p-5 space-y-4">
              {selectedOrder ? (
                <>
                  <div className="border-b border-zinc-800 pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-lg">{selectedOrder.orderNumber}</h3>
                      <Badge className="bg-emerald-500 text-black font-semibold text-xs">
                        PAID
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">Placed on {selectedOrder.createdAt}</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-zinc-500 font-medium uppercase">Customer Details</p>
                      <p className="text-white font-medium text-sm mt-0.5">{selectedOrder.customerName}</p>
                      <p className="text-zinc-300">{selectedOrder.customerEmail}</p>
                      <p className="text-zinc-300">{selectedOrder.customerPhone}</p>
                    </div>

                    <div>
                      <p className="text-zinc-500 font-medium uppercase">Delivery Address</p>
                      <p className="text-zinc-300 mt-0.5 leading-relaxed bg-zinc-950 p-2.5 rounded border border-zinc-800">
                        {selectedOrder.shippingAddress}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500 font-medium uppercase">Items Ordered</p>
                      <p className="text-amber-300 font-medium mt-0.5">{selectedOrder.itemsSummary}</p>
                    </div>

                    {/* Shipping Management Form */}
                    <div className="pt-3 border-t border-zinc-800 space-y-3">
                      <p className="text-zinc-400 font-semibold text-xs uppercase">Shipping & Tracking</p>
                      
                      <div className="space-y-1.5">
                        <Label className="text-[11px] text-zinc-400">Courier Partner</Label>
                        <Input 
                          placeholder="e.g. BlueDart Air, Delhivery"
                          value={orderCourierInput}
                          onChange={e => setOrderCourierInput(e.target.value)}
                          className="h-8 text-xs bg-zinc-950 border-zinc-800"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[11px] text-zinc-400">Tracking / AWB Number</Label>
                        <Input 
                          placeholder="e.g. BD-99881122"
                          value={orderTrackingInput}
                          onChange={e => setOrderTrackingInput(e.target.value)}
                          className="h-8 text-xs bg-zinc-950 border-zinc-800"
                        />
                      </div>

                      <Button 
                        size="sm" 
                        onClick={() => handleSaveShippingTracking(selectedOrder.id)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs h-8"
                      >
                        Save & Dispatch Notification
                      </Button>

                      {/* Quick Status Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateOrderFulfillment(selectedOrder.id, 'processing')}
                          className="text-xs h-7 border-zinc-700"
                        >
                          Mark Processing
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateOrderFulfillment(selectedOrder.id, 'delivered')}
                          className="text-xs h-7 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        >
                          Mark Delivered
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-zinc-500 space-y-2">
                  <Truck className="w-8 h-8 mx-auto text-zinc-600" />
                  <p className="text-sm">Select an order from the list to manage shipping and tracking.</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* CREATE / EDIT PRODUCT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl bg-zinc-900 border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              {editingProduct ? 'Edit Product & Variations' : 'Create New Product'}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Configure product details, pricing, inventory stock, image gallery, and astrological alignment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Product Name *</Label>
                <Input 
                  placeholder="e.g. The Sovereign Pioneer — Mulank 1 T-Shirt"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">URL Slug</Label>
                <Input 
                  placeholder="e.g. mulank-1-luxury-tshirt"
                  value={formSlug}
                  onChange={e => setFormSlug(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="Mulank T-Shirts">Mulank T-Shirts</SelectItem>
                    <SelectItem value="Vedic Gemstones">Vedic Gemstones</SelectItem>
                    <SelectItem value="Sacred Rudraksha">Sacred Rudraksha</SelectItem>
                    <SelectItem value="Yantras & Talismans">Yantras & Talismans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">SKU Code</Label>
                <Input 
                  placeholder="e.g. TSH-M1-BLK"
                  value={formSku}
                  onChange={e => setFormSku(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-sm font-mono"
                />
              </div>
            </div>

            {/* Pricing & Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Selling Price (₹) *</Label>
                <Input 
                  type="number"
                  value={formBasePrice}
                  onChange={e => setFormBasePrice(Number(e.target.value))}
                  className="bg-zinc-900 border-zinc-800 text-sm font-bold text-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Compare MRP (₹)</Label>
                <Input 
                  type="number"
                  value={formComparePrice}
                  onChange={e => setFormComparePrice(Number(e.target.value))}
                  className="bg-zinc-900 border-zinc-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Cost Price / Production (₹)</Label>
                <Input 
                  type="number"
                  value={formCostPerItem}
                  onChange={e => setFormCostPerItem(Number(e.target.value))}
                  className="bg-zinc-900 border-zinc-800 text-sm text-zinc-400"
                />
              </div>
            </div>

            {/* Astrological Alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-amber-500/5 rounded-xl border border-amber-500/20">
              <div className="space-y-1.5">
                <Label className="text-xs text-amber-300">Associated Mulank Number (1 - 9)</Label>
                <Select 
                  value={String(formAssociatedNumber)} 
                  onValueChange={v => setFormAssociatedNumber(Number(v))}
                >
                  <SelectTrigger className="bg-zinc-950 border-zinc-800 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {[1,2,3,4,5,6,7,8,9].map(num => (
                      <SelectItem key={num} value={String(num)}>Mulank {num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-amber-300">Ruling Planet</Label>
                <Input 
                  placeholder="e.g. Sun (Surya), Venus (Shukra)"
                  value={formRulingPlanet}
                  onChange={e => setFormRulingPlanet(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-sm"
                />
              </div>
            </div>

            {/* Images & Gallery */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-white">Images & Photo Gallery</Label>
              
              <div className="space-y-1.5">
                <Label className="text-[11px] text-zinc-400">Featured Hero Image URL *</Label>
                <Input 
                  placeholder="https://images.unsplash.com/..."
                  value={formFeaturedImage}
                  onChange={e => setFormFeaturedImage(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              {/* Gallery List */}
              <div className="space-y-2">
                <Label className="text-[11px] text-zinc-400">Additional Gallery Images</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Paste image URL..."
                    value={newGalleryUrl}
                    onChange={e => setNewGalleryUrl(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-xs flex-1"
                  />
                  <Button size="sm" type="button" onClick={handleAddGalleryImage} className="bg-zinc-800 hover:bg-zinc-700 text-xs">
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {formGalleryImages.map((img, i) => (
                    <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-950">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveGalleryImage(i)}
                        className="absolute top-1 right-1 bg-black/80 text-rose-400 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description & Features */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Product Description</Label>
                <Textarea 
                  rows={3}
                  placeholder="Describe the fabric, cosmic glyph, energization rituals..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              {/* Highlights/Bullet Points */}
              <div className="space-y-2">
                <Label className="text-xs">Key Product Bullet Features</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. 240 GSM French Terry Cotton"
                    value={newFeatureText}
                    onChange={e => setNewFeatureText(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-xs flex-1"
                  />
                  <Button size="sm" type="button" onClick={handleAddFeature} className="bg-zinc-800 hover:bg-zinc-700 text-xs">
                    Add Feature
                  </Button>
                </div>
                <div className="space-y-1 pt-1">
                  {formFeatures.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-zinc-950/80 px-3 py-1.5 rounded text-xs border border-zinc-800">
                      <span>• {f}</span>
                      <button type="button" onClick={() => setFormFeatures(prev => prev.filter((_, i) => i !== idx))} className="text-zinc-500 hover:text-rose-400">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Variants Matrix */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-white">Product Variants (Sizes & Colors)</Label>
                <span className="text-xs text-zinc-400">{formVariants.length} Variants Configured</span>
              </div>

              {/* Add Variant Sub-Form */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs">
                <Input 
                  placeholder="Title (e.g. L / Black)"
                  value={newVariantTitle}
                  onChange={e => setNewVariantTitle(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-xs h-8"
                />
                <Input 
                  placeholder="SKU"
                  value={newVariantSku}
                  onChange={e => setNewVariantSku(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-xs h-8 font-mono"
                />
                <Input 
                  type="number"
                  placeholder="Price"
                  value={newVariantPrice}
                  onChange={e => setNewVariantPrice(Number(e.target.value))}
                  className="bg-zinc-900 border-zinc-800 text-xs h-8"
                />
                <Input 
                  type="number"
                  placeholder="Stock"
                  value={newVariantStock}
                  onChange={e => setNewVariantStock(Number(e.target.value))}
                  className="bg-zinc-900 border-zinc-800 text-xs h-8"
                />
                <Button size="sm" type="button" onClick={handleAddVariant} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs h-8">
                  + Add Variant
                </Button>
              </div>

              {/* Existing Variants Table */}
              {formVariants.length > 0 && (
                <div className="border border-zinc-800 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="p-2">Variant</th>
                        <th className="p-2">SKU</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Stock</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {formVariants.map(v => (
                        <tr key={v.id}>
                          <td className="p-2 font-medium text-white">{v.title}</td>
                          <td className="p-2 font-mono text-zinc-400">{v.sku}</td>
                          <td className="p-2 text-amber-400 font-semibold">₹{v.price}</td>
                          <td className="p-2 text-emerald-400">{v.stock} units</td>
                          <td className="p-2 text-right">
                            <button type="button" onClick={() => handleRemoveVariant(v.id)} className="text-zinc-500 hover:text-rose-400">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Status & Visibility */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-3">
                <Label className="text-xs">Publish Status:</Label>
                <Select value={formStatus} onValueChange={(v: any) => setFormStatus(v)}>
                  <SelectTrigger className="w-32 bg-zinc-950 border-zinc-800 text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="active">Active Live</SelectItem>
                    <SelectItem value="draft">Draft / Hidden</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch 
                  checked={formIsFeatured} 
                  onCheckedChange={setFormIsFeatured}
                  id="featured-switch"
                />
                <Label htmlFor="featured-switch" className="text-xs cursor-pointer">Feature on Storefront</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-zinc-800 pt-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-zinc-700 text-xs">
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs">
              Save Product & Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
