'use client';

import { useState, useEffect } from 'react';
import {
  SuspendedOrder,
  SuspendedOrderItem,
  suspendedOrderService } from
'@/lib/services/suspendedOrderService';
import { MedicineSearchModal } from '@/components/prescription/MedicineSearchModal';
import { products, Product } from '@/lib/data/products';

interface OrderEditModalProps {
  order: SuspendedOrder;
  onClose: () => void;
  onSave: (modifiedOrder: SuspendedOrder) => void;
}

interface ModifiedItem extends SuspendedOrderItem {
  isNew?: boolean;
  isModified?: boolean;
  isRemoved?: boolean;
}

export function OrderEditModal({ order, onClose, onSave }: OrderEditModalProps) {
  const [modifiedItems, setModifiedItems] = useState<ModifiedItem[]>([]);
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize with original items
    setModifiedItems(order.originalItems.map((item) => ({ ...item })));
  }, [order]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setModifiedItems((prev) =>
    prev.map((item) => {
      if (item.id === itemId) {
        const updatedItem = {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.unitPrice,
          isModified: true
        };
        return updatedItem;
      }
      return item;
    })
    );
  };

  const handleUnitTypeChange = (itemId: string, newUnitType: SuspendedOrderItem['unitType']) => {
    setModifiedItems((prev) =>
    prev.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          unitType: newUnitType,
          isModified: true
        };
      }
      return item;
    })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setModifiedItems((prev) =>
    prev.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          isRemoved: true
        };
      }
      return item;
    })
    );
  };

  const handleRestoreItem = (itemId: string) => {
    setModifiedItems((prev) =>
    prev.map((item) => {
      if (item.id === itemId) {
        const { isRemoved, isModified, ...originalItem } = item;
        return originalItem;
      }
      return item;
    })
    );
  };

  const handleAddMedicine = (medicine: any) => {
    // Convert medicine to product format
    const product =
    products.find((p) => p.name === medicine.name) ||
    {
      id: parseInt(medicine.id.replace('med-', '')),
      name: medicine.name,
      nameAr: medicine.genericName || medicine.name,
      price: medicine.price,
      category: medicine.category.toLowerCase(),
      manufacturer: medicine.manufacturer,
      activeIngredient: medicine.activeIngredient,
      dosage: medicine.strength,
      inStock: true
    } as Product;

    const newItem: ModifiedItem = {
      id: `new-item-${Date.now()}`,
      productId: product.id.toString(),
      productName: product.name,
      productNameAr: product.nameAr,
      quantity: 1,
      unitPrice: product.price,
      totalPrice: product.price,
      unitType: 'box',
      prescription: medicine.requiresPrescription || false,
      category: product.category,
      manufacturer: product.manufacturer,
      activeIngredient: product.activeIngredient,
      dosage: product.dosage,
      status: 'pending',
      isNew: true
    };

    setModifiedItems((prev) => [...prev, newItem]);
    setShowMedicineSearch(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare modifications
      const itemsToRemove = modifiedItems.
      filter((item) => item.isRemoved).
      map((item) => item.id);

      const itemsToAdd = modifiedItems.
      filter((item) => item.isNew && !item.isRemoved).
      map((item) => {
        const { isNew, isModified, isRemoved, ...cleanItem } = item;
        return cleanItem;
      });

      const itemsToModify = modifiedItems.
      filter((item) => item.isModified && !item.isRemoved && !item.isNew).
      map((item) => ({
        itemId: item.id,
        newQuantity: item.quantity,
        newUnitType: item.unitType
      }));

      const modification = {
        orderId: order.id,
        modifiedBy: 'pharmacy',
        modifications: {
          itemsToRemove,
          itemsToAdd,
          itemsToModify
        },
        notes: notes || 'Order modified by pharmacy'
      };

      const modifiedOrder = await suspendedOrderService.modifyOrder(modification);
      onSave(modifiedOrder);

      alert(
        '✅ Order modifications saved successfully! Customer will be notified to review changes.'
      );
    } catch (error) {
      console.error('Error saving modifications:', error);
      alert('❌ Error saving modifications. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const activeItems = modifiedItems.filter((item) => !item.isRemoved);
  const totalAmount = activeItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const hasChanges = modifiedItems.some(
    (item) => item.isNew || item.isModified || item.isRemoved
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-oid="07pdv7q">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200" data-oid="tgqch4.">
                {/* Header */}
                <div className="bg-gradient-to-r from-cura-primary to-cura-secondary p-6" data-oid=":298q2h">
                    <div className="flex items-center justify-between" data-oid="yghmuet">
                        <div className="flex items-center space-x-3" data-oid="az2xkhx">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center" data-oid="l780-ft">
                                <span className="text-white text-lg" data-oid="dodwyok">✏️</span>
                            </div>
                            <div data-oid="so8-vis">
                                <h2 className="text-xl font-bold text-white" data-oid="x8j26va">CURA - Edit Order</h2>
                                <p className="text-blue-100 text-sm" data-oid="9k2o4eb">{order.orderNumber}</p>
                            </div>
                        </div>
                        <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg" data-oid="0vbcned">

                            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24" data-oid="fhkmykn">

                                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" data-oid="_o:pdoj" />

                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]" data-oid="btn8s8k">
                    {/* Issue Information */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-6 border-l-4 border-red-500" data-oid="msu58co">
                        <div className="flex items-start space-x-3" data-oid="ei:g9cj">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center" data-oid="33xg_do">
                                <span className="text-white text-sm" data-oid="blqbq7q">⚠️</span>
                            </div>
                            <div data-oid="y32zmnr">
                                <h3 className="font-semibold text-red-800 mb-2" data-oid="m:d6b1m">
                                    Issue: {order.issueType.replace('-', ' ').toUpperCase()}
                                </h3>
                                <p className="text-sm text-red-700" data-oid="bua00nm">{order.issueNotes}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6" data-oid="maii71g">
                        <div className="flex items-center justify-between mb-4" data-oid="36ds_zq">
                            <div className="flex items-center space-x-3" data-oid="guqoh0h">
                                <div className="w-8 h-8 bg-cura-primary rounded-full flex items-center justify-center" data-oid="tei65e6">
                                    <span className="text-white text-sm" data-oid="a24migm">💊</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900" data-oid="kc3goi8">Order Items</h3>
                            </div>
                            <button
                onClick={() => setShowMedicineSearch(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg" data-oid="9vrxp_6">

                                + Add Medicine
                            </button>
                        </div>

                        <div className="space-y-4" data-oid="tykfa4m">
                            {modifiedItems.map((item) =>
              <div
                key={item.id}
                className={`border-2 rounded-xl p-4 transition-all duration-300 ${
                item.isRemoved ?
                'border-red-300 bg-red-50 opacity-60' :
                item.isNew ?
                'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' :
                item.isModified ?
                'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50' :
                'border-gray-200 bg-white hover:border-cura-primary/30 hover:shadow-md'}`
                } data-oid="1zn43up">

                                    <div className="flex items-start justify-between" data-oid="opqy8cs">
                                        <div className="flex-1" data-oid="d7qzzbi">
                                            <div className="flex items-center space-x-2 mb-2" data-oid="yy:qmsa">
                                                <h4 className="font-medium text-gray-900" data-oid="tirbbp8">
                                                    {item.productName}
                                                </h4>
                                                {item.isNew &&
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium" data-oid="w6lec2h">
                                                        NEW
                                                    </span>
                      }
                                                {item.isModified && !item.isNew &&
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium" data-oid="8s7b7u_">
                                                        MODIFIED
                                                    </span>
                      }
                                                {item.isRemoved &&
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium" data-oid="biqm7-8">
                                                        REMOVED
                                                    </span>
                      }
                                                {item.prescription &&
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium" data-oid="3yc8:so">
                                                        RX
                                                    </span>
                      }
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3" data-oid="zdj97z0">
                                                <div data-oid="ec606gv">
                                                    <span className="font-medium" data-oid="3otg4na">
                                                        Manufacturer:
                                                    </span>{' '}
                                                    {item.manufacturer}
                                                </div>
                                                <div data-oid="3dbp0_e">
                                                    <span className="font-medium" data-oid="gqtd37g">
                                                        Active Ingredient:
                                                    </span>{' '}
                                                    {item.activeIngredient}
                                                </div>
                                                {item.dosage &&
                      <div data-oid="nms2fjc">
                                                        <span className="font-medium" data-oid="20y7rt_">Dosage:</span>{' '}
                                                        {item.dosage}
                                                    </div>
                      }
                                                <div data-oid="xu-l6e6">
                                                    <span className="font-medium" data-oid="_i.ybx5">Unit Price:</span>{' '}
                                                    EGP {item.unitPrice.toFixed(2)}
                                                </div>
                                            </div>

                                            {!item.isRemoved &&
                    <div className="grid grid-cols-3 gap-4" data-oid="w3ile83">
                                                    <div data-oid="dfsw7up">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1" data-oid="0sf0-fy">
                                                            Quantity
                                                        </label>
                                                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value) || 1
                          )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cura-primary focus:border-cura-primary transition-colors" data-oid="l_nvfai" />

                                                    </div>
                                                    <div data-oid="lj:3oz-">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1" data-oid="t6k0o.n">
                                                            Unit Type
                                                        </label>
                                                        <select
                          value={item.unitType}
                          onChange={(e) =>
                          handleUnitTypeChange(
                            item.id,
                            e.target.value as SuspendedOrderItem['unitType']
                          )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cura-primary focus:border-cura-primary transition-colors" data-oid="igt8x3a">

                                                            <option value="box" data-oid="g_xr7qn">Box</option>
                                                            <option value="blister" data-oid="0-ie.e0">Blister</option>
                                                            <option value="bottle" data-oid="-ktdpea">Bottle</option>
                                                        </select>
                                                    </div>
                                                    <div data-oid="i-dyl2n">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1" data-oid=":kii0za">
                                                            Total Price
                                                        </label>
                                                        <div className="px-3 py-2 bg-gradient-to-r from-cura-primary/10 to-cura-secondary/10 border border-cura-primary/20 rounded-lg text-cura-primary font-semibold" data-oid="a0qqbwn">
                                                            EGP {item.totalPrice.toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                    }

                                            {item.issueReason &&
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800" data-oid="ewgo2l6">
                                                    <span className="font-medium" data-oid="7:lq6uz">Issue:</span>{' '}
                                                    {item.issueReason}
                                                </div>
                    }
                                        </div>

                                        <div className="ml-4 flex flex-col space-y-2" data-oid="j:-yac3">
                                            {!item.isRemoved ?
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg" data-oid="dwmr_lk">

                                                    Remove
                                                </button> :

                    <button
                      onClick={() => handleRestoreItem(item.id)}
                      className="px-3 py-2 bg-gradient-to-r from-cura-primary to-cura-secondary text-white rounded-lg hover:from-cura-secondary hover:to-cura-accent text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg" data-oid="hsvu03n">

                                                    Restore
                                                </button>
                    }
                                        </div>
                                    </div>
                                </div>
              )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gradient-to-r from-cura-primary/10 to-cura-secondary/10 rounded-xl p-6 mb-6 border border-cura-primary/20" data-oid="egy9hj2">
                        <div className="flex items-center space-x-3 mb-4" data-oid="4gqnkor">
                            <div className="w-8 h-8 bg-cura-primary rounded-full flex items-center justify-center" data-oid="086pznc">
                                <span className="text-white text-sm" data-oid="knojru-">📊</span>
                            </div>
                            <h3 className="font-semibold text-gray-900" data-oid="eyosps1">Order Summary</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm" data-oid="dejysun">
                            <div className="bg-white rounded-lg p-3 border border-gray-200" data-oid="5t_1fgb">
                                <span className="text-gray-600" data-oid="u3x5qqy">Original Total:</span>
                                <div className="font-semibold text-gray-900 text-lg" data-oid="_3e0jgb">
                                    EGP {order.originalTotalAmount.toFixed(2)}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-cura-primary/30" data-oid="ajs04iq">
                                <span className="text-gray-600" data-oid="ttpic79">Modified Total:</span>
                                <div className="font-semibold text-cura-primary text-lg" data-oid="m7k-bbq">
                                    EGP {totalAmount.toFixed(2)}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200" data-oid="49i5co:">
                                <span className="text-gray-600" data-oid="y3djbyd">Active Items:</span>
                                <div className="font-semibold text-gray-900 text-lg" data-oid="9km3vkw">
                                    {activeItems.length}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200" data-oid="7gbx79.">
                                <span className="text-gray-600" data-oid="agnjbf5">Total Difference:</span>
                                <div
                  className={`font-semibold text-lg ${totalAmount > order.originalTotalAmount ? 'text-red-600' : 'text-green-600'}`} data-oid="6v6gc-k">

                                    {totalAmount > order.originalTotalAmount ? '+' : ''}EGP{' '}
                                    {(totalAmount - order.originalTotalAmount).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modification Notes */}
                    <div className="mb-6" data-oid="9vyb49q">
                        <label className="block text-sm font-medium text-gray-700 mb-2" data-oid="p-cfow_">
                            Modification Notes (Required)
                        </label>
                        <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain the changes made to this order..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cura-primary focus:border-cura-primary transition-colors"
              required data-oid="r11vh-b" />

                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30" data-oid="8gi1diw">
                    <div className="flex items-center justify-between" data-oid="on-uoj3">
                        <div className="text-sm" data-oid=".y8bwgw">
                            {hasChanges ?
              <div className="flex items-center space-x-2" data-oid="a8pnk_v">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" data-oid="rlf6a87"></div>
                                    <span className="text-orange-600 font-medium" data-oid="vh3cl-e">
                                        You have unsaved changes
                                    </span>
                                </div> :

              <span className="text-gray-600" data-oid="_k1z7je">No changes made</span>
              }
                        </div>
                        <div className="flex items-center space-x-3" data-oid="vug74mc">
                            <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300" data-oid="gphi4dp">

                                Cancel
                            </button>
                            <button
                onClick={handleSave}
                disabled={!hasChanges || !notes.trim() || saving}
                className="px-6 py-2 bg-gradient-to-r from-cura-primary to-cura-secondary text-white rounded-lg hover:from-cura-secondary hover:to-cura-accent disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-medium transition-all duration-300 shadow-md hover:shadow-lg" data-oid="spqx_ic">

                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medicine Search Modal */}
            {showMedicineSearch &&
      <MedicineSearchModal
        onSelect={handleAddMedicine}
        onClose={() => setShowMedicineSearch(false)} data-oid="sc8w-s7" />

      }
        </div>);

}