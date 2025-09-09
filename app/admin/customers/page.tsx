'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    Users,
    UserCheck,
    DollarSign,
    Repeat,
    X,
    Eye,
    FileText,
    Download,
    BarChart3,
    Calendar,
    Clock,
    MapPin,
    Phone,
    Mail,
    ShoppingBag,
    Target,
    Activity,
} from 'lucide-react';
import axios from 'axios';
import { reportExportService } from '@/lib/utils/reportExport';
import { OrderHistorySlider } from '@/components/ui/order-history-slider';
import { CustomerList } from '@/components/ui/customer-list';
import { CustomerOrderHistoryModal } from '@/components/ui/customer-order-history-modal';

interface CustomerAnalytics {
    totalCustomers: number;
    activeCustomers: number;
    newCustomersToday: number;
    averageOrderValue: number;
    customerRetentionRate: number;
    totalOrders: number;
    growthRate: number;
}

interface CustomerPurchaseData {
    _id:string;
    id: string;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    registeredAt: string;
    addresses:any[];
    order:any[];
    lastOrderAt?: string;
    totalOrders: number;
    totalSpent: number;
    cityId:string;
    status: 'active' | 'inactive' | 'suspended';
    orderFrequency: number;
    averageOrderValue: number;
    preferredCategories: string[];
    lastOrderDate: string;
    mostPurchasedProducts: {
        productName: string;
        quantity: number;
        frequency: string;
        lastPurchased: string;
    }[];
    orderHistory?: {
        orderDate: string;
        orderId: string;
        items: { product: string; quantity: number; price: number }[];
        totalAmount: number;
        reason: string;
    }[];
    frequency?: string;
    nextExpectedOrder?: string;
    preferredProducts?: string[];
    avgOrderValue?: number;
    lastOrder?: string;
}

interface ProductPurchasePattern {
    productName: string;
    category: string;
    totalCustomers: number;
    totalQuantitySold: number;
    averageFrequency: number;
    customers: {
        customerId: string;
        customerName: string;
        email: string;
        phone: string;
        whatsapp: string;
        address: string;
        city: string;
        totalPurchases: number;
        lastPurchased: string;
        frequency: string;
    }[];
}

interface OrderTimingAnalytics {
    hourlyDistribution: { hour: number; orders: number }[];
    dailyDistribution: { day: string; orders: number }[];
    monthlyDistribution: { month: string; orders: number }[];
    peakOrderingTimes: { mostActiveHour: number; mostActiveDay: string; mostActiveMonth: string };
}

interface VisitorData {
    date: string;
    mobile: number;
    desktop: number;
    total: number;
}

