import api from "../api";
import { useState, useEffect } from "react";

interface Pegawai {
    nama: string;
}

function ListSPD() {

    const [results, setResults] = useState([]);
    const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
    const [namaPeg, setNamaPeg] = useState("");

    function formatTanggal(dateString: string) {
        const date = new Date(dateString);

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    useEffect(() => {
        async function fetchSPD() {
            try {
                const result = await api.get("/listspd");
                setResults(result.data);
                console.log("Data loaded");
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }
        fetchSPD();
    }, [])

    useEffect(() => {
        async function fetchNamaPegawai() {
            try {
                const result = await api.get("/lookup/pilihpegawai")
                setPegawaiList(result.data);
                console.log("Nama pegawai loaded");
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }
        fetchNamaPegawai();
    }, [])

    useEffect(() => {
        if (!namaPeg) return;

        async function fetchFilteredSPD() {
            try {
            const res = await api.get("/lookup/filterspd", {
                params: { namaPeg }
            });
            setResults(res.data);
            } catch (err) {
            console.error(err);
            }
        }

        fetchFilteredSPD();
        }, [namaPeg]);

    return (
        <div>
            <div className="container mx-auto border border-gray-500/50">
                <div className="w-full bg-[#212c5f] text-white py-2 text-sm text-center">
                    FILTER BOX
                </div>

                <div className="grid grid-cols-[0.3fr_1fr] items-center gap-y-1 my-2 mx-2 pl-2">
                    <label className="text-sm text-gray-600">Nama Pegawai</label>
                    <select
                    value={namaPeg}
                    onChange={(e) => setNamaPeg(e.target.value)}
                    className="border px-2 py-1 text-sm text-gray-600"
                    >
                        <option value="">-- Pilih Pegawai --</option>
                        {pegawaiList.map((row, index) => (
                            <option key={index} value={row.nama}>
                            {row.nama}
                            </option>
                        ))}
                    </select>
                </div>
                
            </div>
            
            
            {results.length > 0 && (
                <div className="container mx-auto overflow-x-auto mt-5">
                    <div className="container mx-auto text-sm text-gray-600">Hasil: {results.length}</div>
                    <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#212c5f] text-sm text-white">
                            <th className="px-2 py-1 text-center font-normal">Nomor SPD</th>
                            <th className="px-2 py-1 text-center font-normal">Nama</th>
                            <th className="px-2 py-1 text-center font-normal">NIP</th>
                            <th className="px-2 py-1 text-center font-normal">Kegiatan</th>
                            <th className="px-2 py-1 text-center font-normal">Tanggal Berangkat</th>
                            <th className="px-2 py-1 text-center font-normal">Tanggal Kembali</th>
                            <th className="px-2 py-1 text-center font-normal">Download PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((item: any, nomor_spd: number) => (
                        <tr key={nomor_spd} className="text-sm text-gray-600 text-center">
                            <td className="px-2 py-1 text-sm">{item.nomor_spd}</td>
                            <td className="px-2 py-1 text-sm">{item.nama}</td>
                            <td className="px-2 py-1 text-sm">{item.nip}</td>
                            <td className="px-2 py-1 text-sm">{item.nama_kegiatan}</td>
                            <td className="px-2 py-1 text-sm">{formatTanggal(item.tanggal_berangkat)}</td>
                            <td className="px-2 py-1 text-sm">{formatTanggal(item.tanggal_kembali)}</td>
                            <td className="px-2 py-1 text-sm">
                            <a
                                href={`https://spd-master-backend-production.up.railway.app/api/spd/${item.nomor_spd}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                >
                                Download
                            </a>

                                </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            )}

        </div>
    )


}

export default ListSPD;