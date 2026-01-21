import { useEffect, useState } from "react";
import api from "../api";

interface FormData {
  userId: number | null;
  namaPeg: string;
  nipPeg: string;
  pangkatPeg: string;
  jabatanPeg: string;
  nomorST: string;
  namaKeg: string;
  angkutan: string;
  tempatBerangkat: string;
  tempatTujuan: string;
  lamaPerjalanan: string;
  tanggalBerangkat: string;
  tanggalKembali: string;
  namaPPK: string;
  nipPPK: string;
  namaKepala: string;
  nipKepala: string;
}

function Input() {
  const [formData, setFormData] = useState<FormData>({
    userId: null,
    namaPeg: "",
    nipPeg: "",
    pangkatPeg: "",
    jabatanPeg: "",
    nomorST: "",
    namaKeg: "",
    angkutan: "",
    tempatBerangkat: "",
    tempatTujuan: "",
    lamaPerjalanan: "",
    tanggalBerangkat: "",
    tanggalKembali: "",
    namaPPK: "",
    nipPPK: "",
    namaKepala: "",
    nipKepala: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Helper: calculate days of travel */
  function calculateDays(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    return String(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  }

  /** Auto-update lamaPerjalanan */
  useEffect(() => {
    if (!formData.tanggalBerangkat || !formData.tanggalKembali) {
      setFormData(prev => ({ ...prev, lamaPerjalanan: "" }));
      return;
    }
    const days = calculateDays(formData.tanggalBerangkat, formData.tanggalKembali);
    setFormData(prev => ({ ...prev, lamaPerjalanan: `${days} hari` }));
  }, [formData.tanggalBerangkat, formData.tanggalKembali]);

  /** Lookup pegawai by namaPeg */
  useEffect(() => {
    if (!formData.namaPeg) {
      setFormData(prev => ({
        ...prev,
        userId: null,
        nipPeg: "",
        pangkatPeg: "",
        jabatanPeg: "",
      }));
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await api.get("/lookup/pegawai", {
          params: { namaPeg: formData.namaPeg }
        });
        const value = res.data.value;
        setFormData(prev => ({
          ...prev,
          userId: value.id,
          nipPeg: value.nip || "",
          pangkatPeg: value.pangkat || "",
          jabatanPeg: value.jabatan || "",
        }));
      } catch (err) {
        console.error("Lookup pegawai failed", err);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.namaPeg]);

  /** Lookup PPK by namaPPK */
  useEffect(() => {
    if (!formData.namaPPK) {
      setFormData(prev => ({ ...prev, nipPPK: "" }));
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await api.get("/lookup/ppk", { params: { namaPPK: formData.namaPPK } });
        setFormData(prev => ({ ...prev, nipPPK: res.data.value.nip || "" }));
      } catch (err) {
        console.error("Lookup PPK failed", err);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.namaPPK]);

  /** Lookup Kepala by namaKepala */
  useEffect(() => {
    if (!formData.namaKepala) {
      setFormData(prev => ({ ...prev, nipKepala: "" }));
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await api.get("/lookup/kepala", { params: { namaKepala: formData.namaKepala } });
        setFormData(prev => ({ ...prev, nipKepala: res.data.value.nip || "" }));
      } catch (err) {
        console.error("Lookup Kepala failed", err);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.namaKepala]);

  /** Submit form */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.userId) {
      alert("Nama Pegawai belum valid!");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      userId: formData.userId,
      namaKeg: formData.namaKeg,
      angkutan: formData.angkutan,
      tempatBerangkat: formData.tempatBerangkat,
      tempatTujuan: formData.tempatTujuan,
      lamaPerjalanan: formData.lamaPerjalanan,
      tanggalBerangkat: formData.tanggalBerangkat,
      tanggalKembali: formData.tanggalKembali,
      namaPPK: formData.namaPPK,
      nipPPK: formData.nipPPK,
      namaKepala: formData.namaKepala,
      nipKepala: formData.nipKepala,
    };

    try {
      const res = await api.post("/forms/save", payload, { withCredentials: true });
      console.log("Form saved:", res.data);
      alert(`Form submitted successfully!\nNomor SPD: ${res.data.nomorSPD}`);
      setFormData(prev => ({
        ...prev,
        nomorST: "", namaKeg: "", angkutan: "", tempatBerangkat: "", tempatTujuan: "",
        lamaPerjalanan: "", tanggalBerangkat: "", tanggalKembali: "", namaPPK: "",
        nipPPK: "", namaKepala: "", nipKepala: "",
      }));
    } catch (err) {
      console.error("Submit failed", err);
      alert("Submit failed, check console for errors.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* A. Identitas Pegawai */}
        <div className="border p-4 rounded">
          <h2 className="bg-[#212c5f] text-white py-2 text-center text-sm">A. IDENTITAS PEGAWAI</h2>
          <div className="grid grid-cols-[0.3fr_1fr] gap-2 mt-2">
            <label>Nama Pegawai</label>
            <input
              type="text"
              value={formData.namaPeg}
              onChange={e => setFormData(prev => ({ ...prev, namaPeg: e.target.value }))}
              required
              className="border px-2 h-[28px]"
            />
            <label>NIP Pegawai</label>
            <input type="text" value={formData.nipPeg} readOnly className="border px-2 h-[28px] bg-gray-200" />
            <label>Pangkat / Golongan</label>
            <input type="text" value={formData.pangkatPeg} readOnly className="border px-2 h-[28px] bg-gray-200" />
            <label>Jabatan</label>
            <input type="text" value={formData.jabatanPeg} readOnly className="border px-2 h-[28px] bg-gray-200" />
          </div>
        </div>

        {/* B. Rincian SPD */}
        <div className="border p-4 rounded">
          <h2 className="bg-[#212c5f] text-white py-2 text-center text-sm">B. RINCIAN SPD</h2>
          <div className="grid grid-cols-[0.3fr_1fr] gap-2 mt-2">
            <label>Nomor Surat Tugas</label>
            <div className="flex border rounded h-[28px]">
              <span className="px-2 bg-gray-100">ST-</span>
              <input
                type="text"
                value={formData.nomorST}
                onChange={e => setFormData(prev => ({ ...prev, nomorST: e.target.value }))}
                className="flex-1 h-full px-2 outline-none"
                required
              />
              <span className="px-2 bg-gray-100">/KPP.0503/2026</span>
            </div>

            <label>Nama Kegiatan</label>
            <input type="text" value={formData.namaKeg} onChange={e => setFormData(prev => ({ ...prev, namaKeg: e.target.value }))} required className="border px-2 h-[28px]" />

            <label>Alat Angkutan</label>
            <input type="text" value={formData.angkutan} onChange={e => setFormData(prev => ({ ...prev, angkutan: e.target.value }))} required className="border px-2 h-[28px]" />

            <label>Tempat Berangkat</label>
            <input type="text" value={formData.tempatBerangkat} onChange={e => setFormData(prev => ({ ...prev, tempatBerangkat: e.target.value }))} required className="border px-2 h-[28px]" />

            <label>Tempat Tujuan</label>
            <input type="text" value={formData.tempatTujuan} onChange={e => setFormData(prev => ({ ...prev, tempatTujuan: e.target.value }))} required className="border px-2 h-[28px]" />

            <label>Tanggal Berangkat</label>
            <input type="date" value={formData.tanggalBerangkat} onChange={e => setFormData(prev => ({ ...prev, tanggalBerangkat: e.target.value }))} required className="border px-2 h-[28px]" />

            <label>Tanggal Kembali</label>
            <input type="date" value={formData.tanggalKembali} onChange={e => setFormData(prev => ({ ...prev, tanggalKembali: e.target.value }))} required className="border px-2 h-[28px]" />

            <label>Lama Perjalanan</label>
            <input type="text" value={formData.lamaPerjalanan} readOnly className="border px-2 h-[28px] bg-gray-200" />
          </div>
        </div>

        {/* C. Penandatangan */}
        <div className="border p-4 rounded">
          <h2 className="bg-[#212c5f] text-white py-2 text-center text-sm">C. PENANDATANGAN</h2>
          <div className="grid grid-cols-[0.3fr_1fr] gap-2 mt-2">
            <label>Nama PPK</label>
            <input type="text" value={formData.namaPPK} onChange={e => setFormData(prev => ({ ...prev, namaPPK: e.target.value }))} required className="border px-2 h-[28px]" />

            <label>NIP PPK</label>
            <input type="text" value={formData.nipPPK} readOnly className="border px-2 h-[28px] bg-gray-200" />

            <label>Nama Kepala Kantor</label>
            <input type="text" value={formData.namaKepala} onChange={e => setFormData(prev => ({ ...prev, namaKepala: e.target.value }))} required className="border px-2 h-[28px]" />

            <label>NIP Kepala Kantor</label>
            <input type="text" value={formData.nipKepala} readOnly className="border px-2 h-[28px] bg-gray-200" />
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={isSubmitting || !formData.userId}
            className={`px-4 py-2 rounded text-white ${isSubmitting || !formData.userId ? "bg-gray-400" : "bg-[#212c5f] hover:bg-sky-500"}`}
          >
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Input;
