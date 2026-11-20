import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Building, 
  Lock, 
  AlertCircle,
  Download,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import Button from '../common/Button';

export const CheckoutModal = ({ project, isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('easypaisa_simulated');
  const [accountNumber, setAccountNumber] = useState('03001234567');
  const [pinCode, setPinCode] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderReceipt, setOrderReceipt] = useState(null);

  if (!isOpen || !project) return null;

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await orderService.checkout({
        projectId: project.id,
        paymentMethod,
        accountMobileOrCard: accountNumber
      });

      setOrderReceipt(response.data.receipt);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(typeof err === 'string' ? err : 'Payment processing failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!orderReceipt ? (
          /* STEP 1: Payment Checkout Form */
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-ivory text-navy text-[11px] font-semibold mb-1 border border-gold-soft">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Encrypted 256-Bit SSL Checkout</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Purchase Project Package
              </h3>
            </div>

            {/* Order Item Summary Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{project.title}</h4>
                  <div className="text-slate-500 mt-0.5 font-medium">
                    {project.degree} &bull; Semester {project.semester} &bull; {project.subject}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold text-slate-900">
                    Rs. {Number(project.price_pkr || project.pricePKR).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">PKR</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-600">
                <span>Platform Security & Signed URL Vault:</span>
                <span className="font-semibold text-navy-mid">Included (Free)</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Method Selector */}
            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Select Pakistani Payment Method
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {/* EasyPaisa */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('easypaisa_simulated');
                      setAccountNumber('03001234567');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'easypaisa_simulated'
                        ? 'border-gold bg-ivory/70 text-navy font-semibold ring-2 ring-gold-soft/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-gold shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold">EasyPaisa</div>
                      <div className="text-[10px] text-slate-500">Mobile Wallet</div>
                    </div>
                  </button>

                  {/* JazzCash */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('jazzcash_simulated');
                      setAccountNumber('03019876543');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'jazzcash_simulated'
                        ? 'border-gold bg-ivory/70 text-navy font-semibold ring-2 ring-gold-soft/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-red-600 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold">JazzCash</div>
                      <div className="text-[10px] text-slate-500">Mobile Account</div>
                    </div>
                  </button>

                  {/* Sandbox Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('sandbox_card');
                      setAccountNumber('4242 •••• •••• 4242');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'sandbox_card'
                        ? 'border-gold bg-ivory/70 text-navy font-semibold ring-2 ring-gold-soft/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold">Debit / Card</div>
                      <div className="text-[10px] text-slate-500">Visa / Mastercard</div>
                    </div>
                  </button>

                  {/* Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('bank_transfer');
                      setAccountNumber('PK36MEZN009988776655');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-gold bg-ivory/70 text-navy font-semibold ring-2 ring-gold-soft/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-5 h-5 text-teal-600 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold">1-Link Bank</div>
                      <div className="text-[10px] text-slate-500">IBFT Transfer</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Account / Mobile / Card Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {paymentMethod.includes('card') ? 'Card Number' : 'Account / Mobile Number'}
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-mono focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {paymentMethod.includes('card') ? 'CVV' : 'Simulated MPIN'}
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-mono focus:outline-none focus:border-gold text-center tracking-widest"
                    required
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center">
                Sandbox Environment: Card / Mobile PIN simulation executes instant server authorization.
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full shadow-md text-base"
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Pay Rs. {Number(project.price_pkr || project.pricePKR).toLocaleString()} PKR & Download
              </Button>
            </form>
          </div>
        ) : (
          /* STEP 2: Order Receipt & Instant Download Vault Access */
          <div className="text-center space-y-5 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-gold-soft/30 text-navy-mid flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-navy-mid bg-ivory px-2.5 py-0.5 rounded-full border border-gold-soft">
                Payment Verified &bull; 100% Successful
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 pt-1">
                Thank You for Your Order!
              </h3>
              <p className="text-xs text-slate-500">
                Your payment has been ledgered in Pakistani Rupees (PKR).
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-mono font-bold text-slate-900">{orderReceipt.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono text-navy-mid font-semibold">{orderReceipt.transactionReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-slate-900">Rs. {orderReceipt.totalAmountPKR.toLocaleString()} PKR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-medium text-slate-700 capitalize">{orderReceipt.paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  onClose();
                  navigate('/my-downloads');
                }}
                className="w-full shadow-md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Go to My Downloads Vault
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-full text-slate-500"
              >
                Close & Continue Browsing
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutModal;
