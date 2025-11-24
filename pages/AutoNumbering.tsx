import React, { useState, useMemo } from 'react';
import { NumberingRequest, UserRole } from '../types';
import { calculateNumber } from '../utils';
import { FileText, ArrowRight, Download, RefreshCw, CheckCircle } from 'lucide-react';

interface AutoNumberingProps {
  data: NumberingRequest[];
  onAdd: (req: NumberingRequest) => void;
  role: UserRole;
}

export const AutoNumberingPage: React.FC<AutoNumberingProps> = ({ data, onAdd, role }) => {
  const [formData, setFormData] = useState({ name: '', dateSupervision: '', stage: '' });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Document Processing State
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docNumber, setDocNumber] = useState('');
  const [processingStatus, setProcessingStatus] = useState<'IDLE' | 'PROCESSING' | 'DONE'>('IDLE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create temp request to calculate what the number WOULD be
    const tempReq: NumberingRequest = {
      id: Date.now().toString(), // Temp ID
      name: formData.name,
      dateSupervision: formData.dateSupervision,
      stage: formData.stage,
      createdAt: Date.now(),
      generatedNumber: ''
    };

    // Calculate number based on EXISTING data + this new one
    // We pass [...data, tempReq] to the calculator, but calculateNumber uses the specific req context
    // However, the util function expects the req to be inside the array for index finding.
    const newDataList = [...data, tempReq];
    const calculatedNum = calculateNumber(tempReq, newDataList);

    const finalReq = { ...tempReq, generatedNumber: calculatedNum };
    
    onAdd(finalReq);
    setFormData({ name: '', dateSupervision: '', stage: '' });
  };

  const handleProcessDocument = () => {
    if (!docFile || !docNumber) return;
    setProcessingStatus('PROCESSING');
    
    // Simulate Word -> PDF conversion and number injection delay
    setTimeout(() => {
      setProcessingStatus('DONE');
    }, 2000);
  };

  // Pagination Logic
  const sortedData = useMemo(() => {
    // Sort by Number Logic (roughly, though string sort works okay for standard format, 
    // better to sort by Date then CreatedAt for display consistency)
    return [...data].sort((a, b) => b.createdAt - a.createdAt); // Newest first for display
  }, [data]);

  const paginatedData = sortedData.slice(0, itemsPerPage);

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: Ambil Nomor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form (Left) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <RefreshCw className="text-indigo-600" /> Ambil Nomor Baru
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemohon</label>
              <input 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengawasan</label>
              <input 
                type="date" 
                required 
                value={formData.dateSupervision}
                onChange={e => setFormData({...formData, dateSupervision: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
              <p className="text-xs text-gray-500 mt-1">Sistem akan otomatis mendeteksi tanggal susulan.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahapan</label>
              <input 
                required 
                value={formData.stage}
                onChange={e => setFormData({...formData, stage: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow mt-4 transition">
              Generate Nomor
            </button>
          </form>
        </div>

        {/* List (Right) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700">Riwayat Pengambilan Nomor</h3>
            <select 
              className="text-sm border rounded p-1" 
              value={itemsPerPage} 
              onChange={e => setItemsPerPage(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map(n => <option key={n} value={n}>{n} Data</option>)}
            </select>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-indigo-50 text-indigo-900 font-semibold">
                <tr>
                  <th className="p-3">Nomor Hasil</th>
                  <th className="p-3">Tanggal Pengawasan</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Tahapan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono font-bold text-indigo-700">{item.generatedNumber}</td>
                    <td className="p-3">{item.dateSupervision}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 text-gray-600">{item.stage}</td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                   <tr><td colSpan={4} className="p-6 text-center text-gray-400">Belum ada data nomor diambil</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 2: Document Processing */}
      <div className="bg-slate-800 text-white rounded-xl p-8 shadow-2xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FileText className="text-yellow-400" /> Proses Dokumen Otomatis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Step 1 */}
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Langkah 1: Input</span>
            <div>
              <label className="block text-sm mb-2">Pilih Nomor untuk Dibubuhkan</label>
              <select 
                value={docNumber} 
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:border-yellow-400 outline-none text-white"
              >
                <option value="">-- Pilih Nomor --</option>
                {data.slice(0, 10).map(d => (
                  <option key={d.id} value={d.generatedNumber}>{d.generatedNumber} - {d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Upload Draft (Word)</label>
              <input 
                type="file"
                accept=".doc,.docx"
                onChange={(e) => setDocFile(e.target.files ? e.target.files[0] : null)}
                className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-slate-600 file:text-white
                  hover:file:bg-slate-500"
              />
            </div>
          </div>

          {/* Step 2: Action */}
          <div className="flex flex-col items-center justify-center h-full pt-6">
            <button 
              onClick={handleProcessDocument}
              disabled={!docFile || !docNumber || processingStatus === 'PROCESSING'}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105 ${
                processingStatus === 'PROCESSING' ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-500 text-slate-900 hover:bg-yellow-400'
              }`}
            >
              {processingStatus === 'PROCESSING' ? 'Sedang Memproses...' : 'Proses Dokumen'} 
              {processingStatus !== 'PROCESSING' && <ArrowRight size={18} />}
            </button>
          </div>

          {/* Step 3: Result */}
          <div className="bg-slate-700/50 rounded-lg p-6 h-full flex flex-col justify-center items-center border-2 border-dashed border-slate-600">
             {processingStatus === 'IDLE' && (
               <div className="text-center text-gray-400">
                 <p>Hasil konversi PDF akan muncul di sini</p>
               </div>
             )}
             {processingStatus === 'PROCESSING' && (
               <div className="animate-pulse text-center">
                 <RefreshCw className="animate-spin mx-auto mb-2 text-yellow-400" size={32} />
                 <p>Membubuhkan nomor & konversi ke PDF...</p>
               </div>
             )}
             {processingStatus === 'DONE' && (
               <div className="text-center space-y-3">
                 <CheckCircle className="text-green-400 mx-auto" size={48} />
                 <p className="font-bold text-lg">Selesai!</p>
                 <p className="text-xs text-gray-300 mb-4">{docNumber}.pdf</p>
                 <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 mx-auto">
                   <Download size={16} /> Download PDF
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>

    </div>
  );
};
