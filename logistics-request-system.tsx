import React, { useState, useEffect } from 'react';
import { Package, TruckIcon, Calendar, MapPin, User, Phone, Filter, Plus, X, Edit2, Trash2, Search } from 'lucide-react';

const LogisticsRequestSystem = () => {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    korxona: '',
    aloqa: '',
    telefon: '',
    yukTuri: '',
    miqdor: '',
    joylashuv: '',
    manzil: '',
    sana: '',
    izoh: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('logisticsRequests');
    if (saved) {
      setRequests(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('logisticsRequests', JSON.stringify(requests));
  }, [requests]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingRequest) {
      setRequests(requests.map(req => 
        req.id === editingRequest.id 
          ? { ...formData, id: req.id, status: req.status, createdAt: req.createdAt }
          : req
      ));
    } else {
      const newRequest = {
        ...formData,
        id: Date.now(),
        status: 'yangi',
        createdAt: new Date().toISOString()
      };
      setRequests([newRequest, ...requests]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      korxona: '',
      aloqa: '',
      telefon: '',
      yukTuri: '',
      miqdor: '',
      joylashuv: '',
      manzil: '',
      sana: '',
      izoh: ''
    });
    setEditingRequest(null);
    setShowModal(false);
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setFormData({
      korxona: request.korxona,
      aloqa: request.aloqa,
      telefon: request.telefon,
      yukTuri: request.yukTuri,
      miqdor: request.miqdor,
      joylashuv: request.joylashuv,
      manzil: request.manzil,
      sana: request.sana,
      izoh: request.izoh
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("So'rovni o'chirishni xohlaysizmi?")) {
      setRequests(requests.filter(req => req.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.korxona.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.yukTuri.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.manzil.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'yangi': return 'bg-blue-100 text-blue-800';
      case 'jarayonda': return 'bg-yellow-100 text-yellow-800';
      case 'yetkazildi': return 'bg-green-100 text-green-800';
      case 'bekor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    jami: requests.length,
    yangi: requests.filter(r => r.status === 'yangi').length,
    jarayonda: requests.filter(r => r.status === 'jarayonda').length,
    yetkazildi: requests.filter(r => r.status === 'yetkazildi').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <TruckIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Logistika So'rovlari</h1>
                <p className="text-gray-600">Korxonalar uchun yuk tashish tizimi</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Yangi So'rov
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
              <div className="text-2xl font-bold">{stats.jami}</div>
              <div className="text-blue-100">Jami So'rovlar</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-lg text-white">
              <div className="text-2xl font-bold">{stats.yangi}</div>
              <div className="text-yellow-100">Yangi</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg text-white">
              <div className="text-2xl font-bold">{stats.jarayonda}</div>
              <div className="text-orange-100">Jarayonda</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
              <div className="text-2xl font-bold">{stats.yetkazildi}</div>
              <div className="text-green-100">Yetkazildi</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Korxona, yuk turi yoki manzil bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Barcha Holatlar</option>
                <option value="yangi">Yangi</option>
                <option value="jarayonda">Jarayonda</option>
                <option value="yetkazildi">Yetkazildi</option>
                <option value="bekor">Bekor qilingan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">So'rovlar topilmadi</h3>
              <p className="text-gray-500">Yangi so'rov qo'shish uchun yuqoridagi tugmani bosing</p>
            </div>
          ) : (
            filteredRequests.map(request => (
              <div key={request.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{request.korxona}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{request.aloqa}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{request.telefon}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>{request.yukTuri} - {request.miqdor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{request.sana}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin className="w-4 h-4" />
                        <span>{request.joylashuv} → {request.manzil}</span>
                      </div>
                    </div>
                    {request.izoh && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700"><strong>Izoh:</strong> {request.izoh}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="yangi">Yangi</option>
                      <option value="jarayonda">Jarayonda</option>
                      <option value="yetkazildi">Yetkazildi</option>
                      <option value="bekor">Bekor qilish</option>
                    </select>
                    <button
                      onClick={() => handleEdit(request)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingRequest ? "So'rovni Tahrirlash" : "Yangi So'rov Qo'shish"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Korxona nomi *
                    </label>
                    <input
                      type="text"
                      name="korxona"
                      value={formData.korxona}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Korxona nomini kiriting"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Aloqa shaxsi *
                    </label>
                    <input
                      type="text"
                      name="aloqa"
                      value={formData.aloqa}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ism familiya"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefon raqami *
                    </label>
                    <input
                      type="tel"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+998 XX XXX XX XX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Yuk turi *
                    </label>
                    <select
                      name="yukTuri"
                      value={formData.yukTuri}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tanlang</option>
                      <option value="Qurilish materiallari">Qurilish materiallari</option>
                      <option value="Oziq-ovqat mahsulotlari">Oziq-ovqat mahsulotlari</option>
                      <option value="Texnika va uskunalar">Texnika va uskunalar</option>
                      <option value="Kimyoviy moddalar">Kimyoviy moddalar</option>
                      <option value="Kiyim-kechak">Kiyim-kechak</option>
                      <option value="Boshqa">Boshqa</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Miqdor/Og'irlik *
                    </label>
                    <input
                      type="text"
                      name="miqdor"
                      value={formData.miqdor}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masalan: 5 tonna"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Yuk olish sanasi *
                    </label>
                    <input
                      type="date"
                      name="sana"
                      value={formData.sana}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Yuk olish joyi *
                  </label>
                  <input
                    type="text"
                    name="joylashuv"
                    value={formData.joylashuv}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Shahar, tuman"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Yetkazib berish manzili *
                  </label>
                  <input
                    type="text"
                    name="manzil"
                    value={formData.manzil}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="To'liq manzil"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Qo'shimcha izoh
                  </label>
                  <textarea
                    name="izoh"
                    value={formData.izoh}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Maxsus talablar yoki qo'shimcha ma'lumotlar"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {editingRequest ? "Saqlash" : "So'rov Qo'shish"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsRequestSystem;