import React, { useState } from 'react';
import { IncomingMail, MailSource, Classification, UserRole } from '../types';
import { CLASSIFICATIONS, DRIVE_FOLDERS } from '../constants';
import { FileUp, ExternalLink } from 'lucide-react';

interface IncomingMailProps {
  data: IncomingMail[];
  onAdd: (mail: IncomingMail) => void;
  role: UserRole;
}

export const IncomingMailPage: React.FC<IncomingMailProps> = ({ data, onAdd, role }) => {
  const [sourceType, setSourceType] = useState<MailSource>(MailSource.INTERNAL);
  const [formData, setFormData] = useState<Partial<IncomingMail>>({
    dateLetter: '', dateReceived: '', dateAction: '', timeAction: '', 
    placeAction: '', subject: '', agenda: '', agency: '', notes: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number) return alert('Nomor Surat wajib diisi');

    const newMail: IncomingMail = {
      id: Date.now().toString(),
      source: sourceType,
      number: formData.number!,
      classification: formData.classification,
      dateLetter: formData.dateLetter || '',
      dateReceived: formData.dateReceived || '',
      dateAction: formData.dateAction || '',
      timeAction: formData.timeAction || '',
      placeAction: formData.placeAction || '',
      subject: formData.subject || '',
      agenda: formData.agenda || '',
      agency: formData.agency || '',
      notes: formData.notes || '',
      documentName: file ? file.name : 'No Document'
    };

    // Simulate Upload
    if(file) {
      console.log(`Uploading ${file.name} to Google Drive Folder: ${DRIVE_FOLDERS.INCOMING}`);
      // In real app: call API here
    }

    onAdd(newMail);
    
    // Reset basic fields
    setFormData({
       dateLetter: '', dateReceived: '', dateAction: '', timeAction: '', 
       placeAction: '', subject: '', agenda: '', agency: '', notes: ''
    });
    setFile(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Register Surat Masuk</h2>
        <a 
          href={DRIVE_FOLDERS.INCOMING} 
          target="_blank" 
          rel="noreferrer" 
          className="text-accent hover:underline flex items-center gap-2 text-sm"
        >
          Buka Google Drive Folder <ExternalLink size={14} />
        </a>
      </div>

      {role === UserRole.ADMIN && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="mb-6">
             <label className="block text-sm font-medium text-gray-700 mb-2">Sumber Surat</label>
             <select 
               value={sourceType} 
               onChange={(e) => setSourceType(e.target.value as MailSource)}
               className="w-full p-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
             >
               <option value={MailSource.INTERNAL}>INTERNAL</option>
               <option value={MailSource.EXTERNAL}>EXTERNAL</option>
             </select>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Nomor Surat</label>
              <input name="number" required onChange={handleInputChange} className="input-field" placeholder="Contoh: 001/A/2025" />
            </div>

            {sourceType === MailSource.INTERNAL && (
              <div>
                <label className="label">Klasifikasi</label>
                <select name="classification" required onChange={handleInputChange} className="input-field">
                  <option value="">Pilih Klasifikasi...</option>
                  {CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="label">Tanggal Naskah</label>
              <input type="date" name="dateLetter" onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="label">Tanggal Terima</label>
              <input type="date" name="dateReceived" onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="label">Tanggal Pelaksanaan</label>
              <input type="date" name="dateAction" onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="label">Jam Pelaksanaan</label>
              <input type="time" name="timeAction" onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="label">Tempat Pelaksanaan</label>
              <input name="placeAction" onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="label">Instansi Pengirim</label>
              <input name="agency" onChange={handleInputChange} className="input-field" />
            </div>
             <div className="md:col-span-2">
              <label className="label">Perihal</label>
              <input name="subject" required onChange={handleInputChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Agenda</label>
              <textarea name="agenda" rows={2} onChange={handleInputChange} className="input-field"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="label">Keterangan</label>
              <input name="notes" onChange={handleInputChange} className="input-field" />
            </div>
            
            <div className="md:col-span-2 border-t pt-4 mt-2">
               <label className="label flex items-center gap-2 mb-2">
                 <FileUp size={16} /> Upload Dokumen (PDF)
               </label>
               <input 
                 type="file" 
                 accept=".pdf,.doc,.docx"
                 onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                 className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
               />
               <p className="text-xs text-gray-500 mt-1">*Dokumen akan otomatis diklasifikasikan berdasarkan tahun/bulan di Google Drive.</p>
            </div>

            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-accent hover:bg-blue-600 text-white font-bold py-3 rounded transition shadow-lg">
                Simpan Data
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table View */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="p-4">Nomor</th>
                <th className="p-4">Klasifikasi</th>
                <th className="p-4">Tgl Terima</th>
                <th className="p-4">Perihal</th>
                <th className="p-4">Instansi</th>
                <th className="p-4">Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{item.number}</td>
                  <td className="p-4">
                    {item.source === MailSource.INTERNAL ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">{item.classification}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4">{item.dateReceived}</td>
                  <td className="p-4">{item.subject}</td>
                  <td className="p-4">{item.agency}</td>
                  <td className="p-4 text-accent">{item.documentName}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                   <td colSpan={6} className="p-8 text-center text-gray-400">Belum ada data surat masuk</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .label { @apply block text-sm font-medium text-gray-700 mb-1; }
        .input-field { @apply w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition; }
      `}</style>
    </div>
  );
};