export default function AdminCustomersPage() {
    const [activeTab, setActiveTab] = useState<'analytics' | 'customers' | 'products' | 'timing'>(
        'analytics',
    );
    const [analytics, setAnalytics] = useState<CustomerAnalytics | null>(null);
    const [customerData, setCustomerData] = useState<CustomerPurchaseData[]>([]);
    const [productPatterns, setProductPatterns] = useState<ProductPurchasePattern[]>([]);
    const [orderTiming, setOrderTiming] = useState<OrderTimingAnalytics | null>(null);
    const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m'>('3m');
    const [selectedFrequencyType, setSelectedFrequencyType] = useState<
        'high' | 'regular' | 'occasional' | null
    >(null);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

    useEffect(() => {
        loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Separate effect for updating visitor data when time range changes
    useEffect(() => {
        updateVisitorData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeRange]);

    const loadInitialData = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setAnalytics({
            totalCustomers: 15847,
            activeCustomers: 12456,
            newCustomersToday: 1234,
            averageOrderValue: 245.5,
            customerRetentionRate: 78.5,
            totalOrders: 45623,
            growthRate: 4.5,
        });

        // Helper function to generate order history for a customer
        const generateCustomerOrderHistory = (
            totalOrders: number,
            lastOrderDate: Date,
            preferredCategories: string[],
        ) => {
            const orderHistory = [];
            const orderCount = Math.min(totalOrders, 15); // Show up to 15 recent orders

            // Product mapping based on categories
            const categoryProducts: { [key: string]: { name: string; price: number }[] } = {
                'Prescription Medicines': [
                    { name: 'Metformin 500mg', price: 85 },
                    { name: 'Insulin Pen Refills', price: 120 },
                    { name: 'Lisinopril 10mg', price: 65 },
                    { name: 'Amlodipine 5mg', price: 55 },
                ],

                'Supplements & Vitamins': [
                    { name: 'Vitamin C 1000mg', price: 65 },
                    { name: 'Omega-3 Fish Oil', price: 85 },
                    { name: 'Multivitamin Complex', price: 55 },
                    { name: 'Vitamin D3 Tablets', price: 40 },
                ],

                'Baby Care Products': [
                    { name: 'Baby Formula Premium', price: 85 },
                    { name: 'Baby Diapers Large', price: 65 },
                    { name: 'Baby Food Jars', price: 45 },
                    { name: 'Baby Wipes Pack', price: 25 },
                ],

                'Skincare Products': [
                    { name: 'Anti-Aging Night Cream', price: 125 },
                    { name: 'Hyaluronic Acid Serum', price: 95 },
                    { name: 'Moisturizing Face Cream', price: 75 },
                    { name: 'Eye Cream', price: 90 },
                ],

                'Pain Relief': [
                    { name: 'Panadol Extra 500mg', price: 45 },
                    { name: 'Ibuprofen 400mg', price: 35 },
                    { name: 'Muscle Pain Relief Gel', price: 38 },
                    { name: 'Aspirin 100mg', price: 28 },
                ],

                Default: [
                    { name: 'Vitamin C 1000mg', price: 65 },
                    { name: 'Panadol Extra 500mg', price: 45 },
                    { name: 'Antiseptic Solution', price: 25 },
                    { name: 'Bandages Pack', price: 30 },
                ],
            };

            // Get products based on preferred categories
            let availableProducts: { name: string; price: number }[] = [];
            preferredCategories.forEach((category) => {
                if (categoryProducts[category]) {
                    availableProducts.push(...categoryProducts[category]);
                }
            });

            // Fallback to default products if no preferred categories match
            if (availableProducts.length === 0) {
                availableProducts = categoryProducts['Default'];
            }

            for (let i = 0; i < orderCount; i++) {
                // Generate order date (spread over the last year, with most recent being the lastOrderDate)
                let orderDate: Date;
                if (i === 0) {
                    orderDate = lastOrderDate;
                } else {
                    const daysAgo =
                        Math.floor((i * 365) / orderCount) + Math.floor(Math.random() * 30);
                    orderDate = new Date(lastOrderDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
                }

                // Generate 1-4 items per order
                const itemCount = Math.floor(Math.random() * 4) + 1;
                const items = [];
                let totalAmount = 0;

                for (let j = 0; j < itemCount; j++) {
                    const product =
                        availableProducts[Math.floor(Math.random() * availableProducts.length)];
                    const quantity = Math.floor(Math.random() * 3) + 1;
                    items.push({
                        product: product.name,
                        quantity: quantity,
                        price: product.price,
                    });
                    totalAmount += quantity * product.price;
                }

                orderHistory.push({
                    orderDate: orderDate.toISOString().split('T')[0],
                    orderId: `ORD-${Date.now()}-${i.toString().padStart(3, '0')}`,
                    items: items,
                    totalAmount: totalAmount,
                    reason: getOrderReasonByCategory(preferredCategories),
                });
            }

            return orderHistory.reverse(); // Most recent first
        };

        // Helper function to get order reason based on preferred categories
        const getOrderReasonByCategory = (categories: string[]): string => {
            if (
                categories.includes('Prescription Medicines') ||
                categories.includes('Baby Care Products')
            ) {
                return 'Regular health maintenance and essential care needs';
            } else if (categories.includes('Supplements & Vitamins')) {
                return 'Monthly wellness routine and preventive care';
            } else if (categories.includes('Pain Relief')) {
                return 'Emergency health needs and symptom relief';
            } else {
                return 'General health and wellness needs';
            }
        };

        // Generate comprehensive customer data
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth`);
        const fetchedUsers = response.data;
        let filteredUsers = fetchedUsers;
        const newUsers = filteredUsers.filter((user:any) => user.role == 'customer');

        setCustomerData(newUsers);

        // Load product patterns
        setProductPatterns([
            {
                productName: 'Metformin 500mg',
                category: 'Prescription',
                totalCustomers: 156,
                totalQuantitySold: 1890,
                averageFrequency: 30,
                customers: [
                    {
                        customerId: 'C-001',
                        customerName: 'Ahmed Hassan',
                        email: 'ahmed.hassan@email.com',
                        phone: '+20 100 123 4567',
                        whatsapp: '+20 100 123 4567',
                        address: '123 Nasr City, Cairo',
                        city: 'Cairo',
                        totalPurchases: 12,
                        lastPurchased: '2024-01-14',
                        frequency: 'Monthly',
                    },
                ],
            },
        ]);

        // Load order timing data
        setOrderTiming({
            hourlyDistribution: [
                { hour: 8, orders: 45 },
                { hour: 9, orders: 78 },
                { hour: 10, orders: 123 },
                { hour: 11, orders: 156 },
                { hour: 12, orders: 89 },
                { hour: 13, orders: 67 },
                { hour: 14, orders: 134 },
                { hour: 15, orders: 178 },
                { hour: 16, orders: 145 },
                { hour: 17, orders: 198 },
                { hour: 18, orders: 234 },
                { hour: 19, orders: 189 },
                { hour: 20, orders: 156 },
                { hour: 21, orders: 98 },
                { hour: 22, orders: 45 },
            ],

            dailyDistribution: [
                { day: 'Monday', orders: 1234 },
                { day: 'Tuesday', orders: 1456 },
                { day: 'Wednesday', orders: 1345 },
                { day: 'Thursday', orders: 1567 },
                { day: 'Friday', orders: 1789 },
                { day: 'Saturday', orders: 2134 },
                { day: 'Sunday', orders: 1876 },
            ],

            monthlyDistribution: [
                { month: 'Jan', orders: 12456 },
                { month: 'Feb', orders: 13567 },
                { month: 'Mar', orders: 14234 },
                { month: 'Apr', orders: 15678 },
                { month: 'May', orders: 16789 },
                { month: 'Jun', orders: 17234 },
            ],

            peakOrderingTimes: {
                mostActiveHour: 18,
                mostActiveDay: 'Saturday',
                mostActiveMonth: 'June',
            },
        });

        // Generate initial visitor data
        await updateVisitorData();
        setIsLoading(false);
    };

    const updateVisitorData = async () => {
        setIsChartLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300));

        const generateVisitorData = () => {
            const data: VisitorData[] = [];
            const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

            for (let i = days; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const mobile = Math.floor(Math.random() * 200) + 100;
                const desktop = Math.floor(Math.random() * 300) + 150;

                data.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    mobile,
                    desktop,
                    total: mobile + desktop,
                });
            }
            return data;
        };

        setVisitorData(generateVisitorData());
        setIsChartLoading(false);
    };

    const exportCustomerData = async (format: 'csv' | 'excel') => {
        const allCustomersWithOrders = getAllCustomersWithOrderHistory();
        const detailedOrderData: any[] = [];

        allCustomersWithOrders.forEach((customer) => {
            if (customer.orderHistory && customer.orderHistory.length > 0) {
                customer.orderHistory.forEach((order, orderIndex) => {
                    order.items.forEach((item, itemIndex) => {
                        const orderDate = new Date(order.orderDate);
                        const daysSinceLastOrder =
                            orderIndex > 0
                                ? Math.floor(
                                      (orderDate.getTime() -
                                          new Date(
                                              customer.orderHistory![orderIndex - 1].orderDate,
                                          ).getTime()) /
                                          (1000 * 60 * 60 * 24),
                                  )
                                : 'First Order';

                        detailedOrderData.push({
                            // Customer Information
                            'Customer ID': customer.id,
                            'Customer Name': customer.name,
                            'Customer Email': customer.email,
                            'Customer Phone': customer.phone,
                            'Customer City': customer.city,
                            'Customer Type': customer.frequency,
                            'Customer Total Orders': customer.totalOrders,
                            'Customer Total Spent (EGP)': customer.totalSpent.toFixed(2),
                            'Customer Avg Order Value (EGP)': customer.avgOrderValue.toFixed(2),
                            'Customer Next Expected Order': customer.nextExpectedOrder,
                            'Customer Preferred Products': customer.preferredProducts.join(' | '),

                            // Order Information
                            'Order Number': orderIndex + 1,
                            'Order ID': order.orderId,
                            'Order Date': order.orderDate,
                            'Order Day of Week': orderDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                            }),
                            'Order Month': orderDate.toLocaleDateString('en-US', { month: 'long' }),
                            'Order Year': orderDate.getFullYear(),
                            'Order Time': orderDate.toLocaleTimeString(),
                            'Days Since Last Order': daysSinceLastOrder,
                            'Order Total Amount (EGP)': order.totalAmount.toFixed(2),
                            'Order Reason/Purpose': order.reason,
                            'Items in Order': order.items.length,

                            // Product Information
                            'Item Number in Order': itemIndex + 1,
                            'Product Name': item.product,
                            'Product Category': getProductCategory(item.product),
                            'Is Prescription': isPrescriptionProduct(item.product) ? 'Yes' : 'No',
                            'Product Quantity': item.quantity,
                            'Product Unit Price (EGP)': item.price.toFixed(2),
                            'Product Total Price (EGP)': (item.quantity * item.price).toFixed(2),
                            'Product Percentage of Order':
                                (((item.quantity * item.price) / order.totalAmount) * 100).toFixed(
                                    1,
                                ) + '%',

                            // Time Analytics
                            'Order Month Number': orderDate.getMonth() + 1,
                            'Order Quarter': Math.ceil((orderDate.getMonth() + 1) / 3),
                            'Is Weekend Order': [0, 6].includes(orderDate.getDay()) ? 'Yes' : 'No',
                            'Order Hour': orderDate.getHours(),
                            'Time of Day':
                                orderDate.getHours() < 12
                                    ? 'Morning'
                                    : orderDate.getHours() < 17
                                      ? 'Afternoon'
                                      : 'Evening',
                        });
                    });
                });
            }
        });

        const exportData = {
            title: 'Complete Customer Order History Report',
            subtitle: `All customers with detailed order histories - ${detailedOrderData.length.toLocaleString()} order items from ${allCustomersWithOrders.length} customers`,
            generatedAt: new Date().toISOString(),
            generatedBy: 'CURA Admin Dashboard',
            data: detailedOrderData,
        };

        await reportExportService.exportReport(exportData, { format });
    };

    // Helper function to get all customers with order histories
    const getAllCustomersWithOrderHistory = () => {
        const highFreqDetails = getFrequencyDetails('high');
        const regularDetails = getFrequencyDetails('regular');
        const occasionalDetails = getFrequencyDetails('occasional');

        return [
            ...(highFreqDetails?.customers || []),
            ...(regularDetails?.customers || []),
            ...(occasionalDetails?.customers || []),
        ];
    };

    // Helper function to categorize products
    const getProductCategory = (productName: string): string => {
        const name = productName.toLowerCase();

        if (
            name.includes('baby') ||
            name.includes('formula') ||
            name.includes('diaper') ||
            name.includes('wipes')
        ) {
            return 'Baby Care';
        } else if (
            name.includes('vitamin') ||
            name.includes('omega') ||
            name.includes('supplement') ||
            name.includes('calcium') ||
            name.includes('iron')
        ) {
            return 'Supplements & Vitamins';
        } else if (
            name.includes('metformin') ||
            name.includes('insulin') ||
            name.includes('medication') ||
            name.includes('prescription')
        ) {
            return 'Prescription Medicine';
        } else if (
            name.includes('cream') ||
            name.includes('lotion') ||
            name.includes('serum') ||
            name.includes('cleanser') ||
            name.includes('sunscreen')
        ) {
            return 'Skincare & Personal Care';
        } else if (
            name.includes('panadol') ||
            name.includes('aspirin') ||
            name.includes('pain') ||
            name.includes('antiseptic')
        ) {
            return 'Pain Relief & First Aid';
        } else if (
            name.includes('protein') ||
            name.includes('creatine') ||
            name.includes('bcaa') ||
            name.includes('pre-workout')
        ) {
            return 'Sports & Fitness';
        } else {
            return 'General Health';
        }
    };

    // Helper function to identify prescription products
    const isPrescriptionProduct = (productName: string): boolean => {
        const prescriptionKeywords = [
            'metformin',
            'insulin',
            'lisinopril',
            'amlodipine',
            'levothyroxine',
            'medication',
            'prescription',
        ];

        return prescriptionKeywords.some((keyword) => productName.toLowerCase().includes(keyword));
    };

    const exportProductPatterns = async (format: 'csv' | 'excel') => {
        const allCustomersWithOrders = getAllCustomersWithOrderHistory();
        const productOrderData: any[] = [];

        allCustomersWithOrders.forEach((customer) => {
            if (customer.orderHistory) {
                customer.orderHistory.forEach((order, orderIndex) => {
                    order.items.forEach((item, itemIndex) => {
                        const orderDate = new Date(order.orderDate);

                        productOrderData.push({
                            'Product Name': item.product,
                            'Product Category': getProductCategory(item.product),
                            'Is Prescription': isPrescriptionProduct(item.product) ? 'Yes' : 'No',
                            'Product Unit Price (EGP)': item.price.toFixed(2),
                            'Product Quantity Ordered': item.quantity,
                            'Product Total Value (EGP)': (item.quantity * item.price).toFixed(2),
                            'Customer ID': customer.id,
                            'Customer Name': customer.name,
                            'Customer Email': customer.email,
                            'Customer Phone': customer.phone,
                            'Customer City': customer.city,
                            'Customer Type': customer.frequency,
                            'Customer Total Orders': customer.totalOrders,
                            'Customer Total Spent (EGP)': customer.totalSpent.toFixed(2),
                            'Order ID': order.orderId,
                            'Order Date': order.orderDate,
                            'Order Day of Week': orderDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                            }),
                            'Order Month': orderDate.toLocaleDateString('en-US', { month: 'long' }),
                            'Order Year': orderDate.getFullYear(),
                            'Order Time': orderDate.toLocaleTimeString(),
                            'Order Total Amount (EGP)': order.totalAmount.toFixed(2),
                            'Order Reason': order.reason,
                            'Product Share of Order':
                                (((item.quantity * item.price) / order.totalAmount) * 100).toFixed(
                                    1,
                                ) + '%',
                            'Order Number for Customer': orderIndex + 1,
                            'Item Number in Order': itemIndex + 1,
                            'Time of Day':
                                orderDate.getHours() < 12
                                    ? 'Morning'
                                    : orderDate.getHours() < 17
                                      ? 'Afternoon'
                                      : 'Evening',
                            'Is Weekend': [0, 6].includes(orderDate.getDay()) ? 'Yes' : 'No',
                        });
                    });
                });
            }
        });

        const exportData = {
            title: 'Complete Product Purchase History Report',
            subtitle: `All products purchased by all customers with complete order details - ${productOrderData.length.toLocaleString()} product purchases`,
            generatedAt: new Date().toISOString(),
            generatedBy: 'CURA Admin Dashboard',
            data: productOrderData,
        };

        await reportExportService.exportReport(exportData, { format });
    };

    const exportFrequencyAnalysis = async (format: 'csv' | 'excel') => {
        // Get detailed data for all frequency types with expanded customer data
        const highFreqDetails = getFrequencyDetails('high');
        const regularDetails = getFrequencyDetails('regular');
        const occasionalDetails = getFrequencyDetails('occasional');

        // Generate comprehensive customer data for each frequency type
        const allFrequencyData: any[] = [];

        // Helper function to generate more comprehensive customer data
        const generateComprehensiveCustomerData = (
            baseCustomers: any[],
            buyerType: string,
            description: string,
            frequency: string,
            mainCategories: string,
            totalCustomers: number,
            avgOrdersPerMonth: number,
            avgSpentPerMonth: number,
            percentage: string,
        ) => {
            // Generate additional customers to match the total count
            const expandedCustomers = [...baseCustomers];

            // Generate more customers to reach the total count
            const additionalCustomersNeeded = Math.min(totalCustomers - baseCustomers.length, 500); // Limit to 500 additional for performance

            for (let i = 0; i < additionalCustomersNeeded; i++) {
                const customerIndex = baseCustomers.length + i + 1;
                const cities = [
                    'Cairo',
                    'Alexandria',
                    'Giza',
                    'Ismailia',
                    'Suez',
                    'Port Said',
                    'Mansoura',
                    'Tanta',
                ];

                const randomCity = cities[Math.floor(Math.random() * cities.length)];

                // Generate realistic names
                const firstNames = [
                    'Ahmed',
                    'Mohamed',
                    'Fatima',
                    'Yasmin',
                    'Omar',
                    'Nour',
                    'Hassan',
                    'Mona',
                    'Ali',
                    'Sara',
                ];

                const lastNames = [
                    'Hassan',
                    'Mohamed',
                    'Ali',
                    'Farouk',
                    'Saeed',
                    'Ibrahim',
                    'Mahmoud',
                    'Abdel Rahman',
                    'El Sayed',
                    'Mostafa',
                ];

                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const fullName = `${firstName} ${lastName}`;

                const newCustomer = {
                    id: `${buyerType.substring(0, 2).toUpperCase()}-${customerIndex.toString().padStart(3, '0')}`,
                    name: fullName,
                    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
                    phone: `+20 10${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`,
                    city: randomCity,
                    totalOrders: Math.floor(Math.random() * 20) + 1,
                    totalSpent: Math.floor(Math.random() * 5000) + 500,
                    lastOrder: new Date(
                        Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
                    )
                        .toISOString()
                        .split('T')[0],
                    avgOrderValue: Math.floor(Math.random() * 300) + 100,
                    frequency: frequency,
                    nextExpectedOrder:
                        frequency === 'Weekly'
                            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                  .toISOString()
                                  .split('T')[0]
                            : frequency === 'Monthly'
                              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                    .toISOString()
                                    .split('T')[0]
                              : 'Unknown',
                    preferredProducts:
                        frequency === 'Weekly'
                            ? ['Baby Formula', 'Insulin', 'Chronic Medication']
                            : frequency === 'Monthly'
                              ? ['Vitamin C', 'Skincare Cream', 'Omega-3']
                              : ['Panadol', 'Bandages', 'Cough Syrup'],
                    orderHistory: generateOrderHistory(
                        frequency,
                        Math.floor(Math.random() * 10) + 1,
                    ),
                };

                expandedCustomers.push(newCustomer);
            }

            return expandedCustomers;
        };

        // Helper function to generate order history
        const generateOrderHistory = (frequency: string, orderCount: number) => {
            const orderHistory = [];
            const products = {
                Weekly: [
                    { name: 'Baby Formula Premium', price: 85, category: 'Baby Care' },
                    { name: 'Insulin Pen Refills', price: 120, category: 'Prescription' },
                    { name: 'Chronic Medication Pack', price: 95, category: 'Prescription' },
                    { name: 'Baby Diapers Large', price: 65, category: 'Baby Care' },
                    { name: 'Diabetes Test Strips', price: 75, category: 'Medical Devices' },
                ],

                Monthly: [
                    { name: 'Vitamin C 1000mg', price: 65, category: 'Supplements' },
                    { name: 'Anti-Aging Night Cream', price: 125, category: 'Skincare' },
                    { name: 'Hyaluronic Acid Serum', price: 95, category: 'Skincare' },
                    { name: 'Omega-3 Fish Oil', price: 85, category: 'Supplements' },
                    { name: 'Multivitamin Complex', price: 55, category: 'Supplements' },
                ],

                Occasionally: [
                    { name: 'Panadol Extra 500mg', price: 45, category: 'Pain Relief' },
                    { name: 'Cough Syrup', price: 35, category: 'Cold & Flu' },
                    { name: 'Antiseptic Solution', price: 25, category: 'First Aid' },
                    { name: 'Bandages Pack', price: 30, category: 'First Aid' },
                    { name: 'Throat Lozenges', price: 20, category: 'Cold & Flu' },
                ],
            };

            const productList =
                products[frequency as keyof typeof products] || products['Occasionally'];

            for (let i = 0; i < orderCount; i++) {
                const daysAgo =
                    frequency === 'Weekly' ? i * 7 : frequency === 'Monthly' ? i * 30 : i * 60;
                const orderDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

                const itemCount = Math.floor(Math.random() * 3) + 1;
                const items = [];
                let totalAmount = 0;

                for (let j = 0; j < itemCount; j++) {
                    const product = productList[Math.floor(Math.random() * productList.length)];
                    const quantity = Math.floor(Math.random() * 3) + 1;
                    items.push({
                        product: product.name,
                        quantity: quantity,
                        price: product.price,
                    });
                    totalAmount += quantity * product.price;
                }

                orderHistory.push({
                    orderDate: orderDate.toISOString().split('T')[0],
                    orderId: `ORD-${Date.now()}-${i.toString().padStart(3, '0')}`,
                    items: items,
                    totalAmount: totalAmount,
                    reason:
                        frequency === 'Weekly'
                            ? 'Regular weekly health maintenance'
                            : frequency === 'Monthly'
                              ? 'Monthly wellness routine'
                              : 'Emergency health needs',
                });
            }

            return orderHistory.reverse(); // Most recent first
        };

        // Process High Frequency Buyers with expanded data
        if (highFreqDetails) {
            const expandedHighFreqCustomers = generateComprehensiveCustomerData(
                highFreqDetails.customers,
                'High Frequency Buyers',
                'Customers who order weekly (2,456 customers)',
                'Weekly',
                'Baby care and chronic medication',
                2456,
                4.3,
                980.5,
                '15.5%',
            );

            expandedHighFreqCustomers.forEach((customer) => {
                if (customer.orderHistory) {
                    customer.orderHistory.forEach((order: any, orderIndex: number) => {
                        order.items.forEach((item: any, itemIndex: number) => {
                            const orderDate = new Date(order.orderDate);
                            const daysSinceLastOrder =
                                orderIndex > 0
                                    ? Math.floor(
                                          (orderDate.getTime() -
                                              new Date(
                                                  customer.orderHistory![orderIndex - 1].orderDate,
                                              ).getTime()) /
                                              (1000 * 60 * 60 * 24),
                                      )
                                    : 'First Order';

                            allFrequencyData.push({
                                // Frequency Analysis Information
                                'Buyer Type': 'High Frequency Buyers',
                                'Buyer Type Description':
                                    'Customers who order weekly (2,456 customers)',
                                'Order Frequency': 'Weekly',
                                'Main Categories': 'Baby care and chronic medication',
                                'Total Customers in Type': 2456,
                                'Avg Orders Per Month': 4.3,
                                'Avg Spent Per Month (EGP)': 980.5,
                                'Percentage of Total Customers': '15.5%',

                                // Customer Information
                                'Customer ID': customer.id,
                                'Customer Name': customer.name,
                                'Customer Email': customer.email,
                                'Customer Phone': customer.phone,
                                'Customer WhatsApp': customer.phone, // Same as phone for simplicity
                                'Customer City': customer.city,
                                'Customer Registration Date': new Date(
                                    Date.now() -
                                        Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
                                )
                                    .toISOString()
                                    .split('T')[0],
                                'Customer Status': 'Active',
                                'Customer Total Orders': customer.totalOrders,
                                'Customer Total Spent (EGP)': customer.totalSpent.toFixed(2),
                                'Customer Avg Order Value (EGP)': customer.avgOrderValue.toFixed(2),
                                'Customer Last Order Date': customer.lastOrder,
                                'Customer Next Expected Order': customer.nextExpectedOrder,
                                'Customer Preferred Products':
                                    customer.preferredProducts.join(' | '),

                                // Order Information
                                'Order Number for Customer': orderIndex + 1,
                                'Order ID': order.orderId,
                                'Order Date': order.orderDate,
                                'Order Day of Week': orderDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                }),
                                'Order Month': orderDate.toLocaleDateString('en-US', {
                                    month: 'long',
                                }),
                                'Order Year': orderDate.getFullYear(),
                                'Order Time': orderDate.toLocaleTimeString(),
                                'Days Since Last Order': daysSinceLastOrder,
                                'Order Total Amount (EGP)': order.totalAmount.toFixed(2),
                                'Order Reason/Purpose': order.reason,
                                'Total Items in Order': order.items.length,

                                // Product Information
                                'Item Number in Order': itemIndex + 1,
                                'Product Name': item.product,
                                'Product Category': getProductCategory(item.product),
                                'Is Prescription Product': isPrescriptionProduct(item.product)
                                    ? 'Yes'
                                    : 'No',
                                'Product Quantity Ordered': item.quantity,
                                'Product Unit Price (EGP)': item.price.toFixed(2),
                                'Product Total Price (EGP)': (item.quantity * item.price).toFixed(
                                    2,
                                ),
                                'Product Percentage of Order':
                                    (
                                        ((item.quantity * item.price) / order.totalAmount) *
                                        100
                                    ).toFixed(1) + '%',

                                // Time Analytics
                                'Order Month Number': orderDate.getMonth() + 1,
                                'Order Quarter': Math.ceil((orderDate.getMonth() + 1) / 3),
                                'Is Weekend Order': [0, 6].includes(orderDate.getDay())
                                    ? 'Yes'
                                    : 'No',
                                'Order Hour (24h)': orderDate.getHours(),
                                'Time of Day':
                                    orderDate.getHours() < 12
                                        ? 'Morning'
                                        : orderDate.getHours() < 17
                                          ? 'Afternoon'
                                          : 'Evening',
                                Season:
                                    Math.ceil((orderDate.getMonth() + 1) / 3) === 1
                                        ? 'Winter'
                                        : Math.ceil((orderDate.getMonth() + 1) / 3) === 2
                                          ? 'Spring'
                                          : Math.ceil((orderDate.getMonth() + 1) / 3) === 3
                                            ? 'Summer'
                                            : 'Fall',
                            });
                        });
                    });
                }
            });
        }

        // Process Regular Buyers with expanded data
        if (regularDetails) {
            const expandedRegularCustomers = generateComprehensiveCustomerData(
                regularDetails.customers,
                'Regular Buyers',
                'Customers who order monthly (8,234 customers)',
                'Monthly',
                'Supplements and skincare products',
                8234,
                1.2,
                285.75,
                '51.9%',
            );

            expandedRegularCustomers.forEach((customer) => {
                if (customer.orderHistory) {
                    customer.orderHistory.forEach((order: any, orderIndex: number) => {
                        order.items.forEach((item: any, itemIndex: number) => {
                            const orderDate = new Date(order.orderDate);
                            const daysSinceLastOrder =
                                orderIndex > 0
                                    ? Math.floor(
                                          (orderDate.getTime() -
                                              new Date(
                                                  customer.orderHistory![orderIndex - 1].orderDate,
                                              ).getTime()) /
                                              (1000 * 60 * 60 * 24),
                                      )
                                    : 'First Order';

                            allFrequencyData.push({
                                // Frequency Analysis Information
                                'Buyer Type': 'Regular Buyers',
                                'Buyer Type Description':
                                    'Customers who order monthly (8,234 customers)',
                                'Order Frequency': 'Monthly',
                                'Main Categories': 'Supplements and skincare products',
                                'Total Customers in Type': 8234,
                                'Avg Orders Per Month': 1.2,
                                'Avg Spent Per Month (EGP)': 285.75,
                                'Percentage of Total Customers': '51.9%',

                                // Customer Information
                                'Customer ID': customer.id,
                                'Customer Name': customer.name,
                                'Customer Email': customer.email,
                                'Customer Phone': customer.phone,
                                'Customer WhatsApp': customer.phone,
                                'Customer City': customer.city,
                                'Customer Registration Date': new Date(
                                    Date.now() -
                                        Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
                                )
                                    .toISOString()
                                    .split('T')[0],
                                'Customer Status': 'Active',
                                'Customer Total Orders': customer.totalOrders,
                                'Customer Total Spent (EGP)': customer.totalSpent.toFixed(2),
                                'Customer Avg Order Value (EGP)': customer.avgOrderValue.toFixed(2),
                                'Customer Last Order Date': customer.lastOrder,
                                'Customer Next Expected Order': customer.nextExpectedOrder,
                                'Customer Preferred Products':
                                    customer.preferredProducts.join(' | '),

                                // Order Information
                                'Order Number for Customer': orderIndex + 1,
                                'Order ID': order.orderId,
                                'Order Date': order.orderDate,
                                'Order Day of Week': orderDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                }),
                                'Order Month': orderDate.toLocaleDateString('en-US', {
                                    month: 'long',
                                }),
                                'Order Year': orderDate.getFullYear(),
                                'Order Time': orderDate.toLocaleTimeString(),
                                'Days Since Last Order': daysSinceLastOrder,
                                'Order Total Amount (EGP)': order.totalAmount.toFixed(2),
                                'Order Reason/Purpose': order.reason,
                                'Total Items in Order': order.items.length,

                                // Product Information
                                'Item Number in Order': itemIndex + 1,
                                'Product Name': item.product,
                                'Product Category': getProductCategory(item.product),
                                'Is Prescription Product': isPrescriptionProduct(item.product)
                                    ? 'Yes'
                                    : 'No',
                                'Product Quantity Ordered': item.quantity,
                                'Product Unit Price (EGP)': item.price.toFixed(2),
                                'Product Total Price (EGP)': (item.quantity * item.price).toFixed(
                                    2,
                                ),
                                'Product Percentage of Order':
                                    (
                                        ((item.quantity * item.price) / order.totalAmount) *
                                        100
                                    ).toFixed(1) + '%',

                                // Time Analytics
                                'Order Month Number': orderDate.getMonth() + 1,
                                'Order Quarter': Math.ceil((orderDate.getMonth() + 1) / 3),
                                'Is Weekend Order': [0, 6].includes(orderDate.getDay())
                                    ? 'Yes'
                                    : 'No',
                                'Order Hour (24h)': orderDate.getHours(),
                                'Time of Day':
                                    orderDate.getHours() < 12
                                        ? 'Morning'
                                        : orderDate.getHours() < 17
                                          ? 'Afternoon'
                                          : 'Evening',
                                Season:
                                    Math.ceil((orderDate.getMonth() + 1) / 3) === 1
                                        ? 'Winter'
                                        : Math.ceil((orderDate.getMonth() + 1) / 3) === 2
                                          ? 'Spring'
                                          : Math.ceil((orderDate.getMonth() + 1) / 3) === 3
                                            ? 'Summer'
                                            : 'Fall',
                            });
                        });
                    });
                }
            });
        }

        // Process Occasional Buyers with expanded data
        if (occasionalDetails) {
            const expandedOccasionalCustomers = generateComprehensiveCustomerData(
                occasionalDetails.customers,
                'Occasional Buyers',
                'Customers who order occasionally (5,157 customers)',
                'Occasionally',
                'Pain relief and emergency medicines',
                5157,
                0.3,
                125.25,
                '32.6%',
            );

            expandedOccasionalCustomers.forEach((customer) => {
                if (customer.orderHistory) {
                    customer.orderHistory.forEach((order: any, orderIndex: number) => {
                        order.items.forEach((item: any, itemIndex: number) => {
                            const orderDate = new Date(order.orderDate);
                            const daysSinceLastOrder =
                                orderIndex > 0
                                    ? Math.floor(
                                          (orderDate.getTime() -
                                              new Date(
                                                  customer.orderHistory![orderIndex - 1].orderDate,
                                              ).getTime()) /
                                              (1000 * 60 * 60 * 24),
                                      )
                                    : 'First Order';

                            allFrequencyData.push({
                                // Frequency Analysis Information
                                'Buyer Type': 'Occasional Buyers',
                                'Buyer Type Description':
                                    'Customers who order occasionally (5,157 customers)',
                                'Order Frequency': 'Occasionally',
                                'Main Categories': 'Pain relief and emergency medicines',
                                'Total Customers in Type': 5157,
                                'Avg Orders Per Month': 0.3,
                                'Avg Spent Per Month (EGP)': 125.25,
                                'Percentage of Total Customers': '32.6%',

                                // Customer Information
                                'Customer ID': customer.id,
                                'Customer Name': customer.name,
                                'Customer Email': customer.email,
                                'Customer Phone': customer.phone,
                                'Customer WhatsApp': customer.phone,
                                'Customer City': customer.city,
                                'Customer Registration Date': new Date(
                                    Date.now() -
                                        Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
                                )
                                    .toISOString()
                                    .split('T')[0],
                                'Customer Status': 'Active',
                                'Customer Total Orders': customer.totalOrders,
                                'Customer Total Spent (EGP)': customer.totalSpent.toFixed(2),
                                'Customer Avg Order Value (EGP)': customer.avgOrderValue.toFixed(2),
                                'Customer Last Order Date': customer.lastOrder,
                                'Customer Next Expected Order': customer.nextExpectedOrder,
                                'Customer Preferred Products':
                                    customer.preferredProducts.join(' | '),

                                // Order Information
                                'Order Number for Customer': orderIndex + 1,
                                'Order ID': order.orderId,
                                'Order Date': order.orderDate,
                                'Order Day of Week': orderDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                }),
                                'Order Month': orderDate.toLocaleDateString('en-US', {
                                    month: 'long',
                                }),
                                'Order Year': orderDate.getFullYear(),
                                'Order Time': orderDate.toLocaleTimeString(),
                                'Days Since Last Order': daysSinceLastOrder,
                                'Order Total Amount (EGP)': order.totalAmount.toFixed(2),
                                'Order Reason/Purpose': order.reason,
                                'Total Items in Order': order.items.length,

                                // Product Information
                                'Item Number in Order': itemIndex + 1,
                                'Product Name': item.product,
                                'Product Category': getProductCategory(item.product),
                                'Is Prescription Product': isPrescriptionProduct(item.product)
                                    ? 'Yes'
                                    : 'No',
                                'Product Quantity Ordered': item.quantity,
                                'Product Unit Price (EGP)': item.price.toFixed(2),
                                'Product Total Price (EGP)': (item.quantity * item.price).toFixed(
                                    2,
                                ),
                                'Product Percentage of Order':
                                    (
                                        ((item.quantity * item.price) / order.totalAmount) *
                                        100
                                    ).toFixed(1) + '%',

                                // Time Analytics
                                'Order Month Number': orderDate.getMonth() + 1,
                                'Order Quarter': Math.ceil((orderDate.getMonth() + 1) / 3),
                                'Is Weekend Order': [0, 6].includes(orderDate.getDay())
                                    ? 'Yes'
                                    : 'No',
                                'Order Hour (24h)': orderDate.getHours(),
                                'Time of Day':
                                    orderDate.getHours() < 12
                                        ? 'Morning'
                                        : orderDate.getHours() < 17
                                          ? 'Afternoon'
                                          : 'Evening',
                                Season:
                                    Math.ceil((orderDate.getMonth() + 1) / 3) === 1
                                        ? 'Winter'
                                        : Math.ceil((orderDate.getMonth() + 1) / 3) === 2
                                          ? 'Spring'
                                          : Math.ceil((orderDate.getMonth() + 1) / 3) === 3
                                            ? 'Summer'
                                            : 'Fall',
                            });
                        });
                    });
                }
            });
        }

        const exportData = {
            title: 'Complete Purchase Frequency Analysis Report - All Customer Types',
            subtitle: `Comprehensive data from High Frequency Buyers (2,456), Regular Buyers (8,234), and Occasional Buyers (5,157) with complete order histories and customer details - ${allFrequencyData.length.toLocaleString()} detailed order items from ${(2456 + 8234 + 5157).toLocaleString()} customers across all frequency types`,
            generatedAt: new Date().toISOString(),
            generatedBy: 'CURA Admin Dashboard - Customer Analytics',
            data: allFrequencyData,
        };

        await reportExportService.exportReport(exportData, { format });
    };

    // Detailed frequency analysis data with specific customers for each type
    const getFrequencyDetails = (type: 'high' | 'regular' | 'occasional') => {
        // Helper function to generate sample customers for each type
        const generateSampleCustomers = (type: string, count: number = 50) => {
            const customers = [];
            const cities = [
                'Cairo',
                'Alexandria',
                'Giza',
                'Ismailia',
                'Suez',
                'Port Said',
                'Mansoura',
                'Tanta',
                'Aswan',
                'Luxor',
            ];

            const firstNames = [
                'Ahmed',
                'Mohamed',
                'Fatima',
                'Yasmin',
                'Omar',
                'Nour',
                'Hassan',
                'Mona',
                'Ali',
                'Sara',
                'Mahmoud',
                'Dina',
                'Khaled',
                'Aya',
                'Amr',
                'Rana',
                'Youssef',
                'Heba',
                'Tarek',
                'Layla',
            ];

            const lastNames = [
                'Hassan',
                'Mohamed',
                'Ali',
                'Farouk',
                'Saeed',
                'Ibrahim',
                'Mahmoud',
                'Abdel Rahman',
                'El Sayed',
                'Mostafa',
                'Abdel Aziz',
                'El Shamy',
                'Rashad',
                'Nasser',
                'Salah',
                'Zaki',
                'Fouad',
                'Kamal',
                'Shehata',
                'Mansour',
            ];

            for (let i = 0; i < count; i++) {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const fullName = `${firstName} ${lastName}`;
                const city = cities[Math.floor(Math.random() * cities.length)];

                // Generate customer data based on frequency type
                let customerData;
                if (type === 'high') {
                    customerData = {
                        totalOrders: Math.floor(Math.random() * 25) + 15, // 15-40 orders
                        totalSpent: Math.floor(Math.random() * 6000) + 2000, // 2000-8000 EGP
                        avgOrderValue: Math.floor(Math.random() * 150) + 200, // 200-350 EGP
                        frequency: 'Weekly',
                        nextExpectedOrder: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split('T')[0],
                        preferredProducts: [
                            'Baby Formula',
                            'Insulin Pens',
                            'Chronic Medication',
                            'Diabetes Supplies',
                            'Blood Pressure Monitor',
                        ],

                        orderCount: Math.floor(Math.random() * 15) + 8, // 8-23 orders in history
                    };
                } else if (type === 'regular') {
                    customerData = {
                        totalOrders: Math.floor(Math.random() * 15) + 8, // 8-23 orders
                        totalSpent: Math.floor(Math.random() * 3000) + 1000, // 1000-4000 EGP
                        avgOrderValue: Math.floor(Math.random() * 100) + 150, // 150-250 EGP
                        frequency: 'Monthly',
                        nextExpectedOrder: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split('T')[0],
                        preferredProducts: [
                            'Vitamin C',
                            'Skincare Cream',
                            'Omega-3',
                            'Multivitamins',
                            'Protein Powder',
                        ],

                        orderCount: Math.floor(Math.random() * 10) + 5, // 5-15 orders in history
                    };
                } else {
                    customerData = {
                        totalOrders: Math.floor(Math.random() * 8) + 2, // 2-10 orders
                        totalSpent: Math.floor(Math.random() * 1000) + 200, // 200-1200 EGP
                        avgOrderValue: Math.floor(Math.random() * 80) + 70, // 70-150 EGP
                        frequency: 'Occasionally',
                        nextExpectedOrder: 'Unknown',
                        preferredProducts: [
                            'Panadol',
                            'Bandages',
                            'Cough Syrup',
                            'Antiseptic',
                            'Throat Lozenges',
                        ],

                        orderCount: Math.floor(Math.random() * 6) + 2, // 2-8 orders in history
                    };
                }

                const customer = {
                    id: `${type.substring(0, 2).toUpperCase()}-${(i + 1).toString().padStart(3, '0')}`,
                    name: fullName,
                    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
                    phone: `+20 10${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`,
                    city: city,
                    totalOrders: customerData.totalOrders,
                    totalSpent: customerData.totalSpent,
                    lastOrder: new Date(
                        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
                    )
                        .toISOString()
                        .split('T')[0],
                    avgOrderValue: customerData.avgOrderValue,
                    frequency: customerData.frequency,
                    nextExpectedOrder: customerData.nextExpectedOrder,
                    preferredProducts: customerData.preferredProducts,
                    orderHistory: generateOrderHistory(type, customerData.orderCount),
                };

                customers.push(customer);
            }

            return customers;
        };

        // Helper function to generate order history
        const generateOrderHistory = (type: string, orderCount: number) => {
            const orderHistory = [];
            const products = {
                high: [
                    { name: 'Baby Formula Premium', price: 85, category: 'Baby Care' },
                    { name: 'Insulin Pen Refills', price: 120, category: 'Prescription' },
                    { name: 'Chronic Medication Pack', price: 95, category: 'Prescription' },
                    { name: 'Baby Diapers Large', price: 65, category: 'Baby Care' },
                    { name: 'Diabetes Test Strips', price: 75, category: 'Medical Devices' },
                    { name: 'Blood Pressure Monitor', price: 150, category: 'Medical Devices' },
                    { name: 'Baby Food Jars', price: 45, category: 'Baby Care' },
                    { name: 'Insulin Syringes', price: 35, category: 'Medical Devices' },
                    { name: 'Hypertension Medication', price: 110, category: 'Prescription' },
                    { name: 'Baby Wipes Pack', price: 25, category: 'Baby Care' },
                ],

                regular: [
                    { name: 'Vitamin C 1000mg', price: 65, category: 'Supplements' },
                    { name: 'Anti-Aging Night Cream', price: 125, category: 'Skincare' },
                    { name: 'Hyaluronic Acid Serum', price: 95, category: 'Skincare' },
                    { name: 'Omega-3 Fish Oil', price: 85, category: 'Supplements' },
                    { name: 'Multivitamin Complex', price: 55, category: 'Supplements' },
                    { name: 'Collagen Powder', price: 110, category: 'Supplements' },
                    { name: 'Vitamin D3 Tablets', price: 40, category: 'Supplements' },
                    { name: 'Moisturizing Face Cream', price: 75, category: 'Skincare' },
                    { name: 'Protein Powder', price: 120, category: 'Supplements' },
                    { name: 'Eye Cream', price: 90, category: 'Skincare' },
                ],

                occasional: [
                    { name: 'Panadol Extra 500mg', price: 45, category: 'Pain Relief' },
                    { name: 'Cough Syrup', price: 35, category: 'Cold & Flu' },
                    { name: 'Antiseptic Solution', price: 25, category: 'First Aid' },
                    { name: 'Bandages Pack', price: 30, category: 'First Aid' },
                    { name: 'Throat Lozenges', price: 20, category: 'Cold & Flu' },
                    { name: 'Fever Reducer Tablets', price: 28, category: 'Pain Relief' },
                    { name: 'Nasal Decongestant', price: 32, category: 'Cold & Flu' },
                    { name: 'Muscle Pain Relief Gel', price: 38, category: 'Pain Relief' },
                    { name: 'Allergy Relief Tablets', price: 42, category: 'Allergy' },
                    { name: 'Digestive Aid Tablets', price: 35, category: 'Digestive Health' },
                ],
            };

            const productList = products[type as keyof typeof products] || products['occasional'];

            for (let i = 0; i < orderCount; i++) {
                const daysAgo =
                    type === 'high'
                        ? i * 7 + Math.floor(Math.random() * 3)
                        : type === 'regular'
                          ? i * 30 + Math.floor(Math.random() * 7)
                          : i * 60 + Math.floor(Math.random() * 30);
                const orderDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

                const itemCount = Math.floor(Math.random() * 4) + 1;
                const items = [];
                let totalAmount = 0;

                for (let j = 0; j < itemCount; j++) {
                    const product = productList[Math.floor(Math.random() * productList.length)];
                    const quantity = Math.floor(Math.random() * 3) + 1;
                    items.push({
                        product: product.name,
                        quantity: quantity,
                        price: product.price,
                    });
                    totalAmount += quantity * product.price;
                }

                orderHistory.push({
                    orderDate: orderDate.toISOString().split('T')[0],
                    orderId: `ORD-${type.toUpperCase()}-${Date.now()}-${i.toString().padStart(3, '0')}`,
                    items: items,
                    totalAmount: totalAmount,
                    reason:
                        type === 'high'
                            ? 'Regular weekly health maintenance and chronic condition management'
                            : type === 'regular'
                              ? 'Monthly wellness routine and preventive care'
                              : 'Emergency health needs and symptom relief',
                });
            }

            return orderHistory.reverse(); // Most recent first
        };

        switch (type) {
            case 'high':
                return {
                    title: 'High Frequency Buyers',
                    description: 'Customers who order weekly (2,456 customers)',
                    frequency: 'Weekly',
                    totalCustomers: 2456,
                    avgOrdersPerMonth: 4.3,
                    avgSpentPerMonth: 980.5,
                    topCategories: [
                        'Baby Care Products',
                        'Chronic Medications',
                        'Prescription Medicines',
                        'Medical Devices',
                        'Diabetes Supplies',
                    ],

                    customers: generateSampleCustomers('high', 50),
                };

            case 'regular':
                return {
                    title: 'Regular Buyers',
                    description: 'Customers who order monthly (8,234 customers)',
                    frequency: 'Monthly',
                    totalCustomers: 8234,
                    avgOrdersPerMonth: 1.2,
                    avgSpentPerMonth: 285.75,
                    topCategories: [
                        'Supplements & Vitamins',
                        'Skincare Products',
                        'General Health',
                        'Wellness Products',
                        'Beauty Care',
                    ],

                    customers: generateSampleCustomers('regular', 50),
                };

            case 'occasional':
                return {
                    title: 'Occasional Buyers',
                    description: 'Customers who order occasionally (5,157 customers)',
                    frequency: 'Occasionally',
                    totalCustomers: 5157,
                    avgOrdersPerMonth: 0.3,
                    avgSpentPerMonth: 125.25,
                    topCategories: [
                        'Pain Relief',
                        'Emergency Medicines',
                        'First Aid',
                        'Cold & Flu',
                        'Allergy Relief',
                    ],

                    customers: generateSampleCustomers('occasional', 50),
                };

            default:
                return null;
        }
    };

    const exportCategoryAnalysis = async (format: 'csv' | 'excel') => {
        const categoryData = [
            {
                'Category Name': 'Prescription Medicines',
                'Total Orders': 298,
                'Percentage of Total': '29%',
                Rank: 1,
                'Category Type': 'Essential Healthcare',
            },
            {
                'Category Name': 'Supplements & Vitamins',
                'Total Orders': 659,
                'Percentage of Total': '14%',
                Rank: 2,
                'Category Type': 'Wellness',
            },
            {
                'Category Name': 'Baby Care Products',
                'Total Orders': 584,
                'Percentage of Total': '10%',
                Rank: 3,
                'Category Type': 'Family Care',
            },
            {
                'Category Name': 'Skincare Products',
                'Total Orders': 352,
                'Percentage of Total': '15%',
                Rank: 4,
                'Category Type': 'Personal Care',
            },
            {
                'Category Name': 'Pain Relief',
                'Total Orders': 493,
                'Percentage of Total': '33%',
                Rank: 5,
                'Category Type': 'Emergency Care',
            },
        ];

        const exportData = {
            title: 'Product Category Analysis Report',
            subtitle: 'Most purchased product categories by customers',
            generatedAt: new Date().toISOString(),
            generatedBy: 'Admin Dashboard',
            data: categoryData,
        };

        await reportExportService.exportReport(exportData, { format });
    };

    const handleCustomerClick = (customer: any) => {
        // Debug: Log the customer data to see what's being passed
        console.log('Customer clicked:', {
            id: customer.id,
            name: customer.name,
            totalOrders: customer.totalOrders,
            orderHistoryLength: customer.orderHistory?.length,
            hasOrderHistory: !!customer.orderHistory,
        });

        setSelectedCustomer(customer);
        setIsCustomerModalOpen(true);
    };

    const handleCloseCustomerModal = () => {
        setSelectedCustomer(null);
        setIsCustomerModalOpen(false);
    };

    const exportOrderTimingData = async (format: 'csv' | 'excel') => {
        if (!orderTiming) return;

        // Calculate totals and insights
        const totalHourlyOrders = orderTiming.hourlyDistribution.reduce(
            (sum, h) => sum + h.orders,
            0,
        );
        const totalDailyOrders = orderTiming.dailyDistribution.reduce(
            (sum, d) => sum + d.orders,
            0,
        );
        const totalMonthlyOrders = orderTiming.monthlyDistribution.reduce(
            (sum, m) => sum + m.orders,
            0,
        );

        // Find peak times
        const peakHour = orderTiming.hourlyDistribution.reduce((max, h) =>
            h.orders > max.orders ? h : max,
        );
        const peakDay = orderTiming.dailyDistribution.reduce((max, d) =>
            d.orders > max.orders ? d : max,
        );
        const peakMonth = orderTiming.monthlyDistribution.reduce((max, m) =>
            m.orders > max.orders ? m : max,
        );

        // Prepare comprehensive export data
        const exportData = {
            title: 'Order Timing Analytics Report',
            subtitle: 'Complete analysis of customer order timing patterns',
            generatedAt: new Date().toISOString(),
            generatedBy: 'CURA Administrator',
            data: {
                summary: {
                    peakHour: `${peakHour.hour}:00 (${peakHour.orders} orders)`,
                    peakDay: `${peakDay.day} (${peakDay.orders.toLocaleString()} orders)`,
                    peakMonth: `${peakMonth.month} (${peakMonth.orders.toLocaleString()} orders)`,
                    totalHourlyOrders: totalHourlyOrders.toLocaleString(),
                    totalDailyOrders: totalDailyOrders.toLocaleString(),
                    totalMonthlyOrders: totalMonthlyOrders.toLocaleString(),
                    averageHourlyOrders: Math.round(
                        totalHourlyOrders / orderTiming.hourlyDistribution.length,
                    ),
                    averageDailyOrders: Math.round(
                        totalDailyOrders / orderTiming.dailyDistribution.length,
                    ),
                    averageMonthlyOrders: Math.round(
                        totalMonthlyOrders / orderTiming.monthlyDistribution.length,
                    ),
                },
                hourlyDistribution: orderTiming.hourlyDistribution.map((item) => ({
                    hour: `${item.hour}:00`,
                    orders: item.orders,
                    percentage: `${((item.orders / totalHourlyOrders) * 100).toFixed(1)}%`,
                    timeOfDay:
                        item.hour < 12 ? 'Morning' : item.hour < 17 ? 'Afternoon' : 'Evening',
                })),
                dailyDistribution: orderTiming.dailyDistribution.map((item) => ({
                    day: item.day,
                    orders: item.orders,
                    percentage: `${((item.orders / totalDailyOrders) * 100).toFixed(1)}%`,
                    isWeekend: ['Saturday', 'Sunday'].includes(item.day) ? 'Yes' : 'No',
                })),
                monthlyDistribution: orderTiming.monthlyDistribution.map((item) => ({
                    month: item.month,
                    orders: item.orders,
                    percentage: `${((item.orders / totalMonthlyOrders) * 100).toFixed(1)}%`,
                    quarter: Math.ceil(
                        [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                            'Aug',
                            'Sep',
                            'Oct',
                            'Nov',
                            'Dec',
                        ].indexOf(item.month) / 3,
                    ),
                })),
            },
            metadata: {
                reportType: 'Order Timing Analytics',
                dateRange: 'Last 6 months',
                totalDataPoints:
                    orderTiming.hourlyDistribution.length +
                    orderTiming.dailyDistribution.length +
                    orderTiming.monthlyDistribution.length,
                peakHourOrders: peakHour.orders,
                peakDayOrders: peakDay.orders,
                peakMonthOrders: peakMonth.orders,
                insights: [
                    `Peak ordering time is ${peakHour.hour}:00 with ${peakHour.orders} orders`,
                    `${peakDay.day} is the busiest day with ${peakDay.orders.toLocaleString()} orders`,
                    `${peakMonth.month} shows highest monthly activity with ${peakMonth.orders.toLocaleString()} orders`,
                    `Evening hours (17:00-22:00) account for ${Math.round((orderTiming.hourlyDistribution.filter((h) => h.hour >= 17 && h.hour <= 22).reduce((sum, h) => sum + h.orders, 0) / totalHourlyOrders) * 100)}% of daily orders`,
                    `Weekend days account for ${Math.round((orderTiming.dailyDistribution.filter((d) => ['Saturday', 'Sunday'].includes(d.day)).reduce((sum, d) => sum + d.orders, 0) / totalDailyOrders) * 100)}% of weekly orders`,
                ],
            },
        };

        try {
            await reportExportService.exportReport(exportData, {
                format: format,
                filename: `order-timing-analytics-${new Date().toISOString().split('T')[0]}`,
                includeMetadata: true,
                includeCharts: false,
            });
        } catch (error) {
            console.error('Export failed:', error);
            // Fallback export
            const timestamp = new Date().toISOString().split('T')[0];
            let csvContent = '';

            if (format === 'csv') {
                csvContent = `Order Timing Analytics Report
Generated: ${new Date().toLocaleString()}
Generated By: CURA Administrator

SUMMARY
Metric,Value,Description
Peak Hour,${peakHour.hour}:00,${peakHour.orders} orders placed
Peak Day,${peakDay.day},${peakDay.orders.toLocaleString()} orders placed
Peak Month,${peakMonth.month},${peakMonth.orders.toLocaleString()} orders placed
Total Hourly Orders,${totalHourlyOrders.toLocaleString()},Sum of all hourly orders
Total Daily Orders,${totalDailyOrders.toLocaleString()},Sum of all daily orders
Total Monthly Orders,${totalMonthlyOrders.toLocaleString()},Sum of all monthly orders

HOURLY DISTRIBUTION
Hour,Orders,Percentage,Time of Day
${orderTiming.hourlyDistribution
    .map(
        (item) =>
            `${item.hour}:00,${item.orders},${((item.orders / totalHourlyOrders) * 100).toFixed(1)}%,${item.hour < 12 ? 'Morning' : item.hour < 17 ? 'Afternoon' : 'Evening'}`,
    )
    .join('\n')}

DAILY DISTRIBUTION
Day,Orders,Percentage,Is Weekend
${orderTiming.dailyDistribution
    .map(
        (item) =>
            `${item.day},${item.orders},${((item.orders / totalDailyOrders) * 100).toFixed(1)}%,${['Saturday', 'Sunday'].includes(item.day) ? 'Yes' : 'No'}`,
    )
    .join('\n')}

MONTHLY DISTRIBUTION
Month,Orders,Percentage,Quarter
${orderTiming.monthlyDistribution
    .map(
        (item) =>
            `${item.month},${item.orders},${((item.orders / totalMonthlyOrders) * 100).toFixed(1)}%,Q${Math.ceil(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(item.month) / 3)}`,
    )
    .join('\n')}`;
            } else {
                csvContent =
                    '\uFEFF' +
                    `"Order Timing Analytics Report"
"Generated","${new Date().toLocaleString()}"
"Generated By","CURA Administrator"

"SUMMARY"
"Metric","Value","Description"
"Peak Hour","${peakHour.hour}:00","${peakHour.orders} orders placed"
"Peak Day","${peakDay.day}","${peakDay.orders.toLocaleString()} orders placed"
"Peak Month","${peakMonth.month}","${peakMonth.orders.toLocaleString()} orders placed"
"Total Hourly Orders","${totalHourlyOrders.toLocaleString()}","Sum of all hourly orders"
"Total Daily Orders","${totalDailyOrders.toLocaleString()}","Sum of all daily orders"
"Total Monthly Orders","${totalMonthlyOrders.toLocaleString()}","Sum of all monthly orders"

"HOURLY DISTRIBUTION"
"Hour","Orders","Percentage","Time of Day"
${orderTiming.hourlyDistribution
    .map(
        (item) =>
            `"${item.hour}:00",${item.orders},"${((item.orders / totalHourlyOrders) * 100).toFixed(1)}%","${item.hour < 12 ? 'Morning' : item.hour < 17 ? 'Afternoon' : 'Evening'}"`,
    )
    .join('\n')}

"DAILY DISTRIBUTION"
"Day","Orders","Percentage","Is Weekend"
${orderTiming.dailyDistribution
    .map(
        (item) =>
            `"${item.day}",${item.orders},"${((item.orders / totalDailyOrders) * 100).toFixed(1)}%","${['Saturday', 'Sunday'].includes(item.day) ? 'Yes' : 'No'}"`,
    )
    .join('\n')}

"MONTHLY DISTRIBUTION"
"Month","Orders","Percentage","Quarter"
${orderTiming.monthlyDistribution
    .map(
        (item) =>
            `"${item.month}",${item.orders},"${((item.orders / totalMonthlyOrders) * 100).toFixed(1)}%","Q${Math.ceil(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(item.month) / 3)}"`,
    )
    .join('\n')}`;
            }

            const blob = new Blob([csvContent], {
                type:
                    format === 'csv'
                        ? 'text/csv;charset=utf-8;'
                        : 'application/vnd.ms-excel;charset=utf-8;',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `order-timing-analytics-${timestamp}.${format === 'csv' ? 'csv' : 'xls'}`;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    const exportSpecificFrequencyData = async (
        type: 'high' | 'regular' | 'occasional',
        format: 'csv' | 'excel',
    ) => {
        const details = getFrequencyDetails(type);
        if (!details) return;

        // Generate comprehensive customer data for the specific frequency type
        const generateComprehensiveCustomerData = (
            baseCustomers: any[],
            totalCustomers: number,
            frequency: string,
        ) => {
            const expandedCustomers = [...baseCustomers];

            // Generate additional customers to match the total count (limit to 1000 for performance)
            const additionalCustomersNeeded = Math.min(totalCustomers - baseCustomers.length, 1000);

            for (let i = 0; i < additionalCustomersNeeded; i++) {
                const customerIndex = baseCustomers.length + i + 1;
                const cities = [
                    'Cairo',
                    'Alexandria',
                    'Giza',
                    'Ismailia',
                    'Suez',
                    'Port Said',
                    'Mansoura',
                    'Tanta',
                    'Aswan',
                    'Luxor',
                ];

                const randomCity = cities[Math.floor(Math.random() * cities.length)];

                // Generate realistic names
                const firstNames = [
                    'Ahmed',
                    'Mohamed',
                    'Fatima',
                    'Yasmin',
                    'Omar',
                    'Nour',
                    'Hassan',
                    'Mona',
                    'Ali',
                    'Sara',
                    'Mahmoud',
                    'Dina',
                    'Khaled',
                    'Aya',
                    'Amr',
                ];

                const lastNames = [
                    'Hassan',
                    'Mohamed',
                    'Ali',
                    'Farouk',
                    'Saeed',
                    'Ibrahim',
                    'Mahmoud',
                    'Abdel Rahman',
                    'El Sayed',
                    'Mostafa',
                    'Abdel Aziz',
                    'El Shamy',
                    'Rashad',
                    'Nasser',
                    'Salah',
                ];

                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const fullName = `${firstName} ${lastName}`;

                const newCustomer = {
                    id: `${type.substring(0, 2).toUpperCase()}-${customerIndex.toString().padStart(4, '0')}`,
                    name: fullName,
                    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
                    phone: `+20 10${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`,
                    city: randomCity,
                    totalOrders:
                        frequency === 'Weekly'
                            ? Math.floor(Math.random() * 30) + 10
                            : frequency === 'Monthly'
                              ? Math.floor(Math.random() * 15) + 5
                              : Math.floor(Math.random() * 8) + 1,
                    totalSpent:
                        frequency === 'Weekly'
                            ? Math.floor(Math.random() * 8000) + 2000
                            : frequency === 'Monthly'
                              ? Math.floor(Math.random() * 4000) + 1000
                              : Math.floor(Math.random() * 1500) + 200,
                    lastOrder: new Date(
                        Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
                    )
                        .toISOString()
                        .split('T')[0],
                    avgOrderValue:
                        frequency === 'Weekly'
                            ? Math.floor(Math.random() * 200) + 150
                            : frequency === 'Monthly'
                              ? Math.floor(Math.random() * 150) + 100
                              : Math.floor(Math.random() * 100) + 50,
                    frequency: frequency,
                    nextExpectedOrder:
                        frequency === 'Weekly'
                            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                  .toISOString()
                                  .split('T')[0]
                            : frequency === 'Monthly'
                              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                    .toISOString()
                                    .split('T')[0]
                              : 'Unknown',
                    preferredProducts:
                        frequency === 'Weekly'
                            ? [
                                  'Baby Formula',
                                  'Insulin',
                                  'Chronic Medication',
                                  'Diabetes Supplies',
                                  'Blood Pressure Monitor',
                              ]
                            : frequency === 'Monthly'
                              ? [
                                    'Vitamin C',
                                    'Skincare Cream',
                                    'Omega-3',
                                    'Multivitamins',
                                    'Protein Powder',
                                ]
                              : [
                                    'Panadol',
                                    'Bandages',
                                    'Cough Syrup',
                                    'Antiseptic',
                                    'Throat Lozenges',
                                ],

                    orderHistory: generateOrderHistory(
                        frequency,
                        Math.floor(Math.random() * 15) + 3,
                    ),
                };

                expandedCustomers.push(newCustomer);
            }

            return expandedCustomers;
        };

        // Helper function to generate order history
        const generateOrderHistory = (frequency: string, orderCount: number) => {
            const orderHistory = [];
            const products = {
                Weekly: [
                    { name: 'Baby Formula Premium', price: 85, category: 'Baby Care' },
                    { name: 'Insulin Pen Refills', price: 120, category: 'Prescription' },
                    { name: 'Chronic Medication Pack', price: 95, category: 'Prescription' },
                    { name: 'Baby Diapers Large', price: 65, category: 'Baby Care' },
                    { name: 'Diabetes Test Strips', price: 75, category: 'Medical Devices' },
                    { name: 'Blood Pressure Monitor', price: 150, category: 'Medical Devices' },
                    { name: 'Baby Food Jars', price: 45, category: 'Baby Care' },
                    { name: 'Insulin Syringes', price: 35, category: 'Medical Devices' },
                ],

                Monthly: [
                    { name: 'Vitamin C 1000mg', price: 65, category: 'Supplements' },
                    { name: 'Anti-Aging Night Cream', price: 125, category: 'Skincare' },
                    { name: 'Hyaluronic Acid Serum', price: 95, category: 'Skincare' },
                    { name: 'Omega-3 Fish Oil', price: 85, category: 'Supplements' },
                    { name: 'Multivitamin Complex', price: 55, category: 'Supplements' },
                    { name: 'Collagen Powder', price: 110, category: 'Supplements' },
                    { name: 'Vitamin D3 Tablets', price: 40, category: 'Supplements' },
                    { name: 'Moisturizing Face Cream', price: 75, category: 'Skincare' },
                ],

                Occasionally: [
                    { name: 'Panadol Extra 500mg', price: 45, category: 'Pain Relief' },
                    { name: 'Cough Syrup', price: 35, category: 'Cold & Flu' },
                    { name: 'Antiseptic Solution', price: 25, category: 'First Aid' },
                    { name: 'Bandages Pack', price: 30, category: 'First Aid' },
                    { name: 'Throat Lozenges', price: 20, category: 'Cold & Flu' },
                    { name: 'Fever Reducer Tablets', price: 28, category: 'Pain Relief' },
                    { name: 'Nasal Decongestant', price: 32, category: 'Cold & Flu' },
                    { name: 'Muscle Pain Relief Gel', price: 38, category: 'Pain Relief' },
                ],
            };

            const productList =
                products[frequency as keyof typeof products] || products['Occasionally'];

            for (let i = 0; i < orderCount; i++) {
                const daysAgo =
                    frequency === 'Weekly'
                        ? i * 7 + Math.floor(Math.random() * 3)
                        : frequency === 'Monthly'
                          ? i * 30 + Math.floor(Math.random() * 7)
                          : i * 60 + Math.floor(Math.random() * 30);
                const orderDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

                const itemCount = Math.floor(Math.random() * 4) + 1;
                const items = [];
                let totalAmount = 0;

                for (let j = 0; j < itemCount; j++) {
                    const product = productList[Math.floor(Math.random() * productList.length)];
                    const quantity = Math.floor(Math.random() * 3) + 1;
                    items.push({
                        product: product.name,
                        quantity: quantity,
                        price: product.price,
                    });
                    totalAmount += quantity * product.price;
                }

                orderHistory.push({
                    orderDate: orderDate.toISOString().split('T')[0],
                    orderId: `ORD-${type.toUpperCase()}-${Date.now()}-${i.toString().padStart(3, '0')}`,
                    items: items,
                    totalAmount: totalAmount,
                    reason:
                        frequency === 'Weekly'
                            ? 'Regular weekly health maintenance and chronic condition management'
                            : frequency === 'Monthly'
                              ? 'Monthly wellness routine and preventive care'
                              : 'Emergency health needs and symptom relief',
                });
            }

            return orderHistory.reverse(); // Most recent first
        };

        // Generate expanded customer data
        const expandedCustomers = generateComprehensiveCustomerData(
            details.customers,
            details.totalCustomers,
            details.frequency,
        );

        const orderHistoryData: any[] = [];
        expandedCustomers.forEach((customer) => {
            if (customer.orderHistory) {
                customer.orderHistory.forEach((order: any, orderIndex: number) => {
                    order.items.forEach((item: any, itemIndex: number) => {
                        const orderDate = new Date(order.orderDate);
                        const daysSinceLastOrder =
                            orderIndex > 0
                                ? Math.floor(
                                      (orderDate.getTime() -
                                          new Date(
                                              customer.orderHistory![orderIndex - 1].orderDate,
                                          ).getTime()) /
                                          (1000 * 60 * 60 * 24),
                                  )
                                : 'First Order';

                        orderHistoryData.push({
                            // Frequency Type Information
                            'Customer Type': details.title,
                            'Type Description': details.description,
                            'Order Frequency': details.frequency,
                            'Main Product Categories': details.topCategories.join(' | '),
                            'Total Customers in This Type': details.totalCustomers.toLocaleString(),
                            'Avg Orders Per Month for Type': details.avgOrdersPerMonth,
                            'Avg Monthly Spending for Type (EGP)': details.avgSpentPerMonth,

                            // Customer Information
                            'Customer ID': customer.id,
                            'Customer Name': customer.name,
                            'Customer Email': customer.email,
                            'Customer Phone': customer.phone,
                            'Customer WhatsApp': customer.phone, // Same as phone
                            'Customer City': customer.city,
                            'Customer Registration Date': new Date(
                                Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
                            )
                                .toISOString()
                                .split('T')[0],
                            'Customer Status': 'Active',
                            'Customer Frequency Type': customer.frequency,
                            'Customer Total Orders': customer.totalOrders,
                            'Customer Total Spent (EGP)': customer.totalSpent.toFixed(2),
                            'Customer Avg Order Value (EGP)': customer.avgOrderValue.toFixed(2),
                            'Customer Last Order Date': customer.lastOrder,
                            'Customer Next Expected Order': customer.nextExpectedOrder,
                            'Customer Preferred Products': customer.preferredProducts.join(' | '),

                            // Order Information
                            'Order Number for Customer': orderIndex + 1,
                            'Order ID': order.orderId,
                            'Order Date': order.orderDate,
                            'Order Day of Week': orderDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                            }),
                            'Order Month': orderDate.toLocaleDateString('en-US', { month: 'long' }),
                            'Order Year': orderDate.getFullYear(),
                            'Order Time': orderDate.toLocaleTimeString(),
                            'Days Since Last Order': daysSinceLastOrder,
                            'Order Total Amount (EGP)': order.totalAmount.toFixed(2),
                            'Order Reason/Purpose': order.reason,
                            'Total Items in Order': order.items.length,

                            // Product Information
                            'Item Number in Order': itemIndex + 1,
                            'Product Name': item.product,
                            'Product Category': getProductCategory(item.product),
                            'Is Prescription Product': isPrescriptionProduct(item.product)
                                ? 'Yes'
                                : 'No',
                            'Product Quantity Ordered': item.quantity,
                            'Product Unit Price (EGP)': item.price.toFixed(2),
                            'Product Total Price (EGP)': (item.quantity * item.price).toFixed(2),
                            'Product Percentage of Order':
                                (((item.quantity * item.price) / order.totalAmount) * 100).toFixed(
                                    1,
                                ) + '%',

                            // Time Analytics
                            'Order Month Number': orderDate.getMonth() + 1,
                            'Order Quarter': Math.ceil((orderDate.getMonth() + 1) / 3),
                            'Is Weekend Order': [0, 6].includes(orderDate.getDay()) ? 'Yes' : 'No',
                            'Order Hour (24h)': orderDate.getHours(),
                            'Time of Day':
                                orderDate.getHours() < 12
                                    ? 'Morning'
                                    : orderDate.getHours() < 17
                                      ? 'Afternoon'
                                      : 'Evening',
                            Season:
                                Math.ceil((orderDate.getMonth() + 1) / 3) === 1
                                    ? 'Winter'
                                    : Math.ceil((orderDate.getMonth() + 1) / 3) === 2
                                      ? 'Spring'
                                      : Math.ceil((orderDate.getMonth() + 1) / 3) === 3
                                        ? 'Summer'
                                        : 'Fall',

                            // Additional Analytics
                            'Is First Order': orderIndex === 0 ? 'Yes' : 'No',
                            'Customer Loyalty Level':
                                customer.totalOrders > 20
                                    ? 'High'
                                    : customer.totalOrders > 10
                                      ? 'Medium'
                                      : 'Low',
                            'Order Value Category':
                                order.totalAmount > 300
                                    ? 'High Value'
                                    : order.totalAmount > 150
                                      ? 'Medium Value'
                                      : 'Low Value',
                        });
                    });
                });
            }
        });

        const exportData = {
            title: `${details.title} - Complete Customer and Order Analysis`,
            subtitle: `Comprehensive data for ${details.frequency.toLowerCase()} buyers including ${expandedCustomers.length.toLocaleString()} customers with complete order histories and product details - ${orderHistoryData.length.toLocaleString()} detailed order items from ${details.totalCustomers.toLocaleString()} total customers in this category`,
            generatedAt: new Date().toISOString(),
            generatedBy: 'CURA Admin Dashboard - Customer Analytics',
            data: orderHistoryData,
        };

        await reportExportService.exportReport(exportData, { format });
    };

    if (isLoading || !analytics) {
        return (
            <div className="space-y-6" data-oid="vhmv2cr">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="mwwkfb3">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-xl h-32"
                            data-oid="i-5ugh5"
                        ></div>
                    ))}
                </div>
                <div className="bg-gray-200 animate-pulse rounded-xl h-96" data-oid="re:d4sb"></div>
            </div>
        );
    }

    const chartConfig = {
        mobile: { label: 'Mobile', color: 'hsl(var(--chart-1))' },
        desktop: { label: 'Desktop', color: 'hsl(var(--chart-2))' },
        total: { label: 'Total Visitors', color: 'hsl(var(--chart-3))' },
    };

    return (
        <div className="space-y-6" data-oid="8e5nlcg">
            <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as any)}
                className="w-full"
                data-oid="ok3_50k"
            >
                <TabsList
                    className="grid w-full grid-cols-4 bg-white rounded-xl shadow-sm border border-gray-100 p-1"
                    data-oid="-:9yv5n"
                >
                    <TabsTrigger
                        value="analytics"
                        className="flex items-center gap-2"
                        data-oid="33vvktp"
                    >
                        <BarChart3 className="h-4 w-4" data-oid="c_lkz7n" />
                        Analytics Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="customers"
                        className="flex items-center gap-2"
                        data-oid="cwq..wb"
                    >
                        <Users className="h-4 w-4" data-oid="y-aozqw" />
                        Customer Data
                    </TabsTrigger>
                    <TabsTrigger
                        value="products"
                        className="flex items-center gap-2"
                        data-oid="10q55q-"
                    >
                        <ShoppingBag className="h-4 w-4" data-oid="w_rxeoa" />
                        Product Patterns
                    </TabsTrigger>
                    <TabsTrigger
                        value="timing"
                        className="flex items-center gap-2"
                        data-oid="xeuqg9c"
                    >
                        <Clock className="h-4 w-4" data-oid="wrv7o7f" />
                        Order Timing
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="space-y-6" data-oid="tqulo8c">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="jqqzl7t">
                        <Card
                            className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/10 border-cura-primary/20 hover:shadow-cura transition-all duration-300"
                            data-oid="0:zrhgy"
                        >
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2"
                                data-oid="sv10m_n"
                            >
                                <CardTitle
                                    className="text-sm font-semibold text-cura-primary"
                                    data-oid="bns9bcy"
                                >
                                    Total Customers
                                </CardTitle>
                                <div
                                    className="p-2 bg-cura-primary/10 rounded-lg"
                                    data-oid="3ng1asg"
                                >
                                    <Users
                                        className="h-5 w-5 text-cura-primary"
                                        data-oid="athax.7"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid="zg.xiup">
                                <div
                                    className="text-3xl font-bold text-cura-primary mb-1"
                                    data-oid="b9_jng1"
                                >
                                    {analytics.totalCustomers.toLocaleString()}
                                </div>
                                <p
                                    className="text-xs text-cura-primary/70 flex items-center gap-1"
                                    data-oid="v8vejdr"
                                >
                                    <TrendingUp className="h-3 w-3" data-oid="g0kt_rw" />
                                    +12% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300"
                            data-oid="jqhse9:"
                        >
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2"
                                data-oid="36ag1y1"
                            >
                                <CardTitle
                                    className="text-sm font-semibold text-emerald-700"
                                    data-oid="76ea8cu"
                                >
                                    Active Customers
                                </CardTitle>
                                <div className="p-2 bg-emerald-100 rounded-lg" data-oid="5o0x3ua">
                                    <UserCheck
                                        className="h-5 w-5 text-emerald-600"
                                        data-oid=":.yphak"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid=".rjivpj">
                                <div
                                    className="text-3xl font-bold text-emerald-800 mb-1"
                                    data-oid="oo:jxmn"
                                >
                                    {analytics.activeCustomers.toLocaleString()}
                                </div>
                                <p
                                    className="text-xs text-emerald-600 flex items-center gap-1"
                                    data-oid="q125f_3"
                                >
                                    <TrendingUp className="h-3 w-3" data-oid=":n2wpu." />
                                    +8% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-300"
                            data-oid="n3bt7jd"
                        >
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2"
                                data-oid="4vox0xd"
                            >
                                <CardTitle
                                    className="text-sm font-semibold text-amber-700"
                                    data-oid="bol3hy1"
                                >
                                    Avg Order Value
                                </CardTitle>
                                <div className="p-2 bg-amber-100 rounded-lg" data-oid="a4ok2jr">
                                    <DollarSign
                                        className="h-5 w-5 text-amber-600"
                                        data-oid="j-8051c"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid=".crnwnk">
                                <div
                                    className="text-3xl font-bold text-amber-800 mb-1"
                                    data-oid="37y61hn"
                                >
                                    EGP NA
                                </div>
                                <p
                                    className="text-xs text-amber-600 flex items-center gap-1"
                                    data-oid="6q0ml5u"
                                >
                                    <TrendingUp className="h-3 w-3" data-oid=".x20wth" />
                                    +5.2% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 hover:shadow-lg transition-all duration-300"
                            data-oid="wsfpesy"
                        >
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2"
                                data-oid="186cfis"
                            >
                                <CardTitle
                                    className="text-sm font-semibold text-violet-700"
                                    data-oid="f2gbxnu"
                                >
                                    Retention Rate
                                </CardTitle>
                                <div className="p-2 bg-violet-100 rounded-lg" data-oid="vk2e941">
                                    <Repeat
                                        className="h-5 w-5 text-violet-600"
                                        data-oid="7p_4p:h"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid="yqh_-26">
                                <div
                                    className="text-3xl font-bold text-violet-800 mb-1"
                                    data-oid="gh5srzp"
                                >
                                    {analytics.customerRetentionRate}%
                                </div>
                                <p
                                    className="text-xs text-violet-600 flex items-center gap-1"
                                    data-oid="4gapvio"
                                >
                                    <TrendingUp className="h-3 w-3" data-oid="dpn1684" />
                                    +2.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="f-p_9-z">
                        {/* Total Visitors Chart */}
                        <Card className="col-span-1 lg:col-span-2" data-oid=".h-jypu">
                            <CardHeader
                                className="flex flex-row items-center justify-between"
                                data-oid="o_ocv3m"
                            >
                                <div data-oid="ot361wd">
                                    <CardTitle className="text-lg font-semibold" data-oid="7snbh_i">
                                        Total Visitors
                                    </CardTitle>
                                    <CardDescription data-oid="4jprla1">
                                        Total for the last 3 months
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2" data-oid=":qphxfu">
                                    <Button
                                        variant={timeRange === '3m' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setTimeRange('3m');
                                        }}
                                        data-oid="ko_pn.s"
                                    >
                                        Last 3 months
                                    </Button>
                                    <Button
                                        variant={timeRange === '30d' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setTimeRange('30d');
                                        }}
                                        data-oid="3gmc3ny"
                                    >
                                        Last 30 days
                                    </Button>
                                    <Button
                                        variant={timeRange === '7d' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setTimeRange('7d');
                                        }}
                                        data-oid="f30cmkv"
                                    >
                                        Last 7 days
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent data-oid=".5.lltr">
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[300px] w-full"
                                    data-oid="800_:8x"
                                >
                                    <AreaChart data={visitorData} data-oid="0_j_.fp">
                                        <CartesianGrid strokeDasharray="3 3" data-oid="1ej8wao" />
                                        <XAxis dataKey="date" data-oid="w0uaryv" />
                                        <YAxis data-oid="ivhkw82" />
                                        <ChartTooltip
                                            content={<ChartTooltipContent data-oid="4-wpwo2" />}
                                            data-oid="251f2nn"
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="mobile"
                                            stackId="1"
                                            stroke="var(--color-mobile)"
                                            fill="var(--color-mobile)"
                                            fillOpacity={0.6}
                                            data-oid="635jksa"
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="desktop"
                                            stackId="1"
                                            stroke="var(--color-desktop)"
                                            fill="var(--color-desktop)"
                                            fillOpacity={0.6}
                                            data-oid="tyd46ba"
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* New Customers Card */}
                        <Card
                            className="bg-gradient-to-br from-cura-secondary to-cura-accent text-white hover:shadow-cura-lg transition-all duration-300"
                            data-oid="6kk6a-k"
                        >
                            <CardHeader data-oid="zqv.cr4">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="1sose2t"
                                >
                                    <CardTitle
                                        className="text-white font-semibold"
                                        data-oid="frmq7-m"
                                    >
                                        New Customers
                                    </CardTitle>
                                    <div className="p-2 bg-white/10 rounded-lg" data-oid="za3cdmd">
                                        <Activity
                                            className="h-5 w-5 text-white"
                                            data-oid="6lfcbvc"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2" data-oid=".l1y6op">
                                    <TrendingDown
                                        className="h-4 w-4 text-red-300"
                                        data-oid="k2i.7uc"
                                    />

                                    <span className="text-red-300 text-sm" data-oid="j.6c8r4">
                                        -20%
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent data-oid="sx.g5nm">
                                <div
                                    className="text-3xl font-bold text-white mb-2"
                                    data-oid="p:fzd9:"
                                >
                                    {analytics.newCustomersToday.toLocaleString()}
                                </div>
                                <p className="text-white/80 text-sm mb-1" data-oid="hlllowq">
                                    Down 20% this period
                                </p>
                                <p className="text-white/60 text-xs" data-oid="6hqkh7f">
                                    Acquisition needs attention
                                </p>
                            </CardContent>
                        </Card>

                        {/* Growth Rate Card */}
                        <Card
                            className="bg-gradient-to-br from-cura-primary to-cura-secondary text-white hover:shadow-cura-lg transition-all duration-300"
                            data-oid="jdihqxr"
                        >
                            <CardHeader data-oid="kn.z_:.">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="yy55xc4"
                                >
                                    <CardTitle
                                        className="text-white font-semibold"
                                        data-oid="mhee7gb"
                                    >
                                        Growth Rate
                                    </CardTitle>
                                    <div className="p-2 bg-white/10 rounded-lg" data-oid="ufrb2xq">
                                        <Target className="h-5 w-5 text-white" data-oid="aq8v.g5" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2" data-oid="or-k3h4">
                                    <TrendingUp
                                        className="h-4 w-4 text-green-300"
                                        data-oid="zfbyrju"
                                    />

                                    <span className="text-green-300 text-sm" data-oid="usg54bh">
                                        +4.5%
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent data-oid="_4t:nj:">
                                <div
                                    className="text-3xl font-bold text-white mb-2"
                                    data-oid="9krq5xg"
                                >
                                    {analytics.growthRate}%
                                </div>
                                <p className="text-white/80 text-sm mb-1" data-oid="2flkf5j">
                                    Steady performance increase
                                </p>
                                <p className="text-white/60 text-xs" data-oid="imufwit">
                                    Meets growth projections
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Product Categories and Purchase Frequency */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="t7x91:p">
                        <Card data-oid="12no2sk">
                            <CardHeader data-oid="as4iz4.">
                                <div
                                    className="flex justify-between items-center"
                                    data-oid="f1infw0"
                                >
                                    <CardTitle data-oid="yfyr6em">
                                        What Customers Buy Most
                                    </CardTitle>
                                    <div className="flex space-x-2" data-oid="2mikure">
                                        <Button
                                            onClick={() => exportCategoryAnalysis('csv')}
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center space-x-2 border-cura-primary/30 text-cura-primary hover:bg-cura-primary/5 hover:border-cura-primary transition-all duration-300"
                                            data-oid="n7awu1o"
                                        >
                                            <FileText className="h-4 w-4" data-oid="cssfewn" />
                                            <span data-oid="o-2ctik">CSV</span>
                                        </Button>
                                        <Button
                                            onClick={() => exportCategoryAnalysis('excel')}
                                            size="sm"
                                            className="flex items-center space-x-2 bg-cura-gradient hover:opacity-90 text-white transition-all duration-300 shadow-sm hover:shadow-md"
                                            data-oid="_99kulx"
                                        >
                                            <BarChart3 className="h-4 w-4" data-oid="1vvi6n7" />
                                            <span data-oid="iodujvf">Excel</span>
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent data-oid="ajbm0_2">
                                <div className="space-y-4" data-oid="df3_fux">
                                    {[
                                        {
                                            name: 'Prescription Medicines',
                                            orders: 298,
                                            percentage: 29,
                                        },
                                        {
                                            name: 'Supplements & Vitamins',
                                            orders: 659,
                                            percentage: 14,
                                        },
                                        { name: 'Baby Care Products', orders: 584, percentage: 10 },
                                        { name: 'Skincare Products', orders: 352, percentage: 15 },
                                        { name: 'Pain Relief', orders: 493, percentage: 33 },
                                    ].map((category, index) => (
                                        <div
                                            key={category.name}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            data-oid="r1r7zq0"
                                        >
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="n0inidd"
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                                    data-oid="rgccysp"
                                                >
                                                    {index + 1}
                                                </Badge>
                                                <span
                                                    className="font-medium text-gray-900"
                                                    data-oid="ageaj_n"
                                                >
                                                    {category.name}
                                                </span>
                                            </div>
                                            <div className="text-right" data-oid="ovk1tb8">
                                                <span
                                                    className="font-bold text-blue-600"
                                                    data-oid="-w8r13h"
                                                >
                                                    {category.orders} orders
                                                </span>
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="xmmtale"
                                                >
                                                    {category.percentage}% of total
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card data-oid="h2vi7s2">
                            <CardHeader data-oid="cwew6_y">
                                <div
                                    className="flex justify-between items-center"
                                    data-oid="2enh4y3"
                                >
                                    <CardTitle data-oid="4z0-ubl">
                                        Purchase Frequency Analysis
                                    </CardTitle>
                                    <div className="flex space-x-2" data-oid="7p6pso2">
                                        <Button
                                            onClick={() => exportFrequencyAnalysis('csv')}
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center space-x-2 border-cura-primary/30 text-cura-primary hover:bg-cura-primary/5 hover:border-cura-primary transition-all duration-300"
                                            data-oid="e-5h2y4"
                                        >
                                            <FileText className="h-4 w-4" data-oid="6j8qsrs" />
                                            <span data-oid="t0rb_4c">CSV</span>
                                        </Button>
                                        <Button
                                            onClick={() => exportFrequencyAnalysis('excel')}
                                            size="sm"
                                            className="flex items-center space-x-2 bg-cura-gradient hover:opacity-90 text-white transition-all duration-300 shadow-sm hover:shadow-md"
                                            data-oid="afg517d"
                                        >
                                            <BarChart3 className="h-4 w-4" data-oid="o1kaxqv" />
                                            <span data-oid="5-6xuf5">Excel</span>
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent data-oid="tjm-7uk">
                                <div className="space-y-4" data-oid="9y0beep">
                                    <div
                                        className="p-4 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors group"
                                        onClick={() => setSelectedFrequencyType('high')}
                                        data-oid="0y55:3s"
                                    >
                                        <div
                                            className="flex justify-between items-start"
                                            data-oid="x-8..45"
                                        >
                                            <div data-oid=":.3_bm8">
                                                <h4
                                                    className="font-semibold text-blue-900 mb-2"
                                                    data-oid=".h1c9_a"
                                                >
                                                    High Frequency Buyers
                                                </h4>
                                                <p
                                                    className="text-blue-700 text-sm font-medium"
                                                    data-oid="tjfkkbo"
                                                >
                                                    2,456 customers order weekly
                                                </p>
                                                <p
                                                    className="text-blue-600 text-xs"
                                                    data-oid="e-etal3"
                                                >
                                                    Mainly baby care and chronic medication
                                                </p>
                                            </div>
                                            <Eye
                                                className="h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                data-oid="ry6v16h"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="p-4 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors group"
                                        onClick={() => setSelectedFrequencyType('regular')}
                                        data-oid="l9kfkth"
                                    >
                                        <div
                                            className="flex justify-between items-start"
                                            data-oid="57izz9u"
                                        >
                                            <div data-oid="z:4clqo">
                                                <h4
                                                    className="font-semibold text-green-900 mb-2"
                                                    data-oid="ma8ml_z"
                                                >
                                                    Regular Buyers
                                                </h4>
                                                <p
                                                    className="text-green-700 text-sm font-medium"
                                                    data-oid="pga7nqi"
                                                >
                                                    8,234 customers order monthly
                                                </p>
                                                <p
                                                    className="text-green-600 text-xs"
                                                    data-oid="savml-5"
                                                >
                                                    Supplements and skincare products
                                                </p>
                                            </div>
                                            <Eye
                                                className="h-4 w-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                data-oid="o1y.ny3"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors group"
                                        onClick={() => setSelectedFrequencyType('occasional')}
                                        data-oid="qjw2wi7"
                                    >
                                        <div
                                            className="flex justify-between items-start"
                                            data-oid="qeo73ax"
                                        >
                                            <div data-oid="md0o43s">
                                                <h4
                                                    className="font-semibold text-yellow-900 mb-2"
                                                    data-oid="x6cc7lb"
                                                >
                                                    Occasional Buyers
                                                </h4>
                                                <p
                                                    className="text-yellow-700 text-sm font-medium"
                                                    data-oid="155ul25"
                                                >
                                                    5,157 customers order occasionally
                                                </p>
                                                <p
                                                    className="text-yellow-600 text-xs"
                                                    data-oid="2mv97xl"
                                                >
                                                    Pain relief and emergency medicines
                                                </p>
                                            </div>
                                            <Eye
                                                className="h-4 w-4 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                data-oid="u_tuqky"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="customers" className="space-y-6" data-oid="y9:.r4o">
                    <div className="flex justify-between items-center" data-oid="wcm5lk3">
                        <div data-oid="lh:p4d0">
                            <h2 className="text-2xl font-bold text-gray-900" data-oid="6u60if-">
                                All Customers Database
                            </h2>
                            <p className="text-gray-600" data-oid="ksu7..1">
                                Complete customer information with contact details, addresses,
                                WhatsApp numbers, and order histories ({customerData.length}{' '}
                                customers)
                            </p>
                        </div>
                        <div className="flex space-x-3" data-oid="1vvmt5w">
                            <Button
                                onClick={() => exportCustomerData('csv')}
                                variant="outline"
                                className="flex items-center space-x-2 border-cura-primary/30 text-cura-primary hover:bg-cura-primary/5 hover:border-cura-primary transition-all duration-300 shadow-sm hover:shadow-cura-sm"
                                data-oid="b..zcyy"
                            >
                                <FileText className="h-4 w-4" data-oid="6y..7wj" />
                                <span className="font-medium" data-oid="fm:1es.">
                                    Export CSV
                                </span>
                            </Button>
                            <Button
                                onClick={() => exportCustomerData('excel')}
                                className="flex items-center space-x-2 bg-cura-gradient hover:opacity-90 text-white transition-all duration-300 shadow-cura hover:shadow-cura-lg font-medium"
                                data-oid="i2f-fzh"
                            >
                                <Download className="h-4 w-4" data-oid="rwo:4bw" />
                                <span data-oid="jbs_ffz">Export Excel</span>
                            </Button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-oid="r5v2dun">
                        <Card
                            className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/10 border-cura-primary/20 hover:shadow-cura transition-all duration-300"
                            data-oid="5he1_ur"
                        >
                            <CardContent className="p-6" data-oid="zfn2nkk">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="350r02m"
                                >
                                    <div data-oid="pdtzagg">
                                        <p
                                            className="text-cura-primary text-sm font-medium"
                                            data-oid="4rozcdm"
                                        >
                                            Total Customers
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-cura-primary mb-1"
                                            data-oid="lqr0-nm"
                                        >
                                            {customerData.length}
                                        </p>
                                        <p
                                            className="text-xs text-cura-primary/70 flex items-center gap-1"
                                            data-oid="mgzhfq8"
                                        >
                                            <svg
                                                className="h-3 w-3"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="66v-q2s"
                                            >
                                                <path
                                                    d="M7 14l3-3 3 3 5-5-1.41-1.41L13 11.17 10 8.17 5.59 12.59z"
                                                    data-oid="6y0mg69"
                                                />
                                            </svg>
                                            +12% from last month
                                        </p>
                                    </div>
                                    <div
                                        className="p-3 bg-cura-primary/10 rounded-lg"
                                        data-oid="c8grgj:"
                                    >
                                        <svg
                                            className="h-8 w-8 text-cura-primary"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="ncxhtft"
                                        >
                                            <path
                                                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                                data-oid="v.0:744"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300"
                            data-oid=":0c.g9g"
                        >
                            <CardContent className="p-6" data-oid="y3tbhsj">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="kdp50rt"
                                >
                                    <div data-oid="pgpfsjp">
                                        <p
                                            className="text-emerald-600 text-sm font-medium"
                                            data-oid="lrb_a5z"
                                        >
                                            Active Customers
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-emerald-800 mb-1"
                                            data-oid="071i5oy"
                                        >
                                            {
                                                customerData.filter((c) => c.status === 'active')
                                                    .length
                                            }
                                        </p>
                                        <p
                                            className="text-xs text-emerald-600 flex items-center gap-1"
                                            data-oid="_z-olzu"
                                        >
                                            <svg
                                                className="h-3 w-3"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="mgxukcq"
                                            >
                                                <path
                                                    d="M7 14l3-3 3 3 5-5-1.41-1.41L13 11.17 10 8.17 5.59 12.59z"
                                                    data-oid="omemc87"
                                                />
                                            </svg>
                                            {Math.round(
                                                (customerData.filter((c) => c.status === 'active')
                                                    .length /
                                                    customerData.length) *
                                                    100,
                                            )}
                                            % active rate
                                        </p>
                                    </div>
                                    <div
                                        className="p-3 bg-emerald-100 rounded-lg"
                                        data-oid="m9f18s4"
                                    >
                                        <svg
                                            className="h-8 w-8 text-emerald-600"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="j7.3z6s"
                                        >
                                            <path
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                data-oid="ycg3zrv"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300"
                            data-oid="va3l:3:"
                        >
                            <CardContent className="p-6" data-oid="5w:9zzo">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid=".iyp8nw"
                                >
                                    <div data-oid="-a81cl7">
                                        <p
                                            className="text-purple-600 text-sm font-medium"
                                            data-oid="3an40ez"
                                        >
                                            Total Orders
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-purple-800 mb-1"
                                            data-oid="uw5x5aw"
                                        >
                                            {customerData
                                                .reduce((sum, c) => sum + c.totalOrders, 0)
                                                .toLocaleString()}
                                        </p>
                                        <p
                                            className="text-xs text-purple-600 flex items-center gap-1"
                                            data-oid="4ul:sj0"
                                        >
                                            <svg
                                                className="h-3 w-3"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="d8w3q81"
                                            >
                                                <path
                                                    d="M7 14l3-3 3 3 5-5-1.41-1.41L13 11.17 10 8.17 5.59 12.59z"
                                                    data-oid="d-erflt"
                                                />
                                            </svg>
                                            Avg{' '}
                                            {Math.round(
                                                customerData.reduce(
                                                    (sum, c) => sum + c.totalOrders,
                                                    0,
                                                ) / customerData.length,
                                            )}{' '}
                                            per customer
                                        </p>
                                    </div>
                                    <div
                                        className="p-3 bg-purple-100 rounded-lg"
                                        data-oid="1.l5ck3"
                                    >
                                        <svg
                                            className="h-8 w-8 text-purple-600"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="zhukxia"
                                        >
                                            <path
                                                d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                                                data-oid="ni9wk33"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card
                        className="border-cura-primary/20 shadow-cura-sm hover:shadow-cura transition-all duration-300"
                        data-oid="ce1_wrd"
                    >
                        <CardHeader
                            className="bg-gradient-to-r from-cura-primary/5 to-cura-secondary/5 border-b border-cura-primary/10"
                            data-oid="-grp97o"
                        >
                            <div className="flex items-center gap-3" data-oid="c4x0aru">
                                <div
                                    className="p-2 bg-cura-primary/10 rounded-lg"
                                    data-oid="clgs5on"
                                >
                                    <svg
                                        className="h-6 w-6 text-cura-primary"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="ilc2h7a"
                                    >
                                        <path
                                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                            data-oid="oay1oah"
                                        />
                                    </svg>
                                </div>
                                <div data-oid="wg4d22a">
                                    <CardTitle className="text-cura-primary" data-oid="5qbtnnr">
                                        CURA Customer Database
                                    </CardTitle>
                                    <CardDescription data-oid="rr8ndmk">
                                        Complete customer profiles with contact details, addresses,
                                        WhatsApp numbers, and comprehensive purchase history
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent data-oid="8ip0ryb">
                            <div className="overflow-x-auto" data-oid="f4bo77b">
                                <table
                                    className="min-w-full divide-y divide-gray-200"
                                    data-oid="xs:atik"
                                >
                                    <thead
                                        className="bg-gradient-to-r from-cura-primary/5 to-cura-secondary/5"
                                        data-oid="1h3qcw:"
                                    >
                                        <tr data-oid="y2f05if">
                                            <th
                                                className="px-6 py-4 text-left text-xs font-bold text-cura-primary uppercase tracking-wider border-b border-cura-primary/10"
                                                data-oid="kc69iyt"
                                            >
                                                <div
                                                    className="flex items-center gap-2"
                                                    data-oid="q8vdjr1"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="434zfeo"
                                                    >
                                                        <path
                                                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                                            data-oid="ts7lh:_"
                                                        />
                                                    </svg>
                                                    Customer Info
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-4 text-left text-xs font-bold text-cura-primary uppercase tracking-wider border-b border-cura-primary/10"
                                                data-oid="1450gmu"
                                            >
                                                <div
                                                    className="flex items-center gap-2"
                                                    data-oid="r2ks5fs"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="cnogxpn"
                                                    >
                                                        <path
                                                            d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                                                            data-oid=":.mkpzn"
                                                        />
                                                    </svg>
                                                    Contact Details
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-4 text-left text-xs font-bold text-cura-primary uppercase tracking-wider border-b border-cura-primary/10"
                                                data-oid="lc7.xur"
                                            >
                                                <div
                                                    className="flex items-center gap-2"
                                                    data-oid="qq.csyd"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="v2ekktw"
                                                    >
                                                        <path
                                                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                                            data-oid="xf8m_4m"
                                                        />
                                                    </svg>
                                                    Address & Location
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-4 text-left text-xs font-bold text-cura-primary uppercase tracking-wider border-b border-cura-primary/10"
                                                data-oid="obzc.xy"
                                            >
                                                <div
                                                    className="flex items-center gap-2"
                                                    data-oid="n._3bhq"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="94cf2f3"
                                                    >
                                                        <path
                                                            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                                                            data-oid=":z:3c.3"
                                                        />
                                                    </svg>
                                                    Order Statistics
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-4 text-left text-xs font-bold text-cura-primary uppercase tracking-wider border-b border-cura-primary/10"
                                                data-oid="gu1uiao"
                                            >
                                                <div
                                                    className="flex items-center gap-2"
                                                    data-oid="y8zwq1j"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="s35u7jp"
                                                    >
                                                        <path
                                                            d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                                                            data-oid="tfh0x79"
                                                        />
                                                    </svg>
                                                    Purchase Behavior
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-4 text-left text-xs font-bold text-cura-primary uppercase tracking-wider border-b border-cura-primary/10"
                                                data-oid="3bw2o-m"
                                            >
                                                <div
                                                    className="flex items-center gap-2"
                                                    data-oid="dacalho"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="6aeowl2"
                                                    >
                                                        <path
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            data-oid="bew3fr5"
                                                        />
                                                    </svg>
                                                    Status & Activity
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-gray-200"
                                        data-oid="5uihd1o"
                                    >
                                        {customerData.map((customer) => (
                                            <tr
                                                key={customer._id}
                                                className="hover:bg-gradient-to-r hover:from-cura-primary/5 hover:to-cura-secondary/5 cursor-pointer transition-all duration-200 border-b border-gray-100"
                                                onClick={() => handleCustomerClick(customer)}
                                                data-oid="jm0jn96"
                                            >
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="_ilpbv7"
                                                >
                                                    <div
                                                        className="flex items-center"
                                                        data-oid="ramfaa9"
                                                    >
                                                        <div
                                                            className="w-12 h-12 bg-gradient-to-br from-cura-primary to-cura-secondary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md"
                                                            data-oid="vwkj6c5"
                                                        >
                                                            {customer.name
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .join('')}
                                                        </div>
                                                        <div className="ml-4" data-oid="mf9eacn">
                                                            <div
                                                                className="text-sm font-semibold text-gray-900"
                                                                data-oid="_b4u_vp"
                                                            >
                                                                {customer.name}
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500 font-medium"
                                                                data-oid="mnak5_y"
                                                            >
                                                                {customer.id}
                                                            </div>
                                                            <div
                                                                className="text-xs text-gray-400"
                                                                data-oid="z6.rzyb"
                                                            >
                                                                Registered:{' '}
                                                                {new Date(
                                                                    customer.registeredAt,
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="5:h..li"
                                                >
                                                    <div className="space-y-1" data-oid="ciqrbma">
                                                        <div
                                                            className="flex items-center text-sm text-gray-900"
                                                            data-oid="8z.i0t1"
                                                        >
                                                            <Mail
                                                                className="h-3 w-3 mr-2 text-gray-400"
                                                                data-oid=".bp5tmx"
                                                            />

                                                            <span
                                                                className="truncate max-w-[200px]"
                                                                title={customer.email}
                                                                data-oid="mtdt18s"
                                                            >
                                                                {customer.email}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="flex items-center text-sm text-gray-600"
                                                            data-oid="kdk0v2g"
                                                        >
                                                            <Phone
                                                                className="h-3 w-3 mr-2 text-gray-400"
                                                                data-oid="eliq-d6"
                                                            />

                                                            <span data-oid=".5_lm:x">
                                                                {customer.phone}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="flex items-center text-sm text-green-600 font-medium"
                                                            data-oid="rl215c5"
                                                        >
                                                            <svg
                                                                className="h-4 w-4 mr-2 text-green-500"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="br8yx9d"
                                                            >
                                                                <path
                                                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"
                                                                    data-oid="c0sjrn7"
                                                                />
                                                            </svg>
                                                            <span data-oid="lfcbzqf">
                                                                {customer.whatsapp}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4" data-oid="c3zoni4">
                                                    <div className="space-y-1" data-oid="mjsgpli">
                                                        <div
                                                            className="flex items-start text-sm text-gray-900"
                                                            data-oid="dusr4h1"
                                                        >
                                                            <MapPin
                                                                className="h-3 w-3 mr-2 text-gray-400 mt-0.5 flex-shrink-0"
                                                                data-oid="ci5pq7t"
                                                            />

                                                            <span
                                                                className="max-w-[250px] break-words"
                                                                title={customer.addresses[0]?.city}
                                                                data-oid="_-7stz_"
                                                            >
                                                                {customer.addresses[0]?.street} { customer.addresses[0]?.city}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="flex items-center text-sm text-cura-primary font-medium ml-5"
                                                            data-oid="6bv9:6q"
                                                        >
                                                            <svg
                                                                className="h-4 w-4 mr-1 text-cura-primary"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="g2ooc69"
                                                            >
                                                                <path
                                                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                                                    data-oid="xdk0by1"
                                                                />
                                                            </svg>
                                                            {customer.cityId}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="06mxi:n"
                                                >
                                                    <div className="space-y-1" data-oid="o0yzrrp">
                                                        <div
                                                            className="flex items-center text-sm text-gray-900"
                                                            data-oid="j7kcb2y"
                                                        >
                                                            <ShoppingBag
                                                                className="h-3 w-3 mr-2 text-gray-400"
                                                                data-oid="zdf4goo"
                                                            />

                                                            <span
                                                                className="font-semibold"
                                                                data-oid="wqnx0p3"
                                                            >
                                                                {customer.totalOrders} orders
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="flex items-center text-sm font-bold text-cura-primary"
                                                            data-oid=".fp6.5r"
                                                        >
                                                            <svg
                                                                className="h-4 w-4 mr-1 text-cura-primary"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="kxm4ft8"
                                                            >
                                                                <path
                                                                    d="M7 15h7c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2zm5-9.5c1.38 0 2.5 1.12 2.5 2.5S13.38 10.5 12 10.5 9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                                                                    data-oid="ypq9vsw"
                                                                />
                                                            </svg>
                                                            EGP{' '}
                                                            {customer.totalSpent.toLocaleString()}
                                                        </div>
                                                        <div
                                                            className="text-xs text-gray-500"
                                                            data-oid="_wo9qnk"
                                                        >
                                                            Avg: EGP NA
                                                        </div>
                                                        <div
                                                            className="flex items-center text-xs text-cura-secondary font-medium"
                                                            data-oid="-4wa7s7"
                                                        >
                                                            <svg
                                                                className="h-3 w-3 mr-1 text-cura-secondary"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="mg2w-38"
                                                            >
                                                                <path
                                                                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                                                                    data-oid="29ra_9s"
                                                                />
                                                            </svg>
                                                            NA/month
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4" data-oid="hy5bu94">
                                                    <div className="space-y-2" data-oid="m7gvzqr">
                                                        <div
                                                            className="text-xs text-gray-500 font-medium"
                                                            data-oid="9ku9un."
                                                        >
                                                            Preferred Categories:
                                                        </div>
                                                        <div
                                                            className="flex flex-wrap gap-1"
                                                            data-oid="o46h_yq"
                                                        >
                                                            {customer?.preferredCategories
                                                                ?.slice(0, 2)
                                                                .map((category, idx) => (
                                                                    <Badge
                                                                        key={idx}
                                                                        variant="outline"
                                                                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                                                        data-oid="mwg153g"
                                                                    >
                                                                        {category}
                                                                    </Badge>
                                                                ))}
                                                            {customer.preferredCategories?.length >
                                                                2 && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-gray-50 text-gray-600"
                                                                    data-oid="2i-975."
                                                                >
                                                                    +
                                                                    {customer.preferredCategories
                                                                        ?.length - 2}{' '}
                                                                    more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div
                                                            className="text-xs text-gray-500 font-medium mt-2"
                                                            data-oid="0b1bvx3"
                                                        >
                                                            Top Products:
                                                        </div>
                                                        <div
                                                            className="space-y-1"
                                                            data-oid="zhfmxtv"
                                                        >
                                                            {customer.mostPurchasedProducts
                                                                ?.slice(0, 2)
                                                                .map((product, idx) => (
                                                                    <Badge
                                                                        key={idx}
                                                                        variant="secondary"
                                                                        className="text-xs bg-green-50 text-green-700 block w-fit"
                                                                        data-oid=".12zjyl"
                                                                    >
                                                                        {product.productName} (
                                                                        {product.frequency})
                                                                    </Badge>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="k46i913"
                                                >
                                                    <div className="space-y-2" data-oid="7uef3xr">
                                                        <Badge
                                                            variant={
                                                                customer.currentStatus === 'active'
                                                                    ? 'default'
                                                                    : customer.currentStatus === 'inactive'
                                                                      ? 'secondary'
                                                                      : 'destructive'
                                                            }
                                                            className={
                                                                customer.currentStatus === 'active'
                                                                    ? 'bg-green-100 text-green-800 border-green-200'
                                                                    : customer.currentStatus === 'inactive'
                                                                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                                      : 'bg-red-100 text-red-800 border-red-200'
                                                            }
                                                            data-oid="tq0ites"
                                                        >
                                                            {customer.currentStatus
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                customer.currentStatus.slice(1)}
                                                        </Badge>
                                                        <div
                                                            className="text-xs text-gray-500"
                                                            data-oid="epcwn-a"
                                                        >
                                                            Last Order:
                                                        </div>
                                                        <div
                                                            className="text-xs font-medium text-gray-700"
                                                            data-oid="_ho97ae"
                                                        >
                                                            {customer.order[customer.order.length-1]}
                                                        </div>
                                                        <div
                                                            className="text-xs text-gray-400"
                                                            data-oid="hn91cgc"
                                                        >
                                                            {Math.floor(
                                                                (Date.now() -
                                                                    new Date(
                                                                        customer.lastOrderAt || '',
                                                                    ).getTime()) /
                                                                    (1000 * 60 * 60 * 24),
                                                            )}{' '}
                                                            days ago
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-6" data-oid="39mdp_1">
                    <div className="flex justify-between items-center" data-oid="30v-0n4">
                        <div data-oid="a199t1w">
                            <h2 className="text-2xl font-bold text-gray-900" data-oid="wmc:4ri">
                                Frequent Product Buyers
                            </h2>
                            <p className="text-gray-600" data-oid="_g81rqh">
                                Customers who frequently purchase the same products
                            </p>
                        </div>
                        <div className="flex space-x-3" data-oid="01af2pm">
                            <Button
                                onClick={() => exportProductPatterns('csv')}
                                variant="outline"
                                className="flex items-center space-x-2 border-cura-primary/30 text-cura-primary hover:bg-cura-primary/5 hover:border-cura-primary transition-all duration-300 shadow-sm hover:shadow-cura-sm"
                                data-oid="eje.qaz"
                            >
                                <FileText className="h-4 w-4" data-oid="r5gxnle" />
                                <span className="font-medium" data-oid="27wofjo">
                                    Export CSV
                                </span>
                            </Button>
                            <Button
                                onClick={() => exportProductPatterns('excel')}
                                className="flex items-center space-x-2 bg-cura-gradient hover:opacity-90 text-white transition-all duration-300 shadow-cura hover:shadow-cura-lg font-medium"
                                data-oid="ezagncv"
                            >
                                <Download className="h-4 w-4" data-oid="sx67xlr" />
                                <span data-oid="idkhdc5">Export Excel</span>
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6" data-oid="_rnql_x">
                        {productPatterns.map((pattern) => (
                            <Card key={pattern.productName} data-oid="1301di:">
                                <CardHeader data-oid="o.sf:ua">
                                    <CardTitle data-oid="_4wztao">
                                        {pattern.productName} - Frequent Buyers
                                    </CardTitle>
                                    <CardDescription data-oid="aubitd5">
                                        Customers who regularly purchase this product
                                    </CardDescription>
                                </CardHeader>
                                <CardContent data-oid="ckz:1w9">
                                    <div
                                        className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                                        data-oid="lnjqq3a"
                                    >
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center"
                                            data-oid="9-8ql1e"
                                        >
                                            <div data-oid="ab-i_92">
                                                <div
                                                    className="text-2xl font-bold text-blue-600"
                                                    data-oid="cj7ut1n"
                                                >
                                                    {pattern.totalCustomers}
                                                </div>
                                                <div
                                                    className="text-sm text-blue-800"
                                                    data-oid="_y17m0w"
                                                >
                                                    Total Customers
                                                </div>
                                            </div>
                                            <div data-oid="_plkhqw">
                                                <div
                                                    className="text-2xl font-bold text-blue-600"
                                                    data-oid="medqwgj"
                                                >
                                                    {pattern.totalQuantitySold}
                                                </div>
                                                <div
                                                    className="text-sm text-blue-800"
                                                    data-oid="yaw.2kh"
                                                >
                                                    Units Sold
                                                </div>
                                            </div>
                                            <div data-oid="cjyfjd3">
                                                <div
                                                    className="text-2xl font-bold text-blue-600"
                                                    data-oid="fwuh8oh"
                                                >
                                                    {pattern.averageFrequency}
                                                </div>
                                                <div
                                                    className="text-sm text-blue-800"
                                                    data-oid="6yq5v8h"
                                                >
                                                    Days Between Orders
                                                </div>
                                            </div>
                                            <div data-oid="rx3_ahc">
                                                <div
                                                    className="text-2xl font-bold text-blue-600"
                                                    data-oid=".gur9e8"
                                                >
                                                    {pattern.category}
                                                </div>
                                                <div
                                                    className="text-sm text-blue-800"
                                                    data-oid="z45met0"
                                                >
                                                    Category
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto" data-oid="zp-29-4">
                                        <table
                                            className="min-w-full divide-y divide-gray-200"
                                            data-oid="5pw85qi"
                                        >
                                            <thead className="bg-gray-50" data-oid="2ftabtj">
                                                <tr data-oid="pgkrw1e">
                                                    <th
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        data-oid=":9qzm.h"
                                                    >
                                                        Customer
                                                    </th>
                                                    <th
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        data-oid="zhzpywq"
                                                    >
                                                        Contact
                                                    </th>
                                                    <th
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        data-oid="1aj2c_7"
                                                    >
                                                        Address
                                                    </th>
                                                    <th
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        data-oid="e48sf7-"
                                                    >
                                                        Purchase History
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody
                                                className="bg-white divide-y divide-gray-200"
                                                data-oid="b0try:i"
                                            >
                                                {pattern.customers.map((customer) => (
                                                    <tr
                                                        key={customer.customerId}
                                                        className="hover:bg-gray-50"
                                                        data-oid="z._wnd1"
                                                    >
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid=":1jo_a4"
                                                        >
                                                            <div
                                                                className="flex items-center"
                                                                data-oid="fmleryz"
                                                            >
                                                                <div
                                                                    className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
                                                                    data-oid="vlppe9u"
                                                                >
                                                                    {customer.customerName
                                                                        .split(' ')
                                                                        .map((n) => n[0])
                                                                        .join('')}
                                                                </div>
                                                                <div
                                                                    className="ml-3"
                                                                    data-oid="0rokgun"
                                                                >
                                                                    <div
                                                                        className="text-sm font-medium text-gray-900"
                                                                        data-oid="nn-o9.2"
                                                                    >
                                                                        {customer.customerName}
                                                                    </div>
                                                                    <div
                                                                        className="text-sm text-gray-500"
                                                                        data-oid="p_6fhn4"
                                                                    >
                                                                        {customer.customerId}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="aws:2lo"
                                                        >
                                                            <div
                                                                className="flex items-center text-sm text-gray-900"
                                                                data-oid="ypj019_"
                                                            >
                                                                <Mail
                                                                    className="h-3 w-3 mr-2 text-gray-400"
                                                                    data-oid="3c9v9v0"
                                                                />

                                                                <span
                                                                    className="truncate"
                                                                    data-oid="vk_5.zu"
                                                                >
                                                                    {customer.email}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center text-sm text-gray-500"
                                                                data-oid="rpwe97a"
                                                            >
                                                                <Phone
                                                                    className="h-3 w-3 mr-2 text-gray-400"
                                                                    data-oid="014b-u3"
                                                                />

                                                                <span data-oid="662uav7">
                                                                    {customer.phone}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center text-sm text-cura-primary"
                                                                data-oid="tbjnt8k"
                                                            >
                                                                <Phone
                                                                    className="h-3 w-3 mr-2 text-cura-primary"
                                                                    data-oid="ccf2stb"
                                                                />

                                                                <span data-oid="4xaokc4">
                                                                    {customer.whatsapp}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid="3w.e68k"
                                                        >
                                                            <div
                                                                className="flex items-center text-sm text-gray-900"
                                                                data-oid="b6pnoh8"
                                                            >
                                                                <MapPin
                                                                    className="h-3 w-3 mr-2 text-gray-400"
                                                                    data-oid="u3z9meh"
                                                                />

                                                                <span
                                                                    className="truncate"
                                                                    data-oid="mmkb:yu"
                                                                >
                                                                    {customer.address}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500 ml-5"
                                                                data-oid="6bk9-8q"
                                                            >
                                                                {customer.city}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            data-oid=".-0ohwb"
                                                        >
                                                            <div
                                                                className="text-sm text-gray-900"
                                                                data-oid="czbhwzd"
                                                            >
                                                                {customer.totalPurchases} purchases
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500"
                                                                data-oid="0nr3::i"
                                                            >
                                                                Last: {customer.lastPurchased}
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                                data-oid="8-5u524"
                                                            >
                                                                {customer.frequency}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="timing" className="space-y-6" data-oid="x9771ef">
                    {orderTiming && (
                        <>
                            <div className="flex justify-between items-center" data-oid="d5zyesd">
                                <div data-oid="efkpe92">
                                    <h2
                                        className="text-2xl font-bold text-gray-900"
                                        data-oid="iuvz1sl"
                                    >
                                        Order Timing Analytics
                                    </h2>
                                    <p className="text-gray-600" data-oid="pesd48x">
                                        Understanding when customers place their orders
                                    </p>
                                </div>
                                <div className="flex space-x-3" data-oid="aco1mpl">
                                    <Button
                                        onClick={() => exportOrderTimingData('csv')}
                                        variant="outline"
                                        className="flex items-center space-x-2"
                                        data-oid="hn59gae"
                                    >
                                        <FileText className="h-4 w-4" data-oid="nbqw28w" />
                                        Export CSV
                                    </Button>
                                    <Button
                                        onClick={() => exportOrderTimingData('excel')}
                                        className="flex items-center space-x-2"
                                        data-oid="c.96xul"
                                    >
                                        <Download className="h-4 w-4" data-oid="kmvls0z" />
                                        Export Excel
                                    </Button>
                                </div>
                            </div>

                            <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                data-oid="c:tl6s7"
                            >
                                <Card
                                    className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/10 border-cura-primary/20 hover:shadow-cura transition-all duration-300"
                                    data-oid="xolpm46"
                                >
                                    <CardHeader
                                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                                        data-oid="ry2s3fg"
                                    >
                                        <CardTitle
                                            className="text-sm font-semibold text-cura-primary"
                                            data-oid="9r:keb4"
                                        >
                                            Peak Hour
                                        </CardTitle>
                                        <div
                                            className="p-2 bg-cura-primary/10 rounded-lg"
                                            data-oid="-dyf0v7"
                                        >
                                            <Clock
                                                className="h-5 w-5 text-cura-primary"
                                                data-oid="fstm3z6"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent data-oid="a:dk1m7">
                                        <div
                                            className="text-3xl font-bold text-cura-primary mb-1"
                                            data-oid="ai0nnw-"
                                        >
                                            {orderTiming.peakOrderingTimes.mostActiveHour}:00
                                        </div>
                                        <p
                                            className="text-xs text-cura-primary/70"
                                            data-oid="cs9o4ib"
                                        >
                                            Most orders placed
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300"
                                    data-oid="w5:eyfb"
                                >
                                    <CardHeader
                                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                                        data-oid="fcxs0f1"
                                    >
                                        <CardTitle
                                            className="text-sm font-semibold text-emerald-700"
                                            data-oid="sk-bdrm"
                                        >
                                            Peak Day
                                        </CardTitle>
                                        <div
                                            className="p-2 bg-emerald-100 rounded-lg"
                                            data-oid="eqr_16."
                                        >
                                            <Calendar
                                                className="h-5 w-5 text-emerald-600"
                                                data-oid="6x0uthu"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent data-oid="ose34a9">
                                        <div
                                            className="text-3xl font-bold text-emerald-800 mb-1"
                                            data-oid="pu99v6j"
                                        >
                                            {orderTiming.peakOrderingTimes.mostActiveDay}
                                        </div>
                                        <p className="text-xs text-emerald-600" data-oid="k_6a7li">
                                            Highest order volume
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-300"
                                    data-oid="xfa.7oy"
                                >
                                    <CardHeader
                                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                                        data-oid="8e8merm"
                                    >
                                        <CardTitle
                                            className="text-sm font-semibold text-amber-700"
                                            data-oid="0fw55s1"
                                        >
                                            Peak Month
                                        </CardTitle>
                                        <div
                                            className="p-2 bg-amber-100 rounded-lg"
                                            data-oid="jmnb6cb"
                                        >
                                            <BarChart3
                                                className="h-5 w-5 text-amber-600"
                                                data-oid=":3jacmg"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent data-oid="uz9gkiv">
                                        <div
                                            className="text-3xl font-bold text-amber-800 mb-1"
                                            data-oid="gmyvihj"
                                        >
                                            {orderTiming.peakOrderingTimes.mostActiveMonth}
                                        </div>
                                        <p className="text-xs text-amber-600" data-oid="1v4suwt">
                                            Best performing month
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                data-oid="id.qzoa"
                            >
                                <Card data-oid="3o7rokv">
                                    <CardHeader data-oid="-78xptw">
                                        <CardTitle data-oid=".f.hh75">
                                            Hourly Order Distribution
                                        </CardTitle>
                                        <CardDescription data-oid="6wrx0sd">
                                            Orders placed throughout the day
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent data-oid="7dboj-k">
                                        <ChartContainer
                                            config={{
                                                orders: {
                                                    label: 'Orders',
                                                    color: 'hsl(var(--chart-1))',
                                                },
                                            }}
                                            className="h-[300px]"
                                            data-oid="v-7c2jx"
                                        >
                                            <BarChart
                                                data={orderTiming.hourlyDistribution}
                                                data-oid="0gqwfk4"
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    data-oid="9lop-u5"
                                                />

                                                <XAxis dataKey="hour" data-oid="0-4-10h" />
                                                <YAxis data-oid="2fuz0:v" />
                                                <ChartTooltip
                                                    content={
                                                        <ChartTooltipContent data-oid="_nwi72n" />
                                                    }
                                                    data-oid="awo:2kl"
                                                />

                                                <Bar
                                                    dataKey="orders"
                                                    fill="var(--color-orders)"
                                                    data-oid="q_y1ceo"
                                                />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>

                                <Card data-oid="4njsndb">
                                    <CardHeader data-oid="165wf-m">
                                        <CardTitle data-oid="v_i3y-p">
                                            Daily Order Distribution
                                        </CardTitle>
                                        <CardDescription data-oid="c45qx03">
                                            Orders placed throughout the week
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent data-oid="g:ilpbp">
                                        <ChartContainer
                                            config={{
                                                orders: {
                                                    label: 'Orders',
                                                    color: 'hsl(var(--chart-2))',
                                                },
                                            }}
                                            className="h-[300px]"
                                            data-oid="dwldjly"
                                        >
                                            <BarChart
                                                data={orderTiming.dailyDistribution}
                                                data-oid="0esd0gk"
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    data-oid="ps:e5ft"
                                                />

                                                <XAxis dataKey="day" data-oid="82cv2aw" />
                                                <YAxis data-oid="4vnczol" />
                                                <ChartTooltip
                                                    content={
                                                        <ChartTooltipContent data-oid="9hdf5fn" />
                                                    }
                                                    data-oid="82q2k.5"
                                                />

                                                <Bar
                                                    dataKey="orders"
                                                    fill="var(--color-orders)"
                                                    data-oid=":3jaa8y"
                                                />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card data-oid=".0otsan">
                                <CardHeader data-oid="_:45rb4">
                                    <CardTitle data-oid=":l6rxgs">Monthly Order Trends</CardTitle>
                                    <CardDescription data-oid=":46sn:g">
                                        Order volume across different months
                                    </CardDescription>
                                </CardHeader>
                                <CardContent data-oid="_64mqtw">
                                    <ChartContainer
                                        config={{
                                            orders: {
                                                label: 'Orders',
                                                color: 'hsl(var(--chart-3))',
                                            },
                                        }}
                                        className="h-[300px]"
                                        data-oid="97pajge"
                                    >
                                        <LineChart
                                            data={orderTiming.monthlyDistribution}
                                            data-oid="_btcup2"
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                data-oid=".l8ky7a"
                                            />

                                            <XAxis dataKey="month" data-oid="_04t.tf" />
                                            <YAxis data-oid="o3oh6.i" />
                                            <ChartTooltip
                                                content={<ChartTooltipContent data-oid="f2yf5sv" />}
                                                data-oid="ruphxem"
                                            />

                                            <Line
                                                type="monotone"
                                                dataKey="orders"
                                                stroke="var(--color-orders)"
                                                strokeWidth={2}
                                                dot={{ fill: 'var(--color-orders)' }}
                                                data-oid="tcjmh.3"
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </TabsContent>
            </Tabs>

            {/* Enhanced Frequency Analysis Modal */}
            {selectedFrequencyType && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    data-oid="2tjhv5n"
                >
                    <div
                        className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100"
                        data-oid="bmcrdln"
                    >
                        {(() => {
                            const details = getFrequencyDetails(selectedFrequencyType);
                            if (!details) return null;

                            return (
                                <>
                                    {/* Simple Header */}
                                    <div
                                        className="flex justify-between items-center p-6 border-b"
                                        data-oid=".cq0ql5"
                                    >
                                        <h2
                                            className="text-2xl font-bold text-gray-900"
                                            data-oid=".ks8:yo"
                                        >
                                            {details.title}
                                        </h2>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedFrequencyType(null)}
                                            data-oid="vneatj1"
                                        >
                                            <X className="h-4 w-4" data-oid="p8mv761" />
                                        </Button>
                                    </div>

                                    <div
                                        className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]"
                                        data-oid="yq.5z-j"
                                    >
                                        {/* Enhanced Summary Stats */}
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                                            data-oid="9lrih9r"
                                        >
                                            <div
                                                className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/10 p-6 rounded-xl border border-cura-primary/20"
                                                data-oid="7ywrf-t"
                                            >
                                                <div
                                                    className="flex items-center justify-between mb-2"
                                                    data-oid="e66gfxu"
                                                >
                                                    <div
                                                        className="text-3xl font-bold text-cura-primary"
                                                        data-oid="4qrykg4"
                                                    >
                                                        {details.totalCustomers.toLocaleString()}
                                                    </div>
                                                    <Users
                                                        className="h-8 w-8 text-cura-primary/60"
                                                        data-oid="hm9ldv2"
                                                    />
                                                </div>
                                                <div
                                                    className="text-sm font-medium text-cura-primary/80"
                                                    data-oid="ijz8yn8"
                                                >
                                                    Total Customers
                                                </div>
                                            </div>

                                            <div
                                                className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200"
                                                data-oid="co0yi4y"
                                            >
                                                <div
                                                    className="flex items-center justify-between mb-2"
                                                    data-oid="4a7d6-e"
                                                >
                                                    <div
                                                        className="text-3xl font-bold text-emerald-600"
                                                        data-oid="x9vi_12"
                                                    >
                                                        {details.avgOrdersPerMonth}
                                                    </div>
                                                    <Repeat
                                                        className="h-8 w-8 text-emerald-400"
                                                        data-oid="blgdous"
                                                    />
                                                </div>
                                                <div
                                                    className="text-sm font-medium text-emerald-700"
                                                    data-oid="sx_9n1-"
                                                >
                                                    Avg Orders/Month
                                                </div>
                                            </div>

                                            <div
                                                className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200"
                                                data-oid="bqw:.fh"
                                            >
                                                <div
                                                    className="flex items-center justify-between mb-2"
                                                    data-oid="_s2mx_p"
                                                >
                                                    <div
                                                        className="text-3xl font-bold text-amber-600"
                                                        data-oid="124gcj2"
                                                    >
                                                        {details.avgSpentPerMonth}
                                                    </div>
                                                    <DollarSign
                                                        className="h-8 w-8 text-amber-400"
                                                        data-oid=".ml0o.f"
                                                    />
                                                </div>
                                                <div
                                                    className="text-sm font-medium text-amber-700"
                                                    data-oid="p4rfwpk"
                                                >
                                                    Avg Spent/Month (EGP)
                                                </div>
                                            </div>

                                            <div
                                                className="bg-gradient-to-br from-violet-50 to-violet-100 p-6 rounded-xl border border-violet-200"
                                                data-oid="l7sikyu"
                                            >
                                                <div
                                                    className="flex items-center justify-between mb-2"
                                                    data-oid="oyze5g5"
                                                >
                                                    <div
                                                        className="text-3xl font-bold text-violet-600"
                                                        data-oid="rxgdgq7"
                                                    >
                                                        {details.frequency}
                                                    </div>
                                                    <Activity
                                                        className="h-8 w-8 text-violet-400"
                                                        data-oid="xo6u7n3"
                                                    />
                                                </div>
                                                <div
                                                    className="text-sm font-medium text-violet-700"
                                                    data-oid="ok-rmyr"
                                                >
                                                    Order Frequency
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enhanced Top Categories */}
                                        <div className="mb-8" data-oid="j8kbu0:">
                                            <div
                                                className="flex items-center gap-3 mb-4"
                                                data-oid="sfw11ks"
                                            >
                                                <div
                                                    className="p-2 bg-cura-primary/10 rounded-lg"
                                                    data-oid=".mdac_u"
                                                >
                                                    <ShoppingBag
                                                        className="h-5 w-5 text-cura-primary"
                                                        data-oid="j6u_eru"
                                                    />
                                                </div>
                                                <h3
                                                    className="text-xl font-bold text-gray-900"
                                                    data-oid="dd:m8m1"
                                                >
                                                    Top Product Categories
                                                </h3>
                                            </div>
                                            <div
                                                className="grid grid-cols-1 md:grid-cols-3 gap-3"
                                                data-oid="lx8gibb"
                                            >
                                                {details.topCategories.map((category, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-gradient-to-r from-cura-primary/5 to-cura-secondary/5 border border-cura-primary/20 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                                                        data-oid="i8av3i5"
                                                    >
                                                        <div
                                                            className="flex items-center gap-3"
                                                            data-oid="hvi8mpk"
                                                        >
                                                            <div
                                                                className="w-8 h-8 bg-cura-primary/10 rounded-full flex items-center justify-center"
                                                                data-oid="y.85ai5"
                                                            >
                                                                <span
                                                                    className="text-sm font-bold text-cura-primary"
                                                                    data-oid=":s11fcr"
                                                                >
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <span
                                                                className="font-medium text-gray-900"
                                                                data-oid="c.c4axf"
                                                            >
                                                                {category}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Customer List */}
                                        <div data-oid="greexom">
                                            <h3
                                                className="text-lg font-semibold mb-3"
                                                data-oid="h9d3e3r"
                                            >
                                                Customers with Complete Order History
                                            </h3>
                                            <CustomerList
                                                customers={details.customers}
                                                onCustomerClick={handleCustomerClick}
                                                className="mt-4"
                                                data-oid="vz6-0-5"
                                            />
                                        </div>

                                        {/* Enhanced Export Options */}
                                        <div
                                            className="mt-8 pt-6 border-t border-gray-200 bg-gray-50 -mx-6 px-6 py-4 rounded-b-2xl"
                                            data-oid="6las91:"
                                        >
                                            <div
                                                className="flex items-center justify-between"
                                                data-oid="1goeelp"
                                            >
                                                <div data-oid="i32xok2">
                                                    <h4
                                                        className="font-semibold text-gray-900 mb-1"
                                                        data-oid="o.zlwmi"
                                                    >
                                                        Export Data
                                                    </h4>
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        data-oid="z2_4xxy"
                                                    >
                                                        Download complete customer data and order
                                                        history
                                                    </p>
                                                </div>
                                                <div className="flex space-x-3" data-oid="wfujn54">
                                                    <Button
                                                        onClick={() =>
                                                            exportSpecificFrequencyData(
                                                                selectedFrequencyType!,
                                                                'csv',
                                                            )
                                                        }
                                                        variant="outline"
                                                        className="flex items-center space-x-2 border-cura-primary/30 text-cura-primary hover:bg-cura-primary/5 hover:border-cura-primary transition-all duration-300 shadow-sm hover:shadow-cura-sm"
                                                        data-oid="2edx30p"
                                                    >
                                                        <FileText
                                                            className="h-4 w-4"
                                                            data-oid="nx9buc3"
                                                        />

                                                        <span
                                                            className="font-medium"
                                                            data-oid="z8ygyvj"
                                                        >
                                                            Export CSV
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            exportSpecificFrequencyData(
                                                                selectedFrequencyType!,
                                                                'excel',
                                                            )
                                                        }
                                                        className="flex items-center space-x-2 bg-cura-gradient hover:opacity-90 text-white transition-all duration-300 shadow-cura hover:shadow-cura-lg font-medium"
                                                        data-oid="cln9zej"
                                                    >
                                                        <Download
                                                            className="h-4 w-4"
                                                            data-oid="1tj4:af"
                                                        />

                                                        <span data-oid="w_bcvn:">Export Excel</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Customer Order History Modal */}
            <CustomerOrderHistoryModal
                customer={selectedCustomer}
                isOpen={isCustomerModalOpen}
                onClose={handleCloseCustomerModal}
                data-oid="wyf5waw"
            />
        </div>
    );
}
