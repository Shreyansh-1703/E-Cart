import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import api from '../../services/api';

const TrainSearch = () => {
    const navigate = useNavigate();
    const [trainNumber, setTrainNumber] = useState('');
    const [pnr, setPnr] = useState('');
    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedStation, setSelectedStation] = useState(null);

    const handleSearch = async () => {
        if (!trainNumber || trainNumber.length !== 5) {
            setError('Please enter a valid 5-digit train number.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            // Mocking the API response based on legacy logic
            // In a real app, this would call api.get(`/api/railway/route/${trainNumber}`)
            setTimeout(() => {
                const mockRoute = {
                    number: trainNumber,
                    name: 'Kolkata Rajdhani Express',
                    source: 'New Delhi (NDLS)',
                    destination: 'Howrah (HWH)',
                    stations: [
                        { code: 'NDLS', name: 'New Delhi', arr: '--', dep: '16:55', stop: 1, available: false },
                        { code: 'CNB', name: 'Kanpur Central', arr: '21:40', dep: '21:45', stop: 2, available: true },
                        { code: 'PRYJ', name: 'Prayagraj Jn', arr: '23:50', dep: '23:55', stop: 3, available: true },
                        { code: 'DDU', name: 'Pt DD Upadhyaya', arr: '02:00', dep: '02:10', stop: 4, available: true },
                        { code: 'GAYA', name: 'Gaya Junction', arr: '04:35', dep: '04:40', stop: 5, available: true },
                        { code: 'DHN', name: 'Dhanbad Junction', arr: '07:15', dep: '07:20', stop: 6, available: true },
                        { code: 'HWH', name: 'Howrah Junction', arr: '10:50', dep: '--', stop: 7, available: false },
                    ]
                };
                setRouteData(mockRoute);
                setLoading(false);
            }, 800);
        } catch (err) {
            setError('Failed to fetch train route. Please try again.');
            setLoading(false);
        }
    };

    const handleConfirmStation = () => {
        if (selectedStation) {
            // Store selection in session or state management
            sessionStorage.setItem('railway_station', JSON.stringify(selectedStation));
            sessionStorage.setItem('railway_train', JSON.stringify({ number: routeData.number, name: routeData.name }));
            navigate('/railway/products');
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* STEP INDICATOR */}
                <div className="flex justify-between mb-8">
                    <div className="flex-1 text-center border-b-4 border-emerald-500 pb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-1 font-bold text-xs"><CheckCircle2 className="w-4 h-4" /></div>
                        <span className="text-[10px] font-bold text-emerald-600">Train Info</span>
                    </div>
                    <div className="flex-1 text-center border-b-4 border-sky-600 pb-2">
                        <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center mx-auto mb-1 font-bold text-xs">2</div>
                        <span className="text-[10px] font-bold text-sky-600">Select Station</span>
                    </div>
                    <div className="flex-1 text-center border-b-4 border-slate-200 pb-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-1 font-bold text-xs">3</div>
                        <span className="text-[10px] font-bold text-slate-400">Products</span>
                    </div>
                    <div className="flex-1 text-center border-b-4 border-slate-200 pb-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-1 font-bold text-xs">4</div>
                        <span className="text-[10px] font-bold text-slate-400">OTP</span>
                    </div>
                </div>

                {!routeData ? (
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <button onClick={() => navigate('/railway')} className="text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1 text-sm">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </button>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Search className="text-sky-600" /> Find Your Train
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Train Number</label>
                                <input 
                                    type="text" 
                                    value={trainNumber}
                                    onChange={(e) => setTrainNumber(e.target.value)}
                                    placeholder="e.g. 12301" 
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 transition-all text-lg font-mono tracking-widest"
                                    maxLength="5"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button 
                                onClick={handleSearch}
                                disabled={loading}
                                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Searching...</> : 'Find Route Stations'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold">{routeData.number} — {routeData.name}</h2>
                                <p className="text-sm text-slate-500">{routeData.source} → {routeData.destination}</p>
                            </div>
                            <button onClick={() => setRouteData(null)} className="text-sm text-sky-600 font-semibold hover:bg-sky-50 px-3 py-1 rounded-lg">Change Train</button>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {routeData.stations.map((station, idx) => (
                                <div 
                                    key={station.code}
                                    onClick={() => station.available && setSelectedStation(station)}
                                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                        !station.available ? 'opacity-50 grayscale bg-slate-50 cursor-not-allowed' : 
                                        selectedStation?.code === station.code ? 'border-sky-600 bg-sky-50 shadow-sm' : 'border-slate-100 hover:border-sky-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-emerald-500' : idx === routeData.stations.length - 1 ? 'bg-red-500' : 'bg-sky-600'}`}></div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{station.name} <span className="text-[10px] bg-slate-200 px-1 rounded ml-1 text-slate-600">{station.code}</span></h4>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {station.arr === '--' ? station.dep : station.arr}</span>
                                                    <span>Stop #{station.stop}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {station.available ? (
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">DELIVERY AVAILABLE</span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">UNAVAILABLE</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleConfirmStation}
                            disabled={!selectedStation}
                            className={`w-full mt-8 font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                                selectedStation ? 'bg-sky-600 hover:bg-sky-700 text-white cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            Confirm Station & Continue <MapPin className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainSearch;
