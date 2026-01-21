import { useEffect, useState } from "react";
import api from "../api";

function Input() {

    interface FormData {
        userId: Number | null;
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

                setFormData(prev => ({
                    ...prev,
                    userId: res.data.value.id,
                    nipPeg: res.data.value.nip || "",
                    pangkatPeg: res.data.value.pangkat || "",
                    jabatanPeg: res.data.value.jabatan || "",
                }))
            } catch (err) {
                console.error("Lookup failed", err);
            }
        }, 500);

        return () => clearTimeout(timeout);

    }, [formData.namaPeg]);

    useEffect(() => {
        if (!formData.namaPPK) {
            setFormData(prev => ({
                ...prev,
                nipPPK: ""
            }))
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await api.get("/lookup/ppk", {
                    params: { namaPPK: formData.namaPPK}
                });

                setFormData(prev => ({
                    ...prev,
                    nipPPK: res.data.value.nip || ""
                }))
            } catch (err) {
                console.log("Lookup failed", err)
            }
        }, 500)

        return () => clearTimeout(timeout);

    }, [formData.namaPPK]);

    useEffect(() => {
        if (!formData.namaKepala) {
            setFormData(prev => ({
                ...prev,
                nipKepala: ""
            }))
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await api.get("/lookup/kepala", {
                    params: { namaKepala: formData.namaKepala}
                });

                setFormData(prev => ({
                    ...prev,
                    nipKepala: res.data.value.nip || ""
                }))
            } catch (err) {
                console.log("Lookup failed", err)
            }
        }, 500)

        return () => clearTimeout(timeout);

    }, [formData.namaKepala]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const payload = {
            ...formData,
            nomorST: `ST-${formData.nomorST}/KPP.0503/2026`
        }

        try {
            const res = await api.post("/forms/save", payload, {
                responseType: "blob"
            });

            console.log("Form saved: ", res.data);
            alert("Form submitted successfully!");
        } catch (err) {
            console.error("Submit failed", err);
            alert("Submit failed, check console for errors.")
        }
    }

    function calculateDays(start: string, end: string) {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = (Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

        return String(diffDays);
    }

    useEffect(() => {
        if (!formData.tanggalBerangkat || !formData.tanggalKembali) {
            setFormData(prev => ({
                ...prev,
                lamaPerjalanan: ""
            }))
            return;
        }
        
        const days = calculateDays(formData.tanggalBerangkat, formData.tanggalKembali);

        setFormData(prev => ({
            ...prev,
            lamaPerjalanan: `${days} hari`
        }))

    }, [formData.tanggalBerangkat, formData.tanggalKembali])


    return (
        <div>
            <form onSubmit={handleSubmit} className="text-left">
                {/* A. IDENTITAS PEGAWAI */}
                <div className="container mx-auto border border-gray-500/50">
                    <div className="w-full bg-[#212c5f] text-white py-2 text-sm text-center">
                    A. IDENTITAS PEGAWAI
                    </div>

                    <div className="grid grid-cols-[0.3fr_1fr] items-center gap-y-1 my-2 mx-2 pl-2">
                    <label className="text-sm text-gray-600">Nama Pegawai</label>
                    <input
                        type="text"
                        value={formData.namaPeg}
                        onChange={e => setFormData(prev => ({ ...prev, namaPeg: e.target.value }))}
                        className="w-full border px-2 h-[25px] rounded-xs text-sm text-gray-600"
                        required
                    />

                    <label className="text-sm text-gray-600">NIP Pegawai</label>
                    <input
                        type="text"
                        value={formData.nipPeg}
                        readOnly
                        className="w-full border px-2 h-[25px] bg-gray-200 rounded-xs text-sm text-gray-600"
                    />

                    <label className="text-sm text-gray-600">Pangkat / Golongan</label>
                    <input
                        type="text"
                        value={formData.pangkatPeg}
                        readOnly
                        className="w-full border px-2 h-[25px] bg-gray-200 rounded-xs text-sm text-gray-600"
                    />

                    <label className="text-sm text-gray-600">Jabatan</label>
                    <input
                        type="text"
                        value={formData.jabatanPeg}
                        readOnly
                        className="w-full border px-2 h-[25px] bg-gray-200 rounded-xs text-sm text-gray-600"
                    />
                    </div>
                </div>

                {/* B. RINCIAN SPD */}
                <div className="container mx-auto border border-gray-500/50 mt-4">
                    <div className="w-full bg-[#212c5f] text-white py-2 text-sm text-center">
                    B. RINCIAN SPD
                    </div>

                    <div className="grid grid-cols-[0.3fr_1fr] items-center gap-y-1 my-2 mx-2 pl-2">
                    <label className="text-sm text-gray-600">Nomor Surat Tugas</label>

                    <div className="flex items-center w-full border rounded-xs h-[25px] text-sm text-gray-600">
                        {/* PREFIX */}
                        <span className="px-2 text-gray-500 shrink-0 select-none">
                            ST-
                        </span>

                        {/* INPUT */}
                        <input
                            type="text"
                            value={formData.nomorST}
                            onChange={(e) =>
                            setFormData((prev) => ({ ...prev, nomorST: e.target.value }))
                            }
                            className="flex-1 h-full bg-transparent outline-none text-gray-600"
                            required
                        />

                        {/* SUFFIX */}
                        <span className="px-2 text-gray-500 shrink-0 select-none">
                            /KPP.0503/2026
                        </span>
                    </div>

                    <label className="text-sm text-gray-600">Nama Kegiatan</label>
                    <input
                        type="text"
                        value={formData.namaKeg}
                        onChange={e => setFormData(prev => ({ ...prev, namaKeg: e.target.value }))}
                        className="w-full border px-2 h-[25px] rounded-xs text-sm text-gray-600"
                        required
                    />

                    <label className="text-sm text-gray-600">Alat Angkutan</label>
                    <input
                        type="text"
                        value={formData.angkutan}
                        onChange={e => setFormData(prev => ({ ...prev, angkutan: e.target.value }))}
                        className="w-full border px-2 h-[25px] rounded-xs text-sm text-gray-600"
                        required
                    />

                    <label className="text-sm text-gray-600">Tempat Berangkat</label>
                    <input
                        type="text"
                        value={formData.tempatBerangkat}
                        onChange={e => setFormData(prev => ({ ...prev, tempatBerangkat: e.target.value }))}
                        className="w-full border px-2 h-[25px] rounded-xs text-sm text-gray-600"
                        required
                    />

                    <label className="text-sm text-gray-600">Tempat Tujuan</label>
                    <input
                        type="text"
                        value={formData.tempatTujuan}
                        onChange={e => setFormData(prev => ({ ...prev, tempatTujuan: e.target.value }))}
                        className="w-full border px-2 h-[25px] rounded-xs text-sm text-gray-600"
                        required
                    />

                    <label className="text-sm text-gray-600">Tanggal Berangkat</label>
                    <input
                        type="date"
                        value={formData.tanggalBerangkat}
                        onChange={e => setFormData(prev => ({ ...prev, tanggalBerangkat: e.target.value }))}
                        className="w-30 border px-2 h-[25px] rounded-xs text-sm text-gray-600"
                        required
                    />

                    <label className="text-sm text-gray-600">Tanggal Kembali</label>
                    <input
                        type="date"
                        value={formData.tanggalKembali}
                        onChange={e => setFormData(prev => ({ ...prev, tanggalKembali: e.target.value }))}
                        className="w-30 border px-2 h-[25px] rounded-xs text-sm text-sm text-gray-600"
                        required
                    />

                    <label className="text-sm text-gray-600">Lama Perjalanan</label>
                    <input
                        type="text"
                        value={formData.lamaPerjalanan}
                        className="w-full border px-2 h-[25px] bg-gray-200 rounded-xs text-sm text-gray-600"
                        readOnly
                    />
                    </div>
                </div>

                {/* C. PENANDATANGAN */}
                <div className="container mx-auto border border-gray-500/50 mt-4">
                    <div className="w-full bg-[#212c5f] text-white py-2 text-sm text-center">
                    C. PENANDATANGAN
                    </div>

                    <div className="grid grid-cols-[0.3fr_1fr] items-center gap-y-1 my-2 mx-2 pl-2">
                    <label className="text-sm text-gray-600">Nama PPK</label>
                    <input
                        type="text"
                        value={formData.namaPPK}
                        onChange={e => setFormData(prev => ({ ...prev, namaPPK: e.target.value }))}
                        className="w-full border px-2 h-[25px] rounded-xs text-sm text-gray-600"
                        required
                    />

                    <label className="text-sm text-gray-600">NIP PPK</label>
                    <input
                        type="text"
                        value={formData.nipPPK}
                        readOnly
                        className="w-full border px-2 h-[25px] bg-gray-200 rounded-xs text-sm text-gray-600"
                    />

                    <label className="text-sm text-gray-600">Nama Kepala Kantor</label>
                    <input
                        type="text"
                        value={formData.namaKepala}
                        onChange={e => setFormData(prev => ({ ...prev, namaKepala: e.target.value }))}
                        className="w-full border px-2 h-[25px] rounded-xs text-sm text-gray-600"
                        required
                    />

                    <label className="text-sm text-gray-600">NIP Kepala Kantor</label>
                    <input
                        type="text"
                        value={formData.nipKepala}
                        readOnly
                        className="w-full border px-2 h-[25px] bg-gray-200 rounded-xs text-sm text-gray-600"
                    />
                    </div>
                </div>

                {/* SUBMIT */}
                <div className="flex justify-center my-6">
                    <button
                    type="submit"
                    className="text-white bg-[#212c5f] px-4 py-2 rounded hover:bg-sky-500"
                    >
                    Save
                    </button>
                </div>
                </form>

            
            

        </div>
    )
}

export default Input;