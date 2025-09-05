'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { LoadingCard } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthToken } from '@/lib/utils/cookies';

interface ReturnOrder {
  id: string;
  returnId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  reason: string;
  description?: string;
  status: 'requested' | 'approved' | 'rejected' | 'processing' | 'completed';
  requestedAt: string;
  processedAt?: string;
  refundAmount: number;
  refundMethod: 'original_payment' | 'store_credit' | 'bank_transfer';
  returnItems: Array<{
    productId: string;
    productName: string;
    quantity: number;
    reason: string;
    condition: 'unopened' | 'opened' | 'damaged' | 'expired';
    refundAmount: number;
  }>;
  adminNotes?: string;
  customerNotes?: string;
}

export default function PharmacyReturnsPage() {
  const { user } = useAuth();
  const [returns, setReturns] = useState<ReturnOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  };

  // Load return orders
  useEffect(() => {
    const loadReturns = async () => {
      if (!user || user.role !== 'pharmacy') {
        setLoading(false);
        return;
      }

      try {
        // Get orders with returns
        const response = await apiCall('/orders?status=returned');
        
        // Extract return information from orders
        const returnOrders = response.data
          .filter((order: any) => order.returnInfo && order.returnInfo.status)
          .map((order: any) => ({
            id: order._id,
            returnId: order.returnInfo.id,
            orderNumber: order.orderNumber,
            customerId: order.customerId._id,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            reason: order.returnInfo.reason,
            description: order.returnInfo.description,
            status: order.returnInfo.status,
            requestedAt: order.returnInfo.requestedAt,
            processedAt: order.returnInfo.processedAt,
            refundAmount: order.returnInfo.refundAmount,
            refundMethod: order.returnInfo.refundMethod,
            returnItems: order.returnInfo.returnItems,
            adminNotes: order.returnInfo.adminNotes,
            customerNotes: order.returnInfo.customerNotes,
          }));

        setReturns(returnOrders);
      } catch (error) {
        console.error('Error loading returns:', error);
        toast.error('Failed to load return orders');
      } finally {
        setLoading(false);
      }
    };

    loadReturns();
  }, [user]);

  // Process return (approve/reject)
  const processReturn = async (returnId: string, action: 'approve' | 'reject', adminNotes?: string) => {
    try {
      setProcessing(returnId);
      
      await apiCall(`/orders/return/${returnId}/process`, {
        method: 'PUT',
        body: JSON.stringify({ action, adminNotes }),
      });

      // Update local state
      setReturns(prev => prev.map(ret => 
        ret.returnId === returnId 
          ? { 
              ...ret, 
              status: action === 'approve' ? 'approved' : 'rejected',
              processedAt: new Date().toISOString(),
              adminNotes: adminNotes || ret.adminNotes
            }
          : ret
      ));

      toast.success(`Return request ${action}d successfully`);
    } catch (error: any) {
      console.error('Error processing return:', error);
      toast.error(error.message || `Failed to ${action} return request`);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: ReturnOrder['status']) => {
    const variants = {
      requested: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
    };

    const icons = {
      requested: <Clock className="w-3 h-3" />,
      processing: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
    };

    return (
      <Badge className={variants[status]}>
        {icons[status]}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  if (loading) {
    return <LoadingCard text="Loading return orders..." />;
  }

  if (!user || user.role !== 'pharmacy') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Access denied. Pharmacy account required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Return Orders</h1>
          <p className="text-gray-600">Manage customer return requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Returns</p>
                <p className="text-2xl font-bold">{returns.length}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {returns.filter(r => r.status === 'requested').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {returns.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Refunds</p>
                <p className="text-2xl font-bold text-blue-600">
                  EGP {returns.reduce((sum, r) => sum + (r.status === 'approved' ? r.refundAmount : 0), 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Returns List */}
      {returns.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <XCircle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Return Orders</h3>
            <p className="text-gray-600">Customer return requests will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {returns.map((returnOrder) => (
            <Card key={returnOrder.returnId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Return #{returnOrder.returnId}
                    </CardTitle>
                    <p className="text-gray-600">
                      Order: {returnOrder.orderNumber} • {returnOrder.customerName}
                    </p>
                  </div>
                  {getStatusBadge(returnOrder.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Return Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Reason:</span> {returnOrder.reason}</p>
                      <p><span className="font-medium">Requested:</span> {new Date(returnOrder.requestedAt).toLocaleDateString()}</p>
                      <p><span className="font-medium">Refund Amount:</span> EGP {returnOrder.refundAmount.toFixed(2)}</p>
                      {returnOrder.description && (
                        <p><span className="font-medium">Description:</span> {returnOrder.description}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Customer Info</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {returnOrder.customerName}</p>
                      <p><span className="font-medium">Phone:</span> {returnOrder.customerPhone}</p>
                      {returnOrder.customerNotes && (
                        <p><span className="font-medium">Notes:</span> {returnOrder.customerNotes}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Return Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Return Items</h4>
                  <div className="space-y-2">
                    {returnOrder.returnItems.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} • Condition: {item.condition}
                            </p>
                            <p className="text-sm text-gray-600">Reason: {item.reason}</p>
                          </div>
                          <p className="font-semibold text-green-600">
                            EGP {item.refundAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions for pending returns */}
                {returnOrder.status === 'requested' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => processReturn(returnOrder.returnId, 'approve')}
                      disabled={processing === returnOrder.returnId}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Return
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => processReturn(returnOrder.returnId, 'reject')}
                      disabled={processing === returnOrder.returnId}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Return
                    </Button>
                  </div>
                )}

                {/* Admin notes */}
                {returnOrder.adminNotes && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Admin Notes:</p>
                    <p className="text-sm text-blue-800">{returnOrder.adminNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}